import { DepositEvent } from "../../generated/schema";
import { LogMessageToL2 } from "../../generated/StarknetMessaging/StarknetMessaging";
import {
  convertUint256ToBigInt,
  getUniqId,
  starkAddressToBytes,
  TransferStatus,
} from "../utils";

export function createDepositEvent(event: LogMessageToL2): DepositEvent {
  let depositEvent = new DepositEvent(getUniqId(event));

  let l2Recipient = event.params.payload[0];
  let amountLow = event.params.payload[1];
  let amountHigh = event.params.payload[2];

  depositEvent.l2Recipient = starkAddressToBytes(l2Recipient);
  depositEvent.bridgeAddressL1 = event.params.from_address;
  depositEvent.bridgeAddressL2 = starkAddressToBytes(event.params.to_address);
  depositEvent.amount = convertUint256ToBigInt(amountLow, amountHigh);
  depositEvent.status = TransferStatus.PENDING;

  depositEvent.createdAtBlock = event.block.number;
  depositEvent.createdTxHash = event.transaction.hash;
  depositEvent.finishedTxHash = null;

  depositEvent.save();

  return depositEvent;
}
