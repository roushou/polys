import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";
import type { Event } from "./event.js";
import type { Tag } from "./tags.js";

export class SeriesApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get a series by its id
   */
  async get(params: GetSeriesParams): Promise<Series | undefined> {
    const validated = validate(GetSeriesSchema, params);

    return this.client.request<Series>({
      method: "GET",
      path: `/series/${validated.id}`,
      params: {
        include_chat: validated.includeChat,
      },
    });
  }

  /**
   * List all series with pagination and filtering
   */
  async list(params?: ListSeriesParams): Promise<Series[]> {
    const validated = params ? validate(ListSeriesSchema, params) : undefined;

    return this.client.request<Series[]>({
      method: "GET",
      path: "/series",
      params: validated
        ? {
            limit: validated.limit,
            offset: validated.offset,
            order: validated.order,
            ascending: validated.ascending,
            slug: validated.slug,
            categories_ids: validated.categoriesIds,
            categories_labels: validated.categoriesLabels,
            closed: validated.closed,
            include_chat: validated.includeChat,
            recurrence: validated.recurrence,
          }
        : undefined,
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
    validate(NonEmptyString, categoryLabel, "categoryLabel");

    return this.list({
      ...params,
      categoriesLabels: [categoryLabel],
    });
  }
}

const GetSeriesSchema = v.pipe(
  v.object({
    id: NonEmptyString,
    includeChat: v.boolean(),
  }),
  v.metadata({ title: "GetSeriesParams" }),
);

const ListSeriesSchema = v.pipe(
  v.object({
    limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    order: v.optional(v.string()),
    ascending: v.optional(v.boolean()),
    slug: v.optional(v.array(v.string())),
    categoriesIds: v.optional(v.array(v.number())),
    categoriesLabels: v.optional(v.array(v.string())),
    closed: v.optional(v.boolean()),
    includeChat: v.optional(v.boolean()),
    recurrence: v.optional(v.string()),
  }),
  v.metadata({ title: "ListSeriesParams" }),
);

export type GetSeriesParams = v.InferInput<typeof GetSeriesSchema>;
export type ListSeriesParams = v.InferInput<typeof ListSeriesSchema>;

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
