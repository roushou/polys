---
title: Troubleshooting
description: Solve common issues with the signing server
---

This guide helps you diagnose and solve common issues with the signing server and order attribution.

## Server Issues

### Server Won't Start

**Symptoms:**
- Server exits immediately after starting
- Error messages about missing variables
- Port binding errors

**Solutions:**

1. **Check environment variables:**
   ```bash
   # Verify all required variables are set
   cat .env

   # Test with explicit variables
   POLYS_POLYMARKET_API_KEY=test \
   POLYS_POLYMARKET_SECRET=test \
   POLYS_POLYMARKET_PASSPHRASE=test \
   POLYS_BEARER_TOKEN=test \
   ./server
   ```

2. **Verify port availability:**
   ```bash
   # Check if port is in use
   sudo lsof -i :8080
   sudo netstat -tulpn | grep 8080

   # Use a different port
   POLYS_SERVER_PORT=3000 ./server
   ```

3. **Check Bun installation:**
   ```bash
   bun --version

   # Reinstall if needed
   curl -fsSL https://bun.sh/install | bash
   ```

4. **Review server logs:**
   ```bash
   # systemd
   sudo journalctl -u polys-server -n 50 -f

   # Docker
   docker logs polys-server --tail 50 -f

   # PM2
   pm2 logs polys-server
   ```

### Server Crashes or Restarts

**Symptoms:**
- Server stops unexpectedly
- Frequent restarts
- Out of memory errors

**Solutions:**

1. **Check resource usage:**
   ```bash
   # System resources
   htop
   free -h

   # Docker resources
   docker stats polys-server
   ```

2. **Increase memory limits:**
   ```bash
   # Docker compose
   services:
     polys-server:
       mem_limit: 1g
       mem_reservation: 512m

   # systemd
   MemoryLimit=1G
   ```

3. **Enable automatic restarts:**
   ```bash
   # systemd
   Restart=on-failure
   RestartSec=10

   # Docker compose
   restart: unless-stopped

   # PM2
   pm2 start server --name polys-server --max-restarts 10
   ```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**

1. **Find and kill the process:**
   ```bash
   # Find process
   sudo lsof -i :8080

   # Kill process
   sudo kill -9 <PID>
   ```

2. **Use a different port:**
   ```bash
   export POLYS_SERVER_PORT=3000
   ./server
   ```

3. **Configure server to listen on all interfaces:**
   ```bash
   export POLYS_SERVER_HOSTNAME=0.0.0.0
   ```

## Authentication Issues

### Bearer Token Authentication Fails

**Error:** `401 Unauthorized` or `403 Forbidden`

**Solutions:**

1. **Verify token matches:**
   ```bash
   # Server side
   echo $POLYS_BEARER_TOKEN

   # Client side
   echo $SIGNING_SERVER_TOKEN

   # Should be identical
   ```

2. **Check Authorization header:**
   ```bash
   # Correct format
   Authorization: Bearer your_token_here

   # Test with curl
   curl -X POST http://localhost:8080/api/sign \
     -H "Authorization: Bearer your_token" \
     -H "Content-Type: application/json" \
     -d '{"method":"GET","path":"/markets"}'
   ```

3. **Regenerate bearer token:**
   ```bash
   # Generate new token
   openssl rand -base64 32

   # Update on both server and client
   export POLYS_BEARER_TOKEN=new_token
   export SIGNING_SERVER_TOKEN=new_token
   ```

### API Credential Errors

**Error:** `Invalid API credentials` or signature validation failures

**Solutions:**

1. **Verify credentials format:**
   ```bash
   # API key should be alphanumeric
   echo $POLYS_POLYMARKET_API_KEY

   # Secret should be Base64 encoded
   echo $POLYS_POLYMARKET_SECRET | base64 -d

   # Passphrase is plain text
   echo $POLYS_POLYMARKET_PASSPHRASE
   ```

2. **Check credentials on Polymarket:**
   - Log into Polymarket Builder Program dashboard
   - Verify API credentials are active
   - Regenerate if necessary

3. **Test credentials separately:**
   ```bash
   # Test signing endpoint with known-good request
   curl -X POST http://localhost:8080/api/sign \
     -H "Authorization: Bearer $POLYS_BEARER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"method":"GET","path":"/markets"}'
   ```

## Network Issues

