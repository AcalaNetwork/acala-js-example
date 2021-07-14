const getPolkadotApi = require('./getPolkadotApi');
const getSigner = require('./getSigner');
const getSystemParameters = require('./getSystemParameters');

const amountOfACAToConvert = 1;

const swapWithExactSupply = async () => {
    const api = await getPolkadotApi();
    const {
        symbolsDecimals
    } = await getSystemParameters();


    const supplyAmount = amountOfACAToConvert * 10 ** symbolsDecimals["ACA"];

    const path = [{
            TOKEN: "ACA",
        },
        {
            TOKEN: "AUSD",
        },
    ]
    const minTargetAmount = "0x0";


    const signer = getSigner();
    const extrinsic = api.tx.dex.swapWithExactSupply(
        path,
        supplyAmount,
        minTargetAmount
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log('hash', hash.toHuman())
}
swapWithExactSupply();