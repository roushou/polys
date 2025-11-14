import type { ClobClientConfig } from "./clob/client/base.js";
import { ClobClient } from "./clob/client/client.js";

export type PolymarketConfig = {
  clob: ClobClientConfig;
};

export class Polymarket {
  public readonly clob: ClobClient;

  constructor(config: PolymarketConfig) {
    this.clob = new ClobClient(config.clob);
  }
}
