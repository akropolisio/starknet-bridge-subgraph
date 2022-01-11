import {
  ConsumedMessageToL1,
  LogMessageToL1,
} from "../../../generated/StarknetMessaging/StarknetMessaging";
import {
  createWithdrawalEvent,
  loadOrCreateUnfinishedWithdrawal,
  loadUnfinishedWithdrawal,
  loadWithdrawalEvent,
} from "../../entities";
import { addUniq, isL1BridgeAddress, TransferStatus } from "../../utils";
import { makeIdFromPayload } from "../../utils/makeIdFromPayload";

export function handleLogMessageToL1(event: LogMessageToL1): void {
  let bridgeL1Address = event.params.to_address;

  if (!isL1BridgeAddress(bridgeL1Address)) {
    return;
  }

  const withdrawalEvent = createWithdrawalEvent(event);

  const unfinishedWithdrawal = loadOrCreateUnfinishedWithdrawal(
    makeIdFromPayload(bridgeL1Address, event.params.payload)
  );
  unfinishedWithdrawal.withdrawalEvents = addUniq(
    unfinishedWithdrawal.withdrawalEvents,
    withdrawalEvent.id
  );
  unfinishedWithdrawal.save();
}

export function handleConsumedMessageToL1(event: ConsumedMessageToL1): void {
  let bridgeL1Address = event.params.to_address;

  if (!isL1BridgeAddress(bridgeL1Address)) {
    return;
  }

  let unfinishedWithdrawal = loadUnfinishedWithdrawal(
    makeIdFromPayload(bridgeL1Address, event.params.payload)
  );

  let withdrawalEvent = loadWithdrawalEvent(
    unfinishedWithdrawal.withdrawalEvents[0]
  );
  withdrawalEvent.status = TransferStatus.FINISHED;
  withdrawalEvent.finishedTxHash = event.transaction.hash;
  withdrawalEvent.save();

  unfinishedWithdrawal.withdrawalEvents = unfinishedWithdrawal.withdrawalEvents.slice(
    1
  );
  unfinishedWithdrawal.save();
}
