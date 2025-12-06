// Re-export from clob (trading API)
export * from "@dicedhq/clob";
// Re-export from data, excluding types that conflict with clob
// Re-export conflicting types with aliases
export {
  // Users API (excluding Trade and ListTradesParams which conflict with clob)
  type Activity,
  type ActivitySortBy,
  type ActivityType,
  // Builders API
  type Builder,
  type ClosedPosition,
  type ClosedPositionSortBy,
  // Client
  Data,
  type DataConfig,
  // Errors (already exported from clob, but aliased for data-specific use)
  DataError,
  // Misc API
  type GetEventLiveVolume,
  type GetLeaderboardParams,
  type GetMarketOpenInterest,
  // Health API
  type Health,
  // Holders API
  type Holder,
  type ListActivityParams,
  type ListClosedPositionsParams,
  type ListHoldersParams,
  type ListPositionsParams,
  type ListPositionValueParams,
  type ListTradesParams as DataListTradesParams,
  type MarketHolders,
  type Position,
  type PositionValue,
  type SortBy,
  type SortDirection,
  type TimePeriod,
  type Trade as DataTrade,
  type TradedMarkets,
  type TradeFilterType,
  type TradeSide,
} from "@dicedhq/data";
// Re-export from gamma (market data API)
export * from "@dicedhq/gamma";

export { Polymarket, type PolymarketConfig } from "./client.js";
