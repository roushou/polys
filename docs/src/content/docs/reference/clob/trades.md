---
title: Trades
description: Query your trade history
---

Trade operations allow you to retrieve your historical trades, including filled orders, execution prices, and fees.

## Methods

### Get Trades

Retrieve your trade history:

```typescript
const trades = await client.trade.list();
```

Get trades for a specific market:

```typescript
const trades = await client.trade.list({
  marketId: "specific-market-id",
});
```

**Parameters:**
- `marketId` (string, optional): Filter trades by specific market

**Returns**: `Trade[]`

## Trade Type

```typescript
interface Trade {
  tradeId: string;
  orderId: string;
  marketId: string;
  tokenId: string;
  side: "BUY" | "SELL";
  price: string;
  size: string;
  fee: string;
  timestamp: number;
  makerAddress: string;
  takerAddress: string;
  // ... additional fields
}
```

## Example Usage

### List All Trades

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

// Get all trades
const trades = await client.trade.list();

console.log(`You have ${trades.length} trades in your history`);

for (const trade of trades) {
  const date = new Date(trade.timestamp * 1000);
  console.log(`\nTrade ${trade.tradeId}:`);
  console.log(`  Date: ${date.toISOString()}`);
  console.log(`  Side: ${trade.side}`);
  console.log(`  Price: ${trade.price}`);
  console.log(`  Size: ${trade.size}`);
  console.log(`  Fee: ${trade.fee}`);
}
```

### Get Trades for Specific Market

```typescript
// Get trades for a specific market
const marketTrades = await client.trade.list({
  marketId: "0xabcdef1234567890...",
});

console.log(`${marketTrades.length} trades for this market`);

// Calculate total volume
const totalVolume = marketTrades.reduce(
  (sum, trade) => sum + parseFloat(trade.size),
  0
);

console.log(`Total volume: ${totalVolume}`);
```

### Calculate Trading Statistics

```typescript
const trades = await client.trade.list();

// Separate buy and sell trades
const buyTrades = trades.filter(t => t.side === "BUY");
const sellTrades = trades.filter(t => t.side === "SELL");

console.log(`Buy trades: ${buyTrades.length}`);
console.log(`Sell trades: ${sellTrades.length}`);

// Calculate total fees paid
const totalFees = trades.reduce(
  (sum, trade) => sum + parseFloat(trade.fee),
  0
);

console.log(`Total fees paid: ${totalFees.toFixed(4)}`);

// Calculate average trade size
const averageTradeSize = trades.reduce(
  (sum, trade) => sum + parseFloat(trade.size),
  0
) / trades.length;

console.log(`Average trade size: ${averageTradeSize.toFixed(2)}`);
```

### Calculate Realized P&L

```typescript
const trades = await client.trade.list();

// Group trades by market
const tradesByMarket = trades.reduce((acc, trade) => {
  if (!acc[trade.marketId]) {
    acc[trade.marketId] = [];
  }
  acc[trade.marketId].push(trade);
  return acc;
}, {} as Record<string, typeof trades>);

// Calculate P&L for each market
for (const [marketId, marketTrades] of Object.entries(tradesByMarket)) {
  const buys = marketTrades.filter(t => t.side === "BUY");
  const sells = marketTrades.filter(t => t.side === "SELL");

  // Calculate total buy cost
  const buyVolume = buys.reduce((sum, t) => sum + parseFloat(t.size), 0);
  const buyCost = buys.reduce(
    (sum, t) => sum + parseFloat(t.price) * parseFloat(t.size),
    0
  );
  const avgBuyPrice = buyVolume > 0 ? buyCost / buyVolume : 0;

  // Calculate total sell proceeds
  const sellVolume = sells.reduce((sum, t) => sum + parseFloat(t.size), 0);
  const sellProceeds = sells.reduce(
    (sum, t) => sum + parseFloat(t.price) * parseFloat(t.size),
    0
  );
  const avgSellPrice = sellVolume > 0 ? sellProceeds / sellVolume : 0;

  // Calculate fees
  const totalFees = marketTrades.reduce(
    (sum, t) => sum + parseFloat(t.fee),
    0
  );

  // Calculate realized P&L (for closed positions)
  const closedVolume = Math.min(buyVolume, sellVolume);
  const realizedPnL = closedVolume * (avgSellPrice - avgBuyPrice) - totalFees;

  console.log(`\nMarket ${marketId}:`);
  console.log(`  Trades: ${marketTrades.length}`);
  console.log(`  Buy volume: ${buyVolume.toFixed(2)} @ ${avgBuyPrice.toFixed(4)}`);
  console.log(`  Sell volume: ${sellVolume.toFixed(2)} @ ${avgSellPrice.toFixed(4)}`);
  console.log(`  Realized P&L: ${realizedPnL.toFixed(4)}`);
  console.log(`  Fees: ${totalFees.toFixed(4)}`);
}
```

### Get Recent Trades

```typescript
const trades = await client.trade.list();

