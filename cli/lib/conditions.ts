import { PublicKey } from "@solana/web3.js";
import { getNftForOwner } from "@bonfida/name-tokenizer";
import { findOwnedNameAccountsForUser } from "./name-service";
import { connection } from "./connection";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import hashList from "./nft/hash_list.json";

/**
 * A `Condition` is an async function that takes a public key and returns a boolean
 * It can perform arbitrary verifications on the public key
 * e.g hold an SMB, a domain name etc
 */
type Condition = (arg: PublicKey) => Promise<boolean>;

export const domainsCondition = async (arg: PublicKey) => {
  const names = await findOwnedNameAccountsForUser(connection, arg);
  if (names.length > 0) return true;
  const tokenized = await getNftForOwner(connection, arg);
  if (tokenized.length > 0) return true;
  return false;
};

export const smbCondition = async (arg: PublicKey) => {
  return false;
};

export const wolfCondition = async (arg: PublicKey) => {
  const { value: raw } = await connection.getTokenAccountsByOwner(arg, {
    programId: TOKEN_PROGRAM_ID,
  });
  const des = raw.map((e) => {
    return { pubkey: e.pubkey, account: AccountLayout.decode(e.account.data) };
  });

  const nfts = des.filter(
    (e) =>
      e.account.amount.toString() === "1" &&
      hashList.includes(e.account.mint.toBase58())
  );

  return nfts.length >= 1;
};

/**
 * All the `Conditions` of this array will be evaluated
 */
export const CONDITIONS: Condition[] = [wolfCondition];
