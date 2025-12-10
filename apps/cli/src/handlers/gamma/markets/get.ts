import { Gamma } from "@dicedhq/gamma";
import type { GetArgs } from "../../../commands/gamma/markets/get.js";

export async function run(args: GetArgs): Promise<void> {
  const gamma = new Gamma();

  const market = await gamma.market.get(args.id);

  console.log(JSON.stringify(market, null, 2));
}
