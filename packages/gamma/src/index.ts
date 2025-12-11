export type {
  Comment,
  CommentProfile,
  ListCommentsParams,
  Reaction,
} from "./api/comments.js";
export type { Event } from "./api/event.js";
export type {
  ClobReward,
  GammaReward,
  Market as GammaMarket,
} from "./api/market.js";
export type {
  Category,
  Chat,
  Collection,
  ListSeriesParams,
  Series,
} from "./api/series.js";
export type { SportsMetadata } from "./api/sport.js";
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
