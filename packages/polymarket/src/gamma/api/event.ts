import type { GammaBaseClient } from "../client/base.js";
import type { Tag } from "./tags.js";

export class EventApi {
  constructor(private readonly client: GammaBaseClient) {}

  /**
   * Get a specific event by slug
   */
  async get(slug: string): Promise<EventWithMarkets> {
    const raw = await this.client.request<EventWithMarketsRaw>({
      method: "GET",
      path: `/events/${slug}`,
    });
    return transformEventWithMarkets(raw);
  }

  /**
   * List all events with pagination. Defaults to first 10 results.
   */
  async list({
    active,
    archived,
    closed,
    limit = 10,
    offset = 0,
  }: {
    active: boolean;
    archived: boolean;
    closed: boolean;
    limit?: number;
    offset?: number;
  }): Promise<EventWithMarkets[]> {
    const raw = await this.client.request<EventWithMarketsRaw[]>({
      method: "GET",
      path: "/events",
      params: { limit, offset, active, closed, archived },
    });
    return raw.map(transformEventWithMarkets);
  }
}

export type Event = {
  /** Event ID */
  id: string;

  /** Event ticker symbol */
  ticker?: string;

  /** Event title */
  title: string;

  /** Event slug for URLs */
  slug: string;

  /** Event subtitle */
  subtitle?: string;

  /** Event description */
  description?: string;

  /** Resolution source */
  resolutionSource?: string;

  /** Event tags */
  tags?: Tag[];

  /** Event start date */
  start_date?: string;

  /** Event creation date */
  creation_date?: string;

  /** Event end date */
  end_date?: string;

  /** Event closed time */
  closed_time?: string;

  /** Event start time */
  start_time?: string;

  /** Event finished timestamp */
  finished_timestamp?: string;

  /** Event image URL */
  image?: string;

  /** Event icon URL */
  icon?: string;

  /** Featured image URL */
  featured_image?: string;

  /** Whether the event is active */
  active?: boolean;

  /** Whether the event is closed */
  closed?: boolean;

  /** Whether the event is archived */
  archived?: boolean;

  /** Whether the event is new */
  new?: boolean;

  /** Whether the event is featured */
  featured?: boolean;

  /** Whether the event is restricted */
  restricted?: boolean;

  /** Event liquidity */
  liquidity?: number;

  /** Event volume */
  volume?: number;

  /** Event open interest */
  open_interest?: number;

  /** Event competitive score */
  competitive?: number;

  /** Volume in last 24 hours */
  volume24hr?: number;

  /** Volume in last week */
  volume1wk?: number;

  /** Volume in last month */
  volume1mo?: number;

  /** Volume in last year */
  volume1yr?: number;

  /** Event category */
  category?: string;

  /** Event subcategory */
  subcategory?: string;

  /** Sort by field */
  sort_by?: string;

  /** Whether order book is enabled */
  enable_order_book?: boolean;

  /** Whether comments are enabled */
  comments_enabled?: boolean;

  /** Created at timestamp */
  created_at?: string;

  /** Updated at timestamp */
  updated_at?: string;

  /** Published at timestamp */
  published_at?: string;

  /** Game status (for sports events) */
  game_status?: string;

  /** Game ID (for sports events) */
  game_id?: string;

  /** Event week (for sports events) */
  event_week?: number;

  /** Series slug (for sports events) */
  series_slug?: string;

  /** Score (for sports events) */
  score?: string;

  /** Period (for sports events) */
  period?: string;

  /** Elapsed time (for sports events) */
  elapsed?: string;

  /** Whether event is live (for sports events) */
  live?: boolean;

  /** Whether event has ended (for sports events) */
  ended?: boolean;
};

/**
 * Transform a raw event with markets from snake_case to camelCase
 */
