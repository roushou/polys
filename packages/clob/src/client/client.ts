import { AccountApi } from "../api/account.js";
import { AuthApi } from "../api/auth.js";
import { BookApi } from "../api/book.js";
import { MarketApi } from "../api/market.js";
import { OrderApi } from "../api/order.js";
import { TradeApi } from "../api/trade.js";
import { BaseClient, type BaseClientConfig } from "./base.js";

export type { BaseClientConfig as ClobConfig };

export class Clob extends BaseClient {
  public readonly account: AccountApi;

  public readonly auth: AuthApi;

  public readonly book: BookApi;

  public readonly market: MarketApi;

  public readonly order: OrderApi;

  public readonly trade: TradeApi;

  constructor(config: BaseClientConfig) {
    super(config);

    this.account = new AccountApi(this);
    this.auth = new AuthApi(this);
    this.book = new BookApi(this);
    this.market = new MarketApi(this);
    this.order = new OrderApi(this, this.market);
    this.trade = new TradeApi(this);
  }
}
