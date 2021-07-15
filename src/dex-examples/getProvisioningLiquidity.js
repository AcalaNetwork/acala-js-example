const getPolkadotApi = require('./getPolkadotApi');

const getProvisioningPool = async () => {
    const api = await getPolkadotApi();
    const liquidity = await api.query.dex.provisioningPool([{
            TOKEN: 'KAR'
        },
        {
            TOKEN: 'KUSD'
        }
    ], 't98jaBc3cdvZuQpBoiXpJW1uGsFhf9Gq6YDW4UmMtxdxZVL');
    console.log(liquidity.map(t => t.toHuman()))
}
getProvisioningPool();