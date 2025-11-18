# Polys

An unofficial TypeScript toolkit to build apps on top of Polymarket API.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

This repository contains a TypeScript implementation for interacting with Polymarket, including:

- **[@dicedhq/clob](./packages/clob)** - TypeScript client library for CLOB (order book) API
- **[@dicedhq/gamma](./packages/gamma)** - TypeScript client library for Gamma (market data) API
- **[@dicedhq/polymarket](./packages/polymarket)** - Unified client that combines both CLOB and Gamma
- **[@dicedhq/polys-server](./apps/server)** - High-performance signing server built with Bun

## Packages

### [@dicedhq/clob](./packages/clob)

TypeScript client for the Polymarket CLOB (Central Limit Order Book) API:

- Trading on Polymarket's order book (markets, orders, trades)
- Type-safe API with comprehensive TypeScript types
- Built-in error handling, retries, and rate limiting
- HMAC-SHA256 authentication for private endpoints

```bash
npm install @dicedhq/clob viem
```

### [@dicedhq/gamma](./packages/gamma)

TypeScript client for the Polymarket Gamma API:

- Market data, events, sports information, and tags
- Type-safe API with comprehensive TypeScript types
- Built-in error handling, retries, and rate limiting

```bash
npm install @dicedhq/gamma
```

### [@dicedhq/polymarket](./packages/polymarket)

Unified client that combines both CLOB and Gamma APIs for convenience:

```bash
npm install @dicedhq/polymarket viem
```

See the [package documentation](./packages/polymarket/README.md) for detailed usage examples.

### [@dicedhq/polys-server](./apps/server)

A lightweight signing server for Polymarket API, built entirely with Bun's native HTTP server for superior performance.

This is a modern alternative to Polymarket's official [builder-signing-server](https://github.com/Polymarket/builder-signing-server) with:

- Fewer dependencies (only 3 dependencies)
- Better performance using Bun's native HTTP server
- Bearer token authentication
- Type-safe configuration with Valibot

See the [server documentation](./apps/server/README.md) for setup instructions.

## Requirements

This project uses [Bun](https://bun.sh/) as the runtime and package manager. Please follow the [installation instructions](https://bun.sh/) if you don't have it already installed.

## Getting Started

Install dependencies:

```bash
bun install
```

### Run the Signing Server

```bash
bun dev:server
```

### Run Examples

```bash
# CLOB order creation example
cd examples/create-order
bun install
bun run src/index.ts

# Gamma API markets example
cd examples/gamma-markets
bun install
bun run src/index.ts
```

## Development

```bash
# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run check:types

# Build all packages
bun run build
```

## License

This project is licensed under the [MIT License](./LICENSE)
