---
title: Data API Overview
description: Overview of the Data API client for user positions, trades, and analytics
---

The Data API client provides read-only access to Polymarket's user data, including positions, trades, activity history, and market analytics. No authentication is required for accessing public data.

## Installation

```bash
npm install @dicedhq/data
```

## Client Initialization

```typescript
import { Data } from "@dicedhq/data";

// Initialize the client (no authentication required)
const client = new Data();
```

## Configuration Options

```typescript
interface DataConfig {
  debug?: boolean;   // Enable debug logging
  retries?: number;  // Number of automatic retries
}
```

## Available Operations

The Data client provides the following operation groups:

- **[Users](/reference/data/users)** - Query user positions, trades, activity, and closed positions
- **[Holders](/reference/data/holders)** - Get top holders for markets
- **[Builders](/reference/data/builders)** - Access builder leaderboard and volume data

### Miscellaneous

The client also provides additional utility methods:

```typescript
// Get open interest for markets
const openInterest = await client.misc.getOpenInterest("0x...");

// Get live volume for an event
const liveVolume = await client.misc.getEventLiveVolume(12345);
```

## Features

- **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- **Error Handling**: Robust error handling with custom error types
- **Automatic Retries**: Built-in retry logic for failed requests
- **Rate Limiting**: Automatic handling of rate limit errors
- **No Authentication**: Public read-only access to user and market data

## Requirements

- Node.js >= 22.x or Bun >= 1.3.x
- TypeScript >= 5.x (for development)

## See Also

- [CLOB API Reference](/reference/clob/overview)
- [Gamma API Reference](/reference/gamma/overview)
- [Error Handling Guide](/guides/error-handling)
