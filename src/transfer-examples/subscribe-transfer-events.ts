import { CurrencyId, Balance, AccountId } from '@acala-network/types/interfaces';
import getPolkadotApi from "../utils/getPolkadotApi";
import getSystemParameters from "../utils/getSystemParameters";

const subscribeTransferEvents = async () => {
  const api = await getPolkadotApi();
  const { symbolsDecimals } = await getSystemParameters();

  // NOTE: if transfer native token using currencies section, there will be two events: currencies.Transferred and balances.Transfer.
  const unsubscribe = await api.query.system.events((events) => {
    events.forEach((event) => {
      const { section, method } = event.event;

      // subscribe transfer through currencies section
      if (section === 'currencies' && method === 'Transferred') {
        // [ASSET, ORIGIN, TARGET, AMOUNT]
        const data = event.event.data;

        const token = data[0] as CurrencyId;
        const origin = data[1] as AccountId;
        const target = data[2] as AccountId;
        const amount = data[3] as Balance;

        const decimal = token.isToken ? symbolsDecimals[token.asToken.toString()] : 
          token.isDexShare ? symbolsDecimals[token.asDexShare[0].asToken.toString()] : 12;

        console.log(`transfer ${Number(amount.toString()) / (10 ** decimal)} ${(data[0] as CurrencyId).toString()} from ${origin.toHuman()} to ${target.toHuman()}`);
      }

      // subscribe transfer through balances section
      if (section === 'balances' && method === 'Transfer') {
        // [ORIGIN, TARGET, AMOUNT]
        const data = event.event.data;

        const origin = data[0] as AccountId;
        const target = data[1] as AccountId;
        const amount = data[2] as Balance;

        // pls. ensure the native token
        const decimal = symbolsDecimals['KAR'];

        console.log(`transfer ${Number(amount.toString()) / (10 ** decimal)} KAR from ${origin.toHuman()} to ${target.toHuman()}`);
      }
    })
  });
};

subscribeTransferEvents();
