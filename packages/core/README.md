# @dicedhq/core

This package is primarily intended for internal use by other `@dicedhq/*` packages:

- `@dicedhq/clob` - CLOB trading API
- `@dicedhq/gamma` - Market data API
- `@dicedhq/data` - User data API

## Installation

```bash
bunx jsr add @dicedhq/core
```

## What's included

- **BaseHttpClient** - Base HTTP client with retry logic, error handling, and debug logging
- **Error classes** - Typed error hierarchy (ApiError, ValidationError, RateLimitError, etc.)
- **Utilities** - Helper functions like `safeJsonParse`


## License

This project is licenced under the [MIT License](./LICENSE)