function transformEventWithMarkets(raw: EventWithMarketsRaw): EventWithMarkets {
  return {
    id: raw.id,
    ticker: raw.ticker,
    title: raw.title,
    slug: raw.slug,
    subtitle: raw.subtitle,
    description: raw.description,
    resolutionSource: raw.resolutionSource,
    tags: raw.tags,
    start_date: raw.start_date,
    creation_date: raw.creation_date,
    end_date: raw.end_date,
    closed_time: raw.closed_time,
    start_time: raw.start_time,
    finished_timestamp: raw.finished_timestamp,
    image: raw.image,
    icon: raw.icon,
    featured_image: raw.featured_image,
    active: raw.active,
    closed: raw.closed,
    archived: raw.archived,
    new: raw.new,
    featured: raw.featured,
    restricted: raw.restricted,
    liquidity: raw.liquidity,
    volume: raw.volume,
    open_interest: raw.open_interest,
    competitive: raw.competitive,
    volume24hr: raw.volume24hr,
    volume1wk: raw.volume1wk,
    volume1mo: raw.volume1mo,
    volume1yr: raw.volume1yr,
    category: raw.category,
    subcategory: raw.subcategory,
    sort_by: raw.sort_by,
    enable_order_book: raw.enable_order_book,
    comments_enabled: raw.comments_enabled,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    published_at: raw.published_at,
    game_status: raw.game_status,
    game_id: raw.game_id,
    event_week: raw.event_week,
    series_slug: raw.series_slug,
    score: raw.score,
    period: raw.period,
    elapsed: raw.elapsed,
    live: raw.live,
    ended: raw.ended,
    markets: raw.markets?.map((market) => ({
      conditionId: market.condition_id,
      questionId: market.question_id,
      question: market.question,
      description: market.description,
      marketSlug: market.market_slug,
      outcomes: market.outcomes,
      outcomePrices: market.outcomePrices,
      clobTokenIds: market.clobTokenIds,
      image: market.image,
      icon: market.icon,
      active: market.active,
      closed: market.closed,
      archived: market.archived,
      enableOrderBook: market.enable_order_book,
      category: market.category,
      endDateIso: market.end_date_iso,
      volume: market.volume,
      volume24hr: market.volume24hr,
      liquidity: market.liquidity,
    })),
  };
}

/**
 * Raw event with markets response from the API (before transformation)
 */
type EventWithMarketsRaw = {
  id: string;
  ticker?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  resolutionSource?: string;
  tags?: Tag[];
  start_date?: string;
  creation_date?: string;
  end_date?: string;
  closed_time?: string;
  start_time?: string;
  finished_timestamp?: string;
  image?: string;
  icon?: string;
  featured_image?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  new?: boolean;
  featured?: boolean;
  restricted?: boolean;
  liquidity?: number;
  volume?: number;
  open_interest?: number;
  competitive?: number;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  category?: string;
  subcategory?: string;
  sort_by?: string;
  enable_order_book?: boolean;
  comments_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  game_status?: string;
  game_id?: string;
  event_week?: number;
  series_slug?: string;
  score?: string;
  period?: string;
  elapsed?: string;
  live?: boolean;
  ended?: boolean;
  markets?: Array<{
    condition_id: string;
    question_id: string;
    question: string;
    description?: string;
    market_slug?: string;
    outcomes: string[];
    outcomePrices: string;
    clobTokenIds: string;
    image?: string;
    icon?: string;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    enable_order_book?: boolean;
    category?: string;
    end_date_iso?: string;
    volume?: string;
    volume24hr?: string;
    liquidity?: string;
  }>;
};

export type EventWithMarkets = Event & {
  /** Markets associated with this event */
  markets?: Array<{
    conditionId: string;
    questionId: string;
    question: string;
    description?: string;
    marketSlug?: string;
    outcomes: string[];
    outcomePrices: string;
    clobTokenIds: string;
    image?: string;
    icon?: string;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    enableOrderBook?: boolean;
    category?: string;
    endDateIso?: string;
    volume?: string;
    volume24hr?: string;
    liquidity?: string;
  }>;
};
