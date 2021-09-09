import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

const closeLoanWithDex = async () => {
  const api = await getPolkadotApi();

  const signer = getSigner();

  const extrinsic = api.tx.honzon.closeLoanHasDebitByDex(
    { TOKEN: "KSM" },
    // large number, allows swapping almost any amount
    1 * 10 ** 30,
    [{ TOKEN: "KSM" }, { TOKEN: "KUSD" }]
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
closeLoanWithDex();
