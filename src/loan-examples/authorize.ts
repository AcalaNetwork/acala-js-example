import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

const authorize = async () => {
  const api = await getPolkadotApi();

  const signer = await getSigner();

  const accountId = "<ACCOUNT_ID>";
  const extrinsic = api.tx.honzon.authorize({ TOKEN: "KSM" }, accountId);
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
authorize();
