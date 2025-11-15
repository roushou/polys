import type { ClobClientConfig } from "./clob/client/base.js";
import { ClobClient } from "./clob/client/client.js";
import type { GammaClientConfig } from "./gamma/client/base.js";
import { GammaClient } from "./gamma/client/client.js";

export type PolymarketConfig = {
  clob: Omit<ClobClientConfig, "debug">;
  gamma?: Omit<GammaClientConfig, "debug">;
  debug?: boolean;
};

export class Polymarket {
  public readonly clob: ClobClient;
  public readonly gamma: GammaClient;

  constructor(config: PolymarketConfig) {
    this.clob = new ClobClient({
      ...config.clob,
      debug: config.debug,
    });
    this.gamma = new GammaClient({
      ...config.gamma,
      debug: config.debug,
    });
  }
}
