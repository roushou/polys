# @dicedhq/clob

A TypeScript client for the Polymarket CLOB (Central Limit Order Book) API for trading on Polymarket's order book.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

## Features

- [ ] **CLOB API Support**: Complete access to Polymarket's order book
- [x] **Type-Safe**: Comprehensive TypeScript types for all API responses and requests
- [x] **Error Handling**: Robust error handling with custom error types
- [x] **Automatic Retries**: Built-in retry logic for failed requests
- [x] **Rate Limiting**: Automatic handling of rate limit errors
- [x] **Authentication**: HMAC-SHA256 signature authentication for private endpoints
- [ ] **Real-time WebSocket Support**: Subscribe to live order book and trade updates

## Installation

```bash
npm install @dicedhq/clob viem
```

## Documentation

See the [documentation](https://polys.kenji.sh/).

## License

This project is licensed under the [MIT License](./LICENSE)
