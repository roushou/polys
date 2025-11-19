---
title: Gamma Overview
description: Overview of the Gamma API client for market data and events
---

The Gamma API client provides read-only access to Polymarket's market data, events, sports information, and tags. No authentication is required for accessing public market data.

## Installation

```bash
npm install @dicedhq/gamma
```

## Client Initialization

```typescript
import { Gamma } from "@dicedhq/gamma";

// Initialize the client (no authentication required)
const client = new Gamma();
```

## Configuration Options

```typescript
interface GammaConfig {
  debug?: boolean;   // Enable debug logging
  retries?: number;  // Number of automatic retries
}
```

## Available Operations

The Gamma client provides the following operation groups:

- **[Markets](/reference/gamma/markets)** - Query market data and CLOB-tradable markets
- **[Events](/reference/gamma/events)** - Access events and event collections
- **[Sports](/reference/gamma/sports)** - Query sports information
- **[Tags](/reference/gamma/tags)** - Browse and filter by tags

## Features

- **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- **Error Handling**: Robust error handling with custom error types
- **Automatic Retries**: Built-in retry logic for failed requests
- **Rate Limiting**: Automatic handling of rate limit errors
- **No Authentication**: Public read-only access to market data

## Requirements

- Node.js >= 22.x or Bun >= 1.3.x
- TypeScript >= 5.x (for development)

## Examples

Check out the [gamma-markets example](https://github.com/roushou/polys/tree/main/examples/gamma-markets) for complete working examples.

## See Also

- [Getting Started Guide](/guides/getting-started)
- [CLOB API Reference](/reference/clob/overview)
- [Error Handling Guide](/guides/error-handling)
