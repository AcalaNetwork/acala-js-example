import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

const currenciesTransfer = async () => {
  const api = await getPolkadotApi();
  const { symbolsDecimals } = await getSystemParameters();

  const signer = getSigner();

  // transfer 1 KAR to `dest`
  const dest = 'seorgCZDzP5G3JEbsBjFdpQ4dTUgCWoPjQynyJqHCfXvZVW';
  const token = { TOKEN: 'KAR' }
	const amount = 1 * (10 ** symbolsDecimals['KAR']);

  const extrinsic = api.tx.currencies.transfer(dest, token, amount);

  const hash = await extrinsic.signAndSend(signer);

  console.log("transfer at hash", hash.toHuman());
};

currenciesTransfer();
