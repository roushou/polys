import { Gamma } from "@dicedhq/gamma";
import type { ListClobOptions } from "../../../commands/gamma/markets/list-clob.js";

export async function run(options: ListClobOptions): Promise<void> {
  const gamma = new Gamma();

  const markets = await gamma.market.listClobTradable({
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(markets, null, 2));
}
