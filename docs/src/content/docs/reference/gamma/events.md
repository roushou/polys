---
title: Events
description: Access events and event collections
---

Event operations allow you to retrieve event data, which are collections of related markets grouped together.

## Methods

### List Events

Get events with optional filters:

```typescript
const events = await client.event.list({
  archived: false,
  active: true,
  closed: false,
  limit: 10,
  offset: 0,
});
```

**Parameters:**
- `archived` (boolean, optional): Filter by archived status
- `active` (boolean, optional): Filter by active status
- `closed` (boolean, optional): Filter by closed status
- `limit` (number, optional): Maximum number of events to return
- `offset` (number, optional): Number of events to skip for pagination

**Returns**: `Event[]`

### Get Event by Slug

Retrieve detailed information about a specific event:

```typescript
const event = await client.event.get({
  slug: "event-slug"
});
```

**Parameters:**
- `slug` (string): The URL-friendly slug for the event

**Returns**: `Event`

## Event Type

```typescript
interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  markets: Market[];
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  featured: boolean;
  restricted: boolean;
  // ... additional fields
}
```

## Example Usage

### List Active Events

```typescript
import { Gamma } from "@dicedhq/gamma";

const client = new Gamma();

// Get active events
const events = await client.event.list({
  active: true,
  closed: false,
  archived: false,
  limit: 20,
});

console.log(`Found ${events.length} active events`);

for (const event of events) {
  console.log(`\nEvent: ${event.title}`);
  console.log(`  Markets: ${event.markets.length}`);
  console.log(`  Featured: ${event.featured ? "Yes" : "No"}`);
  console.log(`  URL: https://polymarket.com/event/${event.slug}`);
}
```

### Get Event Details

```typescript
// Get specific event by slug
const event = await client.event.get({
  slug: "2024-presidential-election"
});

console.log(`Event: ${event.title}`);
console.log(`Description: ${event.description}`);
console.log(`Status: ${event.active ? "Active" : "Closed"}`);
console.log(`Markets: ${event.markets.length}`);

// List all markets in the event
console.log("\nMarkets:");
for (const market of event.markets) {
  console.log(`- ${market.question}`);
  console.log(`  Volume: $${parseFloat(market.volume).toLocaleString()}`);
}
```

### Pagination Through Events

```typescript
// Fetch all active events with pagination
const pageSize = 50;
let offset = 0;
let allEvents: Event[] = [];

