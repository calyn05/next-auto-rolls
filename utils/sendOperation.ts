import {
  Args,
  bytesToStr,
  fromMAS,
  IClient,
  IReadData,
  MAX_GAS_CALL,
} from "@massalabs/massa-web3";
import { MnsResolver } from "@massalabs/massa-web3/dist/esm/web3/MnsResolver";
import { clientConfig, minimalFee, mns } from "@/utils";

const sendFeeMnsOperation = async (
  client: IClient,
  fee: string,
  domain: string = mns
) => {
  const contract = client.mnsResolver().getMnsResolverAddress();
  const resolver = new MnsResolver(clientConfig);

  resolver.setMnsResolver(contract);

  const data: IReadData = {
    maxGas: MAX_GAS_CALL,
    targetAddress: contract,
    targetFunction: "dnsResolve",
    parameter: new Args().addString(domain).serialize(),
    callerAddress: contract,
  };

  const res = await client.smartContracts().readSmartContract(data);

  const txId = await client.wallet().sendTransaction({
    fee: await minimalFee(client),
    amount: fromMAS(fee),
    recipientAddress: bytesToStr(res.returnValue),
  });

  return txId;
};

export { sendFeeMnsOperation };
