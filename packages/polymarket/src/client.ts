import { Clob, type ClobConfig } from "@dicedhq/clob";
import { Gamma, type GammaConfig } from "@dicedhq/gamma";

export type PolymarketConfig = {
  clob: Omit<ClobConfig, "debug">;
  gamma?: Omit<GammaConfig, "debug">;
  debug?: boolean;
};

export class Polymarket {
  public readonly clob: Clob;
  public readonly gamma: Gamma;

  constructor(config: PolymarketConfig) {
    this.clob = new Clob({
      ...config.clob,
      debug: config.debug,
    });
    this.gamma = new Gamma({
      ...config.gamma,
      debug: config.debug,
    });
  }
}
