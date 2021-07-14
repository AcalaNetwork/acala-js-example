require('dotenv').config();

const {
    ApiPromise,
    WsProvider
} = require("@polkadot/api");
const {
    options
} = require("@acala-network/api");

module.exports = async () => {
    const provider = new WsProvider(process.env.WS_NODE_ENDPOINT);
    const api = new ApiPromise(options({
        provider
    }));
    await api.isReady;
    return api;
}