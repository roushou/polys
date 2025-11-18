---
title: Sports
description: Query sports information
---

Sports operations allow you to retrieve information about sports categories and sports-related markets on Polymarket.

## Methods

### List Sports

Get all available sports:

```typescript
const sports = await client.sport.list();
```

**Returns**: `Sport[]`

### Get Sport by Slug

Retrieve information about a specific sport:

```typescript
const sport = await client.sport.get({
  slug: "sport-slug"
});
```

**Parameters:**
- `slug` (string): The URL-friendly slug for the sport

**Returns**: `Sport`

## Sport Type

```typescript
interface Sport {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  marketCount: number;
  // ... additional fields
}
```

## Example Usage

### List All Sports

```typescript
import { Gamma } from "@dicedhq/gamma";

const client = new Gamma();

// Get all sports
const sports = await client.sport.list();

console.log(`Found ${sports.length} sports`);

for (const sport of sports) {
  console.log(`\nSport: ${sport.title}`);
  console.log(`  Markets: ${sport.marketCount}`);
  console.log(`  Slug: ${sport.slug}`);
}
```

### Get Sport Details

```typescript
// Get specific sport by slug
const sport = await client.sport.get({
  slug: "basketball"
});

console.log(`Sport: ${sport.title}`);
console.log(`Description: ${sport.description}`);
console.log(`Total Markets: ${sport.marketCount}`);
console.log(`URL: https://polymarket.com/sport/${sport.slug}`);
```

### Sort Sports by Market Count

```typescript
const sports = await client.sport.list();

// Sort by number of markets (descending)
const sortedSports = sports.sort(
  (a, b) => b.marketCount - a.marketCount
);

console.log("Sports by popularity (market count):");

sortedSports.forEach((sport, index) => {
  console.log(`${index + 1}. ${sport.title} (${sport.marketCount} markets)`);
});
```

### Find Sports with Most Markets

```typescript
const sports = await client.sport.list();

// Get top 5 sports by market count
const topSports = sports
  .sort((a, b) => b.marketCount - a.marketCount)
  .slice(0, 5);

console.log("Top 5 sports by market count:");

for (const sport of topSports) {
  console.log(`\n${sport.title}:`);
  console.log(`  Markets: ${sport.marketCount}`);
  console.log(`  Slug: ${sport.slug}`);
}
```

### Search Sports by Name

```typescript
const sports = await client.sport.list();

const searchTerm = "ball";
const matchingSports = sports.filter(s =>
  s.title.toLowerCase().includes(searchTerm.toLowerCase())
);

console.log(`Sports matching "${searchTerm}":`);

for (const sport of matchingSports) {
  console.log(`- ${sport.title} (${sport.marketCount} markets)`);
}
```

### Get Sports Statistics

```typescript
const sports = await client.sport.list();

// Calculate total markets across all sports
const totalMarkets = sports.reduce(
  (sum, sport) => sum + sport.marketCount,
  0
);

// Calculate average markets per sport
const avgMarkets = totalMarkets / sports.length;

// Find sport with most/least markets
const mostPopular = sports.reduce((prev, current) =>
  current.marketCount > prev.marketCount ? current : prev
);

const leastPopular = sports.reduce((prev, current) =>
  current.marketCount < prev.marketCount ? current : prev
);

console.log(`Total Sports: ${sports.length}`);
console.log(`Total Markets: ${totalMarkets}`);
console.log(`Average Markets per Sport: ${avgMarkets.toFixed(1)}`);
console.log(`\nMost Popular: ${mostPopular.title} (${mostPopular.marketCount} markets)`);
console.log(`Least Popular: ${leastPopular.title} (${leastPopular.marketCount} markets)`);
```

### Filter Sports by Market Threshold

```typescript
const sports = await client.sport.list();

// Get sports with at least 10 markets
const minMarkets = 10;
const popularSports = sports.filter(s => s.marketCount >= minMarkets);

console.log(`Sports with ${minMarkets}+ markets:`);

for (const sport of popularSports) {
  console.log(`- ${sport.title}: ${sport.marketCount} markets`);
}

console.log(`\nTotal: ${popularSports.length}/${sports.length} sports`);
```

### Compare Sports

```typescript
// Compare specific sports
const sportsToCompare = ["basketball", "football", "baseball"];

const sportDetails = await Promise.all(
  sportsToCompare.map(slug => client.sport.get({ slug }))
);

console.log("Sport Comparison:\n");

sportDetails.forEach(sport => {
  console.log(`${sport.title}:`);
  console.log(`  Markets: ${sport.marketCount}`);
  console.log(`  Description: ${sport.description}`);
  console.log();
});
```

### Group Sports by Category

```typescript
const sports = await client.sport.list();

// Group sports into categories based on market count
const categories = {
  high: sports.filter(s => s.marketCount >= 50),
  medium: sports.filter(s => s.marketCount >= 10 && s.marketCount < 50),
  low: sports.filter(s => s.marketCount < 10),
};

console.log("Sports Categories by Market Count:\n");

console.log(`High Activity (50+ markets): ${categories.high.length} sports`);
categories.high.forEach(s => console.log(`  - ${s.title} (${s.marketCount})`));

console.log(`\nMedium Activity (10-49 markets): ${categories.medium.length} sports`);
categories.medium.forEach(s => console.log(`  - ${s.title} (${s.marketCount})`));

console.log(`\nLow Activity (<10 markets): ${categories.low.length} sports`);
categories.low.forEach(s => console.log(`  - ${s.title} (${s.marketCount})`));
```

### Export Sports Data

```typescript
const sports = await client.sport.list();

// Sort by title alphabetically
sports.sort((a, b) => a.title.localeCompare(b.title));

// Create CSV
const csvRows = ["Sport,Slug,Market Count"];

for (const sport of sports) {
  csvRows.push([
    sport.title,
    sport.slug,
    sport.marketCount.toString(),
  ].join(","));
}

const csv = csvRows.join("\n");
console.log(csv);

// In Node.js, you can write to file:
// import { writeFileSync } from 'fs';
// writeFileSync('sports.csv', csv);
```

### Monitor Sports Growth

```typescript
async function monitorSportsGrowth(intervalMs: number = 3600000) {
  let previousSports = await client.sport.list();

  console.log("Starting sports growth monitoring...");

  while (true) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    const currentSports = await client.sport.list();

    console.log(`\n[${new Date().toISOString()}] Sports Update:`);

    for (const current of currentSports) {
      const previous = previousSports.find(s => s.slug === current.slug);

      if (!previous) {
        console.log(`New sport added: ${current.title}`);
      } else if (current.marketCount > previous.marketCount) {
        const growth = current.marketCount - previous.marketCount;
        console.log(`${current.title}: +${growth} markets (${current.marketCount} total)`);
      }
    }

    previousSports = currentSports;
  }
}

// Monitor every hour
monitorSportsGrowth(3600000);
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
  const sports = await client.sport.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error("Rate limited, retry after:", error.retryAfter);
    await new Promise(resolve =>
      setTimeout(resolve, error.retryAfter * 1000)
    );
    // Retry
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
- [Markets](/reference/gamma/markets)
- [Events](/reference/gamma/events)
