import { Keyring } from "@polkadot/keyring";

export const getSigner = () => {
  const keyring = new Keyring({
    type: "sr25519",
  });

  const phrase = process.env.SEED_PHRASE || process.env.REACT_APP_SEED_PHRASE;
    console.log('phrase', phrase);
  // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  return keyring.addFromMnemonic(phrase);
};

export default getSigner;
