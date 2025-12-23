import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";
import type { OrderSide } from "./order.js";

export class BookApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get order book for a specific token
   */
  async getOrderBook(tokenId: string): Promise<OrderBook> {
    validate(NonEmptyString, tokenId, "tokenId");

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
    const validated = validate(GetOrderBooksSchema, params);

    return this.client.request<OrderBook[]>({
      method: "POST",
      path: "/books",
      auth: { kind: "none" },
      options: {
        body: validated.map((param) => ({
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
    validate(NonEmptyString, tokenId, "tokenId");

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

// ============================================================================
// Parameter Schemas
// ============================================================================

const GetOrderBooksSchema = v.pipe(
  v.array(
    v.object({
      tokenId: NonEmptyString,
      side: v.picklist(["BUY", "SELL"]),
    }),
  ),
  v.minLength(1, "params must not be empty"),
  v.metadata({ title: "GetOrderBooksParams" }),
);

// ============================================================================
// Types
// ============================================================================

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
