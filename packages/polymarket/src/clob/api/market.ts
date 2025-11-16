import type { BaseClobClient } from "../client/base.js";
import type { OrderSide } from "./order.js";

export class MarketApi {
  constructor(private readonly client: BaseClobClient) {}

  /**
   * Get market information by condition ID
   */
  async get(conditionId: string): Promise<Market> {
    return this.client.request<Market>({
      method: "GET",
      path: `/markets/${conditionId}`,
      auth: { kind: "none" },
    });
  }

  /**
   * List available markets (paginated)
   */
  async list(nextCursor?: string): Promise<ListMarketsResponse> {
    return this.client.request<ListMarketsResponse>({
      method: "GET",
      path: "/markets",
      auth: { kind: "none" },
      options: {
        params: { next_cursor: nextCursor },
      },
    });
  }

  /**
   * Get all markets (fetches all pages)
   */
  async listAll(): Promise<Market[]> {
    const markets: Market[] = [];
    let nextCursor: string | undefined;

    do {
      const response = await this.list(nextCursor);
      markets.push(...response.data);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    return markets;
  }

  /**
   * Get the market price for a specific token and side
   */
  async getPrice(
    tokenId: string,
    side: "BUY" | "SELL",
  ): Promise<PriceResponse> {
    return this.client.request<PriceResponse>({
      method: "GET",
      path: "/price",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId, side },
      },
    });
  }

  /**
   * Get market prices for multiple tokens and sides
   */
  async getPrices(
    params: { tokenId: string; side: OrderSide }[],
  ): Promise<PriceResponse> {
    // TODO: use correct type
    return this.client.request<PriceResponse>({
      method: "POST",
      path: "/prices",
      auth: { kind: "none" },
      options: {
        body: params.map((param) => ({
          token_id: param.tokenId,
          side: param.side,
        })),
      },
    });
  }

  /**
   * Get midpoint price for a specific token
   */
  async getMidpoint(tokenId: string): Promise<MidpointResponse> {
    return this.client.request<MidpointResponse>({
      method: "GET",
      path: "/midpoint",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId },
      },
    });
  }

  /**
   * Get historical price data for a given market token
   */
  async getPriceHistory(params: GetPriceHistoryParams): Promise<MarketPrice[]> {
    const response = await this.client.request<Array<{ p: number; t: number }>>(
      {
        method: "GET",
        path: "/prices-history",
        auth: { kind: "none" },
        options: {
          params: {
            market: params.market,
            startTs: params.startTimestamp,
            endTs: params.endTimestamp,
            fidelity: params.fidelity,
            interval: params.interval,
          },
        },
      },
    );
    return response.map((data) => ({
      price: data.p,
      timestamp: data.t,
    }));
  }

  /**
   * Get tick size for a given token
   */
  async getTickSize(tokenId: string): Promise<TickSize> {
    const response = await this.client.request<{ minimum_tick_size: number }>({
      method: "GET",
      path: "/tick-size",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId },
      },
    });
    return response.minimum_tick_size.toString();
  }

  /**
   * Get fee rate bps for a given token
   */
  async getFeeRateBps(tokenId: string): Promise<number> {
    const response = await this.client.request<{ base_fee: number }>({
      method: "GET",
      path: "/fee-rate",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId },
      },
    });
    return response.base_fee;
  }
}

export type Market = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage: string;
  endDate: string;
  category: string;
  liquidity: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  active: boolean;
  marketType: string;
  closed: boolean;
  marketMakerAddress: string;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  closedTime: string;
  mailchimpTag: string;
  archived: boolean;
  restricted: boolean;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  hasReviewedDates: boolean;
  readyForCron: boolean;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  clobTokenIds: string[];
  fpmmLive: boolean;
  volume1wkAmm: number;
  volume1moAmm: number;
  volume1yrAmm: number;
  volume1wkClob: number;
  volume1moClob: number;
  volume1yrClob: number;
  events: Event[];
  creator: string;
  ready: boolean;
  funded: boolean;
  cyom: boolean;
  competitive: number;
  pagerDutyNotificationEnabled: boolean;
  approved: boolean;
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  oneYearPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  clearBookOnStart: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  umaResolutionStatuses: string;
  pendingDeployment: boolean;
  deploying: boolean;
  rfqEnabled: boolean;
  holdingRewardsEnabled: boolean;
  feesEnabled: boolean;
  rewards: undefined;
};

export type MarketToken = {
  token_id: string;
  outcome: string;
  price?: string;
  winner?: boolean;
};

export type ListMarketsResponse = {
  data: Market[];
  next_cursor?: string;
  limit: number;
  count: number;
};

export type PriceResponse = {
  price: string;
};

export type MidpointResponse = {
  mid: string;
};

export type GetPriceHistoryParams = {
  market: string;
  startTimestamp?: number;
  endTimestamp?: number;
  fidelity?: number;
  interval?: "1m" | "1w" | "1d" | "6h" | "12h" | "1h" | "max";
};

export type MarketPrice = {
  price: number;
  timestamp: number;
};

export type TickSize = "0.1" | "0.01" | "0.001" | "0.0001" | (string & {});
