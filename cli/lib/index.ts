#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow("Serverless Merch \n");

  await sleep();
  rainbowTitle.stop();
}

welcome();
