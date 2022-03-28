import { PublicKey } from "@solana/web3.js";

/**
 * A `Condition` is an async function that takes a public key and returns a boolean
 * It can perform arbitrary verifications on the public key
 * e.g hold an SMB, a domain name etc
 */
type Condition = (arg: PublicKey) => Promise<boolean>;

export const domainsCondition = async (arg: PublicKey) => {
  return false;
};

export const smbCondition = async (arg: PublicKey) => {
  return false;
};

/**
 * All the `Conditions` of this array will be evaluated
 */
export const CONDITIONS: Condition[] = [domainsCondition];
