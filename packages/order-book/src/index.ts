export type { ClientConfig } from "./base-client.ts";
export { OrderBookClient } from "./client.ts";
export {
  ApiError,
  AuthenticationError,
  NetworkError,
  OrderBookError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from "./errors.ts";
export type { BalanceAllowanceResponse } from "./requests/account.ts";
export type {
  Market,
  MarketsResponse,
  MarketToken,
  OrderBookSummary,
  OrderLevel,
  TickerResponse,
} from "./requests/book.ts";
export type {
  CancelResponse,
  CreateOrderParams,
  Order,
  OrderResponse,
  OrderSide,
  OrderType,
  SignedOrder,
} from "./requests/order.ts";
export type { MidpointResponse, PriceResponse } from "./requests/pricing.ts";
export type {
  GetTradesParams,
  Trade,
  TradesResponse,
} from "./requests/trade.ts";

export {
  calculateFees,
  calculateMidpoint,
  calculateOrderCost,
  calculateSpread,
  calculateSpreadPercent,
  calculateTotalCost,
  formatTokenId,
  getOppositeSide,
  isValidTickSize,
  priceToRaw,
  rawToPrice,
  rawToSize,
  roundToTickSize,
  sizeToRaw,
  validatePrice,
  validateSize,
} from "./utils.ts";
