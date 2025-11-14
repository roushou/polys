import type { BaseClobClient } from "../client/base.js";
import type { OrderSide } from "./order.js";

export class BookApi {
  constructor(private readonly client: BaseClobClient) {}

  /**
   * Get order book for a specific token
   */
  async getOrderBook(tokenId: string): Promise<OrderBook> {
    return this.client.request<OrderBook>({
      method: "GET",
      path: "/book",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId },
      },
    });
  }

  /**
   * Get multiple order books
   */
  async getOrderBooks(
    params: { tokenId: string; side: OrderSide }[],
  ): Promise<OrderBook[]> {
    return this.client.request<OrderBook[]>({
      method: "POST",
      path: "/books",
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
   * Get ticker information for a token
   */
  async getTicker(tokenId: string): Promise<TickerResponse> {
    return this.client.request<TickerResponse>({
      method: "GET",
      path: "/ticker",
      auth: { kind: "none" },
      options: {
        params: { token_id: tokenId },
      },
    });
  }
}

export type OrderLevel = {
  price: string;
  size: string;
};

export type OrderBook = {
  market: string;
  asset_id: string;
  bids: OrderLevel[];
  asks: OrderLevel[];
  timestamp: number;
  hash: string;
  min_order_size: string;
  tick_size: string;
  neg_risk: boolean;
};

export type TickerResponse = {
  token_id: string;
  market: string;
  last_price?: string;
  bid?: string;
  ask?: string;
  mid?: string;
  volume?: string;
  timestamp: number;
};
