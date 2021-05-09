import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";
import { useEffect, useState } from "react";

function App() {
  const [api, setApi] = useState();
  const [aUSDBalance, setAUSDBalance] = useState();
  const [acaBalance, setACABalance] = useState();
  const [decimals, setDecimals] = useState();

  useEffect(() => {
    const provider = new WsProvider(
      "wss://acala-mandala.api.onfinality.io/public-ws"
    );

    const api = new ApiPromise(
      options({
        provider,
      })
    );

    api.isReady.then(() => {
      setApi(api);
    });
  }, []);

  useEffect(() => {
    if (api?.isReady) {
      api.rpc.system.properties().then((result) => {
        let decimals = {};

        const tokenDecimals = result.tokenDecimals.isNone
          ? []
          : result.tokenDecimals.value;
        const tokenSymbol = result.tokenSymbol.isNone
          ? []
          : result.tokenSymbol.value;

        for (let i = 0; i < tokenSymbol.length; i++) {
          decimals[tokenSymbol[i]] = tokenDecimals[i].toNumber();
        }

        setDecimals(decimals);
      });
    }
  }, [api]);

  useEffect(() => {
    if (api?.isReady && decimals) {
      const unsubAUSD = api.query.tokens.accounts(
        "5FnLzAUmXeTZg5J9Ao5psKU68oA5PBekXqhrZCKDbhSCQi88",
        {
          TOKEN: "AUSD",
        },
        (result) => {
          setAUSDBalance(
            (Number(result.free.toString()) / 10 ** decimals["AUSD"]).toFixed(5)
          );
        }
      );

      const unsubACA = api.query.system.account(
        "5FnLzAUmXeTZg5J9Ao5psKU68oA5PBekXqhrZCKDbhSCQi88",
        (result) => {
          setACABalance(
            (
              Number(result.data.free.toString()) /
              10 ** decimals["ACA"]
            ).toFixed(5)
          );
        }
      );

      return () => {
        unsubAUSD.then((cb) => cb());
        unsubACA.then((cb) => cb());
      };
    }
  }, [api, decimals]);

  return (
    <div className="App">
      <div>aca balance: {aUSDBalance} aUSD</div>
      <div>ausd balance: {acaBalance} ACA</div>
    </div>
  );
}

export default App;
