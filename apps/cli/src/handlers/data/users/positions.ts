import { Data, type SortBy, type SortDirection } from "@dicedhq/data";
import type {
  PositionsArgs,
  PositionsOptions,
} from "../../../commands/data/users/positions.js";

export async function run(
  args: PositionsArgs,
  options: PositionsOptions,
): Promise<void> {
  const data = new Data();

  const positions = await data.users.positions({
    user: args.user,
    market: options.market,
    eventId: options.eventId,
    redeemable: options.redeemable,
    mergeable: options.mergeable,
    limit: options.limit,
    offset: options.offset,
    sortBy: options.sortBy as SortBy | undefined,
    sortDirection: options.sortDir as SortDirection | undefined,
  });

  console.log(JSON.stringify(positions, null, 2));
}
