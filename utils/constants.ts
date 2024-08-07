import {
  DefaultProviderUrls,
  IClient,
  IClientConfig,
  ProviderType,
} from "@massalabs/massa-web3";

// Don't change the values here, it will affect the buying process and transactions will fail
export const title = "Massa Auto Roll";

export const minimalFee = async (client: IClient) => {
  const fee = await client.publicApi().getMinimalFees();
  return fee;
};

// For buying rolls
export const buyFee = 0.01; //  current minimal fee for buying rolls
export const serviceFee = 0.01; // 1% service fee from the MAS amount
export const maxServiceFee = 100; // 100 MAS max service fee
export const mns = title.toLowerCase().slice(6, 15).replace(" ", "");
export const masDecimals = 9; // 9 decimal points for MAS token

export const clientConfig: IClientConfig = {
  providers: [
    { url: DefaultProviderUrls.MAINNET, type: ProviderType.PUBLIC },
    { url: DefaultProviderUrls.MAINNET, type: ProviderType.PRIVATE },
  ],
  retryStrategyOn: true,
};
