NEXT AUTO ROLLS dashboard on Massa Blockchain - Auto roll buying

Version 1.2.1

Update necessary from version 1.2.0 - Min rolls to buy in a single transaction fixed

# Description

This app is made to run locally on your machine in development mode, for security reasons. It is not recommended to run this app on a public server, as it will need your private key for auto roll buying.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The repo is a dashboard for the NEXT AUTO ROLLS project on the Massa Blockchain. It is a simple dashboard that displays the current balance, final and active rolls. Once the user starts Auto roll buying, the dashboard will check every 60 seconds the current balance, final and active rolls and $MAS amount till next roll buy. The user can also stop the auto roll buying at any time by closing the browser tab, or reload the page.

Once the balance is reached the system will automatically buy a new roll and continue the process.

## Getting Started

Clone the repo and install the dependencies:

- open a terminal in your desired directory on your machine
- run `git clone https://github.com/calyn05/next-auto-rolls.git` or download the zip file from the repo
- run `cd next-auto-rolls`
- run `npm install` or `yarn install` or `pnpm install` or `bun install`

- create a `.env` file in the root of the project or rename the `.env.example` file to `.env`
- add the necessary environment variables in the `.env` file
- make sure that your private key is not shared with anyone
- and that you add the key of your staking wallet

## Running the app

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Update the app

- open a terminal in the root of the project
- run `git pull` to update the app
- run `npm install` or `yarn install` or `pnpm install` or `bun install` to install the new dependencies
- run `npm run dev` or `yarn dev` or `pnpm dev` or `bun dev` to start the app

## Run auto roll buying

Click on the "Start Auto Buy" button to start the auto roll buying. The system will automatically buy a new roll once the balance is reached, or use all the available $MAS to buy new rolls.

## Min rolls to buy in a single transaction

The default number of rolls that can be bought in a single transaction is 1 roll.
Set the number of rolls you want to buy in a single transaction in the input field.
Once the balance is reached, the system will buy the number of rolls set in the input field.

## Stop auto roll buying

Close the browser tab or reload the page to stop the auto roll buying.

## Fees - Introducing the progressive fee system

The progressive fee system is a mechanism that allows users to pay a fee based on the size of the transaction they are sending. This is a way to help small balance users to pay less fees, especially when the rolls get autosold and the system buys new rolls.

The fee is calculated based on the number of rolls bought by the system and taking into account the biggest staking address roll balance.

So, if the system buys a number of rolls equal or bigger than the biggest staking address roll balance, the fee will be 1000 $MAS, which is the max fee.

We have a minimum fee of 1 $MAS. This means that the fee will not be less than 1 $MAS.

As mentioned above we also set a max fee of 1000 $MAS. This means that the fee will not be more than 1000 $MAS.

The max fee is reached when the system buys a number of rolls equal or bigger than the biggest staking address roll balance.

The fee is taken only if the roll is bought successfully.

There are also transaction fees that are paid to the Massa Blockchain network. These fees are not included in the service fee. The total network fee is 0.02 $MAS - for two transactions: one for the roll buying and one for fee transaction.

# Fee calculation example

We have a fee calculator that calculates the fee based on the number of rolls bought by the system. Check it out on the main page of the app, after you start the auto roll buying.

Here are some examples of how the fee is calculated:

1 roll = 100 $MAS + 0.01 $MAS tx fee + 1 $MAS service fee + 0.01 $MAS tx fee

Service fee = 1.02 $MAS

2 rolls = 200 $MAS + 0.01 $MAS tx fee + 1.0295072292711713 $MAS service fee + 0.01 $MAS tx fee

Service fee = 1.0295072292711713 $MAS

10 rolls = 1000 $MAS + 0.01 $MAS tx fee + 1.147536146355857 $MAS service fee + 0.01 $MAS tx fee

Service fee: 1.147536146355857 $MAS

100 rolls = 10000 $MAS + 0.01 $MAS tx fee + 2.475361463558572 $MAS service fee + 0.01 $MAS tx fee

Service fee: 2.475361463558572 $MAS

1000 rolls = 100000 $MAS + 0.01 $MAS tx fee + 15.753614635585718 $MAS service fee + 0.01 $MAS tx fee

Service fee: 15.753614635585718 $MAS

The biggest staking address roll balance is continuously updated and the fee is calculated based on the biggest staking address roll balance.

# Environment variables

- Don't forget to add the necessary environment variables in the `.env` file

- Make sure that your address is a staking address on the Massa Blockchain

# Use cases

- If you miss blocks and the rolls are sold out, you can use this app to buy new rolls automatically.
- If you have deferred credits and you want to buy new rolls automatically.
- When balance for a new roll is reached and you are not around to buy a new roll.
