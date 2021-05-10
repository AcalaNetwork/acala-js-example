import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";
import { useEffect, useMemo, useState } from "react";
import { web3Enable } from "@polkadot/extension-dapp";

const formatNumber = (number, decimals) => {
  if (number.toString() === "0") return "0";
  return (Number(number.toString()) / 10 ** decimals).toFixed(5);
};

function App() {
  const [api, setApi] = useState();
  const [aUSDBalance, setAUSDBalance] = useState();
  const [acaBalance, setACABalance] = useState();
  const [decimals, setDecimals] = useState();
  const [extension, setExtension] = useState();
  const [accountList, setAccountList] = useState();
  const [selectedAddress, setSelectedAddress] = useState();

  useEffect(() => {
    const provider = new WsProvider(process.env.REACT_APP_ENDPOINT);

    const api = new ApiPromise(
      options({
        provider,
      })
    );

    api.isReady.then(() => {
      setApi(api);
    });
  }, []);

  useEffect(async () => {
    if (extension) {
      const list = await extension.accounts.get();
      setAccountList(list);
    }
  }, [extension]);

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
          setAUSDBalance(result.free);
        }
      );

      const unsubACA = api.query.system.account(
        "5FnLzAUmXeTZg5J9Ao5psKU68oA5PBekXqhrZCKDbhSCQi88",
        (result) => {
          setACABalance(result.data.free);
        }
      );

      return () => {
        unsubAUSD.then((cb) => cb());
        unsubACA.then((cb) => cb());
      };
    }
  }, [api, decimals]);

  useEffect(() => {
    async function enable() {
      const extensions = await web3Enable("ACALA EXAMPLE");
      const extension =
        extensions.find(({ name }) => name === "polkadot-js") || null;

      setExtension(extension);
    }

    enable();
  }, []);

  const formatedAUSD = useMemo(() => {
    if (!aUSDBalance || !decimals["AUSD"]) return "0";
    return formatNumber(aUSDBalance, decimals["AUSD"]);
  }, [aUSDBalance, decimals]);

  const formatedACA = useMemo(() => {
    if (!acaBalance || !decimals["ACA"]) return "0";
    return formatNumber(acaBalance, decimals["ACA"]);
  }, [acaBalance, decimals]);

  console.log(extension);
  return (
    <div className="App">
      <div>
        <select
          defaultValue=""
          value={selectedAddress}
          onChange={(event) => setSelectedAddress(event.target.value)}
        >
          <option value="" selected disabled hidden>
            Choose Account
          </option>
          {(accountList || []).map(({ address, name }) => (
            <option key={address} value={address}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>address: {selectedAddress}</div>
      <div>aca balance: {formatedAUSD} aUSD</div>
      <div>ausd balance: {formatedACA} ACA</div>
      <div></div>
    </div>
  );
}

export default App;
