import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import inquirer from "inquirer";
import { connection } from "./connection";

export interface VendorConfig {
  address: string;
  price: number;
}

enum VendorConfigOptions {
  Generate = "🆕 Generate a vendor config \n",
  Load = "💾 Load existing vendor config \n",
}

export const loadVendorConfig = (path?: string) => {
  try {
    path = path || "./vendor_config.json";
    const loaded = fs.readFileSync(path);
    const config: VendorConfig = JSON.parse(loaded.toString());
    return config;
  } catch {
    return undefined;
  }
};

export const handleVendorConfig = async () => {
  const answers = await inquirer.prompt({
    name: "vendor",
    type: "list",
    message: "What would you like to do?\n",
    choices: [VendorConfigOptions.Generate, VendorConfigOptions.Load],
  });

  if (answers.vendor === VendorConfigOptions.Generate) {
    try {
      const pubkeyAnswer = await inquirer.prompt({
        name: "pubkey",
        type: "input",
        message: `Enter the address used to collect payments, for instance, if you want to collect USDC enter your USDC token account address.\n`,
      });
      const address = new PublicKey(pubkeyAnswer.pubkey);
      const info = await connection.getAccountInfo(address);

      if (!info?.data) {
        console.log("Invalid address");
        return;
      }
      console.log(`\n`);
      const priceAnswer = await inquirer.prompt({
        name: "price",
        type: "input",
        message: `Price of each item (with decimals)\n`,
      });

      const price = parseFloat(priceAnswer.price);

      if (!price || isNaN(price) || !isFinite(price) || price <= 0) {
        console.log("Invalid price");
        return;
      }

      const config: VendorConfig = { address: pubkeyAnswer.pubkey, price };

      fs.writeFileSync("./config.json", JSON.stringify(config));
      console.log("\n Config created ✨ \n");

      return config;
    } catch (err) {
      console.log("Something went wrong");
    }
  } else if (answers.vendor === VendorConfigOptions.Load) {
    const answers = await inquirer.prompt({
      name: "path",
      type: "input",
      message: `Enter the path to your config file`,
    });

    const config = loadVendorConfig(answers.path);
    if (!config) {
      console.log(`Config file does not exist`);
    }
    return config;
  }
};
