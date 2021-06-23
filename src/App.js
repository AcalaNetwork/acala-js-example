import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { web3Enable } from "@polkadot/extension-dapp";

const formatNumber = (number, decimals) => {
  if (number.toString() === "0") return "0";
  return (Number(number.toString()) / 10 ** decimals).toFixed(5);
};

function App() {
  const [api, setApi] = useState();
  const [dotBalance, setDotBalance] = useState();
  const [acaBalance, setACABalance] = useState();
  const [decimals, setDecimals] = useState();
  const [extension, setExtension] = useState();
  const [accountList, setAccountList] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [inputACA, setInputACA] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [acaPerDot, setAcaPerDot] = useState(0);

  const swap = useCallback(async () => {
    if (api && inputACA && extension && selectedAddress && decimals) {
      setIsSubmiting(true);
      const valueFormatted = parseInt(inputACA * 10 ** decimals["ACA"])
      try {
        const extrinsic = api.tx.dex.swapWithExactSupply(
          // path
          [
            {
              TOKEN: "ACA",
            },
            {
              TOKEN: "AUSD",
            },
            {
              TOKEN: "DOT",
            },
          ],
          // supplyAmount
          valueFormatted,
          // minTargetAmount
          "0x0"
        );

        await extrinsic.signAsync(selectedAddress, {
          signer: extension.signer,
        });

        await new Promise((resolve, reject) => {
          extrinsic.send((result) => {
            if (result.status.isFinalized || result.status.isInBlock) {
              result.events
                .filter(({ event: { section } }) => section === "system")
                .forEach((event) => {
                  const {
                    event: { data, method },
                  } = event;

                  if (method === "ExtrinsicFailed") {
                    const [dispatchError] = data;

                    let message = dispatchError.type;

                    if (dispatchError.isModule) {
                      try {
                        const mod = dispatchError.asModule;
                        const error = api.registry.findMetaError(
                          new Uint8Array([
                            mod.index.toNumber(),
                            mod.error.toNumber(),
                          ])
                        );
                        message = `${error.section}.${error.name}`;
                      } catch (error) {
                        // swallow
                      }
                    }

                    reject({ message, result });
                  } else if (method === "ExtrinsicSuccess") {
                    resolve({ result });
                  }
                });
            } else if (result.isError) {
              reject({ result });
            }
          });
        });

        alert("Success");
        setInputACA("");
      } catch (error) {
        if (error.message) {
          alert(`Failed, ${error.message}`);
        } else {
          alert(`Failed`);
        }
      } finally {
        setIsSubmiting(false);
      }
    }
  }, [api, inputACA, extension, selectedAddress, decimals]);

  useEffect(() => {
    const provider = new WsProvider(process.env.REACT_APP_ENDPOINT);

    const api = new ApiPromise(
      options({
        provider,
      })
    );

    api.isReady.then(() => {
      console.log("Api Ready");
      setApi(api);
    });
  }, []);

  useEffect(async () => {
    if (api && decimals) {
      const ausdDotPool = await api.query.dex.liquidityPool([
        { Token: "AUSD" },
        { Token: "DOT" },
      ]);
      const ausdPerDot = (+ausdDotPool[0].toString() / 10 ** decimals["AUSD"]) / 
        (+ausdDotPool[1].toString() / 10 ** decimals["DOT"]);

      // notice that
      const ausdAcaPool = await api.query.dex.liquidityPool([
        { Token: "ACA" },
        { Token: "AUSD" },
      ]);
      const ausdPerAca = (+ausdAcaPool[1].toString() / 10 ** decimals["AUSD"]) / 
        (+ausdAcaPool[0].toString() / 10 ** decimals["ACA"])
      const acaPerDot = ausdPerAca / ausdPerDot;

      setAcaPerDot(acaPerDot);
    }
  }, [api, decimals])

  useEffect(() => {
    if (extension) {
      extension.accounts.get().then((list) => {
        setAccountList(list);
      });
    }
  }, [extension]);

  useEffect(() => {
    if (api) {
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
    if (api && decimals && selectedAddress) {
      const unsubDOT = api.query.tokens.accounts(
        selectedAddress,
        {
          TOKEN: "DOT",
        },
        (result) => {
          setDotBalance(result.free);
        }
      );

      const unsubACA = api.query.system.account(selectedAddress, (result) => {
        setACABalance(result.data.free);
      });

      return () => {
        unsubDOT.then((cb) => cb());
        unsubACA.then((cb) => cb());
      };
    }
  }, [api, decimals, selectedAddress]);

  useEffect(() => {
    async function enable() {
      const extensions = await web3Enable("ACALA EXAMPLE");
      const extension =
        extensions.find(({ name }) => name === "polkadot-js") || null;

      setExtension(extension);
    }

    enable();
  }, []);

  const formatedDOT = useMemo(() => {
    if (!dotBalance || !decimals["DOT"]) return "0";
    return formatNumber(dotBalance, decimals["DOT"]);
  }, [dotBalance, decimals]);

  const formatedACA = useMemo(() => {
    if (!acaBalance || !decimals["ACA"]) return "0";
    return formatNumber(acaBalance, decimals["ACA"]);
  }, [acaBalance, decimals]);

  if (!api) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      <h2>Swap ACA to DOT example</h2>
      <div>------------------------------------------</div>
      <div>
        <select
          defaultValue=""
          value={selectedAddress}
          onChange={(event) => setSelectedAddress(event.target.value)}
        >
          <option value="" disabled hidden>
            Choose Account
          </option>
          {(accountList || []).map(({ address, name }) => (
            <option key={address} value={address}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>------------------------------------------</div>
      <div>Address: {selectedAddress || 'account not selected'}</div>
      <div>------------------------------------------</div>
     {selectedAddress && (<div>
      <div>ACA balance: {formatedACA} ACA</div>
      <div>------------------------------------------</div>
      <div>
        Input ACA:&nbsp;
        <input
          type="text"
          value={inputACA}
          onChange={(event) => setInputACA(event.target.value)}
        />
        <button disabled={isSubmiting} onClick={swap}>
          SWAP ACA
        </button>
        <span>&nbsp;To receive: {(inputACA * acaPerDot).toFixed(2) || 0} DOT</span>
      </div>
      <div>------------------------------------------</div>
      <div>DOT balance: {formatedDOT} DOT</div>
      <div>------------------------------------------</div>
     </div>)}
    </div>
  );
}

export default App;
