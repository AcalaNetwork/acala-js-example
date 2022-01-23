import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

const getPositions = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const result = await api.query.loans.positions({ TOKEN: "KSM" }, process.env.ACCOUNT_ID);
  console.log(result.toHuman());
};
getPositions();
