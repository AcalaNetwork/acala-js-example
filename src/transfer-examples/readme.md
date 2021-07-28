# Token Transfers & Subscription to Transfer Events

Two modules allow transferring tokens in Karura network:
 `currencies` and `balances`.

All tokens supported by Karura runtime are native tokens and can be transferred using `currencies` module. KAR is a network token and it supports transfers using `balances` module.

### Transferring Network token (KAR)


```typescript=
    const dest = "<DESTINATION_ADDRESSS>";
    const amount = 1 * 10 ** symbolsDecimals[NETWORK_TOKEN_SYMBOL];
    const extrinsic = api.tx.balances.transfer(dest, amount);
```

**Full code snippet:**
[network-token-transfer.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/transfer-examples/network-token-transfer.ts)

To run:
```bash=
npx ts-node src/transfer-examples/network-token-transfer.ts
```

### Transferring all native tokens


```typescript=
    const dest = "<DESTINATION_ADDRESS>";
    const token = { TOKEN: "KSM" };
    const amount = 1 * 10 ** symbolsDecimals["KSM"];
    const extrinsic = api.tx.currencies.transfer(dest, token, amount);
```

**Full code snippet:**
[general-token-transfer.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/transfer-examples/general-token-transfer.ts)

To run:
```bash=
npx ts-node src/transfer-examples/general-token-transfer.ts
```

### Subscribing to transfer events

2 events will be emitted when a token is transferred:
- **currencies.Transferred** emitted when token transferred using `currencies` module
- **balances.Transfer** emitted when the transfer was initiated by `balances` module

    > Note :warning: when Network Token (KAR) is transferred using `currencies` module both events will be emitted.

```typescript=
    await api.query.system.events((events) => {
    events.forEach((event) => {
        const { section, method } = event.event;
        if (section === "currencies" && method === "Transferred") {
            ...
        }
        if (section === "balances" && method === "Transfer") {
            ...
        }
    }
```

**Full code snippet:**
[subscribe-transfer-events.ts](https://github.com/AcalaNetwork/acala-js-example/blob/bf702ab6000928e05c309aecf57ad197648e07e2/src/transfer-examples/subscribe-transfer-events.ts)

To run:
```bash=
npx ts-node src/transfer-examples/subscribe-transfer-events.ts
```