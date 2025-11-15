import type { GammaBaseClient } from "../client/base.js";
import type { Event } from "./event.js";

export class MarketApi {
  constructor(private readonly client: GammaBaseClient) {}

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
function parseMarket(raw: MarketRaw): Market {
  return {
    ...raw,
    outcomes: JSON.parse(raw.outcomes),
    outcomePrices: raw.outcomePrices ? JSON.parse(raw.outcomePrices) : [],
    clobTokenIds: raw.clobTokenIds ? JSON.parse(raw.clobTokenIds) : [],
    rewards: raw.rewards ? JSON.parse(raw.rewards) : undefined,
  };
}

/**
 * Raw market response from the Gamma API (before parsing)
 */
type MarketRaw = {
  condition_id: string;
  question_id: string;
  question: string;
  description: string;
  market_slug?: string;
  outcomes: string; // stringified JSON array
  outcomePrices?: string; // stringified JSON array
  clobTokenIds: string; // stringified JSON array
  events?: Event[];
  tags?: string[];
  image?: string;
  icon?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  enable_order_book?: boolean;
  category?: string;
  end_date_iso?: string;
  game_start_time?: string;
  rewards?: string; // stringified JSON
  clobRewards?: ClobReward[];
  volume?: string;
  volume24hr?: string;
  liquidity?: string;
};

/**
 * Parsed market with properly typed fields
 */
export type Market = {
  /** Condition ID for the market */
  condition_id: string;

  /** Associated question ID */
  question_id: string;

  /** Question text */
  question: string;

  /** Market description */
  description: string;

  /** Market slug for URLs */
  market_slug?: string;

  /** Market outcomes (parsed from JSON) */
  outcomes: string[];

  /** Outcome prices (parsed from JSON) */
  outcomePrices: string[];

  /** CLOB token IDs (parsed from JSON) */
  clobTokenIds: string[];

  /** Associated events */
  events?: Event[];

  /** Market tags */
  tags?: string[];

  /** Market image URL */
  image?: string;

  /** Market icon URL */
  icon?: string;

  /** Whether the market is active */
  active?: boolean;

  /** Whether the market is closed */
  closed?: boolean;

  /** Whether the market is archived */
  archived?: boolean;

  /** Whether order book is enabled */
  enable_order_book?: boolean;

  /** Market category */
  category?: string;

  /** End date in ISO format */
  end_date_iso?: string;

  /** Game start time */
  game_start_time?: string;

  /** Reward configuration (parsed from JSON) */
  rewards?: GammaReward;

  /** CLOB rewards configuration */
  clobRewards?: ClobReward[];

  /** Volume in USD */
  volume?: string;

  /** Volume in last 24h */
  volume24hr?: string;

  /** Liquidity */
  liquidity?: string;
};

export type GammaReward = {
  min_size?: string;
  max_spread?: string;
  event_start_date?: string;
  event_end_date?: string;
  rates?: number[] | null;
};

export type ClobReward = {
  /** Token ID */
  token_id: string;

  /** Reward type */
  reward_type: string;

  /** Reward amount */
  amount: string;

  /** Minimum size */
  min_size?: string;

  /** Maximum spread */
  max_spread?: string;
};
