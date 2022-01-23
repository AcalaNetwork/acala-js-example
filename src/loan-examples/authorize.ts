import { ApiPromise } from '@polkadot/api';
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

const authorize = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());

  const signer = getSigner();

  const accountId = process.env.ACCOUNT_ID;
  const extrinsic = api.tx.honzon.authorize({ TOKEN: "KSM" }, accountId);
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
authorize();
