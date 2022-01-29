import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

export const generalTokenTransfer = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const { symbolsDecimals } = await getSystemParameters(api);

  const signer = getSigner();

  // transfer 1 KSM to `dest`
  const dest = "seorgCZDzP5G3JEbsBjFdpQ4dTUgCWoPjQynyJqHCfXvZVW";
  const token = { TOKEN: "KSM" };
  const amount = 1 * 10 ** symbolsDecimals["KSM"];

  const extrinsic = api.tx.currencies.transfer(dest, token, amount);

  const hash = await extrinsic.signAndSend(signer);

  console.log("transfer at hash", hash.toHuman());
};
