import getPolkadotApi from "../utils/getPolkadotApi";

const getCollateralParams = async () => {
  const api = await getPolkadotApi();
  const result = await api.query.cdpEngine.collateralParams({ TOKEN: "KSM" });
  console.log(result.toHuman());
};
getCollateralParams();
