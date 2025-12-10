import { Gamma } from "@dicedhq/gamma";
import type { ListActiveOptions } from "../../../commands/gamma/series/list-active.js";

export async function run(options: ListActiveOptions): Promise<void> {
  const gamma = new Gamma();

  const seriesList = await gamma.series.listActive({
    limit: options.limit,
    offset: options.offset,
  });

  console.log(JSON.stringify(seriesList, null, 2));
}
