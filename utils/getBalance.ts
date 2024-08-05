import { Client, fromMAS } from "@massalabs/massa-web3";

export const getBalanceMas = async (
  address: string,
  client: Client
): Promise<bigint> => {
  return fromMAS(
    (await client.publicApi().getAddresses([address]))[0].final_balance
  );
};

export const getCandidateBalance = async (
  address: string,
  client: Client
): Promise<bigint> => {
  return fromMAS(
    (await client.publicApi().getAddresses([address]))[0].candidate_balance
  );
};
