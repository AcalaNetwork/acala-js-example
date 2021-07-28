import { Keyring } from "@polkadot/keyring";

export const getSigner = () => {
  const keyring = new Keyring({
    type: "sr25519",
  });

  // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  return keyring.addFromMnemonic(process.env.SEED_PHRASE);
};

export default getSigner;
