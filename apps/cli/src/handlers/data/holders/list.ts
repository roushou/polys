import { Data } from "@dicedhq/data";
import type {
  ListArgs,
  ListOptions,
} from "../../../commands/data/holders/list.js";

export async function run(args: ListArgs, options: ListOptions): Promise<void> {
  const data = new Data();

  const holders = await data.holders.listHolders({
    market: args.market,
    limit: options.limit,
    minBalance: options.minBalance,
  });

  console.log(JSON.stringify(holders, null, 2));
}
