import { Data } from "@dicedhq/data";
import type { OpenInterestOptions } from "../../commands/data/open-interest.js";

export async function run(options: OpenInterestOptions): Promise<void> {
  const data = new Data();

  const openInterest = await data.misc.getOpenInterest(options.market);

  console.log(JSON.stringify(openInterest, null, 2));
}
