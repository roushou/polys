import { Data, type TimePeriod } from "@dicedhq/data";
import type {
  LeaderboardArgs,
  LeaderboardOptions,
} from "../../../commands/data/builders/leaderboard.js";

export async function run(
  args: LeaderboardArgs,
  options: LeaderboardOptions,
): Promise<void> {
  const data = new Data();

  const leaderboard = await data.builders.leaderboard({
    timePeriod: args.timePeriod as TimePeriod,
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(leaderboard, null, 2));
}
