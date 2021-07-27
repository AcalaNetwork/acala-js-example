import dotenv from "dotenv";
dotenv.config();

import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";

export const getPolkadotApiProvider = async () => {
  const provider = new WsProvider(process.env.WS_NODE_ENDPOINT, 100);
  const api = new ApiPromise(
    options({
      provider,
    })
  );
  await api.isReady;
  return api;
};

export default getPolkadotApiProvider;
