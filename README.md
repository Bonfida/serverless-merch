<h1 align="center">Serverless Merch</h1>
<br />
<p align="center">
<img width="250" src="https://i.imgur.com/nn7LMNV.png"/>
</p>
<p align="center">
<a href="https://twitter.com/bonfida">
<img src="https://img.shields.io/twitter/url?label=Bonfida&style=social&url=https%3A%2F%2Ftwitter.com%2Fbonfida">
</a>
</p>

<br />

<p align="center">
<strong>
Easily create and distribute merch to your community without any backend server
</strong>
</p>

<p align="center">
<img src="assets/cli.png" />
</p>

<div align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
</div>

<br />
<h2 align="center">Table of contents</h2>
<br />

1. [Introduction](#introduction)
2. [CLI](#cli)
   - [Conditions](#fetching-orders)
   - [Fetching orders](#fetching-orders)
   - [Generator vendor config](#fetching-orders)
   - [Generator payment config](#fetching-orders)
3. [UI](#ui)

<h2 align="center">Disclaimer</h2>

- This repository is in active development, so all APIs are subject to change.
- This code is unaudited. Use at your own risk.

<br />
<a name="introduction"></a>
<h2 align="center">Introduction</h2>
<br />

```
git clone git@github.com:Bonfida/serverless-merch.git
cd serverless-merch
```

This repository aims to provide an easy way for Solana communities to create and distribute merch to their communities. It is composed of:

- A command line interface (CLI) that can be used to:
  - Fetch orders and save them as a .csv file
  - Create a vendor configuration file
  - Create a RSA keypair
- A demo UI:
  - Built with React + Typescript + Tailwind
  - Can be adapted to any merch/goodie

<br />
<p align="center">
<img width="95%" src="assets/overview.png" />
</p>
<br />

The program works as follows:

1. User enters shipping information in the UI
2. User information is encrypted with the RSA publickey of the vendor
3. The **encrypted** data is uploaded to IPFS
4. The user sends a transaction composed of
   - Instruction 1: A token transfer to the vendor address
   - Instruction 2: A Memo program instruction logging the IPFS CID
5. The vendor fetches all the transactions made to its fee address
6. Transactions are parsed:
   - Verify the token amount transfered
   - Extract the IFPS CID
   - Optional: Verify that a user meets a set of vendor-defined conditions
7. Fetch encrypted data from IPFS
8. Decrypt data and save to disk

<br />
<a name="cli"></a>
<h2 align="center">CLI</h2>
<br />

To run the CLI:

```
cd cli
yarn && yarn dev
```

<br />
<a name="conditions"></a>
<h3 align="center">Conditions</h3>
<br />

A vendor can set arbitrary conditions that users should meet to be able to submit orders. For instance, this can be used to verify that the order was submitted by a user that holds a particular NFT, has a certain amount of tokens or owns domain names.

A condition is defined as:

```ts
type Condition = (arg: PublicKey) => Promise<boolean>;
```

A vendor can define several conditions and evaluate them by defining a condition array:

```ts
export const CONDITIONS: Condition[] = [condition_1, condition_1];
```

<br />
<a name="fetching-orders"></a>
<h3 align="center">Fetching orders</h3>
<br />

Fetching submitted orders can be done via the CLI. The results will be saved on disk in 3 files:

- `errors_orders.csv`: Orders that could not be decrypted
- `invalid_orders.csv`: Orders that failed for one of the following reason
  - User did not send enough tokens (i.e did not pay the right price)
  - User does not meet the conditions set by the vendor
  - RPC connection error while fetching transaction information
  - Could not find the memo in the transaction
- `valid_orders.csv`: CSV file that contains valid orders information

<br />
<a name="vendor-config"></a>
<h3 align="center">Generating vending configuration</h3>
<br />

A vendor config is a RSA keypair i.e a set of public and private keys. The CLI can be used to create a new keypair or load an existing keypair from its path. Keypairs generated from the CLI have a key length of 4,096 bytes.

This keypair will be used to encrypt user information at submission and then decrypt it when fetching orders.

<br />
<a name="payment-config"></a>
<h3 align="center">Generating payment configuration</h3>
<br />

A payment config is a JSON file containing the following information:

```typescript
export interface VendorConfig {
  address: string;
  price: number;
}
```

For example if you want to receive USDC at `3emsAVdmGKERbHjmGfQ6oZ1e35dkf5iYcS6U4CPKFVaa` and the price of each item is 20 USDC (USDC has 6 decimals) the config file will be

```json
{
  "address": "3emsAVdmGKERbHjmGfQ6oZ1e35dkf5iYcS6U4CPKFVaa",
  "price": 20000000
}
```

The CLI can be used to create a new configuration or load an existing JSON file from its path.

<br />
<a name="ui"></a>
<h2 align="center">UI</h2>
<br />

<img src="assets/ui.png" />

```
cd ui
yarn && yarn start
```

The environment file must contain the following variables

```
REACT_APP_CONNECTION_DEV= The RPC URL for your dev enviroment
REACT_APP_CONNECTION= The RPC URL for your production build
REACT_APP_COLLECT_FEES= The address used to collect fees
GENERATE_SOURCEMAP=false
```

You **must** also specify your RSA public key in `ui/src/rsa/pubkey.tsx`

```ts
/**
 * THIS IS AN EXAMPLE!
 * REPLACE THIS WITH YOUR OWN PUBLIC KEY ????
 */

export const publicKey = `-----BEGIN PUBLIC KEY----- ... ----END PUBLIC KEY-----`;
```
