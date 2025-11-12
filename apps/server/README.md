# @dicedhq/server

High-performance signing server for Polymarket API built with Bun.

A lightweight alternative to Polymarket's official [builder-signing-server](https://github.com/Polymarket/builder-signing-server), built entirely with Bun's native HTTP server for better performance.

## Features

- Fast HTTP server using Bun's native implementation
- Bearer token authentication
- Request signing with HMAC-SHA256
- Input validation with [Valibot](https://valibot.dev/)
- Type-safe configuration management
- Hot module reloading in development

## Prerequisites

- [Bun](https://bun.sh/) runtime installed

## Installation

```bash
bun install
```

## Configuration

Re-use `.env.example` file and update it with your Polymarket credentials.

```bash
# Required
DICED_POLYMARKET_API_KEY=your_api_key
DICED_POLYMARKET_SECRET=your_base64_secret
DICED_POLYMARKET_PASSPHRASE=your_passphrase

# Optional (with defaults)
DICED_SERVER_HOSTNAME=127.0.0.1
DICED_SERVER_PORT=8080
```

## Usage

### Development

```bash
bun run dev
```

This starts the server with hot module reloading enabled.

### Production

```bash
bun run start
```

## License

MIT - See [LICENSE](../../LICENSE) for details
