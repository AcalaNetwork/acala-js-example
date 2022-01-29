import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

export const getLiquidity = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const test = await api.query.dex.liquidityPool([
    {
      TOKEN: "KAR",
    },
    {
      TOKEN: "KSM",
    },
  ]);
  console.log((test as any).map((t) => t.toHuman()));
};
