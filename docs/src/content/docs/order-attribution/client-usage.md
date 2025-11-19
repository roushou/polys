---
title: Client Usage
description: Integrate the signing server with your Polys clients
---

Once your signing server is deployed, configure your Polys clients to use it for order attribution. This allows orders placed through your application to be attributed to your Builder Program account.

## Using with Polymarket Client

The unified Polymarket client provides access to both CLOB and Gamma APIs.

```typescript
import { Polymarket, createConnectedWallet } from "@dicedhq/polymarket";
import type { Credentials } from "@dicedhq/polymarket";

// Create wallet for signing transactions
const wallet = createConnectedWallet({
  privateKey: process.env.PRIVATE_KEY,
  chain: "polygon",
});

// Your Polymarket API credentials
const credentials: Credentials = {
  key: process.env.POLYMARKET_API_KEY,
  secret: process.env.POLYMARKET_SECRET,
  passphrase: process.env.POLYMARKET_PASSPHRASE,
};

// Initialize with signing server for order attribution
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
    attributor: {
      url: "https://your-signing-server.com/api/sign",
      token: process.env.SIGNING_SERVER_TOKEN,
    },
  },
});

// All orders will now be attributed to your builder account
const order = await client.clob.order.createOrder({
  price: 0.55,
  side: "BUY",
  size: 100,
  tokenId: "0x1234...",
  expiration: Math.floor(Date.now() / 1000) + 86400,
  taker: "public",
});
```

## Configuration Options

### Attributor Configuration

```typescript
interface AttributorConfig {
  url: string;   // Signing server endpoint URL
  token: string; // Bearer token for authentication
}
```

**`url`**
- Full URL to your signing server's `/api/sign` endpoint
- Example: `https://signing.yourdomain.com/api/sign`
- Must be accessible from your application server
- Should use HTTPS in production

**`token`**
- Bearer token configured on your signing server
- Must match the `POLYS_BEARER_TOKEN` environment variable
- Keep this secret and secure
- Rotate periodically for security

## Environment Variables

Store configuration securely in environment variables:

```bash
# .env file
PRIVATE_KEY=your_wallet_private_key
POLYMARKET_API_KEY=your_api_key
POLYMARKET_SECRET=your_api_secret
POLYMARKET_PASSPHRASE=your_passphrase
SIGNING_SERVER_TOKEN=your_bearer_token
```

## Testing the Integration

### Verify Attribution is Working

1. **Create a test order:**

```typescript
const testOrder = await client.clob.order.createOrder({
  price: 0.01, // Low price to avoid fills
  side: "BUY",
  size: 1,
  tokenId: "0x1234...",
  expiration: Math.floor(Date.now() / 1000) + 3600,
  taker: "public",
});

console.log("Test order created:", testOrder.orderId);
```

2. **Check the order in Polymarket dashboard:**
   - Log into your Polymarket Builder Program account
   - Navigate to your orders/volume dashboard
   - Verify the order appears in your attributed volume

3. **Cancel the test order:**

```typescript
await client.clob.order.cancel({
  orderId: testOrder.orderId,
});

console.log("Test order cancelled");
```

### 4. Fallback Strategy

Handle signing server outages:

```typescript
async function createOrder(orderParams: any) {
  try {
    // Try with attribution
    return await clientWithAttribution.order.createOrder(orderParams);
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn("Signing server unavailable, creating order without attribution");

      // Fallback to direct client (no attribution)
      return await clientWithoutAttribution.order.createOrder(orderParams);
    }

    throw error;
  }
}
```

## Troubleshooting

### Common Issues

**Authentication Errors**
```
Error: Authentication failed
```
- Verify `SIGNING_SERVER_TOKEN` matches the server's `POLYS_BEARER_TOKEN`
- Check that the token is passed correctly in the client configuration

**Network Errors**
```
Error: connect ECONNREFUSED
```
- Verify the signing server URL is correct
- Ensure the server is running and accessible
- Check firewall rules and network connectivity

**Invalid Signature Errors**
```
Error: Invalid signature
```
- Verify API credentials are correct on both client and server
- Ensure the signing server is using the correct credentials
- Check that credentials haven't expired

### Debug Mode

Enable debug logging:

```typescript
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
    attributor: {
      url: process.env.SIGNING_SERVER_URL!,
      token: process.env.SIGNING_SERVER_TOKEN!,
    },
    debug: true, // Enable debug logging
  },
});
```

## See Also

- [Setup Guide](/order-attribution/setup) - Configure the signing server
- [Deployment Guide](/order-attribution/deployment) - Deploy to production
- [Troubleshooting](/order-attribution/troubleshooting) - Solve common issues
- [Error Handling Guide](/guides/error-handling) - Error handling best practices
