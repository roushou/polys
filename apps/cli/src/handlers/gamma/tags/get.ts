import { Gamma } from "@dicedhq/gamma";
import type { GetArgs, GetOptions } from "../../../commands/gamma/tags/get.js";

export async function run(args: GetArgs, options: GetOptions): Promise<void> {
  const gamma = new Gamma();

  const tag = options.bySlug
    ? await gamma.tags.getBySlug({
        slug: args.id,
        includeTemplate: options.includeTemplate ?? false,
      })
    : await gamma.tags.getById({
        id: args.id,
        includeTemplate: options.includeTemplate ?? false,
      });

  console.log(JSON.stringify(tag, null, 2));
}
