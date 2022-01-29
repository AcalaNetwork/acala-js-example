import { ApiPromise } from '@polkadot/api';
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";

export const closeLoanWithDex = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());

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
