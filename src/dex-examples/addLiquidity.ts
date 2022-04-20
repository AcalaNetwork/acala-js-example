import getPolkadotApi from "../utils/getPolkadotApi";
import getSigner from "../utils/getSigner";
import getSystemParameters from "../utils/getSystemParameters";

const addLiquidity = async () => {
  const api = await getPolkadotApi();
  const { symbolsDecimals } = await getSystemParameters();

  const signer = await getSigner();
  const currency_id_a = {
    TOKEN: "KAR",
  };
  const currency_id_b = {
    TOKEN: "KSM",
  };

  const max_amount_a = 1 * 10 ** symbolsDecimals["KAR"];
  const max_amount_b = 1 * 10 ** symbolsDecimals["KSM"];
  // slippage is 100% for receiving shares
  const min_share_increment = 0;
  const stake_increment_share = true;

  const extrinsic = api.tx.dex.addLiquidity(
    currency_id_a,
    currency_id_b,
    max_amount_a,
    max_amount_b,
    min_share_increment,
    stake_increment_share
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
};
addLiquidity();
