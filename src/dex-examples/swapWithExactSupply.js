const getPolkadotApi = require('./getPolkadotApi');
const getSigner = require('./getSigner');
const getSystemParameters = require('./getSystemParameters');

const amountOfACAToConvert = 10;

const swapWithExactSupply = async () => {
    const api = await getPolkadotApi();
    const {
        symbolsDecimals
    } = await getSystemParameters();

    const signer = getSigner();
    const supplyAmount = amountOfACAToConvert * 10 ** symbolsDecimals["KAR"];

    const path = [{
            TOKEN: "KAR",
        },
        {
            TOKEN: "KUSD",
        },
    ]
    const minTargetAmount = "0x0";

    const extrinsic = api.tx.dex.swapWithExactSupply(
        path,
        supplyAmount,
        minTargetAmount
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log('hash', hash.toHuman())
}
swapWithExactSupply();