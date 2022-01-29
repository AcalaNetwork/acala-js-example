import { ApiPromise } from '@polkadot/api';
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

export const adjustLoan = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());

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
