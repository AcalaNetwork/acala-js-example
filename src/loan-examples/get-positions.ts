import getPolkadotApi from "../utils/getPolkadotApi";

const getPositions = async () => {
  const api = await getPolkadotApi();
  const result = await api.query.loans.positions(
    { TOKEN: "KSM" },
    "<ACCOUNT_ID>"
  );
  console.log(result.toHuman());
};
getPositions();
