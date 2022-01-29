import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

export const getDebitExchangeRate = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const blockHash = "0x3e8d04e18d0d7655e283fa9b8f2698e818b7183d930823f6c442afc86b303fd1";
  const result = await api.query.cdpEngine.debitExchangeRate.at(blockHash, {
    TOKEN: "KSM",
  });
  console.log(result.toHuman());
};
