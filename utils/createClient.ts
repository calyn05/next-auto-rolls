import {
  CHAIN_ID,
  ClientFactory,
  DefaultProviderUrls,
  IAccount,
} from "@massalabs/massa-web3";

const createClient = async (baseAccount: IAccount) => {
  const client = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.MAINNET,
    CHAIN_ID.MainNet,
    true,
    baseAccount
  );

  return client;
};

export { createClient };
