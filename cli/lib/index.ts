#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { handleRsa } from "./rsa";
import NodeRSA from "node-rsa";

/**
 * Global variables
 */
let rsaKeypair: NodeRSA | undefined = undefined;

/**
 * - Generate keypair
 * - Fetch orders
 */

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

enum WelcomeOptions {
  FetchOrders = "Fetch orders",
  GenerateRsa = "Generate vendor RSA keys",
  GeneratePayment = "Generate payment config",
}

export async function welcome() {
  const answers = await inquirer.prompt({
    name: "welcome",
    type: "list",
    message: "What would you like to do?\n",
    choices: [
      WelcomeOptions.FetchOrders,
      WelcomeOptions.GenerateRsa,
      WelcomeOptions.GeneratePayment,
    ],
  });

  switch (answers.welcome) {
    case WelcomeOptions.FetchOrders:
      console.log(1);
    case WelcomeOptions.GenerateRsa:
      return await handleRsa(rsaKeypair);
    case WelcomeOptions.GeneratePayment:
      console.log(3);

    default:
      break;
  }
}

welcome();
