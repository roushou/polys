import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/markets/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  const markets = await gamma.market.listAll({
    active: options.active ?? false,
    closed: options.closed ?? false,
    archived: options.archived ?? false,
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(markets, null, 2));
}
