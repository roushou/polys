---
title: Holders
description: Query top holders for markets
---

The Holders API provides access to top holders data for Polymarket markets.

## List Holders

Get top holders for specific markets.

```typescript
const holders = await client.holders.listHolders({
  market: "0x1234...",
  limit: 100,
  minBalance: 10,
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `market` | string | required | Comma-separated condition IDs |
| `limit` | number | 100 | Max results (0-500) |
| `minBalance` | number | 1 | Minimum balance threshold (0-999999) |

### Response

```typescript
type MarketHolders = {
  token: string;
  holders: Holder[];
};

type Holder = {
  proxyWallet: string;
  bio?: string;
  asset?: string;
  pseudonym?: string;
  amount: number;
  displayUsernamePublic?: boolean;
  outcomeIndex: number;
  name?: string;
  profileImage?: string;
  profileImageOptimized?: string;
};
```

## Example

Get top 50 holders with at least 100 tokens:

```typescript
import { Data } from "@dicedhq/data";

const client = new Data();

const result = await client.holders.listHolders({
  market: "0xabc123...",
  limit: 50,
  minBalance: 100,
});

console.log(`Token: ${result.token}`);
for (const holder of result.holders) {
  console.log(`${holder.pseudonym ?? holder.proxyWallet}: ${holder.amount}`);
}
```
