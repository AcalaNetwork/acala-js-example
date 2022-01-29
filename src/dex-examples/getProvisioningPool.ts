import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";

export const getProvisioningPool = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const liquidity = await api.query.dex.provisioningPool(
    [
      {
        TOKEN: "KAR",
      },
      {
        TOKEN: "KUSD",
      },
    ],
    "t98jaBc3cdvZuQpBoiXpJW1uGsFhf9Gq6YDW4UmMtxdxZVL",
  );
  console.log((liquidity as any).map((t) => t.toHuman()));
};
