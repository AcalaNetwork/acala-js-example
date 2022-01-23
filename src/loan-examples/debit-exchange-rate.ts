import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

export const getDebitExchangeRate = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const blockHash = "0xaba4c0c5dbcfe86075a8d4436358408c247a6420381a0c8c2bcc6fe046482591";
  const result = await api.query.cdpEngine.debitExchangeRate.at(blockHash, {
    TOKEN: "KSM",
  });
  console.log(result.toHuman());
};
