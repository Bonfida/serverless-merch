import { connection } from "./connection";
import { PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import { VendorConfig } from "./vendor_config";
import { REGEX } from "./regex";
import { makeUrl } from "./ipfs";
import axios from "axios";
import NodeRSA from "node-rsa";
import ObjectsToCsv from "objects-to-csv";
import { createSpinner } from "nanospinner";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONDITIONS } from "./conditions";

const isToken = async (key: PublicKey) => {
  const info = await connection.getAccountInfo(key);
  return info?.owner.equals(TOKEN_PROGRAM_ID);
};

export const fetchAllTxs = async (key: PublicKey) => {
  let before: string | undefined = undefined;
  const txs: ConfirmedSignatureInfo[] = [];

  let result = await connection.getSignaturesForAddress(key, { before });
  result?.sort((a, b) => a.slot - b.slot);

  while (result.length > 0) {
    txs.push(...result);
    before = result[0].signature;
    result = await connection.getSignaturesForAddress(key, { before });
  }

  return txs;
};

export const filterTxs = async (
  config: VendorConfig,
  txs: ConfirmedSignatureInfo[]
) => {
  let valid: { tx: ConfirmedSignatureInfo; hash: string }[] = [];
  let invalid: ConfirmedSignatureInfo[] = [];

  for (let tx of txs) {
    const response = await connection.getTransaction(tx.signature);
    if (!response || !response.meta || response.meta.err) {
      invalid.push(tx);
      continue;
    }

    const accountIndex = response.transaction.message.accountKeys.findIndex(
      (pubkey) => pubkey.toBase58() === config.address
    );

    // Verify the index
    if (accountIndex === -1) {
      // Invalid tx
      invalid.push(tx);
      continue;
    }

    const token = await isToken(new PublicKey(config.address));

    let preAmount: number;
    let postAmount: number;

    if (token) {
      // SPL tokens
      if (!response.meta.preTokenBalances || !response.meta.postTokenBalances) {
        invalid.push(tx);
        continue;
      }
      preAmount = parseInt(
        response.meta.preTokenBalances[accountIndex].uiTokenAmount.amount
      );
      postAmount = parseInt(
        response.meta.postTokenBalances[accountIndex].uiTokenAmount.amount
      );
    } else {
      // Native SOL
      preAmount = response.meta.preBalances[accountIndex];
      postAmount = response.meta.postBalances[accountIndex];
    }

    // Verify the amount
    if (postAmount - preAmount !== config.price) {
      // Invalid amount
      invalid.push(tx);
      continue;
    }

    // Verify the conditions
    const resolved = await Promise.all(
      CONDITIONS.map((fn) => fn(new PublicKey(config.address)))
    );
    const conditionsMet = resolved.reduce((acc, x) => acc && x);
    if (!conditionsMet) {
      invalid.push(tx);
      continue;
    }

    //
    if (!response?.meta?.logMessages) {
      invalid.push(tx);
      continue;
    }

    // Check the memo
    for (let log of response?.meta?.logMessages) {
      const result = log.match(REGEX);
      if (result?.groups?.hash) {
        valid.push({ tx, hash: result.groups.hash });
      } else {
        invalid.push(tx);
      }
    }
  }
  return { valid, invalid };
};

export const fetchIpfs = async (
  rsaKeypair: NodeRSA,
  valid: { tx: ConfirmedSignatureInfo; hash: string }[]
) => {
  const decryptedOrders: { tx: ConfirmedSignatureInfo; decrypted: Object }[] =
    [];

  for (let { tx, hash } of valid) {
    const { data } = await axios.get(makeUrl(hash));
    const decrypted = JSON.parse(rsaKeypair.decrypt(data).toString());
    decryptedOrders.push({ tx, ...decrypted });
  }

  return decryptedOrders;
};

export const fetchOrders = async (
  rsaKeypair: NodeRSA,
  config: VendorConfig
) => {
  const spinner = createSpinner("Fetching all orders...").start();
  const key = new PublicKey(config.address);

  const allTxs = await fetchAllTxs(key);

  spinner.update({ text: "Filtering orders..." });
  const { valid, invalid } = await filterTxs(config, allTxs);

  spinner.update({ text: "Decrypting valid orders..." });
  const decryptedOrders = await fetchIpfs(rsaKeypair, valid);

  const decryptedCsv = new ObjectsToCsv(decryptedOrders);
  const invalidCsv = new ObjectsToCsv(invalid);

  spinner.update({ text: "Saving orders to disk..." });
  await decryptedCsv.toDisk("./valid_orders.csv", { append: true });
  await invalidCsv.toDisk("./invalid_orders.csv", { append: true });

  spinner.success({ text: "All order saved to disk (csv)" });
};
