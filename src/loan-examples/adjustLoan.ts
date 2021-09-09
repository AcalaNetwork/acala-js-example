import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

const adjustLoan = async () => {
  const api = await getPolkadotApi();

  const signer = getSigner();

  const currencyId = { TOKEN: "KSM" };
  const collateralAdjustment = "";
  const debitAdjustment = "";

  const extrinsic = api.tx.honzon.adjustLoan(
    currencyId,
    collateralAdjustment,
    debitAdjustment
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
adjustLoan();
