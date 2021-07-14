const getPolkadotApi = require('./getPolkadotApi');
const getSigner = require('./getSigner');
const getSystemParameters = require('./getSystemParameters');

const amountOfAUSDToConvert = 1;

const swapWithExactTarget = async () => {
    const api = await getPolkadotApi();
    const {
        symbolsDecimals
    } = await getSystemParameters();

    const signer = getSigner();
    const targetAmount = amountOfAUSDToConvert * 10 ** symbolsDecimals["AUSD"];

    const path = [{
            TOKEN: "ACA",
        },
        {
            TOKEN: "AUSD",
        },
    ]
    // we are willing to spend maximum 2 ACA to get 1 AUSD
    const maxSupplyAmount = 2 * 10 ** symbolsDecimals["ACA"];

    const extrinsic = api.tx.dex.swapWithExactTarget(
        path,
        targetAmount,
        maxSupplyAmount,
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log('hash', hash.toHuman())
}
swapWithExactTarget();