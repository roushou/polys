import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/events/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  const events = await gamma.event.list({
    active: options.active ?? false,
    closed: options.closed ?? false,
    tag_id: options.tagId,
    limit: options.limit,
    offset: options.offset,
    ascending: options.ascending,
  });

  console.log(JSON.stringify(events, null, 2));
}
