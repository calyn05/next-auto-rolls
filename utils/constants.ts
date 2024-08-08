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
export const minServiceFee = 1; // 1 $MAS minimum service fee
// Progressive fee - READ MORE: utils/PROGRESSIVEFEE.md
export const maxServiceFee = 1000; // 1000 MAS max service fee for top staker address
export const mns = title.toLowerCase().slice(6, 15).replace(" ", "");
export const masDecimals = 9; // 9 decimal points for MAS token

export const clientConfig: IClientConfig = {
  providers: [
    { url: DefaultProviderUrls.MAINNET, type: ProviderType.PUBLIC },
    { url: DefaultProviderUrls.MAINNET, type: ProviderType.PRIVATE },
  ],
  retryStrategyOn: true,
};
