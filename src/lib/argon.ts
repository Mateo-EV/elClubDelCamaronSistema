import { hash as hashLib } from "@node-rs/argon2";

export const hash = (password: string | Uint8Array) => {
  return hashLib(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};
