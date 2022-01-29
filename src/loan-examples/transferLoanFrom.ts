import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

export const transferLoanFrom = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());

  const signer = getSigner();

  const fromAccountId = "<ACCOUNT_ID>";
  const extrinsic = api.tx.honzon.transferLoanFrom({ TOKEN: "KSM" }, fromAccountId);
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
