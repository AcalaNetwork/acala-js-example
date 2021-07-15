const getPolkadotApi = require('./getPolkadotApi');

const getTradingPairStatus = async () => {
    const api = await getPolkadotApi();
    const status = await api.query.dex.tradingPairStatuses([{
            TOKEN: 'KAR'
        },
        {
            TOKEN: 'KUSD'
        }
    ]);
    console.log(status.toString())
}
getTradingPairStatus();