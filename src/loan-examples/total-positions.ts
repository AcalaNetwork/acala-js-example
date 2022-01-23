import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

const getTotalPositions = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const result = await api.query.loans.totalPositions({ TOKEN: "KSM" });
  console.log(result.toHuman());
};
getTotalPositions();
