import { Gamma } from "@dicedhq/gamma";
import type { ListCurrentOptions } from "../../../commands/gamma/markets/list-current.js";

export async function run(options: ListCurrentOptions): Promise<void> {
  const gamma = new Gamma();

  const markets = await gamma.market.listCurrent({
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(markets, null, 2));
}
