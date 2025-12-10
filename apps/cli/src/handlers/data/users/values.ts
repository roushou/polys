import { Data } from "@dicedhq/data";
import type {
  ValuesArgs,
  ValuesOptions,
} from "../../../commands/data/users/values.js";

export async function run(
  args: ValuesArgs,
  options: ValuesOptions,
): Promise<void> {
  const data = new Data();

  const values = await data.users.listPositionsValues({
    user: args.user,
    market: options.market,
  });

  console.log(JSON.stringify(values, null, 2));
}
