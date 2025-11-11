import type { BaseClient } from "../base-client.ts";
import type { OrderSide } from "./order.ts";

export class MarketRequests {
  constructor(private readonly client: BaseClient) {}

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
}

export type Market = {
  condition_id: string;
  question_id: string;
  tokens: MarketToken[];
  rewards?: {
    min_size: string;
    max_spread: string;
    event_start_date?: string;
    event_end_date?: string;
    rates?: number[];
  };
  minimum_order_size: string;
  minimum_tick_size: string;
  description: string;
  category?: string;
  end_date_iso?: string;
  game_start_time?: string;
  question?: string;
  market_slug?: string;
  min_incentive_size?: string;
  max_incentive_spread?: string;
  active?: boolean;
  closed?: boolean;
  seconds_delay?: number;
  icon?: string;
  neg_risk?: boolean;
  neg_risk_market_id?: string;
  neg_risk_request_id?: string;
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
