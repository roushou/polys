import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/series/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  const seriesList = await gamma.series.list({
    limit: options.limit,
    offset: options.offset,
    order: options.order,
    ascending: options.ascending,
    slug: options.slug ? [options.slug] : undefined,
    categoriesLabels: options.category ? [options.category] : undefined,
    closed: options.closed,
    includeChat: options.includeChat,
    recurrence: options.recurrence,
  });

  console.log(JSON.stringify(seriesList, null, 2));
}