while (true) {
  const events = await client.event.list({
    active: true,
    limit: pageSize,
    offset: offset,
  });

  if (events.length === 0) break;

  allEvents = allEvents.concat(events);
  offset += pageSize;

  console.log(`Fetched ${allEvents.length} events so far...`);

  // Optional: add delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log(`Total events fetched: ${allEvents.length}`);
```

### Filter Events by Status

```typescript
// Get all events
const allEvents = await client.event.list({ limit: 100 });

// Separate by status
const activeEvents = allEvents.filter(e => e.active && !e.closed);
const closedEvents = allEvents.filter(e => e.closed);
const archivedEvents = allEvents.filter(e => e.archived);

console.log(`Active events: ${activeEvents.length}`);
console.log(`Closed events: ${closedEvents.length}`);
console.log(`Archived events: ${archivedEvents.length}`);
```

### Find Featured Events

```typescript
// Get featured events
const events = await client.event.list({
  active: true,
  limit: 50,
});

const featuredEvents = events.filter(e => e.featured);

console.log(`${featuredEvents.length} featured events`);

for (const event of featuredEvents) {
  console.log(`- ${event.title}`);
  console.log(`  Markets: ${event.markets.length}`);
}
```

### Calculate Event Statistics

```typescript
const event = await client.event.get({
  slug: "event-slug"
});

// Calculate total volume across all markets in event
const totalVolume = event.markets.reduce(
  (sum, market) => sum + parseFloat(market.volume),
  0
);

// Find market with highest volume
const highestVolumeMarket = event.markets.reduce((prev, current) =>
  parseFloat(current.volume) > parseFloat(prev.volume)
    ? current
    : prev
);

// Count active markets
const activeMarkets = event.markets.filter(m => m.active && !m.closed);

console.log(`Event: ${event.title}`);
console.log(`Total Volume: $${totalVolume.toLocaleString()}`);
console.log(`Active Markets: ${activeMarkets.length}/${event.markets.length}`);
console.log(`\nHighest Volume Market:`);
console.log(`  ${highestVolumeMarket.question}`);
console.log(`  Volume: $${parseFloat(highestVolumeMarket.volume).toLocaleString()}`);
```

### Sort Events by Market Count

```typescript
const events = await client.event.list({
  active: true,
  limit: 50,
});

// Sort by number of markets (descending)
const sortedByMarkets = events.sort(
  (a, b) => b.markets.length - a.markets.length
);

console.log("Events with most markets:");
sortedByMarkets.slice(0, 10).forEach((event, index) => {
  console.log(`${index + 1}. ${event.title}`);
  console.log(`   Markets: ${event.markets.length}`);
});
```

### Find Events Ending Soon

```typescript
const events = await client.event.list({
  active: true,
  limit: 100,
});

// Filter events ending in the next 7 days
const sevenDaysFromNow = new Date();
sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

const endingSoon = events.filter(event => {
  const endDate = new Date(event.endDate);
  return endDate <= sevenDaysFromNow && endDate >= new Date();
});

// Sort by end date (soonest first)
endingSoon.sort((a, b) =>
  new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
);

console.log(`${endingSoon.length} events ending in the next 7 days:`);

for (const event of endingSoon) {
  const daysUntilEnd = Math.ceil(
    (new Date(event.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  console.log(`${event.title} (${daysUntilEnd} days remaining)`);
}
```

### Search Events by Keyword

```typescript
const events = await client.event.list({ limit: 100 });

const keyword = "sports";
const matchingEvents = events.filter(e =>
  e.title.toLowerCase().includes(keyword.toLowerCase()) ||
  e.description.toLowerCase().includes(keyword.toLowerCase())
);

console.log(`Found ${matchingEvents.length} events matching "${keyword}"`);

for (const event of matchingEvents) {
  console.log(`- ${event.title}`);
  console.log(`  Markets: ${event.markets.length}`);
}
```

### Get Event Market Overview

```typescript
const event = await client.event.get({
  slug: "event-slug"
});

console.log(`Event: ${event.title}\n`);

// Group markets by status
const activeMarkets = event.markets.filter(m => m.active && !m.closed);
const closedMarkets = event.markets.filter(m => m.closed);

console.log(`Market Overview:`);
console.log(`  Total: ${event.markets.length}`);
console.log(`  Active: ${activeMarkets.length}`);
console.log(`  Closed: ${closedMarkets.length}`);

// Calculate volume statistics
const volumes = event.markets.map(m => parseFloat(m.volume));
const totalVolume = volumes.reduce((sum, v) => sum + v, 0);
const avgVolume = totalVolume / volumes.length;
const maxVolume = Math.max(...volumes);
const minVolume = Math.min(...volumes);

console.log(`\nVolume Statistics:`);
console.log(`  Total: $${totalVolume.toLocaleString()}`);
console.log(`  Average: $${avgVolume.toLocaleString()}`);
console.log(`  Max: $${maxVolume.toLocaleString()}`);
console.log(`  Min: $${minVolume.toLocaleString()}`);
```

### Compare Multiple Events

```typescript
const eventSlugs = [
  "presidential-election-2024",
  "super-bowl-2024",
  "bitcoin-price-predictions"
];

const events = await Promise.all(
  eventSlugs.map(slug => client.event.get({ slug }))
);

console.log("Event Comparison:\n");

for (const event of events) {
  const totalVolume = event.markets.reduce(
    (sum, m) => sum + parseFloat(m.volume),
    0
  );

  console.log(`${event.title}:`);
  console.log(`  Markets: ${event.markets.length}`);
  console.log(`  Total Volume: $${totalVolume.toLocaleString()}`);
  console.log(`  Status: ${event.active ? "Active" : "Closed"}`);
  console.log();
}
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
  const events = await client.event.list({
    active: true,
    limit: 10,
  });
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
- [Sports](/reference/gamma/sports)
