import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";
import type { OrderSide } from "./order.js";

export class TradeApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List trades
   */
  async listTrades(params?: ListTradesParams): Promise<TradesResponse> {
    const validated = params ? validate(ListTradesSchema, params) : undefined;

    return this.client.request<TradesResponse>({
      method: "GET",
      path: "/trades",
      auth: { kind: "none" },
      options: { params: validated },
    });
  }

  /**
   * List all trades for a market
   */
  async listAllTrades(market: string): Promise<Trade[]> {
    validate(NonEmptyString, market, "market");

    const trades: Trade[] = [];
    let nextCursor: string | undefined;

    do {
      const response = await this.listTrades({
        market,
        next_cursor: nextCursor,
      });
      trades.push(...response.data);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    return trades;
  }
}

// ============================================================================
// Parameter Schemas
// ============================================================================

const ListTradesSchema = v.pipe(
  v.object({
    market: v.optional(v.string()),
    maker_address: v.optional(v.string()),
    asset_id: v.optional(v.string()),
    next_cursor: v.optional(v.string()),
    limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    before: v.optional(v.number()),
    after: v.optional(v.number()),
  }),
  v.metadata({ title: "ListTradesParams" }),
);

export type ListTradesParams = v.InferInput<typeof ListTradesSchema>;

// ============================================================================
// Response Types
// ============================================================================

export type Trade = {
  id: string;
  taker_order_id: string;
  market: string;
  asset_id: string;
  side: OrderSide;
  size: string;
  fee_rate_bps: string;
  price: string;
  status: string;
  match_time?: string;
  last_update?: string;
  outcome?: string;
  bucket_index?: number;
  owner?: string;
  maker_address?: string;
  transaction_hash?: string;
  trader_side?: OrderSide;
  type?: string;
};

export type TradesResponse = {
  data: Trade[];
  next_cursor?: string;
};
