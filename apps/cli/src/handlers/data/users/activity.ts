import {
  type ActivitySortBy,
  Data,
  type SortDirection,
  type TradeSide,
} from "@dicedhq/data";
import type {
  ActivityArgs,
  ActivityOptions,
} from "../../../commands/data/users/activity.js";

export async function run(
  args: ActivityArgs,
  options: ActivityOptions,
): Promise<void> {
  const data = new Data();

  const activity = await data.users.listActivity({
    user: args.user,
    market: options.market,
    eventId: options.eventId,
    type: options.activityType,
    start: options.start,
    end: options.end,
    sortBy: options.sortBy as ActivitySortBy | undefined,
    sortDirection: options.sortDir as SortDirection | undefined,
    side: options.side as TradeSide | undefined,
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(activity, null, 2));
}
