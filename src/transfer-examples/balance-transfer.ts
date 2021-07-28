import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

// transfer native token and nonative tokens
const balanceTransfer = async () => {
  const api = await getPolkadotApi();
  const { symbolsDecimals } = await getSystemParameters();

  const signer = getSigner();

  // transfer 1 KAR to `dest`
  const dest = "seorgCZDzP5G3JEbsBjFdpQ4dTUgCWoPjQynyJqHCfXvZVW";
  const amount = 1 * 10 ** symbolsDecimals["KAR"];

  const extrinsic = api.tx.balances.transfer(dest, amount);

  const hash = await extrinsic.signAndSend(signer);

  console.log("transfer at hash", hash.toHuman());
};

balanceTransfer();
