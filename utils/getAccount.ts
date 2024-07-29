import { WalletClient } from "@massalabs/massa-web3";

const accountFromSecret = async () => {
  const secretKey = process.env.NEXT_PUBLIC_MASSA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing secret key in .env file");
  }

  const account = await WalletClient.getAccountFromSecretKey(secretKey);
  const address = account.address;

  if (!address) {
    throw new Error("Missing address from account");
  }

  return account;
};

export { accountFromSecret };
