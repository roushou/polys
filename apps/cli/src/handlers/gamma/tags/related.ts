import { Gamma } from "@dicedhq/gamma";
import type {
  RelatedArgs,
  RelatedOptions,
} from "../../../commands/gamma/tags/related.js";

export async function run(
  args: RelatedArgs,
  options: RelatedOptions,
): Promise<void> {
  const gamma = new Gamma();

  const status = (options.status ?? "all") as "active" | "closed" | "all";

  const relatedTags = options.bySlug
    ? await gamma.tags.listRelatedTagsBySlug({
        slug: args.id,
        omitEmpty: options.omitEmpty ?? false,
        status,
      })
    : await gamma.tags.listRelatedTagsById({
        id: args.id,
        omitEmpty: options.omitEmpty ?? false,
        status,
      });

  console.log(JSON.stringify(relatedTags, null, 2));
}
