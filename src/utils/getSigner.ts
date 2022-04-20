import { Keyring } from "@polkadot/keyring";
import {cryptoWaitReady} from "@polkadot/util-crypto"

export const getSigner = async () => {
  await cryptoWaitReady()
  const keyring = new Keyring({
    type: "sr25519",
  });

  // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  return keyring.addFromMnemonic(process.env.SEED_PHRASE);
};

export default getSigner;
