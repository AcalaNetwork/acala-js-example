import { ApiPromise } from '@polkadot/api';
import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

const amountOfAUSDToConvert = 1;

export const swapWithExactTarget = async (polkadotApi?: ApiPromise) => {
  const api = polkadotApi || (await getPolkadotApi());
  const { symbolsDecimals } = await getSystemParameters(api);

  const signer = getSigner();
  const targetAmount = amountOfAUSDToConvert * 10 ** symbolsDecimals["KUSD"];

  const path = [
    {
      TOKEN: "KAR",
    },
    {
      TOKEN: "KUSD",
    },
  ];
  // we are willing to spend maximum 2 KAR to get 1 KUSD
  const maxSupplyAmount = 2 * 10 ** symbolsDecimals["KAR"];

  const extrinsic = api.tx.dex.swapWithExactTarget(path, targetAmount, maxSupplyAmount);
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
