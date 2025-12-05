---
title: Users
description: Query user positions, trades, activity, and analytics
---

The Users API provides access to user trading data including positions, trades, activity history, and closed positions.

## List Positions

Get current positions for a user.

```typescript
const positions = await client.users.positions({
  user: "0x1234...",
  limit: 100,
  sortBy: "TOKENS",
  sortDirection: "DESC",
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | required | User address |
| `market` | string | - | Comma-separated condition IDs |
| `eventId` | string | - | Comma-separated event IDs |
| `sizeThreshold` | number | 1 | Minimum position size |
| `redeemable` | boolean | false | Filter redeemable positions |
| `mergeable` | boolean | false | Filter mergeable positions |
| `limit` | number | 100 | Max results (0-500) |
| `offset` | number | 0 | Pagination offset (0-10000) |
| `sortBy` | SortBy | "TOKENS" | Sort field |
| `sortDirection` | SortDirection | "DESC" | Sort order |
| `title` | string | - | Filter by title (max 100 chars) |

### Response

```typescript
type Position = {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: number;
  avgPrice: number;
  initialValue: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
  totalBought: number;
  realizedPnl: number;
  percentRealizedPnl: number;
  curPrice: number;
  redeemable: boolean;
  mergeable: boolean;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate?: string;
  negativeRisk: boolean;
};
```

## List Trades

Get trades for a user or markets.

```typescript
const trades = await client.users.listTrades({
  user: "0x1234...",
  limit: 100,
  side: "BUY",
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | - | User address |
| `market` | string | - | Comma-separated condition IDs |
| `eventId` | string | - | Comma-separated event IDs |
| `side` | TradeSide | - | "BUY" or "SELL" |
| `takerOnly` | boolean | true | Only taker trades |
| `filterType` | TradeFilterType | - | "CASH" or "TOKENS" |
| `filterAmount` | number | - | Minimum amount |
| `limit` | number | 100 | Max results (0-10000) |
| `offset` | number | 0 | Pagination offset |

### Response

```typescript
type Trade = {
  proxyWallet: string;
  side: "BUY" | "SELL";
  asset: string;
  conditionId: string;
  size: number;
  price: number;
  timestamp: number;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
  transactionHash?: string;
};
```

## List Activity

Get on-chain activity for a user.

```typescript
const activity = await client.users.listActivity({
  user: "0x1234...",
  type: "TRADE,REDEEM",
  sortBy: "TIMESTAMP",
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | required | User address |
| `market` | string | - | Comma-separated condition IDs |
| `eventId` | string | - | Comma-separated event IDs |
| `type` | string | - | Comma-separated activity types |
| `side` | TradeSide | - | "BUY" or "SELL" |
| `start` | number | - | Start timestamp |
| `end` | number | - | End timestamp |
| `limit` | number | 100 | Max results (0-10000) |
| `offset` | number | 0 | Pagination offset |
| `sortBy` | ActivitySortBy | "TIMESTAMP" | Sort field |
| `sortDirection` | SortDirection | "DESC" | Sort order |

### Activity Types

- `TRADE` - Trade execution
- `SPLIT` - Position split
- `MERGE` - Position merge
- `REDEEM` - Position redemption
- `REWARD` - Reward distribution
- `CONVERSION` - Token conversion

### Response

```typescript
type Activity = {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: ActivityType;
  size: number;
  usdcSize: number;
  transactionHash?: string;
  price?: number;
  asset?: string;
  side?: string;
  outcomeIndex?: number;
  title?: string;
  slug?: string;
  icon?: string;
  outcome?: string;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
};
```

## List Position Values

Get total value of a user's positions.

```typescript
const values = await client.users.listPositionsValues({
  user: "0x1234...",
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | required | User address |
| `market` | string | - | Comma-separated condition IDs |

### Response

```typescript
type PositionValue = {
  user: string;
  value: number;
};
```

## List Closed Positions

Get closed positions for a user.

```typescript
const closedPositions = await client.users.listClosedPositions({
  user: "0x1234...",
  sortBy: "REALIZEDPNL",
  sortDirection: "DESC",
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | required | User address |
| `market` | string | - | Comma-separated condition IDs |
| `eventId` | string | - | Comma-separated event IDs |
| `title` | string | - | Filter by title (max 100 chars) |
| `limit` | number | 10 | Max results (0-50) |
| `offset` | number | 0 | Pagination offset (0-100000) |
| `sortBy` | ClosedPositionSortBy | "REALIZEDPNL" | Sort field |
| `sortDirection` | SortDirection | "DESC" | Sort order |

### Response

```typescript
type ClosedPosition = {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  totalBought: number;
  realizedPnl: number;
  curPrice: number;
  timestamp: number;
  title: string;
  slug: string;
  icon?: string;
  eventSlug?: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate?: string;
};
```

## Get Traded Markets

Get total markets a user has traded.

```typescript
const tradedMarkets = await client.users.getTradedMarkets("0x1234...");
```

### Response

```typescript
type TradedMarkets = {
  user: string;
  traded: number;
};
```

## Types

### SortBy

```typescript
type SortBy =
  | "CURRENT"
  | "INITIAL"
  | "TOKENS"
  | "CASHPNL"
  | "PERCENTPNL"
  | "TITLE"
  | "RESOLVING"
  | "PRICE"
  | "AVGPRICE";
```

### ClosedPositionSortBy

```typescript
type ClosedPositionSortBy =
  | "REALIZEDPNL"
  | "TITLE"
  | "PRICE"
  | "AVGPRICE"
  | "TIMESTAMP";
```

### SortDirection

```typescript
type SortDirection = "ASC" | "DESC";
```
