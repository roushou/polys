# @dicedhq/polymarket

A TypeScript client for the Polymarket API that combines both CLOB (order book) and Gamma (market data) clients in a single package for convenience.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

## Features

- [x] **Unified API**: Access both CLOB and Gamma APIs from a single client
- [x] **CLOB API Support**: Trade on Polymarket's order book via [@dicedhq/clob](../clob)
- [x] **Gamma API Support**: Access market data, events, and sports information via [@dicedhq/gamma](../gamma)
- [x] **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- [x] **Error Handling**: Robust error handling with custom error types
- [x] **Automatic Retries**: Built-in retry logic for failed requests
- [x] **Rate Limiting**: Automatic handling of rate limit errors
- [x] **Authentication**: HMAC-SHA256 signature authentication for private endpoints
- [ ] **Real-time WebSocket Support**: Subscribe to live order book and trade updates (coming soon)

> **Note**: If you only need CLOB or Gamma functionality, you can install the individual packages:
> - `npm install @dicedhq/clob viem` - For CLOB API only
> - `npm install @dicedhq/gamma` - For Gamma API only

## Installation

```bash
npm install @dicedhq/polymarket viem
```

## Quick Start

### Initialize the Client

```typescript
import { Polymarket, createConnectedWallet } from "@dicedhq/polymarket";

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
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
  },
  debug: true, // Optional: enable debug logging
});
```

### Using the CLOB API

The CLOB (Central Limit Order Book) API allows you to trade on Polymarket's order book.

```typescript
// Get current markets
const markets = await client.clob.market.list();

// Get order book for a specific market
const orderBook = await client.clob.book.getOrderBook({ tokenId: "..." });

// Create and post an order
const order = await client.clob.order.createOrder({
  price: 0.5,
  side: "BUY",
  size: 10,
  tokenId: "...",
  expiration: 1000000000,
  taker: "public",
});

// Get your open orders
const openOrders = await client.clob.order.list();

// Cancel an order
await client.clob.order.cancel({ orderId: "..." });
```

### Using the Gamma API

The Gamma API provides access to market data, events, and sports information.

```typescript
// Get current active markets
const currentMarkets = await client.gamma.market.listCurrent({ limit: 10 });

// Get CLOB-tradable markets
const tradableMarkets = await client.gamma.market.listClobTradable({ limit: 10 });

// Get active events
const events = await client.gamma.event.list({
  archived: false,
  active: true,
  closed: false,
  limit: 10,
});

// Get sports information
const sports = await client.gamma.sport.list();

// Get tags
const tags = await client.gamma.tag.list({ limit: 10 });
```

## Advanced Configuration

### Using with a Signing Server

For production environments, you can use an external signing server (attributor):

```typescript
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
    attributor: {
      url: "https://your-signing-server.com/api/sign",
      token: "your-bearer-token",
    },
  },
});
```

### Standalone Clients

You can also use the CLOB and Gamma clients independently by installing the separate packages:

```typescript
// Install separate packages
// npm install @dicedhq/clob @dicedhq/gamma

import { ClobClient } from "@dicedhq/clob";
import { GammaClient } from "@dicedhq/gamma";

// CLOB client only
const clobClient = new ClobClient({
  wallet,
  credentials,
});

// Gamma client only (no authentication required for read-only access)
const gammaClient = new GammaClient();
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
} from "@dicedhq/polymarket";

try {
  const markets = await client.clob.market.list();
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

Check out the [examples](../../examples) directory for more complete examples:

- [Create Order](../../examples/create-order) - Complete example of creating and posting orders
- [Gamma Markets](../../examples/gamma-markets) - Examples of querying market data with the Gamma API

## Requirements

- Node.js >= 22.x or Bun >= 1.3.x
- TypeScript >= 5.x (for development)

## License

This project is licensed under the [MIT License](./LICENSE)
