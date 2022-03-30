import { Order } from "../order/type";
import NodeRSA from "node-rsa";
import { publicKey } from "./pubkey";

export const encrypt = (info: Order) => {
  const str = JSON.stringify(info);
  const key = new NodeRSA(publicKey);
  return key.encrypt(str).toString("base64");
};
