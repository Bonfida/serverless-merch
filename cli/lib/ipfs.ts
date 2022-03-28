const GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

export const makeUrl = (hash: string) => {
  return GATEWAY + hash;
};
