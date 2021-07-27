import getPolkadotApi from "./getPolkadotApi";

export const getSystemParameters = async () => {
  const api = await getPolkadotApi();
  const params = await api.rpc.system.properties();
  const decimals =
    !params.tokenDecimals.isNone && params.tokenDecimals.value.toHuman();
  const symbols =
    !params.tokenSymbol.isNone &&
    (params.tokenSymbol.value.toHuman() as string[]);
  // console.log('decimals', decimals);
  // console.log('symbols', symbols);
  const symbolsDecimals /* Record<string, string> */ = symbols.reduce(
    (acc, symbol, index) => ({
      ...acc,
      [symbol]: +decimals[index],
    }),
    {}
  );
  return {
    decimals,
    symbols,
    symbolsDecimals,
  };
};

export default getSystemParameters;
