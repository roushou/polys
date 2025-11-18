# @dicedhq/clob

A TypeScript client for the Polymarket CLOB (Central Limit Order Book) API for trading on Polymarket's order book.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

## Features

- [ ] **CLOB API Support**: Complete access to Polymarket's order book
- [x] **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- [x] **Error Handling**: Robust error handling with custom error types
- [x] **Automatic Retries**: Built-in retry logic for failed requests
- [x] **Rate Limiting**: Automatic handling of rate limit errors
- [x] **Authentication**: HMAC-SHA256 signature authentication for private endpoints
- [ ] **Real-time WebSocket Support**: Subscribe to live order book and trade updates

## Installation

```bash
npm install @dicedhq/clob
```

## Quick Start

### Initialize the Client

```typescript
import { Clob, createConnectedWallet } from "@dicedhq/clob";

// Create a wallet for signing transactions
const wallet = createConnectedWallet({
  privateKey: process.env.PRIVATE_KEY,
  chain: "polygon",
});

// Set up credentials for authenticated endpoints
const credentials = {
  key: process.env.POLYMARKET_API_KEY,
  secret: process.env.POLYMARKET_SECRET,
  passphrase: process.env.POLYMARKET_PASSPHRASE,
};

// Initialize the client
const client = new ClobClient({
  wallet,
  credentials,
  debug: true, // Optional: enable debug logging
});
```

### Using the CLOB API

```typescript
// Get current markets
const markets = await client.market.list();

// Get order book for a specific market
const orderBook = await client.book.getOrderBook({ tokenId: "..." });

// Create and post an order
const order = await client.order.createOrder({
  price: 0.5,
  side: "BUY",
  size: 10,
  tokenId: "...",
  expiration: 1000000000,
  taker: "public",
});

// Get your open orders
const openOrders = await client.order.list();

// Cancel an order
await client.order.cancel({ orderId: "..." });
```

## Advanced Configuration

### Using with a Signing Server

For production environments, you can use an external signing server (attributor):

```typescript
const client = new ClobClient({
  wallet,
  credentials,
  attributor: {
    url: "https://your-signing-server.com/api/sign",
    token: "your-bearer-token",
  },
});
```

## Error Handling

The library provides custom error types for better error handling:

```typescript
import {
  ApiError,
  RateLimitError,
  AuthenticationError,
  NetworkError,
  ValidationError,
} from "@dicedhq/clob";

try {
  const markets = await client.market.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log("Rate limited, retry after:", error.retryAfter);
  } else if (error instanceof AuthenticationError) {
    console.log("Authentication failed:", error.message);
  } else if (error instanceof NetworkError) {
    console.log("Network error:", error.message);
  }
}
```

## Examples

Check out the [examples](../../examples/create-order) directory for complete examples of creating and posting orders.

## Requirements

- Node.js >= 22.x or Bun >= 1.3.x
- TypeScript >= 5.x (for development)

## License

This project is licensed under the [MIT License](./LICENSE)
