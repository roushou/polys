# Polys

An unofficial TypeScript toolkit to build apps on top of Polymarket API.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

This repository contains a TypeScript implementation for interacting with Polymarket, including:

- **[@dicedhq/polymarket](./packages/polymarket)** - TypeScript client library for both CLOB (order book) and Gamma (market data) APIs
- **[@dicedhq/polys-server](./apps/server)** - High-performance signing server built with Bun

## Packages

### [@dicedhq/polymarket](./packages/polymarket)

A comprehensive TypeScript client for the Polymarket API with support for:

- **CLOB API**: Trading on Polymarket's order book (markets, orders, trades)
- **Gamma API**: Market data, events, sports information, and tags
- Type-safe API with comprehensive TypeScript types
- Built-in error handling, retries, and rate limiting

```bash
npm install @dicedhq/polymarket
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
