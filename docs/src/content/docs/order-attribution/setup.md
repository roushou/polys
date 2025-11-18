---
title: Setup
description: Install and configure the Polys signing server
---

## Prerequisites

Before setting up the signing server, ensure you have:

- **[Bun](https://bun.sh/)** runtime >= 1.3.x
- **Polymarket API credentials** (key, secret, passphrase)
- **Builder Program access** (optional, but required for rebates)

### Installing Bun

If you don't have Bun installed, please follow the instructions [here](https://bun.com/)

```bash
# Check installation
bun --version
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/roushou/polys.git
cd polys/apps/server
```

### Install Dependencies

```bash
bun install
```

## Configuration

### Environment Variables

The signing server uses environment variables for configuration. Create a `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```bash
# Required - Polymarket API Credentials
POLYS_POLYMARKET_API_KEY=your_api_key
POLYS_POLYMARKET_SECRET=your_base64_secret
POLYS_POLYMARKET_PASSPHRASE=your_passphrase

# Required - Server Authentication
POLYS_BEARER_TOKEN=your_secure_bearer_token

# Optional - Server Configuration
POLYS_SERVER_HOSTNAME=127.0.0.1
POLYS_SERVER_PORT=8080
```

### Configuration Details

#### Required Variables

**`POLYS_POLYMARKET_API_KEY`**
- Your Polymarket API key
- Obtained from the Polymarket builder dashboard
- Used for signing order requests

**`POLYS_POLYMARKET_SECRET`**
- Your Polymarket API secret (Base64 encoded)
- Keep this extremely secure
- Used for HMAC-SHA256 signature generation

**`POLYS_POLYMARKET_PASSPHRASE`**
- Your Polymarket API passphrase
- Set when creating your API credentials

**`POLYS_BEARER_TOKEN`**
- Bearer token for authenticating requests to the signing server
- Clients must include this in the `Authorization` header

#### Optional Variables

**`POLYS_SERVER_HOSTNAME`**
- Server hostname or IP address
- Default: `127.0.0.1` (localhost)
- Use `0.0.0.0` to listen on all interfaces

**`POLYS_SERVER_PORT`**
- Server port number
- Default: `8080`
- Choose an available port on your system

### Generating a Secure Bearer Token

Generate a cryptographically secure bearer token:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Bun
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use the generated token as your `POLYS_BEARER_TOKEN`.

## Verification

### Test the Configuration

Start the server in development mode:

```bash
bun run dev
```

You should see output indicating the server is running:

```
Server running at http://127.0.0.1:8080
```

### Test the Health Endpoint

Check if the server is responding:

```bash
curl http://127.0.0.1:8080/health
```

Expected response:
```json
{"status":"ok"}
```

## Next Steps

Now that your signing server is configured:

1. **[Deploy to Production](/order-attribution/deployment)** - Choose a deployment method
2. **[Configure Your Client](/order-attribution/client-usage)** - Integrate with your application
3. **[Troubleshooting](/order-attribution/troubleshooting)** - Solve common issues

## Common Issues

### Port Already in Use

If port 8080 is already in use:

```bash
# Change the port in .env
POLYS_SERVER_PORT=5000
```

## See Also

- [Overview](/order-attribution/overview) - Learn about order attribution
- [Deployment](/order-attribution/deployment) - Deploy to production
- [Getting Started Guide](/guides/getting-started) - Polys basics
