import { IClient } from "@massalabs/massa-web3";
import { maxServiceFee } from "./constants";

const topStaker = async (client: IClient) => {
  const stakers = await client.publicApi().getStakers();
  const top = stakers[0][1];
  return top;
};

export const progressiveFee = async (client: IClient, rolls: number) => {
  const topStakerFee = maxServiceFee;
  const topStakerRolls = await topStaker(client);
  const fee = (topStakerFee * rolls) / topStakerRolls;
  return fee;
};
