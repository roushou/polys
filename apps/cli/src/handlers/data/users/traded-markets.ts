import { Data } from "@dicedhq/data";
import type { TradedMarketsArgs } from "../../../commands/data/users/traded-markets.js";

export async function run(args: TradedMarketsArgs): Promise<void> {
  const data = new Data();

  const tradedMarkets = await data.users.getTradedMarkets(args.user);

  console.log(JSON.stringify(tradedMarkets, null, 2));
}
