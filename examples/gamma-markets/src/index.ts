import { createConnectedWallet, Polymarket } from "@dicedhq/polymarket";

const wallet = createConnectedWallet({
  privateKey: process.env.POLYS_PRIVATE_KEY!,
  chain: "polygon",
});

const credentials = {
  key: process.env.POLYS_POLYMARKET_API_KEY!,
  secret: process.env.POLYS_POLYMARKET_SECRET!,
  passphrase: process.env.POLYS_POLYMARKET_PASSPHRASE!,
};

const client = new Polymarket({
  clob: { wallet, credentials },
});

console.log("=== Gamma API Examples ===\n");

// Example 1: Get current markets (active, non-closed, non-archived)
console.log("1. Getting current markets...");
const currentMarkets = await client.gamma.market.listCurrent({ limit: 3 });
console.log(`Found ${currentMarkets.length} current markets:\n`);
for (const market of currentMarkets) {
  console.log(`- ${market.question}`);
  console.log(`  ID: ${market.conditionId}`);
  console.log(`  Slug: ${market.slug}`);
  console.log(`  Outcomes: ${market.outcomes.join(", ")}`);
  console.log("");
}

// Example 2: Get CLOB-tradable markets
console.log("\n2. Getting CLOB-tradable markets...");
const clobMarkets = await client.gamma.market.listClobTradable({ limit: 2 });
console.log(`Found ${clobMarkets.length} CLOB-tradable markets:\n`);
for (const market of clobMarkets) {
  console.log(`- ${market.question}`);
  console.log(`  CLOB Token IDs: ${market.clobTokenIds}`);
  console.log("");
}

// // Example 3: Get a specific market by ID
// if (currentMarkets.length > 0) {
//   console.log("\n3. Getting specific market details...");
//   const marketId = currentMarkets[0].condition_id;
//   const marketDetails = await client.gamma.markets.get(marketId);
//   console.log(`Market: ${marketDetails.question}`);
//   console.log(`Description: ${marketDetails.description}`);
//   console.log(`Active: ${marketDetails.active}`);
//   console.log(`Closed: ${marketDetails.closed}`);
//   if (marketDetails.events && marketDetails.events.length > 0) {
//     console.log(`Event: ${marketDetails.events[0].title}`);
//   }
// }

// Example 3: Get events
console.log("\n\n4. Getting events...");
const events = await client.gamma.event.list({
  archived: false,
  active: true,
  closed: false,
  limit: 2,
});
console.log(`Found ${events.length} active events:\n`);
for (const event of events) {
  console.log(`- ${event.title}`);
  console.log(`  Slug: ${event.slug}`);
  if (event.markets) {
    console.log(`  Markets: ${event.markets.length}`);
  }
  console.log("");
}

// Example 4: Get sports
console.log("\n\n4. Getting sports...");
const sports = await client.gamma.sport.list();
console.log(`Found ${sports.length} sports:\n`);
for (const sport of sports) {
  console.log(`- ${sport.sport}`);
  if (sport.series) {
    console.log(`  Series: ${sport.series}`);
  }
  if (sport.tags) {
    console.log(`  Tags: ${sport.tags}`);
  }
}
