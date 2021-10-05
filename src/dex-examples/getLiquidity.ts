import getPolkadotApi from "../utils/getPolkadotApi";

const getLiquidity = async () => {
  const api = await getPolkadotApi();
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
getLiquidity();
