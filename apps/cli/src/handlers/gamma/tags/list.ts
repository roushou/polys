import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/tags/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  const tags = await gamma.tags.list({
    limit: options.limit,
    offset: options.offset,
    order: options.order,
    ascending: options.ascending,
    includeTemplate: options.includeTemplate,
    isCarousel: options.isCarousel,
  });

  console.log(JSON.stringify(tags, null, 2));
}
