import { Data, type TradeSide } from "@dicedhq/data";
import type { TradesOptions } from "../../../commands/data/users/trades.js";

export async function run(options: TradesOptions): Promise<void> {
  const data = new Data();

  const trades = await data.users.listTrades({
    user: options.user,
    market: options.market,
    eventId: options.eventId,
    side: options.side as TradeSide | undefined,
    takerOnly: options.takerOnly,
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(trades, null, 2));
}
