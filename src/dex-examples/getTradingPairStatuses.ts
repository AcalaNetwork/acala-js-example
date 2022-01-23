import { ApiPromise } from '@polkadot/api';
import getPolkadotApi from "../utils/getPolkadotApi";

export const getTradingPairStatus = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const status = await api.query.dex.tradingPairStatuses([
    {
      TOKEN: "KAR",
    },
    {
      TOKEN: "KUSD",
    },
  ]);
  console.log(status.toString());
};
