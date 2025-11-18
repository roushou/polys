---
title: Tags
description: Browse and filter by tags
---

Tag operations allow you to retrieve tags used to categorize markets on Polymarket. Tags help users discover and filter markets by topic.

## Methods

### List Tags

Get all available tags:

```typescript
const tags = await client.tag.list({
  limit: 10,
  offset: 0,
});
```

**Parameters:**
- `limit` (number, optional): Maximum number of tags to return
- `offset` (number, optional): Number of tags to skip for pagination

**Returns**: `Tag[]`

## Tag Type

```typescript
interface Tag {
  id: string;
  label: string;
  slug: string;
  marketCount: number;
  // ... additional fields
}
```

## Example Usage

### List All Tags

```typescript
import { Gamma } from "@dicedhq/gamma";

const client = new Gamma();

// Get first 50 tags
const tags = await client.tag.list({ limit: 50 });

console.log(`Found ${tags.length} tags`);

for (const tag of tags) {
  console.log(`Tag: ${tag.label} (${tag.marketCount} markets)`);
}
```

### Pagination Through Tags

```typescript
// Fetch all tags with pagination
const pageSize = 50;
let offset = 0;
let allTags: Tag[] = [];

while (true) {
  const tags = await client.tag.list({
    limit: pageSize,
    offset: offset,
  });

  if (tags.length === 0) break;

  allTags = allTags.concat(tags);
  offset += pageSize;

  console.log(`Fetched ${allTags.length} tags so far...`);

  // Optional: add delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log(`Total tags fetched: ${allTags.length}`);
```

### Sort Tags by Popularity

```typescript
const tags = await client.tag.list({ limit: 100 });

// Sort by market count (descending)
const sortedTags = tags.sort(
  (a, b) => b.marketCount - a.marketCount
);

console.log("Most popular tags:");

sortedTags.slice(0, 10).forEach((tag, index) => {
  console.log(`${index + 1}. ${tag.label} (${tag.marketCount} markets)`);
});
```

### Find Tags by Keyword

```typescript
const tags = await client.tag.list({ limit: 100 });

const keyword = "crypto";
const matchingTags = tags.filter(t =>
  t.label.toLowerCase().includes(keyword.toLowerCase())
);

console.log(`Tags matching "${keyword}":`);

for (const tag of matchingTags) {
  console.log(`- ${tag.label} (${tag.marketCount} markets)`);
}
```

### Get Popular Tags

```typescript
const tags = await client.tag.list({ limit: 100 });

// Filter tags with at least 20 markets
const popularTags = tags.filter(t => t.marketCount >= 20);

// Sort by market count
popularTags.sort((a, b) => b.marketCount - a.marketCount);

console.log(`Popular tags (20+ markets):`);

for (const tag of popularTags) {
  console.log(`- ${tag.label}: ${tag.marketCount} markets`);
}
```

### Calculate Tag Statistics

```typescript
const tags = await client.tag.list({ limit: 100 });

// Calculate total markets across all tags
const totalMarkets = tags.reduce(
  (sum, tag) => sum + tag.marketCount,
  0
);

// Calculate average markets per tag
const avgMarkets = totalMarkets / tags.length;

// Find most/least used tags
const mostUsed = tags.reduce((prev, current) =>
  current.marketCount > prev.marketCount ? current : prev
);

const leastUsed = tags.reduce((prev, current) =>
  current.marketCount < prev.marketCount ? current : prev
);

console.log(`Total Tags: ${tags.length}`);
console.log(`Average Markets per Tag: ${avgMarkets.toFixed(1)}`);
console.log(`\nMost Used: ${mostUsed.label} (${mostUsed.marketCount} markets)`);
console.log(`Least Used: ${leastUsed.label} (${leastUsed.marketCount} markets)`);
```

### Group Tags by Category

```typescript
const tags = await client.tag.list({ limit: 100 });

// Group tags into categories based on market count
const categories = {
  veryPopular: tags.filter(t => t.marketCount >= 100),
  popular: tags.filter(t => t.marketCount >= 20 && t.marketCount < 100),
  moderate: tags.filter(t => t.marketCount >= 5 && t.marketCount < 20),
  niche: tags.filter(t => t.marketCount < 5),
};

console.log("Tag Categories:\n");

console.log(`Very Popular (100+ markets): ${categories.veryPopular.length}`);
categories.veryPopular.forEach(t =>
  console.log(`  - ${t.label} (${t.marketCount})`)
);

console.log(`\nPopular (20-99 markets): ${categories.popular.length}`);
categories.popular.slice(0, 5).forEach(t =>
  console.log(`  - ${t.label} (${t.marketCount})`)
);

console.log(`\nModerate (5-19 markets): ${categories.moderate.length}`);
console.log(`Niche (<5 markets): ${categories.niche.length}`);
```

### Search Tags by Multiple Keywords

