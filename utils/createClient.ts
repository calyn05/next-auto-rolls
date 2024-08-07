import {
  CHAIN_ID,
  Client,
  ClientFactory,
  DefaultProviderUrls,
  IAccount,
  ProviderType,
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

const customClient = async (baseAccount: IAccount) => {
  const client = await ClientFactory.createCustomClient(
    [
      { url: DefaultProviderUrls.MAINNET, type: ProviderType.PUBLIC },
      { url: DefaultProviderUrls.MAINNET, type: ProviderType.PRIVATE },
    ],
    CHAIN_ID.MainNet,
    true,
    baseAccount
  );

  return client;
};

export { createClient, customClient };
