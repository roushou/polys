import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class UsersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List current positions for a user
   */
  async positions(params: ListPositionsParams): Promise<Position[]> {
    const validated = validate(ListPositionsSchema, params);

    return this.client.request<Position[]>({
      method: "GET",
      path: "/positions",
      params: validated,
    });
  }

  /**
   * List trades for a user or markets
   */
  async listTrades(params: ListTradesParams): Promise<Trade[]> {
    const validated = validate(ListTradesSchema, params);

    return this.client.request<Trade[]>({
      method: "GET",
      path: "/trades",
      params: validated,
    });
  }

  /**
   * List on-chain activity for a user
   */
  async listActivity(params: ListActivityParams): Promise<Activity[]> {
    const validated = validate(ListActivitySchema, params);

    return this.client.request<Activity[]>({
      method: "GET",
      path: "/activity",
      params: validated,
    });
  }

  /**
   * List total value of a user's positions
   */
  async listPositionsValues(
    params: ListPositionValueParams,
  ): Promise<PositionValue[]> {
    const validated = validate(ListPositionValueSchema, params);

    return this.client.request<PositionValue[]>({
      method: "GET",
      path: "/value",
      params: validated,
    });
  }

  /**
   * List closed positions for a user
   */
  async listClosedPositions(
    params: ListClosedPositionsParams,
  ): Promise<ClosedPosition[]> {
    const validated = validate(ListClosedPositionsSchema, params);

    return this.client.request<ClosedPosition[]>({
      method: "GET",
      path: "/closed-positions",
      params: validated,
    });
  }

  /**
   * Get total markets a user has traded
   */
  async getTradedMarkets(user: string): Promise<TradedMarkets> {
    validate(NonEmptyString, user, "user");

    return this.client.request<TradedMarkets>({
      method: "GET",
      path: "/traded",
      params: { user },
    });
  }
}

const ListPositionsSchema = v.pipe(
  v.object({
    user: NonEmptyString,
    market: v.optional(v.string()),
    eventId: v.optional(v.string()),
    sizeThreshold: v.optional(v.number(), 1),
    redeemable: v.optional(v.boolean(), false),
    mergeable: v.optional(v.boolean(), false),
    limit: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(500)),
      100,
    ),
    offset: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10000)),
      0,
    ),
    sortBy: v.optional(
      v.picklist([
        "CURRENT",
        "INITIAL",
        "TOKENS",
        "CASHPNL",
        "PERCENTPNL",
        "TITLE",
        "RESOLVING",
        "PRICE",
        "AVGPRICE",
      ]),
      "TOKENS",
    ),
    sortDirection: v.optional(v.picklist(["ASC", "DESC"]), "DESC"),
    title: v.optional(v.pipe(v.string(), v.maxLength(100))),
  }),
  v.metadata({ title: "ListPositionsParams" }),
);

const ListTradesSchema = v.pipe(
  v.object({
    user: v.optional(v.string()),
    market: v.optional(v.string()),
    eventId: v.optional(v.string()),
    side: v.optional(v.picklist(["BUY", "SELL"])),
    takerOnly: v.optional(v.boolean(), true),
    filterType: v.optional(v.picklist(["CASH", "TOKENS"])),
    filterAmount: v.optional(v.number()),
    limit: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10000)),
      100,
    ),
    offset: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10000)),
      0,
    ),
  }),
  v.metadata({ title: "ListTradesParams" }),
);

const ListActivitySchema = v.pipe(
  v.object({
    user: NonEmptyString,
    market: v.optional(v.string()),
    eventId: v.optional(v.string()),
    type: v.optional(v.string()),
    side: v.optional(v.picklist(["BUY", "SELL"])),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    limit: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10000)),
      100,
    ),
    offset: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10000)),
      0,
    ),
    sortBy: v.optional(
      v.picklist(["TIMESTAMP", "TOKENS", "CASH"]),
      "TIMESTAMP",
    ),
    sortDirection: v.optional(v.picklist(["ASC", "DESC"]), "DESC"),
  }),
  v.metadata({ title: "ListActivityParams" }),
);

const ListPositionValueSchema = v.pipe(
  v.object({
    user: NonEmptyString,
    market: v.optional(v.string()),
  }),
  v.metadata({ title: "ListPositionValueParams" }),
);

const ListClosedPositionsSchema = v.pipe(
  v.object({
    user: NonEmptyString,
    market: v.optional(v.string()),
    eventId: v.optional(v.string()),
    title: v.optional(v.pipe(v.string(), v.maxLength(100))),
    limit: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(50)),
      100,
    ),
    offset: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(100000)),
      0,
    ),
    sortBy: v.optional(
      v.picklist(["REALIZEDPNL", "TITLE", "PRICE", "AVGPRICE", "TIMESTAMP"]),
      "REALIZEDPNL",
    ),
    sortDirection: v.optional(v.picklist(["ASC", "DESC"]), "DESC"),
  }),
  v.metadata({ title: "ListClosedPositionsParams" }),
);

export type ListPositionsParams = v.InferInput<typeof ListPositionsSchema>;
export type ListTradesParams = v.InferInput<typeof ListTradesSchema>;
export type ListActivityParams = v.InferInput<typeof ListActivitySchema>;
export type ListPositionValueParams = v.InferInput<
  typeof ListPositionValueSchema
>;
export type ListClosedPositionsParams = v.InferInput<
  typeof ListClosedPositionsSchema
>;

export type SortBy =
  | "CURRENT"
  | "INITIAL"
  | "TOKENS"
  | "CASHPNL"
  | "PERCENTPNL"
  | "TITLE"
  | "RESOLVING"
  | "PRICE"
  | "AVGPRICE";
export type SortDirection = "ASC" | "DESC";
export type TradeSide = "BUY" | "SELL";
export type TradeFilterType = "CASH" | "TOKENS";
export type ActivitySortBy = "TIMESTAMP" | "TOKENS" | "CASH";
export type ActivityType =
  | "TRADE"
  | "SPLIT"
  | "MERGE"
  | "REDEEM"
  | "REWARD"
  | "CONVERSION";
export type ClosedPositionSortBy =
  | "REALIZEDPNL"
  | "TITLE"
  | "PRICE"
  | "AVGPRICE"
  | "TIMESTAMP";

// ============================================================================
// Response Types
// ============================================================================

export type Position = {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: number;
  avgPrice: number;
  initialValue: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
  totalBought: number;
  realizedPnl: number;
  percentRealizedPnl: number;
  curPrice: number;
  redeemable: boolean;
  mergeable: boolean;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate?: string;
  negativeRisk: boolean;
};

export type Trade = {
  proxyWallet: string;
  side: "BUY" | "SELL";
  asset: string;
  conditionId: string;
  size: number;
  price: number;
  timestamp: number;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
  transactionHash?: string;
};

export type Activity = {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: "TRADE" | "SPLIT" | "MERGE" | "REDEEM" | "REWARD" | "CONVERSION";
  size: number;
  usdcSize: number;
  transactionHash?: string;
  price?: number;
  asset?: string;
  side?: string;
  outcomeIndex?: number;
  title?: string;
  slug?: string;
  icon?: string;
  outcome?: string;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
};

export type PositionValue = {
  user: string;
  value: number;
};

export type ClosedPosition = {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  totalBought: number;
  realizedPnl: number;
  curPrice: number;
  timestamp: number;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate?: string;
};

export type TradedMarkets = {
  user: string;
  traded: number;
};