### Cannot Reach Signing Server

**Error:** `ECONNREFUSED`, `ETIMEDOUT`, or `Network error`

**Solutions:**

1. **Verify server is running:**
   ```bash
   # Check health endpoint
   curl http://localhost:8080/health

   # Check process
   ps aux | grep server
   systemctl status polys-server
   docker ps | grep polys-server
   ```

2. **Check network connectivity:**
   ```bash
   # From client machine
   ping your-server.com

   # Test port connectivity
   telnet your-server.com 8080
   nc -zv your-server.com 8080
   ```

3. **Review firewall rules:**
   ```bash
   # Check firewall status
   sudo ufw status
   sudo iptables -L

   # Allow port 8080
   sudo ufw allow 8080/tcp
   sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
   ```

4. **Check DNS resolution:**
   ```bash
   # Verify domain resolves
   nslookup your-server.com
   dig your-server.com

   # Test with IP directly
   curl http://1.2.3.4:8080/health
   ```

### SSL/TLS Certificate Errors

**Error:** `certificate verify failed` or `SSL handshake failed`

**Solutions:**

1. **Verify certificate validity:**
   ```bash
   # Check certificate
   openssl s_client -connect your-server.com:443

   # Verify expiration
   echo | openssl s_client -connect your-server.com:443 2>/dev/null | \
     openssl x509 -noout -dates
   ```

2. **Update certificates:**
   ```bash
   # Let's Encrypt
   sudo certbot renew

   # Copy new certificates
   sudo cp /etc/letsencrypt/live/your-domain/fullchain.pem /path/to/certs/
   sudo cp /etc/letsencrypt/live/your-domain/privkey.pem /path/to/certs/
   ```

3. **Disable SSL verification (development only):**
   ```typescript
   // NOT for production
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
   ```

## Monitoring and Debugging

**Client side:**
```typescript
const client = new Polymarket({
  clob: {
    wallet,
    credentials,
    attributor: {
      url: process.env.SIGNING_SERVER_URL!,
      token: process.env.SIGNING_SERVER_TOKEN!,
    },
    debug: true, // Enable debug logging
  },
});
```

### Health Monitoring Script

Create `health-check.sh`:

```bash
#!/bin/bash

SERVER_URL="http://localhost:8080"
BEARER_TOKEN="your_token"

# Check health endpoint
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" $SERVER_URL/health)

if [ "$HEALTH" != "200" ]; then
    echo "❌ Server health check failed: HTTP $HEALTH"
    # Send alert (email, Slack, PagerDuty, etc.)
    exit 1
fi

echo "✅ Server is healthy"
exit 0
```

Run as cron job:
```bash
*/5 * * * * /path/to/health-check.sh >> /var/log/health-check.log 2>&1
```

### Request Tracing

Add request IDs for tracing:

```typescript
import { randomUUID } from "crypto";

async function createOrderWithTracing(orderParams: any) {
  const requestId = randomUUID();

  console.log(`[${requestId}] Creating order:`, {
    side: orderParams.side,
    size: orderParams.size,
    price: orderParams.price,
  });

  try {
    const order = await client.order.createOrder(orderParams);
    console.log(`[${requestId}] Order created:`, order.orderId);
    return order;
  } catch (error) {
    console.error(`[${requestId}] Order failed:`, error);
    throw error;
  }
}
```

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Server logs: Look for error messages and stack traces
   - Client logs: Enable debug mode to see request/response details
   - System logs: Check systemd/Docker logs

2. **Test components individually:**
   - Server health endpoint
   - Signing endpoint with curl
   - Client without attribution
   - Client with attribution

3. **Review configuration:**
   - Environment variables
   - Network settings
   - Firewall rules
   - SSL certificates

4. **Search existing issues:**
   - [GitHub Issues](https://github.com/roushou/polys/issues)
   - Common error messages
   - Configuration examples

5. **Create an issue:**
   - Include error messages
   - Provide configuration (redact sensitive data)
   - Describe steps to reproduce
   - Share relevant logs

## See Also

- [Setup Guide](/order-attribution/setup) - Initial configuration
- [Deployment Guide](/order-attribution/deployment) - Production deployment
- [Client Usage](/order-attribution/client-usage) - Integration examples
- [Error Handling Guide](/guides/error-handling) - Error handling patterns
