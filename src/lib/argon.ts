import { hash as hashLib, verify as verfyLib } from "@node-rs/argon2";
import { User } from "@prisma/client";

const HASHING_CONFIG = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const hash = (password: string | Uint8Array) => {
  return hashLib(password, HASHING_CONFIG);
};

export const verify = (
  hashed: string | Uint8Array,
  password: string | Uint8Array,
) => {
  return verfyLib(hashed, password, HASHING_CONFIG);
};
