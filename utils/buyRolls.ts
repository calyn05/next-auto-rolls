import { fromMAS, IClient, IRollsData } from "@massalabs/massa-web3";
import { buyFee } from "@/utils";

const buyMassaRolls = async (client: IClient, rolls: number) => {
  // buy rolls
  console.log(`Buy ${rolls} rolls`);

  const rollData: IRollsData = {
    fee: fromMAS(buyFee),
    amount: BigInt(rolls),
  };

  const txId = await client.wallet().buyRolls(rollData);

  return txId;
};

export { buyMassaRolls };
