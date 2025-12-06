import { safeJsonParse } from "@dicedhq/core";
import type { BaseClient } from "../client/base.js";
import type { Event } from "./event.js";

export class MarketApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get a specific market by ID
   */
  async get(id: string): Promise<Market> {
    const raw = await this.client.request<MarketRaw>({
      method: "GET",
      path: `/markets/${id}`,
    });
    return parseMarket(raw);
  }

  /**
   * List all markets with pagination. Defaults to first 10 results.
   */
  async listAll({
    active,
    closed,
    archived,
    limit = 10,
    offset = 0,
  }: {
    active: boolean;
    closed: boolean;
    archived: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Market[]> {
    const raw = await this.client.request<MarketRaw[]>({
      method: "GET",
      path: "/markets",
      params: { limit, offset, active, closed, archived },
    });
    return raw.map(parseMarket);
  }

  /**
   * List current markets (active, non-closed, non-archived). Defaults to first 10 results.
   */
  async listCurrent({
    limit = 10,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}): Promise<Market[]> {
    const raw = await this.client.request<MarketRaw[]>({
      method: "GET",
      path: "/markets",
      params: {
        limit,
        offset,
        active: true,
        closed: false,
        archived: false,
      },
    });
    return raw.map(parseMarket);
  }

  /**
   * List all current markets by fetching all pages. Defaults to first 10 results.
   */
  async listAllCurrent(limit = 10): Promise<Market[]> {
    const markets: Market[] = [];
    let offset = 0;

    while (true) {
      const batch = await this.listCurrent({ limit, offset });
      if (batch.length === 0) break;
      markets.push(...batch);
      offset += batch.length;
      if (batch.length < limit) break; // Last page
    }

    return markets;
  }

  /**
   * List CLOB-tradable markets (markets with order book enabled)
   */
  async listClobTradable(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Market[]> {
    const raw = await this.client.request<MarketRaw[]>({
      method: "GET",
      path: "/markets",
      params: {
        limit: params?.limit,
        offset: params?.offset,
        enableOrderBook: true,
      },
    });
    return raw.map(parseMarket);
  }
}

/**
 * Parse a raw market response from the API into a properly typed Market
 */
export function parseMarket(raw: MarketRaw): Market {
  return {
    ...raw,
    outcomes: safeJsonParse<string[]>(raw.outcomes, []),
    outcomePrices: safeJsonParse<string[]>(raw.outcomePrices, []),
    clobTokenIds: safeJsonParse<string[]>(raw.clobTokenIds, []),
    rewards: safeJsonParse<GammaReward | undefined>(raw.rewards, undefined),
  };
}

/**
 * Raw market response from the Gamma API (before parsing)
 */
export type MarketRaw = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage?: string;
  endDate?: string;
  category?: string;
  liquidity?: string;
  image?: string;
  icon?: string;
  description?: string;
  outcomes: string; // stringified JSON array
  outcomePrices?: string; // stringified JSON array
  volume?: string;
  active?: boolean;
  marketType?: string;
  closed?: boolean;
  marketMakerAddress?: string;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  closedTime?: string;
  mailchimpTag?: string;
  archived?: boolean;
  restricted?: boolean;
  volumeNum?: number;
  liquidityNum?: number;
  endDateIso?: string;
  hasReviewedDates?: boolean;
  readyForCron?: boolean;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  clobTokenIds: string; // stringified JSON array
  fpmmLive?: boolean;
  volume1wkAmm?: number;
  volume1moAmm?: number;
  volume1yrAmm?: number;
  volume1wkClob?: number;
  volume1moClob?: number;
  volume1yrClob?: number;
  events?: Event[];
  creator?: string;
  ready?: boolean;
  funded?: boolean;
  cyom?: boolean;
  competitive?: number;
  pagerDutyNotificationEnabled?: boolean;
  approved?: boolean;
  rewardsMinSize?: number;
  rewardsMaxSpread?: number;
  spread?: number;
  oneDayPriceChange?: number;
  oneHourPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;
  oneYearPriceChange?: number;
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  clearBookOnStart?: boolean;
  manualActivation?: boolean;
  negRiskOther?: boolean;
  umaResolutionStatuses?: string;
  pendingDeployment?: boolean;
  deploying?: boolean;
  rfqEnabled?: boolean;
  holdingRewardsEnabled?: boolean;
  feesEnabled?: boolean;
  rewards?: string; // stringified JSON
  clobRewards?: ClobReward[];
  tags?: string[];
};

/**
 * Parsed market with properly typed fields
 */
export type Market = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage?: string;
  endDate?: string;
  category?: string;
  liquidity?: string;
  image?: string;
  icon?: string;
  description?: string;
  outcomes: string[];
  outcomePrices: string[];
  volume?: string;
  active?: boolean;
  marketType?: string;
  closed?: boolean;
  marketMakerAddress?: string;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  closedTime?: string;
  mailchimpTag?: string;
  archived?: boolean;
  restricted?: boolean;
  volumeNum?: number;
  liquidityNum?: number;
  endDateIso?: string;
  hasReviewedDates?: boolean;
  readyForCron?: boolean;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  clobTokenIds: string[];
  fpmmLive?: boolean;
  volume1wkAmm?: number;
  volume1moAmm?: number;
  volume1yrAmm?: number;
  volume1wkClob?: number;
  volume1moClob?: number;
  volume1yrClob?: number;
  events?: Event[];
  creator?: string;
  ready?: boolean;
  funded?: boolean;
  cyom?: boolean;
  competitive?: number;
  pagerDutyNotificationEnabled?: boolean;
  approved?: boolean;
  rewardsMinSize?: number;
  rewardsMaxSpread?: number;
  spread?: number;
  oneDayPriceChange?: number;
  oneHourPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;
  oneYearPriceChange?: number;
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  clearBookOnStart?: boolean;
  manualActivation?: boolean;
  negRiskOther?: boolean;
  umaResolutionStatuses?: string;
  pendingDeployment?: boolean;
  deploying?: boolean;
  rfqEnabled?: boolean;
  holdingRewardsEnabled?: boolean;
  feesEnabled?: boolean;
  rewards?: GammaReward;
  clobRewards?: ClobReward[];
  tags?: string[];
};

export type GammaReward = {
  minSize?: string;
  maxSpread?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  rates?: number[] | null;
};

export type ClobReward = {
  /** Token ID */
  tokenId: string;

  /** Reward type */
  rewardType: string;

  /** Reward amount */
  amount: string;

  /** Minimum size */
  minSize?: string;

  /** Maximum spread */
  maxSpread?: string;
};
