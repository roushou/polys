# @dicedhq/gamma

A TypeScript client for the Polymarket Gamma API for accessing market data, events, and sports information.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

## Features

- [x] **Gamma API Support**: Complete access to Polymarket's market data
- [x] **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- [x] **Error Handling**: Robust error handling with custom error types
- [x] **Automatic Retries**: Built-in retry logic for failed requests
- [x] **Rate Limiting**: Automatic handling of rate limit errors
- [x] **No Authentication Required**: Public read-only access to market data

## Installation

```bash
npm install @dicedhq/gamma
```

## Quick Start

### Initialize the Client

```typescript
import { GammaClient } from "@dicedhq/gamma";

// Initialize the client (no authentication required for read-only access)
const client = new GammaClient({
  debug: true, // Optional: enable debug logging
});
```

### Using the Gamma API

```typescript
// Get current active markets
const currentMarkets = await client.market.listCurrent({ limit: 10 });

// Get CLOB-tradable markets
const tradableMarkets = await client.market.listClobTradable({ limit: 10 });

// Get active events
const events = await client.event.list({
  archived: false,
  active: true,
  closed: false,
  limit: 10,
});

// Get sports information
const sports = await client.sport.list();

// Get tags
const tags = await client.tag.list({ limit: 10 });
```

## Error Handling

The library provides custom error types for better error handling:

```typescript
import {
  ApiError,
  RateLimitError,
  NetworkError,
  ValidationError,
} from "@dicedhq/gamma";

try {
  const markets = await client.market.listCurrent({ limit: 10 });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log("Rate limited, retry after:", error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.log("Network error:", error.message);
  }
}
```

## Examples

Check out the [examples](../../examples/gamma-markets) directory for complete examples of querying market data.

## Requirements

- Node.js >= 22.x or Bun >= 1.3.x
- TypeScript >= 5.x (for development)

## License

This project is licensed under the [MIT License](./LICENSE)
