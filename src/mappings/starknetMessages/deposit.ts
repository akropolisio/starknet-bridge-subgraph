import {
  ConsumedMessageToL2,
  LogMessageToL2,
} from "../../../generated/StarknetMessaging/StarknetMessaging";
import {
  createDepositEvent,
  loadDepositEvent,
  loadOrCreateUnfinishedDeposit,
  loadUnfinishedDeposit,
} from "../../entities";
import {
  ADDRESS_TYPE,
  addUniq,
  bigIntToAddressBytes,
  isBridgeDepositMessage,
  TransferStatus,
} from "../../utils";
import { makeIdFromPayload } from "../../utils/makeIdFromPayload";

export function handleLogMessageToL2(event: LogMessageToL2): void {
  let bridgeL1Address = event.params.from_address;
  let bridgeL2Address = bigIntToAddressBytes(
    event.params.to_address,
    ADDRESS_TYPE.STARKNET
  );

  if (!isBridgeDepositMessage(bridgeL1Address, bridgeL2Address)) {
    return;
  }

  const depositEvent = createDepositEvent(event);

  const unfinishedDeposit = loadOrCreateUnfinishedDeposit(
    makeIdFromPayload(bridgeL1Address, event.params.payload)
  );
  unfinishedDeposit.depositEvents = addUniq(
    unfinishedDeposit.depositEvents,
    depositEvent.id
  );
  unfinishedDeposit.save();
}

export function handleConsumedMessageToL2(event: ConsumedMessageToL2): void {
  let bridgeL1Address = event.params.from_address;
  let bridgeL2Address = bigIntToAddressBytes(
    event.params.to_address,
    ADDRESS_TYPE.STARKNET
  );

  if (!isBridgeDepositMessage(bridgeL1Address, bridgeL2Address)) {
    return;
  }

  let unfinishedDeposit = loadUnfinishedDeposit(
    makeIdFromPayload(bridgeL1Address, event.params.payload)
  );

  let depositEvent = loadDepositEvent(unfinishedDeposit.depositEvents[0]);
  depositEvent.status = TransferStatus.FINISHED;
  depositEvent.finishedTxHash = event.transaction.hash;
  depositEvent.save();

  unfinishedDeposit.depositEvents = unfinishedDeposit.depositEvents.slice(1);
  unfinishedDeposit.save();
}
