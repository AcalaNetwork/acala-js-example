const getPolkadotApi = require('./getPolkadotApi');

const getLiquidity = async () => {
    const api = await getPolkadotApi();
    const test = await api.query.dex.liquidityPool([{
            TOKEN: 'ACA'
        },
        {
            TOKEN: 'AUSD'
        }
    ]);
    console.log(test.map(t => t.toHuman()))
}
getLiquidity();