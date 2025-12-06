import { Clob, type ClobConfig } from "@dicedhq/clob";
import { Data, type DataConfig } from "@dicedhq/data";
import { Gamma, type GammaConfig } from "@dicedhq/gamma";

export type PolymarketConfig = {
  clob: Omit<ClobConfig, "debug">;
  gamma?: Omit<GammaConfig, "debug">;
  data?: Omit<DataConfig, "debug">;
  debug?: boolean;
};

export class Polymarket {
  public readonly clob: Clob;
  public readonly gamma: Gamma;
  public readonly data: Data;

  constructor(config: PolymarketConfig) {
    this.clob = new Clob({
      ...config.clob,
      debug: config.debug,
    });
    this.gamma = new Gamma({
      ...config.gamma,
      debug: config.debug,
    });
    this.data = new Data({
      ...config.data,
      debug: config.debug,
    });
  }
}
