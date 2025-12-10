import { Gamma } from "@dicedhq/gamma";
import type {
  GetArgs,
  GetOptions,
} from "../../../commands/gamma/events/get.js";

export async function run(args: GetArgs, options: GetOptions): Promise<void> {
  const gamma = new Gamma();

  const event = options.bySlug
    ? await gamma.event.getBySlug(args.id)
    : await gamma.event.getById(args.id);

  console.log(JSON.stringify(event, null, 2));
}
