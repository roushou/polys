import { AccountRequests } from "./api/account.js";
import { AuthRequests } from "./api/auth.js";
import { BookRequests } from "./api/book.js";
import { MarketRequests } from "./api/market.js";
import { OrderRequests } from "./api/order.js";
import { TradeRequests } from "./api/trade.js";
import { BaseClient, type ClientConfig } from "./base-client.js";

/**
 * Client for interacting with the Polymarket CLOB API
 *
 * @example
 * ```typescript
 * const client = new OrderBookClient({
 *   credentials: {
 *     key: 'your-api-key',
 *     secret: 'your-api-secret',
 *     passphrase: 'your-passphrase',
 *   },
 * });
 *
 * // Access order book data
 * const orderBook = await client.book.getOrderBook('token-id');
 *
 * // Get trades
 * const trades = await client.trade.getTrades({ market: 'market-id' });
 *
 * // Place an order (authenticated)
 * const order = await client.order.createAndPostOrder({
 *   token_id: 'token-id',
 *   price: 0.55,
 *   side: 'BUY',
 *   size: 100,
 * });
 *
 * // Check balance (authenticated)
 * const balance = await client.account.getBalanceAllowance('token-id', 'address');
 * ```
 */
export class OrderBookClient extends BaseClient {
  public readonly auth: AuthRequests;

  public readonly book: BookRequests;

  public readonly trade: TradeRequests;

  public readonly market: MarketRequests;

  public readonly order: OrderRequests;

  public readonly account: AccountRequests;

  constructor(config: ClientConfig) {
    super(config);

    this.auth = new AuthRequests(this);
    this.book = new BookRequests(this);
    this.trade = new TradeRequests(this);
    this.market = new MarketRequests(this);
    this.order = new OrderRequests(this, this.market);
    this.account = new AccountRequests(this);
  }
}
