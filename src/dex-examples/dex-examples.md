# Dex Examples

### Installing dependencies
```bash=
yarn
```

### Preparing endpoints

You need to specify the endpoint in `.env` file
```bash=
WS_NODE_ENDPOINT = wss://kusama-1.polkawallet.io:9944/
```

If you want to try examples who change the state of the ledger (swaps, add/remove liquidity etc),
you need to add your seed phrase to `.env` file:
```bash=
SEED_PHRASE = <YOUR_SEED_PHRASE>
```

Reading the state of the chain doesn't require SEED_PHRASE to be specified

### Running examples
```bash=
node src/dex-examples/getLiquidity.js
```