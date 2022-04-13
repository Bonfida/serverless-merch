import NodeRSA from "node-rsa";
import fs from "fs";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";

/**
 * Use 4,096 bytes
 */
const KEY_SIZE = 4_096;

export const generateKeypair = () => {
  const key = new NodeRSA({ b: KEY_SIZE });

  const pubkey = key.exportKey("public");
  const privatekey = key.exportKey("private");

  fs.writeFileSync("./vendor_rsa.pub", pubkey);
  fs.writeFileSync("./vendor_rsa", privatekey);

  return key;
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
  Generate = "🆕 Generate RSA key pair \n",
  Load = "💾 Load existing RSA key pair \n",
}

export const handleRsa = async () => {
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

  if (answers.rsa === RsaOptions.Generate) {
    const spinner = createSpinner("Generating RSA keypair...").start();
    const keypair = generateKeypair();
    spinner.success({ text: "Keypair generated \n" });
    return keypair;
  }

  if (answers.rsa === RsaOptions.Load) {
    const answers = await inquirer.prompt({
      name: "path",
      type: "input",
      message: "Keypair path?",
    });

    const spinner = createSpinner("Loading RSA keypair...").start();
    const loadedKeypair = loadKeyPair(answers.path);
    if (!loadedKeypair) {
      spinner.stop({ text: "Keypair not found \n" });
      process.exit(1);
    }
    spinner.success({ text: "Keypair loaded \n" });
    return loadedKeypair;
  }
};
