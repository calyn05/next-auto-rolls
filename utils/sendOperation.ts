import { fromMAS, IClient } from "@massalabs/massa-web3";
import { feeAddress, minimalFee } from "@/utils";

const sendFeeOperation = async (client: IClient, fee: string) => {
  const txId = await client.wallet().sendTransaction({
    fee: await minimalFee(client),
    amount: fromMAS(fee),
    recipientAddress: feeAddress,
  });

  return txId;
};

export { sendFeeOperation };
