// Don't change the values here, it will affect the buying process and transactions might fail

import { IClient } from "@massalabs/massa-web3";

export const minimalFee = async (client: IClient) => {
  const fee = await client.publicApi().getMinimalFees();
  return fee;
};

export const buyFee = 0.01; //  current minimal fee for buying rolls
export const serviceFee = 0.01; // 1% service fee from the MAS amount
export const maxServiceFee = 100; // 100 MAS max service fee
export const feeAddress =
  "AU125BxaWeUaS1ffEjTCvF1QkVSMw572PNvnJBCGFCwqXFnbFQCGf";
export const masDecimals = 9; // 9 decimal points for MAS token
