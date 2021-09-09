import getPolkadotApi from "../utils/getPolkadotApi";

const getTotalPositions = async () => {
  const api = await getPolkadotApi();
  const result = await api.query.loans.totalPositions({ TOKEN: "KSM" });
  console.log(result.toHuman());
};
getTotalPositions();
