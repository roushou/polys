import { AccountRequests } from "./api/account.js";
import { AuthRequests } from "./api/auth.js";
import { BookRequests } from "./api/book.js";
import { MarketRequests } from "./api/market.js";
import { OrderRequests } from "./api/order.js";
import { TradeRequests } from "./api/trade.js";
import { BaseClient, type ClientConfig } from "./base-client.js";

export class Polymarket extends BaseClient {
  public readonly account: AccountRequests;

  public readonly auth: AuthRequests;

  public readonly book: BookRequests;

  public readonly market: MarketRequests;

  public readonly order: OrderRequests;

  public readonly trade: TradeRequests;

  constructor(config: ClientConfig) {
    super(config);

    this.account = new AccountRequests(this);
    this.auth = new AuthRequests(this);
    this.book = new BookRequests(this);
    this.market = new MarketRequests(this);
    this.order = new OrderRequests(this, this.market);
    this.trade = new TradeRequests(this);
  }
}
