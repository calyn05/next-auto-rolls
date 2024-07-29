NEXT AUTO ROLLS dashboard on Massa Blockchain

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run auto roll buying

Click on the "Start Auto Buy" button to start the auto roll buying. The system will automatically buy a new roll once the balance is reached.

## Stop auto roll buying

Close the browser tab or reload the page to stop the auto roll buying.

## Fees

We have a small 1% fee on the auto roll buying from the $MAS used.

We also set a max fee to 100 $MAS. This means that the fee will not exceed 100 $MAS.

The fee is taken only if the roll is bought successfully.

There are also transaction fees that are paid to the Massa Blockchain network. These fees are not included in the 1% fee. The total network fee is 0.02 $MAS - for two transactions: one for the roll buying and one for fee transaction.

# Fee calculation example

1 roll = 100 $MAS + 0.01 $MAS tx fee + 1 $MAS service fee + 0.01 $MAS tx fee

Total fee = 1.02 $MAS

2 rolls = 200 $MAS + 0.01 $MAS tx fee + 2 $MAS service fee + 0.01 $MAS tx fee

Total fee = 2.02 $MAS

10 rolls = 1000 $MAS + 0.01 $MAS tx fee + 10 $MAS service fee + 0.01 $MAS tx fee

Total fee = 10.02 $MAS

100 rolls = 10000 $MAS + 0.01 $MAS tx fee + 100 $MAS service fee + 0.01 $MAS tx fee

Total fee = 100.02 $MAS

1000 rolls = 100000 $MAS + 0.01 $MAS tx fee + 100 $MAS service fee + 0.01 $MAS tx fee

Total fee = 100.02 $MAS

# Use cases

- If you miss blocks and the rolls are sold out, you can use this app to buy new rolls automatically.
- If you have deferred credits and you want to buy new rolls automatically.
- When balance for a new roll is reached and you are not around to buy a new roll.
