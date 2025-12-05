---
title: Builders
description: Access builder leaderboard and volume data
---

The Builders API provides access to Polymarket's builder leaderboard and volume analytics.

## Get Leaderboard

Get the aggregated builder leaderboard.

```typescript
const leaderboard = await client.builders.leaderboard({
  timePeriod: "week",
  limit: 25,
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timePeriod` | TimePeriod | required | Time period to aggregate |
| `limit` | number | 25 | Max results |
| `offset` | number | 0 | Pagination offset |

### Time Periods

```typescript
type TimePeriod = "day" | "week" | "month" | "all";
```

### Response

```typescript
type Builder = {
  rank: string;
  builder: string;
  volume: number;
  activeUsers: number;
  verified: boolean;
  builderLogo?: string;
};
```

## Get Volume Time Series

Get daily time-series volume data with multiple entries per builder (one per day).

```typescript
const volumeData = await client.builders.volume("month");
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `timePeriod` | TimePeriod | Time period for the time series |

### Response

Returns an array of `Builder` objects with daily data points.

## Examples

### Weekly Leaderboard

```typescript
import { Data } from "@dicedhq/data";

const client = new Data();

const leaderboard = await client.builders.leaderboard({
  timePeriod: "week",
  limit: 10,
});

console.log("Top 10 Builders This Week:");
for (const builder of leaderboard) {
  const verified = builder.verified ? " (verified)" : "";
  console.log(`#${builder.rank} ${builder.builder}${verified}`);
  console.log(`  Volume: $${builder.volume.toLocaleString()}`);
  console.log(`  Active Users: ${builder.activeUsers}`);
}
```

### Monthly Volume Trends

```typescript
import { Data } from "@dicedhq/data";

const client = new Data();

const volumeData = await client.builders.volume("month");

// Group by builder
const builderVolumes = new Map<string, number[]>();
for (const entry of volumeData) {
  const volumes = builderVolumes.get(entry.builder) ?? [];
  volumes.push(entry.volume);
  builderVolumes.set(entry.builder, volumes);
}

// Calculate total volume per builder
for (const [builder, volumes] of builderVolumes) {
  const total = volumes.reduce((sum, v) => sum + v, 0);
  console.log(`${builder}: $${total.toLocaleString()}`);
}
```