```typescript
const tags = await client.tag.list({ limit: 100 });

const keywords = ["politics", "election", "government"];

const matchingTags = tags.filter(tag =>
  keywords.some(keyword =>
    tag.label.toLowerCase().includes(keyword.toLowerCase())
  )
);

console.log(`Tags matching any of [${keywords.join(", ")}]:`);

for (const tag of matchingTags) {
  console.log(`- ${tag.label} (${tag.marketCount} markets)`);
}
```

### Filter Tags by Market Count Range

```typescript
const tags = await client.tag.list({ limit: 100 });

const minMarkets = 10;
const maxMarkets = 50;

const filteredTags = tags.filter(
  t => t.marketCount >= minMarkets && t.marketCount <= maxMarkets
);

console.log(`Tags with ${minMarkets}-${maxMarkets} markets:`);

// Sort alphabetically
filteredTags.sort((a, b) => a.label.localeCompare(b.label));

for (const tag of filteredTags) {
  console.log(`- ${tag.label}: ${tag.marketCount} markets`);
}
```

### Get Tag Distribution

```typescript
const tags = await client.tag.list({ limit: 100 });

// Create distribution buckets
const buckets = {
  "0-9": 0,
  "10-49": 0,
  "50-99": 0,
  "100-499": 0,
  "500+": 0,
};

tags.forEach(tag => {
  if (tag.marketCount < 10) buckets["0-9"]++;
  else if (tag.marketCount < 50) buckets["10-49"]++;
  else if (tag.marketCount < 100) buckets["50-99"]++;
  else if (tag.marketCount < 500) buckets["100-499"]++;
  else buckets["500+"]++;
});

console.log("Tag Distribution by Market Count:\n");

for (const [range, count] of Object.entries(buckets)) {
  const percentage = ((count / tags.length) * 100).toFixed(1);
  console.log(`${range} markets: ${count} tags (${percentage}%)`);
}
```

### Export Tags to CSV

```typescript
const tags = await client.tag.list({ limit: 100 });

// Sort alphabetically
tags.sort((a, b) => a.label.localeCompare(b.label));

// Create CSV
const csvRows = ["Tag,Slug,Market Count"];

for (const tag of tags) {
  csvRows.push([
    tag.label,
    tag.slug,
    tag.marketCount.toString(),
  ].join(","));
}

const csv = csvRows.join("\n");
console.log(csv);

// In Node.js, you can write to file:
// import { writeFileSync } from 'fs';
// writeFileSync('tags.csv', csv);
```

### Find Related Tags

```typescript
const tags = await client.tag.list({ limit: 100 });

// Find tags related to a specific topic
const topicTag = "cryptocurrency";
const relatedKeywords = ["crypto", "bitcoin", "blockchain", "defi"];

const relatedTags = tags.filter(tag =>
  relatedKeywords.some(keyword =>
    tag.label.toLowerCase().includes(keyword.toLowerCase())
  )
);

console.log(`Tags related to "${topicTag}":`);

// Sort by market count
relatedTags.sort((a, b) => b.marketCount - a.marketCount);

for (const tag of relatedTags) {
  console.log(`- ${tag.label} (${tag.marketCount} markets)`);
}
```

### Monitor Tag Growth

```typescript
async function monitorTagGrowth(intervalMs: number = 3600000) {
  let previousTags = await client.tag.list({ limit: 100 });

  console.log("Starting tag growth monitoring...");

  while (true) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    const currentTags = await client.tag.list({ limit: 100 });

    console.log(`\n[${new Date().toISOString()}] Tag Updates:`);

    for (const current of currentTags) {
      const previous = previousTags.find(t => t.id === current.id);

      if (!previous) {
        console.log(`New tag: ${current.label} (${current.marketCount} markets)`);
      } else if (current.marketCount > previous.marketCount) {
        const growth = current.marketCount - previous.marketCount;
        console.log(`${current.label}: +${growth} markets (${current.marketCount} total)`);
      }
    }

    previousTags = currentTags;
  }
}

// Monitor every hour
monitorTagGrowth(3600000);
```

### Compare Tag Usage

```typescript
const tags = await client.tag.list({ limit: 100 });

// Compare specific tags
const tagsToCompare = ["Politics", "Sports", "Crypto"];

const comparison = tagsToCompare.map(label => {
  const tag = tags.find(t =>
    t.label.toLowerCase() === label.toLowerCase()
  );
  return tag || { label, marketCount: 0 };
});

console.log("Tag Comparison:\n");

comparison.forEach(tag => {
  console.log(`${tag.label}: ${tag.marketCount} markets`);
});

// Calculate relative popularity
const total = comparison.reduce((sum, t) => sum + t.marketCount, 0);
console.log("\nRelative Popularity:");

comparison.forEach(tag => {
  const percentage = total > 0 ? ((tag.marketCount / total) * 100).toFixed(1) : 0;
  console.log(`${tag.label}: ${percentage}%`);
});
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
  const tags = await client.tag.list({ limit: 50 });
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
