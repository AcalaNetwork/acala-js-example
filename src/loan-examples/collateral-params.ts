import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

export const getCollateralParams = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const result = await api.query.cdpEngine.collateralParams({ TOKEN: "KSM" });
  console.log(result.toHuman());
};
