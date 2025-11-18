---
title: Positions
description: View your current positions in markets
---

Position operations allow you to query your current positions across all markets, including the quantity held, average entry price, and unrealized profit/loss.

## Methods

### Get Positions

Retrieve your current positions:

```typescript
const positions = await client.position.list();
```

**Returns**: `Position[]`

## Position Type

```typescript
interface Position {
  marketId: string;
  tokenId: string;
  outcome: string;
  side: "LONG" | "SHORT";
  quantity: string;
  averagePrice: string;
  currentPrice: string;
  unrealizedPnL: string;
  realizedPnL: string;
  // ... additional fields
}
```

## Example Usage

### List All Positions

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

// Get all positions
const positions = await client.position.list();

console.log(`You have ${positions.length} open positions`);

for (const position of positions) {
  console.log(`\nPosition in market ${position.marketId}:`);
  console.log(`  Outcome: ${position.outcome}`);
  console.log(`  Side: ${position.side}`);
  console.log(`  Quantity: ${position.quantity}`);
  console.log(`  Average Price: ${position.averagePrice}`);
  console.log(`  Current Price: ${position.currentPrice}`);
  console.log(`  Unrealized P&L: ${position.unrealizedPnL}`);
}
```

### Calculate Total P&L

```typescript
const positions = await client.position.list();

// Calculate total unrealized P&L
const totalUnrealizedPnL = positions.reduce(
  (sum, position) => sum + parseFloat(position.unrealizedPnL),
  0
);

// Calculate total realized P&L
const totalRealizedPnL = positions.reduce(
  (sum, position) => sum + parseFloat(position.realizedPnL),
  0
);

const totalPnL = totalUnrealizedPnL + totalRealizedPnL;

console.log(`Total Unrealized P&L: ${totalUnrealizedPnL.toFixed(2)}`);
console.log(`Total Realized P&L: ${totalRealizedPnL.toFixed(2)}`);
console.log(`Total P&L: ${totalPnL.toFixed(2)}`);
```

### Filter Positions by Side

```typescript
const positions = await client.position.list();

// Get all long positions
const longPositions = positions.filter(p => p.side === "LONG");

// Get all short positions
const shortPositions = positions.filter(p => p.side === "SHORT");

console.log(`Long positions: ${longPositions.length}`);
console.log(`Short positions: ${shortPositions.length}`);

// Calculate P&L for long positions only
const longPnL = longPositions.reduce(
  (sum, position) => sum + parseFloat(position.unrealizedPnL),
  0
);

console.log(`Long positions P&L: ${longPnL.toFixed(2)}`);
```

### Find Profitable Positions

```typescript
const positions = await client.position.list();

// Filter positions with positive unrealized P&L
const profitablePositions = positions.filter(
  p => parseFloat(p.unrealizedPnL) > 0
);

// Filter positions with negative unrealized P&L
const losingPositions = positions.filter(
  p => parseFloat(p.unrealizedPnL) < 0
);

console.log(`Profitable positions: ${profitablePositions.length}`);
console.log(`Losing positions: ${losingPositions.length}`);

// Show most profitable position
if (profitablePositions.length > 0) {
  const mostProfitable = profitablePositions.reduce((prev, current) =>
    parseFloat(current.unrealizedPnL) > parseFloat(prev.unrealizedPnL)
      ? current
      : prev
  );

  console.log(`\nMost profitable position:`);
  console.log(`  Outcome: ${mostProfitable.outcome}`);
  console.log(`  P&L: ${mostProfitable.unrealizedPnL}`);
}
```

### Calculate Position Value

```typescript
const positions = await client.position.list();

for (const position of positions) {
  const quantity = parseFloat(position.quantity);
  const currentPrice = parseFloat(position.currentPrice);
  const averagePrice = parseFloat(position.averagePrice);

  // Current value of position
  const currentValue = quantity * currentPrice;

  // Cost basis
  const costBasis = quantity * averagePrice;

  // Calculate return percentage
  const returnPct = ((currentPrice - averagePrice) / averagePrice) * 100;

  console.log(`Position: ${position.outcome}`);
  console.log(`  Cost Basis: $${costBasis.toFixed(2)}`);
  console.log(`  Current Value: $${currentValue.toFixed(2)}`);
  console.log(`  Return: ${returnPct.toFixed(2)}%`);
  console.log();
}
```

### Monitor Position Changes

```typescript
async function monitorPositions(intervalMs: number = 30000) {
  let previousPositions = await client.position.list();

  while (true) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    const currentPositions = await client.position.list();

    // Check for new positions
    for (const position of currentPositions) {
      const previous = previousPositions.find(
        p => p.tokenId === position.tokenId
      );

      if (!previous) {
        console.log(`New position opened: ${position.outcome}`);
      } else {
        // Check for quantity changes
        const quantityChange = parseFloat(position.quantity) -
          parseFloat(previous.quantity);

        if (quantityChange !== 0) {
          console.log(`Position ${position.outcome} quantity changed by ${quantityChange}`);
        }

        // Check for P&L changes
        const pnlChange = parseFloat(position.unrealizedPnL) -
          parseFloat(previous.unrealizedPnL);

        if (Math.abs(pnlChange) > 0.01) {
          console.log(`Position ${position.outcome} P&L changed by ${pnlChange.toFixed(2)}`);
        }
      }
    }

    // Check for closed positions
    for (const previous of previousPositions) {
      const current = currentPositions.find(
        p => p.tokenId === previous.tokenId
      );

      if (!current) {
        console.log(`Position closed: ${previous.outcome}`);
      }
    }

    previousPositions = currentPositions;
  }
}

// Start monitoring
monitorPositions(30000); // Check every 30 seconds
```

### Get Position for Specific Market

```typescript
const positions = await client.position.list();

const marketId = "0xabcdef1234567890...";
const marketPosition = positions.find(p => p.marketId === marketId);

if (marketPosition) {
  console.log(`Position found for market ${marketId}:`);
  console.log(`  Outcome: ${marketPosition.outcome}`);
  console.log(`  Quantity: ${marketPosition.quantity}`);
  console.log(`  P&L: ${marketPosition.unrealizedPnL}`);
} else {
  console.log(`No position found for market ${marketId}`);
}
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
  const positions = await client.position.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited, retry after:", error.retryAfter);
    // Wait and retry
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Retry with backoff
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [CLOB Overview](/reference/clob/overview)
- [Orders](/reference/clob/orders)
- [Trades](/reference/clob/trades)
