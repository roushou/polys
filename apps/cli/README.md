# polys

CLI for Polymarket Data and Gamma APIs.

## Installation

```bash
bun install
```

## Usage

```bash
# Run in development mode
bun run dev

# Show help
bun run dev -- --help
```

## Build

Compile to a standalone executable:

```bash
bun run build
```

This outputs a single binary to `bin/polys` that can be run without Bun installed.

## Development

The CLI is generated using [bao](https://github.com/roushou/bao) from `bao.toml`. Command definitions are in `src/commands/` and handlers are in `src/handlers/`.

To regenerate the CLI structure after modifying `bao.toml`:

```bash
bao bake
```
