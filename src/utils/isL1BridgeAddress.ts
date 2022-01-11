import { Address, Bytes } from "@graphprotocol/graph-ts";

import { l1BridgesAddresses } from "./constants";

export function isL1BridgeAddress(address: Address): boolean {
  let equals = false;

  for (let i = 0; i < l1BridgesAddresses.length; i++) {
    equals = equals || l1BridgesAddresses[i].equals(address);
  }

  return equals;
}
