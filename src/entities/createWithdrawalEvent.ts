import { WithdrawalEvent } from "../../generated/schema";
import { LogMessageToL1 } from "../../generated/StarknetMessaging/StarknetMessaging";
import {
  convertUint256ToBigInt,
  getUniqId,
  bugIntToAddressBytes,
  TransferStatus,
  ADDRESS_TYPE,
} from "../utils";

export function createWithdrawalEvent(event: LogMessageToL1): WithdrawalEvent {
  let withdrawalEvent = new WithdrawalEvent(getUniqId(event));

  let l1Recipient = event.params.payload[1];
  let amountLow = event.params.payload[2];
  let amountHigh = event.params.payload[3];

  withdrawalEvent.l1Recipient = bugIntToAddressBytes(
    l1Recipient,
    ADDRESS_TYPE.ETHEREUM
  );
  withdrawalEvent.bridgeAddressL1 = event.params.to_address;
  withdrawalEvent.bridgeAddressL2 = bugIntToAddressBytes(
    event.params.from_address,
    ADDRESS_TYPE.STARKNET
  );
  withdrawalEvent.amount = convertUint256ToBigInt(amountLow, amountHigh);
  withdrawalEvent.status = TransferStatus.PENDING;

  withdrawalEvent.createdAtBlock = event.block.number;
  withdrawalEvent.createdTxHash = event.transaction.hash;
  withdrawalEvent.finishedTxHash = null;

  withdrawalEvent.save();

  return withdrawalEvent;
}
