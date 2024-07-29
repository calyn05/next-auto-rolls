import { EOperationStatus, IClient } from "@massalabs/massa-web3";

const operationStatus = async (
  client: IClient,
  txId: string,
  untilFinal: boolean = true
) => {
  const status = await client
    .smartContracts()
    .awaitRequiredOperationStatus(txId, EOperationStatus.SPECULATIVE_SUCCESS);

  const events = await client.smartContracts().getFilteredScOutputEvents({
    start: null,
    end: null,
    original_caller_address: null,
    original_operation_id: txId,
    emitter_address: null,
    is_final: null,
  });

  if (!untilFinal) return { status, events };

  await client
    .smartContracts()
    .awaitRequiredOperationStatus(txId, EOperationStatus.FINAL_SUCCESS);

  return { status, events };
};

export { operationStatus };
