# @dicedhq/signer

HMAC-SHA256 signature generator for Polymarket API authentication.

## Features

- HMAC-SHA256 signature generation for API requests
- URL-safe base64 encoding
- TypeScript support with full type inference
- Zero dependencies

## Installation

```bash
bun add @dicedhq/signer
```

## Usage

### Basic Example

```typescript
import { Signer } from "@dicedhq/signer";

const signer = new Signer({
  key: "your-api-key",
  secret: "your-base64-encoded-secret",
  passphrase: "your-passphrase",
});

const payload = signer.createHeaderPayload({
  method: "POST",
  path: "/api/orders",
  body: JSON.stringify({ order: "data" }),
  timestamp: Math.floor(Date.now() / 1000), // Optional, auto-generated if not provided
});
```

### GET Requests

```typescript
const payload = signer.createHeaderPayload({
  method: "GET",
  path: "/api/orders",
  body: undefined,
  timestamp: undefined,
});
```

### With Custom Timestamp

```typescript
const payload = signer.createHeaderPayload({
  method: "POST",
  path: "/api/orders",
  body: JSON.stringify({ order: "data" }),
  timestamp: 1234567890, // Use specific timestamp
});
```

## License

MIT - See [LICENSE](../../LICENSE) for details
