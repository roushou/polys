import {
  Data,
  type ClosedPositionSortBy,
  type SortDirection,
} from "@dicedhq/data";
import type {
  ClosedPositionsArgs,
  ClosedPositionsOptions,
} from "../../../commands/data/users/closed-positions.js";

export async function run(
  args: ClosedPositionsArgs,
  options: ClosedPositionsOptions,
): Promise<void> {
  const data = new Data();

  const closedPositions = await data.users.listClosedPositions({
    user: args.user,
    market: options.market,
    eventId: options.eventId,
    title: options.title,
    limit: options.limit,
    offset: options.offset,
    sortBy: options.sortBy as ClosedPositionSortBy | undefined,
    sortDirection: options.sortDir as SortDirection | undefined,
  });

  console.log(JSON.stringify(closedPositions, null, 2));
}
