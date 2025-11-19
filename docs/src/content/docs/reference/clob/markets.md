---
title: Markets
description: Query available markets and market data
---

Market operations allow you to query available markets and retrieve market information from the CLOB API.

## Methods

### List Markets

Get all available markets:

```typescript
const markets = await client.market.list();
```

**Returns**: `Market[]`

### Get Market by Condition ID

Retrieve a specific market by its condition ID:

```typescript
const market = await client.market.get({
  conditionId: "your-condition-id"
});
```

**Parameters:**
- `conditionId` (string): The unique condition ID for the market

**Returns**: `Market`

## Market Type

```typescript
interface Market {
  conditionId: string;
  questionId: string;
  question: string;
  description: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  tokens: Token[];
  // ... additional fields
}

interface Token {
  tokenId: string;
  outcome: string;
  price: string;
  // ... additional fields
}
```

## Example Usage

### List All Markets

```typescript
import { Clob, createConnectedWallet } from "@dicedhq/clob";

const wallet = createConnectedWallet({
  privateKey: process.env.PRIVATE_KEY,
  chain: "polygon",
});

const credentials = {
  key: process.env.POLYMARKET_API_KEY,
  secret: process.env.POLYMARKET_SECRET,
  passphrase: process.env.POLYMARKET_PASSPHRASE,
};

const client = new Clob({ wallet, credentials });

// Get all markets
const markets = await client.market.list();

console.log(`Found ${markets.length} markets`);

// Filter active markets
const activeMarkets = markets.filter(m => m.active && !m.closed);
console.log(`${activeMarkets.length} active markets`);
```

### Get Specific Market

```typescript
// Get a specific market by condition ID
const market = await client.market.get({
  conditionId: "0x1234567890abcdef..."
});

console.log(`Market: ${market.question}`);
console.log(`Outcomes: ${market.outcomes.join(", ")}`);
console.log(`Current prices: ${market.outcomePrices.join(", ")}`);
```

### Find Markets by Keyword

```typescript
// Get all markets and search by keyword
const markets = await client.market.list();

const keyword = "election";
const matchingMarkets = markets.filter(m =>
  m.question.toLowerCase().includes(keyword.toLowerCase())
);

console.log(`Found ${matchingMarkets.length} markets matching "${keyword}"`);
```

## Error Handling

```typescript
import { ApiError, NetworkError } from "@dicedhq/clob";

try {
  const markets = await client.market.list();
} catch (error) {
  if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Retry logic
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [CLOB Overview](/reference/clob/overview)
- [Order Book](/reference/clob/order-book)
- [Orders](/reference/clob/orders)
