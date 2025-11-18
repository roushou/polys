---
title: Error Handling
description: Best practices for handling errors in Polys
---

Polys provides comprehensive error handling with custom error types that help you handle different failure scenarios gracefully. All packages export the same set of error types for consistency.

## Error Types

### ApiError

Base error class for all API-related errors. All other error types extend from this class.

```typescript
import { ApiError } from "@dicedhq/polymarket";

try {
  // API operation
} catch (error) {
  if (error instanceof ApiError) {
    console.log("API error:", error.message);
    console.log("Status code:", error.statusCode);
  }
}
```

**Properties:**
- `message` (string): Human-readable error description
- `statusCode` (number): HTTP status code from the API response

### RateLimitError

Thrown when you exceed the API rate limits.

```typescript
import { RateLimitError } from "@dicedhq/polymarket";

try {
  // API operation
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log("Rate limited!", error.message);
    // Slow down!
  }
}
```

**Properties:**
- `retryAfter` (number): Number of seconds to wait before retrying

### AuthenticationError

Thrown when authentication fails, typically due to invalid credentials.

```typescript
import { AuthenticationError } from "@dicedhq/clob";

try {
  const markets = await client.market.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log("Authentication failed:", error.message);
    // Check your API credentials
  }
}
```

**Common causes:**
- Invalid API key, secret, or passphrase
- Expired credentials
- Incorrect HMAC signature

### NetworkError

Thrown when network-related issues occur, such as connection failures or timeouts.

```typescript
import { NetworkError } from "@dicedhq/polymarket";

try {
  const markets = await client.market.list();
} catch (error) {
  if (error instanceof NetworkError) {
    console.log("Network error:", error.message);
    // Retry the operation or check your connection
  }
}
```

**Common causes:**
- No internet connection
- DNS resolution failures
- Request timeouts
- Server unreachable

### ValidationError

Thrown when request parameters fail validation.

```typescript
import { ValidationError } from "@dicedhq/polymarket";

try {
  const order = await client.clob.order.createOrder({
    price: 1.5, // Invalid: price must be between 0.0 and 1.0
    side: "BUY",
    size: 10,
    tokenId: "...",
    expiration: 1000000000,
    taker: "public",
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation error:", error.message);
    // Fix the invalid parameters
  }
}
```

**Common causes:**
- Invalid parameter values
- Missing required fields
- Type mismatches
- Out-of-range values

## Best Practices

### Logging Errors

Log errors with sufficient context for debugging:

```typescript
function logError(error: Error, context: Record<string, any>) {
  console.error({
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  });
}

try {
  const order = await client.clob.order.createOrder(orderParams);
} catch (error) {
  logError(error, {
    operation: "createOrder",
    params: orderParams,
  });
  throw error;
}
```

### Graceful Degradation

Provide fallbacks when non-critical operations fail:

```typescript
async function getMarketData(conditionId: string) {
  try {
    return await client.gamma.market.get({ conditionId });
  } catch (error) {
    if (error instanceof NetworkError) {
      // Return cached data if available
      return getCachedMarketData(conditionId);
    }
    throw error; // Re-throw if it's a critical error
  }
}
```

## Built-in Retry Mechanism

Polys includes automatic retry logic for certain types of failures:

- **Rate Limit Errors**: Automatically retries after the specified delay
- **Transient Network Errors**: Retries with exponential backoff
- **5xx Server Errors**: Retries with exponential backoff

You can disable automatic retries by setting `maxRetries: 0` in the client configuration:

```typescript
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
    maxRetries: 0, // Disable automatic retries
  },
});
```

## See Also

- [Getting Started Guide](/guides/getting-started)
- [CLOB API Reference](/reference/clob)
- [Gamma API Reference](/reference/gamma)
