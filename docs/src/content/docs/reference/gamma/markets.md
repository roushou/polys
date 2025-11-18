---
title: Markets
description: Query market data and CLOB-tradable markets
---

Market operations allow you to retrieve current market data, including prices, volumes, and market status.

## Methods

### List Current Markets

Get currently active markets:

```typescript
const markets = await client.market.listCurrent({
  limit: 10,
  offset: 0,
});
```

**Parameters:**
- `limit` (number, optional): Maximum number of markets to return
- `offset` (number, optional): Number of markets to skip for pagination

**Returns**: `Market[]`

### List CLOB-Tradable Markets

Get markets that are tradable on the CLOB:

```typescript
const tradableMarkets = await client.market.listClobTradable({
  limit: 10,
  offset: 0,
});
```

**Parameters:**
- `limit` (number, optional): Maximum number of markets to return
- `offset` (number, optional): Number of markets to skip for pagination

**Returns**: `Market[]`

### Get Market by Condition ID

Retrieve detailed information about a specific market:

```typescript
const market = await client.market.get({
  conditionId: "your-condition-id"
});
```

**Parameters:**
- `conditionId` (string): The unique condition ID for the market

**Returns**: `Market`

### Get Market by Slug

Retrieve a market using its URL-friendly slug:

```typescript
const market = await client.market.getBySlug({
  slug: "market-slug"
});
```

**Parameters:**
- `slug` (string): The URL-friendly slug for the market

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
  liquidity: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  slug: string;
  tokens: Token[];
  // ... additional fields
}

interface Token {
  tokenId: string;
  outcome: string;
  price: string;
  winner: boolean;
  // ... additional fields
}
```

## Example Usage

### List Current Markets

```typescript
import { Gamma } from "@dicedhq/gamma";

const client = new Gamma();

// Get first 20 current markets
const markets = await client.market.listCurrent({ limit: 20 });

console.log(`Found ${markets.length} active markets`);

for (const market of markets) {
  console.log(`\nMarket: ${market.question}`);
  console.log(`  Outcomes: ${market.outcomes.join(", ")}`);
  console.log(`  Prices: ${market.outcomePrices.join(", ")}`);
  console.log(`  Volume: $${parseFloat(market.volume).toLocaleString()}`);
}
```

### Get CLOB-Tradable Markets

```typescript
// Get markets available for trading on CLOB
const tradableMarkets = await client.market.listClobTradable({ limit: 10 });

console.log(`${tradableMarkets.length} tradable markets`);

// Filter by minimum volume
const minVolume = 10000;
const highVolumeMarkets = tradableMarkets.filter(
  m => parseFloat(m.volume) >= minVolume
);

console.log(`${highVolumeMarkets.length} markets with volume >= $${minVolume}`);
```

### Pagination

```typescript
// Fetch markets with pagination
const pageSize = 50;
let offset = 0;
let allMarkets: Market[] = [];

while (true) {
  const markets = await client.market.listCurrent({
    limit: pageSize,
    offset: offset,
  });

  if (markets.length === 0) break;

  allMarkets = allMarkets.concat(markets);
  offset += pageSize;

  console.log(`Fetched ${allMarkets.length} markets so far...`);

  // Optional: break after certain number
  if (allMarkets.length >= 200) break;
}

console.log(`Total markets fetched: ${allMarkets.length}`);
```

### Get Market by Condition ID

```typescript
// Get specific market by condition ID
const market = await client.market.get({
  conditionId: "0x1234567890abcdef..."
});

console.log(`Market: ${market.question}`);
console.log(`Description: ${market.description}`);
console.log(`Status: ${market.active ? "Active" : "Closed"}`);
console.log(`Total Volume: $${parseFloat(market.volume).toLocaleString()}`);
console.log(`Liquidity: $${parseFloat(market.liquidity).toLocaleString()}`);

// Show token information
for (const token of market.tokens) {
  console.log(`\nToken: ${token.outcome}`);
  console.log(`  ID: ${token.tokenId}`);
  console.log(`  Price: ${token.price}`);
  console.log(`  Winner: ${token.winner ? "Yes" : "No"}`);
}
```

### Get Market by Slug

```typescript
// Get market using URL slug
const market = await client.market.getBySlug({
  slug: "will-bitcoin-reach-100k-by-2025"
});

