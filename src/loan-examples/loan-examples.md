# Loan Examples

### Installing dependencies
```bash=
yarn
```

### Preparing endpoints

You need to specify the endpoint in `.env` file
```bash=
WS_NODE_ENDPOINT = wss://karura.api.onfinality.io/public-ws
```

If you want to try examples who change the state of the ledger (swaps, add/remove liquidity etc),
you need to add your seed phrase to `.env` file:
```bash=
SEED_PHRASE = <YOUR_SEED_PHRASE>
```

Reading the state of the chain doesn't require SEED_PHRASE to be specified

### Running examples
```bash=
npx ts-node src/loan-examples/total-positions.ts
```