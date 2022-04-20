import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

const transferLoanFrom = async () => {
  const api = await getPolkadotApi();

  const signer = await getSigner();

  const fromAccountId = "<ACCOUNT_ID>";
  const extrinsic = api.tx.honzon.transferLoanFrom(
    { TOKEN: "KSM" },
    fromAccountId
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
transferLoanFrom();
