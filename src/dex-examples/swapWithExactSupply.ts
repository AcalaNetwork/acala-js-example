import { ApiPromise } from "@polkadot/api";
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

const amountOfACAToConvert = 10;

export const swapWithExactSupply = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const { symbolsDecimals } = await getSystemParameters(api);

  const signer = getSigner();
  const supplyAmount = amountOfACAToConvert * 10 ** symbolsDecimals["KAR"];

  const path = [
    {
      TOKEN: "KAR",
    },
    {
      TOKEN: "KUSD",
    },
  ];
  const minTargetAmount = "0x0";

  const extrinsic = api.tx.dex.swapWithExactSupply(path, supplyAmount, minTargetAmount);
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
