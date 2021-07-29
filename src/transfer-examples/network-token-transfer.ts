import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

const NETWORK_TOKEN_SYMBOL = "KAR";

// transfer network token
const networkTokenTransfer = async () => {
  const api = await getPolkadotApi();
  const { symbolsDecimals } = await getSystemParameters();

  const signer = getSigner();

  // transfer 1 KAR to `dest`
  const dest = "seorgCZDzP5G3JEbsBjFdpQ4dTUgCWoPjQynyJqHCfXvZVW";
  const amount = 1 * 10 ** symbolsDecimals[NETWORK_TOKEN_SYMBOL];

  const extrinsic = api.tx.balances.transfer(dest, amount);

  const hash = await extrinsic.signAndSend(signer);

  console.log("transfer hash", hash.toHuman());
};

networkTokenTransfer();
