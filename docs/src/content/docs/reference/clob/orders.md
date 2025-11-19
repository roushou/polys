---
title: Orders
description: Create, list, and cancel orders on the order book
---

Order operations allow you to create new orders, query your existing orders, and cancel orders on the CLOB.

## Methods

### Create Order

Create a new order:

```typescript
const order = await client.order.createOrder({
  price: 0.5,
  side: "BUY",
  size: 10,
  tokenId: "your-token-id",
  expiration: 1000000000,
  taker: "public",
});
```

**Parameters:**
- `price` (number): Price per share, must be between 0.0 and 1.0
- `side` (string): Order side, either `"BUY"` or `"SELL"`
- `size` (number): Number of shares to trade
- `tokenId` (string): The token ID for the market outcome
- `expiration` (number): Unix timestamp when the order expires
- `taker` (string): Either `"public"` for any taker, or a specific Ethereum address

**Returns**: `Order`

### List Orders

Get all your open orders:

```typescript
const openOrders = await client.order.list();
```

Get orders with filters:

```typescript
const filteredOrders = await client.order.list({
  marketId: "specific-market-id",
  status: "LIVE",
});
```

**Parameters:**
- `marketId` (string, optional): Filter by specific market
- `status` (string, optional): Filter by order status (`"LIVE"`, `"FILLED"`, `"CANCELLED"`)

**Returns**: `Order[]`

### Cancel Order

Cancel a specific order:

```typescript
await client.order.cancel({
  orderId: "your-order-id"
});
```

**Parameters:**
- `orderId` (string): The ID of the order to cancel

**Returns**: `void`

### Cancel All Orders

Cancel all open orders:

```typescript
await client.order.cancelAll();
```

Cancel all orders for a specific market:

```typescript
await client.order.cancelAll({
  marketId: "specific-market-id"
});
```

**Parameters:**
- `marketId` (string, optional): Cancel only orders for this market

**Returns**: `void`

## Order Type

```typescript
interface Order {
  orderId: string;
  marketId: string;
  tokenId: string;
  side: "BUY" | "SELL";
  price: string;
  size: string;
  filled: string;
  remaining: string;
  status: "LIVE" | "FILLED" | "CANCELLED" | "EXPIRED";
  createdAt: number;
  updatedAt: number;
  // ... additional fields
}
```

## Example Usage

### Create a Buy Order

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

// Create a buy order
const order = await client.order.createOrder({
  price: 0.55,           // Buy at 55 cents
  side: "BUY",
  size: 100,             // 100 shares
  tokenId: "0x1234567890abcdef...",
  expiration: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
  taker: "public",
});

console.log(`Order created: ${order.orderId}`);
console.log(`Status: ${order.status}`);
```

### Create a Sell Order

```typescript
// Create a sell order
const order = await client.order.createOrder({
  price: 0.65,           // Sell at 65 cents
  side: "SELL",
  size: 50,              // 50 shares
  tokenId: "0x1234567890abcdef...",
  expiration: Math.floor(Date.now() / 1000) + 86400,
  taker: "public",
});

console.log(`Sell order created: ${order.orderId}`);
```

### List Your Orders

```typescript
// Get all open orders
const openOrders = await client.order.list();

console.log(`You have ${openOrders.length} open orders`);

for (const order of openOrders) {
  console.log(`Order ${order.orderId}:`);
  console.log(`  Side: ${order.side}`);
  console.log(`  Price: ${order.price}`);
  console.log(`  Size: ${order.size}`);
  console.log(`  Filled: ${order.filled}`);
  console.log(`  Remaining: ${order.remaining}`);
}
```

### Filter Orders by Market

```typescript
// Get orders for a specific market
const marketOrders = await client.order.list({
  marketId: "0xabcdef1234567890...",
});

console.log(`${marketOrders.length} orders for this market`);

// Group by side
const buyOrders = marketOrders.filter(o => o.side === "BUY");
const sellOrders = marketOrders.filter(o => o.side === "SELL");

console.log(`Buy orders: ${buyOrders.length}`);
console.log(`Sell orders: ${sellOrders.length}`);
```

### Cancel a Specific Order

```typescript
// Cancel an order by ID
const orderId = "0x9876543210fedcba...";

try {
  await client.order.cancel({ orderId });
  console.log(`Order ${orderId} cancelled successfully`);
} catch (error) {
  console.error("Failed to cancel order:", error.message);
}
```

### Cancel All Orders

```typescript
// Cancel all your open orders
await client.order.cancelAll();
console.log("All orders cancelled");

// Or cancel orders for a specific market only
await client.order.cancelAll({
  marketId: "0xabcdef1234567890..."
});
console.log("Market orders cancelled");
```

### Place Order with Error Handling

```typescript
import {
  ValidationError,
  AuthenticationError,
  RateLimitError
} from "@dicedhq/clob";

async function placeOrder(orderParams) {
  try {
    const order = await client.order.createOrder(orderParams);
    console.log("Order placed successfully:", order.orderId);
    return order;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Invalid order parameters:", error.message);
      // Fix parameters and retry
    } else if (error instanceof AuthenticationError) {
      console.error("Authentication failed:", error.message);
      // Check credentials
    } else if (error instanceof RateLimitError) {
      console.error("Rate limited, retrying after:", error.retryAfter);
      await new Promise(resolve =>
        setTimeout(resolve, error.retryAfter * 1000)
      );
      return placeOrder(orderParams); // Retry
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

// Use the function
await placeOrder({
  price: 0.5,
  side: "BUY",
  size: 10,
  tokenId: "0x1234567890abcdef...",
  expiration: Math.floor(Date.now() / 1000) + 86400,
  taker: "public",
});
```

### Calculate Order Expiration

```typescript
// Helper function to create expiration timestamp
function getExpirationTimestamp(hours: number): number {
  const now = Math.floor(Date.now() / 1000);
  return now + (hours * 3600);
}

// Create order expiring in 48 hours
const order = await client.order.createOrder({
  price: 0.6,
  side: "BUY",
  size: 25,
  tokenId: "0x1234567890abcdef...",
  expiration: getExpirationTimestamp(48),
  taker: "public",
});
```

### Monitor Order Status

```typescript
async function waitForOrderFill(orderId: string, timeoutMs: number = 60000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const orders = await client.order.list();
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "FILLED") {
      console.log("Order filled!");
      return order;
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      throw new Error(`Order ${order.status.toLowerCase()}`);
    }

    console.log(`Order status: ${order.status}, filled: ${order.filled}/${order.size}`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
  }

  throw new Error("Timeout waiting for order to fill");
}

// Place order and wait for it to fill
const order = await client.order.createOrder({
  price: 0.5,
  side: "BUY",
  size: 10,
  tokenId: "0x1234567890abcdef...",
  expiration: getExpirationTimestamp(24),
  taker: "public",
});

console.log("Order placed:", order.orderId);
await waitForOrderFill(order.orderId);
```

## Error Handling

```typescript
import {
  ApiError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
  NetworkError
} from "@dicedhq/clob";

try {
  const order = await client.order.createOrder({
    price: 0.5,
    side: "BUY",
    size: 10,
    tokenId: "0x1234567890abcdef...",
    expiration: Math.floor(Date.now() / 1000) + 86400,
    taker: "public",
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited, retry after:", error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message);
  }
}
```

## See Also

- [CLOB Overview](/reference/clob/overview)
- [Order Book](/reference/clob/order-book)
- [Trades](/reference/clob/trades)
- [Error Handling Guide](/guides/error-handling)
