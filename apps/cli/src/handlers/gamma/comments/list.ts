import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/comments/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  const comments = await gamma.comments.list({
    limit: options.limit,
    offset: options.offset,
    order: options.order,
    ascending: options.ascending,
    parentEntityType: options.entityType as "Event" | "Series" | "market",
    parentEntityId: options.entityId,
    getPositions: options.getPositions,
    holdersOnly: options.holdersOnly,
  });

  console.log(JSON.stringify(comments, null, 2));
}
