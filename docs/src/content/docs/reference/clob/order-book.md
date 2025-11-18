---
title: Order Book
description: Access order book data for markets
---

Order book operations allow you to retrieve the current state of the order book for specific markets, including bid and ask orders.

## Methods

### Get Order Book

Retrieve the order book for a specific token:

```typescript
const orderBook = await client.book.getOrderBook({
  tokenId: "your-token-id"
});
```

**Parameters:**
- `tokenId` (string): The token ID for the market outcome

**Returns**: `OrderBook`

## OrderBook Type

```typescript
interface OrderBook {
  bids: OrderBookEntry[];  // Buy orders, sorted by price (highest first)
  asks: OrderBookEntry[];  // Sell orders, sorted by price (lowest first)
  timestamp: number;
}

interface OrderBookEntry {
  price: string;    // Price per share
  size: string;     // Total size at this price level
  orders: number;   // Number of orders at this price
}
```

## Example Usage

### Get Order Book for a Market

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

// Get order book for a specific token
const orderBook = await client.book.getOrderBook({
  tokenId: "0x1234567890abcdef..."
});

console.log("Order Book:");
console.log("Bids (Buy Orders):");
orderBook.bids.forEach(bid => {
  console.log(`  ${bid.price} - ${bid.size} shares (${bid.orders} orders)`);
});

console.log("\nAsks (Sell Orders):");
orderBook.asks.forEach(ask => {
  console.log(`  ${ask.price} - ${ask.size} shares (${ask.orders} orders)`);
});
```

### Get Best Bid and Ask

```typescript
const orderBook = await client.book.getOrderBook({
  tokenId: "0x1234567890abcdef..."
});

// Best bid (highest buy price)
const bestBid = orderBook.bids[0];
console.log(`Best bid: ${bestBid.price} for ${bestBid.size} shares`);

// Best ask (lowest sell price)
const bestAsk = orderBook.asks[0];
console.log(`Best ask: ${bestAsk.price} for ${bestAsk.size} shares`);

// Spread
const spread = parseFloat(bestAsk.price) - parseFloat(bestBid.price);
console.log(`Spread: ${spread.toFixed(4)}`);
```

### Calculate Market Depth

```typescript
const orderBook = await client.book.getOrderBook({
  tokenId: "0x1234567890abcdef..."
});

// Calculate total bid volume
const totalBidVolume = orderBook.bids.reduce(
  (sum, bid) => sum + parseFloat(bid.size),
  0
);

// Calculate total ask volume
const totalAskVolume = orderBook.asks.reduce(
  (sum, ask) => sum + parseFloat(ask.size),
  0
);

console.log(`Total bid volume: ${totalBidVolume}`);
console.log(`Total ask volume: ${totalAskVolume}`);
console.log(`Bid/Ask ratio: ${(totalBidVolume / totalAskVolume).toFixed(2)}`);
```

### Find Liquidity at Price Level

```typescript
const orderBook = await client.book.getOrderBook({
  tokenId: "0x1234567890abcdef..."
});

const targetPrice = "0.55";

// Find bids at or above target price
const bidsAbovePrice = orderBook.bids.filter(
  bid => parseFloat(bid.price) >= parseFloat(targetPrice)
);

const liquidityAbovePrice = bidsAbovePrice.reduce(
  (sum, bid) => sum + parseFloat(bid.size),
  0
);

console.log(`Liquidity at or above ${targetPrice}: ${liquidityAbovePrice} shares`);
```

## Polling for Updates

Since the order book changes frequently, you may want to poll for updates:

```typescript
async function pollOrderBook(tokenId: string, intervalMs: number = 5000) {
  while (true) {
    try {
      const orderBook = await client.book.getOrderBook({ tokenId });

      console.log(`[${new Date().toISOString()}]`);
      console.log(`Best bid: ${orderBook.bids[0]?.price || "N/A"}`);
      console.log(`Best ask: ${orderBook.asks[0]?.price || "N/A"}`);

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    } catch (error) {
      console.error("Error fetching order book:", error);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
}

// Start polling
pollOrderBook("0x1234567890abcdef...", 5000);
```

## Error Handling

```typescript
import { ApiError, NetworkError, ValidationError } from "@dicedhq/clob";

try {
  const orderBook = await client.book.getOrderBook({
    tokenId: "0x1234567890abcdef..."
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Invalid token ID:", error.message);
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Retry logic
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [CLOB Overview](/reference/clob/overview)
- [Markets](/reference/clob/markets)
- [Orders](/reference/clob/orders)
