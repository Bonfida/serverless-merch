#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import { fetchOrders } from "./orders";
import figlet from "figlet";
import { handleRsa, loadKeyPair } from "./rsa";
import NodeRSA from "node-rsa";
import {
  VendorConfig,
  handleVendorConfig,
  loadVendorConfig,
} from "./vendor_config";

/**
 * Global variables
 */
let rsaKeypair: NodeRSA | undefined = undefined;
let vendorConfig: VendorConfig | undefined = undefined;

/**
 * - Generate keypair
 * - Fetch orders
 */

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

enum WelcomeOptions {
  FetchOrders = "🚚 Fetch orders \n",
  GenerateRsa = "🔐 Generate vendor RSA keys \n",
  GeneratePayment = "💰 Generate payment config \n",
  Exit = "👋 Exit",
}

export async function welcome() {
  figlet(`Serverless merch`, (err, data) => {
    console.log(gradient.pastel.multiline(data + "\n"));
  });
  await sleep(100);
  /**
   * Try to load default config
   */
  rsaKeypair = loadKeyPair();
  vendorConfig = loadVendorConfig();

  while (true) {
    const answers = await inquirer.prompt({
      name: "welcome",
      type: "list",
      message: "What would you like to do?\n",
      choices: [
        WelcomeOptions.FetchOrders,
        WelcomeOptions.GenerateRsa,
        WelcomeOptions.GeneratePayment,
        WelcomeOptions.Exit,
      ],
    });

    if (answers.welcome === WelcomeOptions.FetchOrders) {
      if (!rsaKeypair) {
        console.log(`RSA keypair not found - Please load or create one \n`);
        continue;
      } else if (!vendorConfig) {
        console.log(`Vendor config not found - Please load or create one \n`);
        continue;
      } else {
        await fetchOrders(rsaKeypair, vendorConfig);
      }
    } else if (answers.welcome === WelcomeOptions.GenerateRsa) {
      rsaKeypair = await handleRsa();
      continue;
    } else if (answers.welcome === WelcomeOptions.GeneratePayment) {
      vendorConfig = await handleVendorConfig();
      continue;
    } else if (answers.welcome === WelcomeOptions.Exit) {
      process.exit(0);
    }
  }
}

welcome();
