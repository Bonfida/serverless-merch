import { PublicKey } from "@solana/web3.js";

export const MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

export const COLLECT_KEY = new PublicKey(process.env.REACT_APP_COLLECT_FEES!);

export const PRICE = 50 * Math.pow(10, 6); // With decimals
