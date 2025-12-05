import type { BaseClient } from "../client/base.js";

export class UsersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List current positions for a user
   */
  async positions({
    user,
    market,
    eventId,
    sizeThreshold = 1,
    redeemable = false,
    mergeable = false,
    limit = 100,
    offset = 0,
    sortBy = "TOKENS",
    sortDirection = "DESC",
    title,
  }: ListPositionsParams): Promise<Position[]> {
    return this.client.request<Position[]>({
      method: "GET",
      path: "/positions",
      params: {
        user,
        market,
        eventId,
        sizeThreshold,
        redeemable,
        mergeable,
        limit,
        offset,
        sortBy,
        sortDirection,
        title,
      },
    });
  }

  /**
   * List trades for a user or markets
   */
  async listTrades({
    user,
    market,
    eventId,
    takerOnly = true,
    filterType,
    filterAmount,
    limit = 100,
    offset = 0,
    side,
  }: ListTradesParams): Promise<Trade[]> {
    return this.client.request<Trade[]>({
      method: "GET",
      path: "/trades",
      params: {
        user,
        market,
        eventId,
        takerOnly,
        filterType,
        filterAmount,
        limit,
        offset,
        side,
      },
    });
  }

  /**
   * List on-chain activity for a user
   */
  async listActivity({
    user,
    market,
    eventId,
    type,
    start,
    end,
    sortBy = "TIMESTAMP",
    sortDirection = "DESC",
    side,
    limit = 100,
    offset = 0,
  }: ListActivityParams): Promise<Activity[]> {
    return this.client.request<Activity[]>({
      method: "GET",
      path: "/activity",
      params: {
        user,
        market,
        eventId,
        type,
        start,
        end,
        sortBy,
        sortDirection,
        side,
        limit,
        offset,
      },
    });
  }

  /**
   * List total value of a user's positions
   */
  async listPositionsValues({
    user,
    market,
  }: ListPositionValueParams): Promise<PositionValue[]> {
    return this.client.request<PositionValue[]>({
      method: "GET",
      path: "/value",
      params: {
        user,
        market,
      },
    });
  }

  /**
   * List closed positions for a user
   */
  async listClosedPositions({
    user,
    market,
    eventId,
    title,
    limit = 100,
    offset = 0,
    sortBy = "REALIZEDPNL",
    sortDirection = "DESC",
  }: ListClosedPositionsParams): Promise<ClosedPosition[]> {
    return this.client.request<ClosedPosition[]>({
      method: "GET",
      path: "/closed-positions",
      params: {
        user,
        market,
        title,
        eventId,
        limit,
        offset,
        sortBy,
        sortDirection,
      },
    });
  }

  /**
   * Get total markets a user has traded
   */
  async getTradedMarkets(user: string): Promise<TradedMarkets> {
    return this.client.request<TradedMarkets>({
      method: "GET",
      path: "/traded",
      params: { user },
    });
  }
}

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

export type ListPositionsParams = {
  user: string;
  market?: string; // comma-separated condition IDs
  eventId?: string; // comma-separated event IDs
  sizeThreshold?: number; // default: 1
  redeemable?: boolean;
  mergeable?: boolean;
  limit?: number; // 0-500, default: 100
  offset?: number; // 0-10000, default: 0
  sortBy?: SortBy;
  sortDirection?: SortDirection; // default: DESC
  title?: string; // max 100 chars
};

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

export type TradeSide = "BUY" | "SELL";

export type TradeFilterType = "CASH" | "TOKENS";

export type ListTradesParams = {
  user?: string;
  market?: string; // comma-separated condition IDs
  eventId?: string; // comma-separated event IDs (mutually exclusive with market)
  side?: TradeSide;
  takerOnly?: boolean; // default: true
  filterType?: TradeFilterType;
  filterAmount?: number;
  limit?: number; // 0-10000, default: 100
  offset?: number; // 0-10000, default: 0
};

export type Trade = {
  proxyWallet: string;
  side: TradeSide;
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

export type ListActivityParams = {
  user: string;
  market?: string; // comma-separated condition IDs
  eventId?: string; // comma-separated event IDs
  type?: string; // comma-separated activity types
  side?: TradeSide;
  start?: number; // timestamp
  end?: number; // timestamp
  limit?: number; // 0-10000, default: 100
  offset?: number; // 0-10000, default: 0
  sortBy?: ActivitySortBy; // default: TIMESTAMP
  sortDirection?: SortDirection; // default: DESC
};

export type ActivityType =
  | "TRADE"
  | "SPLIT"
  | "MERGE"
  | "REDEEM"
  | "REWARD"
  | "CONVERSION";

export type ActivitySortBy = "TIMESTAMP" | "TOKENS" | "CASH";

export type Activity = {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: ActivityType;
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

export type ListPositionValueParams = {
  user: string;
  market?: string; // comma-separated condition IDs
};

export type PositionValue = {
  user: string;
  value: number;
};

export type ClosedPositionSortBy =
  | "REALIZEDPNL"
  | "TITLE"
  | "PRICE"
  | "AVGPRICE"
  | "TIMESTAMP";

export type ListClosedPositionsParams = {
  user: string;
  market?: string; // comma-separated condition IDs
  eventId?: string; // comma-separated event IDs
  title?: string; // max 100 chars
  limit?: number; // 0-50, default: 10
  offset?: number; // 0-100000, default: 0
  sortBy?: ClosedPositionSortBy; // default: REALIZEDPNL
  sortDirection?: SortDirection; // default: DESC
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
