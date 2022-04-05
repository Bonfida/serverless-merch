import { PublicKey } from "@solana/web3.js";
import { getNftForOwner } from "@bonfida/name-tokenizer";
import { findOwnedNameAccountsForUser } from "./name-service";
import { connection } from "./connection";

/**
 * A `Condition` is an async function that takes a public key and returns a boolean
 * It can perform arbitrary verifications on the public key
 * e.g hold an SMB, a domain name etc
 */
type Condition = (arg: PublicKey) => Promise<boolean>;

export const domainsCondition = async (arg: PublicKey) => {
  return true;
  const names = await findOwnedNameAccountsForUser(connection, arg);
  if (names.length > 0) return true;
  const tokenized = await getNftForOwner(connection, arg);
  if (tokenized.length > 0) return true;
  return false;
};

export const smbCondition = async (arg: PublicKey) => {
  return false;
};

/**
 * All the `Conditions` of this array will be evaluated
 */
export const CONDITIONS: Condition[] = [domainsCondition];
