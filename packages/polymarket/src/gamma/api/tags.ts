import type { GammaBaseClient } from "../client/base.js";

export class TagsApi {
  constructor(private readonly client: GammaBaseClient) {}

  /**
   * Get a specific tag by slug
   */
  async getBySlug({
    slug,
    includeTemplate,
  }: {
    slug: string;
    includeTemplate: boolean;
  }): Promise<Tag | undefined> {
    return this.client.request<Tag | undefined>({
      method: "GET",
      path: `/tags/slug/${slug}`,
      params: { include_template: includeTemplate },
    });
  }

  /**
   * Get a specific tag by ID
   */
  async getById({
    id,
    includeTemplate,
  }: {
    id: string;
    includeTemplate: boolean;
  }): Promise<Tag | undefined> {
    return this.client.request<Tag | undefined>({
      method: "GET",
      path: `/tags/${id}`,
      params: { include_template: includeTemplate },
    });
  }

  /**
   * List all tags with pagination and filtering
   */
  async list(params?: ListTagsParams): Promise<Tag[]> {
    return this.client.request<Tag[]>({
      method: "GET",
      path: "/tags",
      params: {
        limit: params?.limit,
        offset: params?.offset,
        order: params?.order,
        ascending: params?.ascending,
        include_template: params?.includeTemplate,
        is_carousel: params?.isCarousel,
      },
    });
  }

  /**
   * List related tags (relationships) to a given tag
   */
  async listRelatedTagsById({
    id,
    omitEmpty,
    status,
  }: {
    id: string;
    omitEmpty: boolean;
    status: "active" | "closed" | "all";
  }): Promise<RelatedTag[]> {
    return this.client.request<RelatedTag[]>({
      method: "GET",
      path: `/tags/${id}/related-tags`,
      params: { omit_empty: omitEmpty, status },
    });
  }

  /**
   * List related tags (relationships) to a given tag
   */
  async listRelatedTagsBySlug({
    slug,
    omitEmpty,
    status,
  }: {
    slug: string;
    omitEmpty: boolean;
    status: "active" | "closed" | "all";
  }): Promise<RelatedTag[]> {
    return this.client.request<RelatedTag[]>({
      method: "GET",
      path: `/tags/slug/${slug}/related-tags`,
      params: { omit_empty: omitEmpty, status },
    });
  }
}

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

export type ListTagsParams = {
  /** Maximum number of tags to return */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Comma-separated list of fields to order by */
  order?: string;

  /** Sort direction (true for ascending, false for descending) */
  ascending?: boolean;

  /** Include template data */
  includeTemplate?: boolean;

  /** Filter carousel tags */
  isCarousel?: boolean;
};

export type RelatedTag = {
  id: string;
  tagId: number;
  relatedTagId: number;
  rank: number;
};
