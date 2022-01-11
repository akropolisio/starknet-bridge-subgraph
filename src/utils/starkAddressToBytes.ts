import { Bytes, BigInt } from "@graphprotocol/graph-ts";

export function starkAddressToBytes(address: BigInt): Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(address));
}
