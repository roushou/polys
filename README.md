# Polys

An unofficial TypeScript toolkit to build apps on top of Polymarket API.

> [!WARNING]
> This is currently work-in-progress so the API may change and some features may be missing

This repository contains a TypeScript implementation for interacting with Polymarket, including:

- **[@dicedhq/clob](./packages/clob)** - TypeScript client library for CLOB (order book) API
- **[@dicedhq/gamma](./packages/gamma)** - TypeScript client library for Gamma (market data) API
- **[@dicedhq/polymarket](./packages/polymarket)** - Unified client that combines both CLOB and Gamma
- **[@dicedhq/polys-server](./apps/server)** - High-performance signing server built with Bun

## Documentation

See the [documentation](https://polys.kenji.sh/).

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
