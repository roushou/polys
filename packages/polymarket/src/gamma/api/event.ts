import type { GammaBaseClient } from "../client/base.js";
import { type Market, type MarketRaw, parseMarket } from "./market.js";
import type { Tag } from "./tags.js";

export class EventApi {
  constructor(private readonly client: GammaBaseClient) {}

  /**
   * Get a specific event by id
   */
  async getById(id: string): Promise<Event> {
    const raw = await this.client.request<EventRaw>({
      method: "GET",
      path: `/events/${id}`,
    });
    return transformEventWithMarkets(raw);
  }

  /**
   * Get a specific event by slug
   */
  async getBySlug(slug: string): Promise<Event> {
    const raw = await this.client.request<EventRaw>({
      method: "GET",
      path: `/events/slug/${slug}`,
    });
    return transformEventWithMarkets(raw);
  }

  /**
   * List all events with pagination. Defaults to first 10 results.
   */
  async list({
    active,
    closed,
    tag_id,
    limit = 10,
    offset = 0,
    ascending = true,
  }: {
    active: boolean;
    closed: boolean;
    tag_id?: string;
    limit?: number;
    offset?: number;
    ascending?: boolean;
  }): Promise<Event[]> {
    const raw = await this.client.request<EventRaw[]>({
      method: "GET",
      path: "/events",
      params: { active, closed, tag_id, limit, offset, ascending },
    });
    return raw.map(transformEventWithMarkets);
  }
}

/**
 * Transform a raw event with markets from snake_case to camelCase
 */
function transformEventWithMarkets(raw: EventRaw): Event {
  return {
    id: raw.id,
    ticker: raw.ticker,
    title: raw.title,
    slug: raw.slug,
    subtitle: raw.subtitle,
    description: raw.description,
    resolutionSource: raw.resolutionSource,
    tags: raw.tags,
    startDate: raw.start_date,
    creationDate: raw.creation_date,
    endDate: raw.end_date,
    closedTime: raw.closed_time,
    startTime: raw.start_time,
    finishedTimestamp: raw.finished_timestamp,
    image: raw.image,
    icon: raw.icon,
    featuredImage: raw.featured_image,
    active: raw.active,
    closed: raw.closed,
    archived: raw.archived,
    new: raw.new,
    featured: raw.featured,
    restricted: raw.restricted,
    liquidity: raw.liquidity,
    volume: raw.volume,
    openInterest: raw.open_interest,
    competitive: raw.competitive,
    volume24hr: raw.volume24hr,
    volume1wk: raw.volume1wk,
    volume1mo: raw.volume1mo,
    volume1yr: raw.volume1yr,
    category: raw.category,
    subcategory: raw.subcategory,
    sortBy: raw.sort_by,
    enableOrderBook: raw.enable_order_book,
    commentsEnabled: raw.comments_enabled,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    publishedAt: raw.published_at,
    gameStatus: raw.game_status,
    gameId: raw.game_id,
    eventWeek: raw.event_week,
    seriesSlug: raw.series_slug,
    score: raw.score,
    period: raw.period,
    elapsed: raw.elapsed,
    live: raw.live,
    ended: raw.ended,
    markets: raw.markets?.map(parseMarket),
  };
}

export type Event = {
  id: string;
  ticker: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  resolutionSource: string;
  tags: Tag[];
  startDate: string;
  creationDate: string;
  endDate: string;
  closedTime: string;
  startTime: string;
  finishedTimestamp: string;
  image: string;
  icon: string;
  featuredImage: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  category: string;
  subcategory: string;
  sortBy: string;
  enableOrderBook: boolean;
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  gameStatus: string;
  gameId: string;
  eventWeek: number;
  seriesSlug: string;
  score: string;
  period: string;
  elapsed: string;
  live: boolean;
  ended: boolean;
  markets?: Market[];
};

/**
 * Raw event with markets response from the API (before transformation)
 */
type EventRaw = {
  id: string;
  ticker: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  resolutionSource: string;
  tags: Tag[];
  start_date: string;
  creation_date: string;
  end_date: string;
  closed_time: string;
  start_time: string;
  finished_timestamp: string;
  image: string;
  icon: string;
  featured_image: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  open_interest: number;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  category: string;
  subcategory: string;
  sort_by: string;
  enable_order_book: boolean;
  comments_enabled: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  game_status: string;
  game_id: string;
  event_week: number;
  series_slug: string;
  score: string;
  period: string;
  elapsed: string;
  live: boolean;
  ended: boolean;
  markets?: Array<MarketRaw>;
};
