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

  const swap = useCallback(async () => {
    if (api && inputACA && extension && selectedAddress && decimals) {
      setIsSubmiting(true);
      try {
        const extrinsic = api.tx.dex.swapWithExactTarget(
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
          parseInt(inputACA * 10 ** decimals["ACA"]),
          "0xffffffffffffffff"
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

  return (
    <div className="App">
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
      <div>Address: {selectedAddress}</div>
      <div>------------------------------------------</div>
      <div>DOT balance: {formatedDOT} DOT</div>
      <div>------------------------------------------</div>
      <div>ACA balance: {formatedACA} ACA</div>
      <div>------------------------------------------</div>
      <div>
        Input ACA:
        <input
          type="text"
          value={inputACA}
          onChange={(event) => setInputACA(event.target.value)}
        />
        <button disabled={isSubmiting} onClick={swap}>
          SWAP DOT
        </button>
      </div>
      <div>------------------------------------------</div>
    </div>
  );
}

export default App;
