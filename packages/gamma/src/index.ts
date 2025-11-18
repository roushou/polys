export type { Event } from "./api/event.js";
export type {
  ClobReward,
  GammaReward,
  Market as GammaMarket,
} from "./api/market.js";
export type { ListTagsParams, RelatedTag, Tag } from "./api/tags.js";
export { Gamma, type GammaConfig } from "./client/client.js";
export {
  ApiError,
  AuthenticationError,
  GammaError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from "./errors.js";
