import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";
import { InjectedAccount, InjectedExtension } from "@polkadot/extension-inject/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { web3Enable } from "@polkadot/extension-dapp";
import { addLiquidity } from "./dex-examples/addLiquidity";
import { getLiquidity } from "./dex-examples/getLiquidity";
import { getProvisioningPool } from "./dex-examples/getProvisioningPool";
import { getTradingPairStatus } from "./dex-examples/getTradingPairStatuses";
import { removeLiquidity } from './dex-examples/removeLiquidity';
import { swapWithExactSupply } from './dex-examples/swapWithExactSupply';
import { swapWithExactTarget } from './dex-examples/swapWithExactTarget';
import { swapWithSDK } from './dex-examples/swapWithSDK';

const formatNumber = (number, decimals) => {
  if (number.toString() === "0") return "0";
  return (Number(number.toString()) / 10 ** decimals).toFixed(5);
};

function App() {
  const [api, setApi] = useState<ApiPromise>();
  const [dotBalance, setDotBalance] = useState();
  const [acaBalance, setACABalance] = useState();
  const [decimals, setDecimals] = useState<Record<any, any>>();
  const [extension, setExtension] = useState<InjectedExtension | null>();
  const [accountList, setAccountList] = useState<InjectedAccount[]>();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [inputACA, setInputACA] = useState(0);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [ausdPerAca, setAusdPerAca] = useState(0);

  const swap = useCallback(async () => {
    if (api && inputACA && extension && selectedAddress && decimals) {
      setIsSubmiting(true);
      const valueFormatted = inputACA * 10 ** decimals["ACA"];
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
          ],
          // supplyAmount
          valueFormatted,
          // minTargetAmount
          "0x0",
        );

        await extrinsic.signAsync(selectedAddress, {
          // @ts-ignore
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
                  } = event as any;

                  if (method === "ExtrinsicFailed") {
                    const [dispatchError] = data;

                    let message = dispatchError.type;

                    if (dispatchError.isModule) {
                      try {
                        const mod = dispatchError.asModule;
                        const error = api.registry.findMetaError(
                          new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                        );
                        message = `${error.section}.${error.name}`;
                      } catch (error) {
                        // swallow
                      }
                    }

                    reject({
                      message,
                      result,
                    });
                  } else if (method === "ExtrinsicSuccess") {
                    resolve({
                      result,
                    });
                  }
                });
            } else if (result.isError) {
              reject({
                result,
              });
            }
          });
        });

        alert("Success");
        setInputACA(0);
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
    const provider = new WsProvider(process.env.REACT_APP_WS_NODE_ENDPOINT);

    const api = new ApiPromise(
      options({
        provider,
      }),
    );

    api.isReady.then(() => {
      console.log("Api Ready for endpoint: " + process.env.REACT_APP_WS_NODE_ENDPOINT);
      setApi(api);
    });
  }, []);

  useEffect(() => {
    const setAusd = async () => {
      if (api && decimals) {
        const ausdAcaPool = await api.query.dex.liquidityPool([
          {
            Token: "ACA",
          },
          {
            Token: "AUSD",
          },
        ]);
        const ausdPerAca =
          +ausdAcaPool[1].toString() / 10 ** decimals["AUSD"] / (+ausdAcaPool[0].toString() / 10 ** decimals["ACA"]);

        setAusdPerAca(ausdPerAca);
      }
    };

    setAusd();
  }, [api, decimals]);

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

        const tokenDecimals = result.tokenDecimals.isNone ? [] : result.tokenDecimals.value;
        const tokenSymbol = result.tokenSymbol.isNone ? [] : result.tokenSymbol.value;

        // @ts-ignore
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
          TOKEN: "AUSD",
        },
        (result) => {
          setDotBalance(result.free);
        },
      );

      const unsubACA = api.query.system.account(selectedAddress, (result) => {
        setACABalance(result.data.free);
      });

      return () => {
        unsubDOT.then((cb: any) => cb());
        unsubACA.then((cb: any) => cb());
      };
    }
  }, [api, decimals, selectedAddress]);

  useEffect(() => {
    async function enable() {
      const extensions = await web3Enable("ACALA EXAMPLE");
      const extension = extensions.find(({ name }) => name === "polkadot-js") || null;

      setExtension(extension);
    }

    enable();
  }, []);

  const formatedDOT = useMemo(() => {
    if (!dotBalance || !decimals["AUSD"]) return "0";
    return formatNumber(dotBalance, decimals["AUSD"]);
  }, [dotBalance, decimals]);

  const formatedACA = useMemo(() => {
    if (!acaBalance || !decimals["ACA"]) return "0";
    return formatNumber(acaBalance, decimals["ACA"]);
  }, [acaBalance, decimals]);

  if (!api) {
    return <div> loading... </div>;
  }

  return (
    <div className="App" style={{ maxWidth: "40vw" }}>
      <div>
        <h2> Swap ACA to AUSD example </h2>
        <div>
          <select defaultValue="" value={selectedAddress} onChange={(event) => setSelectedAddress(event.target.value)}>
            <option value="" disabled hidden>
              Choose Account
            </option>{" "}
            {(accountList || []).map(({ address, name }) => (
              <option key={address} value={address}>
                {" "}
                {name}{" "}
              </option>
            ))}{" "}
          </select>
        </div>
        <hr />
        <div> Address: {selectedAddress || "account not selected"} </div>
        <hr />
        {selectedAddress && (
          <div>
            <div>
              {" "}
              ACA balance: {formatedACA}
              ACA{" "}
            </div>{" "}
            <hr />
            <div>
              Input ACA: &nbsp;{" "}
              <input type="text" value={inputACA} onChange={(event) => setInputACA(parseInt(event.target.value))} />
              <button disabled={isSubmiting} onClick={swap}>
                SWAP ACA
              </button>
              <div>
                {" "}
                To receive: {(inputACA * ausdPerAca).toFixed(2) || 0}
                AUSD
              </div>
            </div>
            <hr />
            <div>
              {" "}
              AUSD balance: {formatedDOT}
              AUSD{" "}
            </div>{" "}
            <hr />
          </div>
        )}
      </div>
      <h1>Other examples (check console for results)</h1>
      <div>
        <h2>Add liquidity</h2>
        <button onClick={() => addLiquidity(api)}>Add Liquidity</button>
      </div>
      <div>
        <h2>Get liquidity</h2>
        <button onClick={() => getLiquidity(api)}>Get liquidity</button>
      </div>
      <div>
        <h2>Get provisioning pool</h2>
        <button onClick={() => getProvisioningPool(api)}>Get provisioning pool</button>
      </div>

      <div>
        <h2>Get Trading Pair Statuses</h2>
        <button onClick={() => getTradingPairStatus(api)}>Get Trading Pair Statuses</button>
      </div>
      <div>
        <h2>Remove Liquidity</h2>
        <button onClick={() => removeLiquidity(api)}>Remove Liquidity</button>
      </div>
      <div>
        <h2>Swap with exact supply</h2>
        <button onClick={() => swapWithExactSupply(api)}>Swap with exact supply</button>
      </div>
      <div>
        <h2>Swap with exact target</h2>
        <button onClick={() => swapWithExactTarget(api)}>Swap with exact target</button>
      </div>
      <div>
        <h2>Swap with SDK</h2>
        <button onClick={() => swapWithSDK(api)}>Swap with SDK</button>
      </div>
    </div>
  );
}

export default App;