console.log(`Market: ${market.question}`);
console.log(`URL: https://polymarket.com/event/${market.slug}`);
```

### Search Markets by Keyword

```typescript
// Get all current markets and search
const markets = await client.market.listCurrent({ limit: 100 });

const keyword = "election";
const matchingMarkets = markets.filter(m =>
  m.question.toLowerCase().includes(keyword.toLowerCase()) ||
  m.description.toLowerCase().includes(keyword.toLowerCase())
);

console.log(`Found ${matchingMarkets.length} markets matching "${keyword}"`);

for (const market of matchingMarkets) {
  console.log(`- ${market.question}`);
}
```

### Sort Markets by Volume

```typescript
const markets = await client.market.listCurrent({ limit: 50 });

// Sort by volume (highest first)
const sortedByVolume = markets.sort(
  (a, b) => parseFloat(b.volume) - parseFloat(a.volume)
);

console.log("Top 10 markets by volume:");
sortedByVolume.slice(0, 10).forEach((market, index) => {
  const volume = parseFloat(market.volume);
  console.log(`${index + 1}. ${market.question}`);
  console.log(`   Volume: $${volume.toLocaleString()}`);
});
```

### Find Markets with Close Prices

```typescript
const markets = await client.market.listCurrent({ limit: 50 });

// Find markets where outcomes are close (e.g., within 10% of 0.5)
const closePriceMarkets = markets.filter(market => {
  const prices = market.outcomePrices.map(p => parseFloat(p));
  // Check if any price is between 0.45 and 0.55
  return prices.some(price => price >= 0.45 && price <= 0.55);
});

console.log(`Found ${closePriceMarkets.length} markets with close prices`);

for (const market of closePriceMarkets) {
  console.log(`\n${market.question}`);
  market.outcomes.forEach((outcome, i) => {
    console.log(`  ${outcome}: ${market.outcomePrices[i]}`);
  });
}
```

### Filter Markets by Date Range

```typescript
const markets = await client.market.listCurrent({ limit: 100 });

// Filter markets ending within the next 7 days
const sevenDaysFromNow = new Date();
sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

const endingSoon = markets.filter(market => {
  const endDate = new Date(market.endDate);
  return endDate <= sevenDaysFromNow && endDate >= new Date();
});

console.log(`${endingSoon.length} markets ending in the next 7 days`);

// Sort by end date
endingSoon.sort((a, b) =>
  new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
);

for (const market of endingSoon) {
  const daysUntilEnd = Math.ceil(
    (new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  console.log(`${market.question} (${daysUntilEnd} days remaining)`);
}
```

### Calculate Market Statistics

```typescript
const markets = await client.market.listCurrent({ limit: 100 });

// Calculate total volume across all markets
const totalVolume = markets.reduce(
  (sum, market) => sum + parseFloat(market.volume),
  0
);

// Calculate average volume
const avgVolume = totalVolume / markets.length;

// Find market with highest liquidity
const highestLiquidity = markets.reduce((prev, current) =>
  parseFloat(current.liquidity) > parseFloat(prev.liquidity)
    ? current
    : prev
);

console.log(`Total Volume: $${totalVolume.toLocaleString()}`);
console.log(`Average Volume: $${avgVolume.toLocaleString()}`);
console.log(`\nHighest Liquidity Market:`);
console.log(`  ${highestLiquidity.question}`);
console.log(`  Liquidity: $${parseFloat(highestLiquidity.liquidity).toLocaleString()}`);
```

## Error Handling

```typescript
import {
  ApiError,
  NetworkError,
  ValidationError,
  RateLimitError
} from "@dicedhq/gamma";

try {
  const markets = await client.market.listCurrent({ limit: 10 });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error("Rate limited, retry after:", error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [Gamma Overview](/reference/gamma/overview)
- [Events](/reference/gamma/events)
- [Sports](/reference/gamma/sports)
