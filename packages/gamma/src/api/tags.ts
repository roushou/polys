import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class TagsApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get a specific tag by slug
   */
  async getBySlug(params: GetTagBySlugParams): Promise<Tag | undefined> {
    const validated = validate(GetTagBySlugSchema, params);

    return this.client.request<Tag | undefined>({
      method: "GET",
      path: `/tags/slug/${validated.slug}`,
      params: { include_template: validated.includeTemplate },
    });
  }

  /**
   * Get a specific tag by ID
   */
  async getById(params: GetTagByIdParams): Promise<Tag | undefined> {
    const validated = validate(GetTagByIdSchema, params);

    return this.client.request<Tag | undefined>({
      method: "GET",
      path: `/tags/${validated.id}`,
      params: { include_template: validated.includeTemplate },
    });
  }

  /**
   * List all tags with pagination and filtering
   */
  async list(params?: ListTagsParams): Promise<Tag[]> {
    const validated = params ? validate(ListTagsSchema, params) : undefined;

    return this.client.request<Tag[]>({
      method: "GET",
      path: "/tags",
      params: validated
        ? {
            limit: validated.limit,
            offset: validated.offset,
            order: validated.order,
            ascending: validated.ascending,
            include_template: validated.includeTemplate,
            is_carousel: validated.isCarousel,
          }
        : undefined,
    });
  }

  /**
   * List related tags (relationships) to a given tag
   */
  async listRelatedTagsById(params: {
    id: string;
    omitEmpty: boolean;
    status: "active" | "closed" | "all";
  }): Promise<RelatedTag[]> {
    validate(NonEmptyString, params.id, "id");
    const validated = validate(ListRelatedTagsSchema, params);

    return this.client.request<RelatedTag[]>({
      method: "GET",
      path: `/tags/${params.id}/related-tags`,
      params: { omit_empty: validated.omitEmpty, status: validated.status },
    });
  }

  /**
   * List related tags (relationships) to a given tag
   */
  async listRelatedTagsBySlug(params: {
    slug: string;
    omitEmpty: boolean;
    status: "active" | "closed" | "all";
  }): Promise<RelatedTag[]> {
    validate(NonEmptyString, params.slug, "slug");
    const validated = validate(ListRelatedTagsSchema, params);

    return this.client.request<RelatedTag[]>({
      method: "GET",
      path: `/tags/slug/${params.slug}/related-tags`,
      params: { omit_empty: validated.omitEmpty, status: validated.status },
    });
  }
}

const GetTagBySlugSchema = v.pipe(
  v.object({
    slug: NonEmptyString,
    includeTemplate: v.boolean(),
  }),
  v.metadata({ title: "GetTagBySlugParams" }),
);

const GetTagByIdSchema = v.pipe(
  v.object({
    id: NonEmptyString,
    includeTemplate: v.boolean(),
  }),
  v.metadata({ title: "GetTagByIdParams" }),
);

const ListTagsSchema = v.pipe(
  v.object({
    limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    order: v.optional(v.string()),
    ascending: v.optional(v.boolean()),
    includeTemplate: v.optional(v.boolean()),
    isCarousel: v.optional(v.boolean()),
  }),
  v.metadata({ title: "ListTagsParams" }),
);

const ListRelatedTagsSchema = v.pipe(
  v.object({
    omitEmpty: v.boolean(),
    status: v.picklist(["active", "closed", "all"]),
  }),
  v.metadata({ title: "ListRelatedTagsParams" }),
);

export type GetTagBySlugParams = v.InferInput<typeof GetTagBySlugSchema>;
export type GetTagByIdParams = v.InferInput<typeof GetTagByIdSchema>;
export type ListTagsParams = v.InferInput<typeof ListTagsSchema>;

export type Tag = {
  id: string;
  label?: string;
  slug?: string;
  forceShow?: boolean;
  forceHide?: boolean;
  isCarousel?: boolean;
  publishedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RelatedTag = {
  id: string;
  tagId: number;
  relatedTagId: number;
  rank: number;
};
