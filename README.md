# Polys

This is an unofficial TypeScript toolkit to build apps on top of Polymarket API.

Currently, it's mostly a rewrite of their [builder-signing-server](https://github.com/Polymarket/builder-signing-server) and [builder-signing-sdk](https://github.com/Polymarket/builder-signing-sdk) with much less dependencies (only 1 so far).

It's also built entirely with Bun and its native HTTP server while Polymarket uses Nodejs and Express. So you get more speed out-of-the-box.

## Requirements

Bun is used under-the-hood so please follow the [instructions](https://bun.sh/) if you don't have it already installed.

## Getting started

To install dependencies

```bash
bun install
```

Launch the HTTP server

```bash
bun dev:server
```

## License

This project is licensed under the [MIT License](./LICENSE)
