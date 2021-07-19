const getPolkadotApi = require('./getPolkadotApi');
const getSigner = require('./getSigner');

const removeLiquidity = async () => {
    const api = await getPolkadotApi();

    const signer = getSigner();
    const currency_id_a = {
        TOKEN: 'KAR'
    };
    const currency_id_b = {
        TOKEN: 'KSM'
    };
    const remove_share = 1;

    // slippage for KAR is 100%, we want to receive anything that liquidity pool ratio will offer
    const min_withdrawn_a = 0;
    // slippage for KSM is 100%, we want to receive anything that liquidity pool ratio will offer
    const min_withdrawn_b = 0;
    const by_unstake = false;

    const extrinsic = api.tx.dex.removeLiquidity(
        currency_id_a,
        currency_id_b,
        remove_share,
        min_withdrawn_a,
        min_withdrawn_b,
        by_unstake
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log('hash', hash.toHuman())
}
removeLiquidity();