import axios from "axios";

export const URL_UPLOAD = "https://ipfs.infura.io:5001/api/v0/add";
export const URL_PIN = "https://ipfs.infura.io:5001/api/v0/pin/add?arg=/ipfs/";

export const upload = async (file: Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(URL_UPLOAD, formData);
  // @ts-ignore
  const hash = data.Hash as string;

  // Pin
  await axios.post(URL_PIN + hash);

  return hash;
};
