import { IClient } from "@massalabs/massa-web3";

const getAddressInfo = async (client: IClient, address: string) => {
  const activeRolls = await client
    .publicApi()
    .getStakers()
    .then((stakers) => {
      const index = stakers.findIndex(
        (staker) => (staker[0] as any) === address
      );
      return stakers[index][1];
    });

  const accountBalance = await client.wallet().getAccountBalance(address);
  const finalRolls = await client
    .publicApi()
    .getAddresses([address])
    .then((res) => {
      return res[0].final_roll_count;
    });
  return {
    activeRolls,
    accountBalance,
    finalRolls,
  };
};

export { getAddressInfo };
