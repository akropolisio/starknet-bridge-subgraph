import { Bytes } from "@graphprotocol/graph-ts";
import { bridgesAddresses } from "../../generated/config";

export let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export class TransferStatus {
  static PENDING: string = "PENDING";
  static FINISHED: string = "FINISHED";
}

export const l1BridgesAddresses: Bytes[] = bridgesAddresses.map<Bytes>(
  (x: string): Bytes => Bytes.fromByteArray(Bytes.fromHexString(x))
);