// Get trades from the last 24 hours
const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
const recentTrades = trades.filter(t => t.timestamp >= oneDayAgo);

console.log(`${recentTrades.length} trades in the last 24 hours`);

// Sort by timestamp (most recent first)
recentTrades.sort((a, b) => b.timestamp - a.timestamp);

// Show last 5 trades
console.log("\nLast 5 trades:");
recentTrades.slice(0, 5).forEach(trade => {
  const date = new Date(trade.timestamp * 1000);
  console.log(`  ${date.toLocaleString()}: ${trade.side} ${trade.size} @ ${trade.price}`);
});
```

### Find Largest Trades

```typescript
const trades = await client.trade.list();

// Find trade with largest size
const largestBySize = trades.reduce((prev, current) =>
  parseFloat(current.size) > parseFloat(prev.size) ? current : prev
);

console.log("Largest trade by size:");
console.log(`  Size: ${largestBySize.size}`);
console.log(`  Price: ${largestBySize.price}`);
console.log(`  Side: ${largestBySize.side}`);

// Find trade with largest value (price * size)
const largestByValue = trades.reduce((prev, current) => {
  const currentValue = parseFloat(current.price) * parseFloat(current.size);
  const prevValue = parseFloat(prev.price) * parseFloat(prev.size);
  return currentValue > prevValue ? current : prev;
});

const largestValue = parseFloat(largestByValue.price) *
  parseFloat(largestByValue.size);

console.log("\nLargest trade by value:");
console.log(`  Value: ${largestValue.toFixed(2)}`);
console.log(`  Price: ${largestByValue.price}`);
console.log(`  Size: ${largestByValue.size}`);
```

### Calculate Average Fill Price

```typescript
const trades = await client.trade.list();

const orderId = "0x9876543210fedcba...";

// Get all trades for a specific order
const orderTrades = trades.filter(t => t.orderId === orderId);

if (orderTrades.length > 0) {
  // Calculate weighted average fill price
  const totalValue = orderTrades.reduce(
    (sum, t) => sum + parseFloat(t.price) * parseFloat(t.size),
    0
  );
  const totalSize = orderTrades.reduce(
    (sum, t) => sum + parseFloat(t.size),
    0
  );
  const avgFillPrice = totalValue / totalSize;

  console.log(`Order ${orderId}:`);
  console.log(`  Fills: ${orderTrades.length}`);
  console.log(`  Total size: ${totalSize.toFixed(2)}`);
  console.log(`  Average fill price: ${avgFillPrice.toFixed(4)}`);
} else {
  console.log(`No trades found for order ${orderId}`);
}
```

### Export Trade History to CSV

```typescript
const trades = await client.trade.list();

// Sort by timestamp
trades.sort((a, b) => a.timestamp - b.timestamp);

// Create CSV header
const csvRows = ["Trade ID,Date,Market,Side,Price,Size,Fee,Order ID"];

// Add trade data
for (const trade of trades) {
  const date = new Date(trade.timestamp * 1000).toISOString();
  csvRows.push([
    trade.tradeId,
    date,
    trade.marketId,
    trade.side,
    trade.price,
    trade.size,
    trade.fee,
    trade.orderId,
  ].join(","));
}

const csv = csvRows.join("\n");

// Save to file or log
console.log(csv);

// In Node.js, you can write to file:
// import { writeFileSync } from 'fs';
// writeFileSync('trades.csv', csv);
```

## Error Handling

```typescript
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  RateLimitError
} from "@dicedhq/clob";

try {
  const trades = await client.trade.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited, retry after:", error.retryAfter);
    await new Promise(resolve =>
      setTimeout(resolve, error.retryAfter * 1000)
    );
    // Retry
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [CLOB Overview](/reference/clob/overview)
- [Orders](/reference/clob/orders)
- [Positions](/reference/clob/positions)
