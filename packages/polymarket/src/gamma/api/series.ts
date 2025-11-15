import type { GammaBaseClient } from "../client/base.js";
import type { Event } from "./event.js";
import type { Tag } from "./tags.js";

export class SeriesApi {
  constructor(private readonly client: GammaBaseClient) {}

  /**
   * Get a series by its id
   */
  async get({
    id,
    includeChat,
  }: {
    id: string;
    includeChat: boolean;
  }): Promise<Series | undefined> {
    return this.client.request<Series>({
      method: "GET",
      path: `/series/${id}`,
      params: {
        include_chat: includeChat,
      },
    });
  }

  /**
   * List all series with pagination and filtering
   */
  async list(params?: ListSeriesParams): Promise<Series[]> {
    return this.client.request<Series[]>({
      method: "GET",
      path: "/series",
      params: {
        limit: params?.limit,
        offset: params?.offset,
        order: params?.order,
        ascending: params?.ascending,
        slug: params?.slug,
        categories_ids: params?.categoriesIds,
        categories_labels: params?.categoriesLabels,
        closed: params?.closed,
        include_chat: params?.includeChat,
        recurrence: params?.recurrence,
      },
    });
  }

  /**
   * List active series (non-closed, non-archived)
   */
  async listActive(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Series[]> {
    return this.client.request<Series[]>({
      method: "GET",
      path: "/series",
      params: {
        limit: params?.limit,
        offset: params?.offset,
        closed: false,
        archived: false,
      },
    });
  }

  /**
   * List series by category
   */
  async listByCategory(
    categoryLabel: string,
    params?: { limit?: number; offset?: number },
  ): Promise<Series[]> {
    return this.list({
      ...params,
      categoriesLabels: [categoryLabel],
    });
  }
}

export type ListSeriesParams = {
  /** Maximum number of series to return */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Comma-separated list of fields to order by */
  order?: string;

  /** Sort direction (true for ascending, false for descending) */
  ascending?: boolean;

  /** Filter by series slugs */
  slug?: string[];

  /** Filter by category IDs */
  categoriesIds?: number[];

  /** Filter by category labels */
  categoriesLabels?: string[];

  /** Filter by closed status */
  closed?: boolean;

  /** Include chat data */
  includeChat?: boolean;

  /** Filter by recurrence pattern */
  recurrence?: string;
};

export type Series = {
  /** Series ID */
  id: string;

  /** Series ticker symbol */
  ticker?: string;

  /** Series slug for URLs */
  slug: string;

  /** Series title */
  title: string;

  /** Series subtitle */
  subtitle?: string;

  /** Series description */
  description?: string;

  /** Series type */
  seriesType?: string;

  /** Recurrence pattern */
  recurrence?: string;

  /** Layout type */
  layout?: string;

  /** Whether this is a template */
  isTemplate?: boolean;

  /** Template variables */
  templateVariables?: string;

  /** Whether the series is active */
  active?: boolean;

  /** Whether the series is closed */
  closed?: boolean;

  /** Whether the series is archived */
  archived?: boolean;

  /** Whether the series is new */
  new?: boolean;

  /** Whether the series is featured */
  featured?: boolean;

  /** Whether the series is restricted */
  restricted?: boolean;

  /** Created at timestamp */
  createdAt?: string;

  /** Updated at timestamp */
  updatedAt?: string;

  /** Start date */
  startDate?: string;

  /** Published at timestamp */
  publishedAt?: string;

  /** Series image URL */
  image?: string;

  /** Series icon URL */
  icon?: string;

  /** Volume in last 24 hours */
  volume24hr?: number;

  /** Total volume */
  volume?: number;

  /** Liquidity */
  liquidity?: number;

  /** Comment count */
  commentCount?: number;

  /** Score */
  score?: number;

  /** Whether comments are enabled */
  commentsEnabled?: boolean;

  /** Competitive score */
  competitive?: number;

  /** Events in this series */
  events?: Event[];

  /** Collections associated with this series */
  collections?: Collection[];

  /** Categories this series belongs to */
  categories?: Category[];

  /** Tags associated with this series */
  tags?: Tag[];

  /** Chats associated with this series */
  chats?: Chat[];

  /** Created by user ID */
  createdBy?: string;

  /** Updated by user ID */
  updatedBy?: string;
};

export type Collection = {
  /** Collection ID */
  id: string;

  /** Collection title */
  title?: string;

  /** Collection slug */
  slug?: string;

  /** Collection description */
  description?: string;
};

export type Category = {
  /** Category ID */
  id: string;

  /** Category label */
  label?: string;

  /** Category slug */
  slug?: string;
};

export type Chat = {
  /** Chat ID */
  id: string;

  /** Chat name */
  name?: string;

  /** Chat URL */
  url?: string;
};
