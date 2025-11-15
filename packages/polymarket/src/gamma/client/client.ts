import { CommentsApi } from "../api/comments.js";
import { EventApi } from "../api/event.js";
import { MarketApi } from "../api/market.js";
import { SeriesApi } from "../api/series.js";
import { SportApi } from "../api/sport.js";
import { TagsApi } from "../api/tags.js";
import { GammaBaseClient, type GammaClientConfig } from "./base.js";

export class GammaClient extends GammaBaseClient {
  public readonly comments: CommentsApi;

  public readonly event: EventApi;

  public readonly market: MarketApi;

  public readonly series: SeriesApi;

  public readonly sport: SportApi;

  public readonly tags: TagsApi;

  constructor(config: GammaClientConfig = {}) {
    super(config);

    this.comments = new CommentsApi(this);
    this.event = new EventApi(this);
    this.market = new MarketApi(this);
    this.series = new SeriesApi(this);
    this.sport = new SportApi(this);
    this.tags = new TagsApi(this);
  }
}
