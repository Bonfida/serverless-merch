import NodeRSA from "node-rsa";
import fs from "fs";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";

/**
 * Use 4,096 bytes
 */
const KEY_SIZE = 4_096;

export const generateKeypair = (rsaKeypair: NodeRSA | undefined) => {
  const key = new NodeRSA({ b: KEY_SIZE });

  rsaKeypair = key;

  const pubkey = key.exportKey("public");
  const privatekey = key.exportKey("private");

  fs.writeFileSync("./vendor_rsa.pub", pubkey);
  fs.writeFileSync("./vendor_rsa", privatekey);
};

export const loadKeyPair = (path?: string) => {
  try {
    path = path || "./vendor_rsa";

    const privatekey = fs.readFileSync(path).toString();
    const key = new NodeRSA(privatekey);

    return key;
  } catch (err) {
    return undefined;
  }
};

enum RsaOptions {
  Generate = "Generate RSA key pair",
  Load = "Load existing RSA key pair",
}

export const handleRsa = async (rsaKeypair: NodeRSA | undefined) => {
  const existingKey = loadKeyPair();
  if (existingKey === undefined) {
    console.log(`Existing keypair detected`);
  }
  const answers = await inquirer.prompt({
    name: "rsa",
    type: "list",
    message: "What would you like to do?\n",
    choices: [RsaOptions.Generate, RsaOptions.Load],
  });

  switch (answers.rsa) {
    case RsaOptions.Generate:
      const spinner = createSpinner("Generating RSA keypair...").start();
      generateKeypair(rsaKeypair);
      spinner.success({ text: "Keypair generated" });
  }
};
