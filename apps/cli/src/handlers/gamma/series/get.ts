import { Gamma } from "@dicedhq/gamma";
import type {
  GetArgs,
  GetOptions,
} from "../../../commands/gamma/series/get.js";

export async function run(args: GetArgs, options: GetOptions): Promise<void> {
  const gamma = new Gamma();

  const series = await gamma.series.get({
    id: args.id,
    includeChat: options.includeChat ?? false,
  });

  console.log(JSON.stringify(series, null, 2));
}
