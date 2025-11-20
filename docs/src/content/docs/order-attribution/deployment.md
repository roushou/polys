---
title: Deployment
description: Deploy the signing server to production environments
---

Choose the deployment method that best fits your infrastructure and requirements.

## Single-file Executable

Bun can compile the server into a standalone, portable executable with zero dependencies. This is the easiest way to deploy the signing server.

:::tip[Recommended for Simple Deployments]
Single-file executables are perfect for VPS deployments or when you want minimal dependencies. The entire server, including the Bun runtime, is bundled into one file.
:::

### Build the Executable

From the `polys/apps/server` directory:

```bash
bun build --compile --minify --sourcemap ./src/app.ts --outfile server
```

**What this does:**
- `--compile`: Creates a standalone executable with embedded Bun runtime
- `--minify`: Reduces file size by minifying the code
- `--sourcemap`: Generates source maps for debugging
- `--outfile server`: Names the output file `server`

### Run the Executable

```bash
./server
```

Make sure your environment variables are set (either through a `.env` file in the same directory or exported in your shell).

### Benefits

- **Zero Dependencies**: No need to install Bun on the server
- **Portable**: Copy the single file to any Linux/macOS machine and run it
- **Fast Startup**: Compiled executables start faster than interpreted code
- **Small Size**: Typically ~50MB including the runtime

### VPS Deployment with systemd

Deploy to a Linux VPS with automatic restarts:

```bash
# Build locally
bun build --compile --minify --sourcemap ./src/app.ts --outfile server

# Copy to your server
rsync -avz server user@your-server.com:/opt/polys-server/

# SSH into server
ssh user@your-server.com
cd /opt/polys-server
chmod +x server

# Create systemd service
sudo tee /etc/systemd/system/polys-server.service > /dev/null << 'EOF'
[Unit]
Description=Polys Signing Server
After=network.target

[Service]
Type=simple
User=polys
WorkingDirectory=/opt/polys-server
EnvironmentFile=/opt/polys-server/.env
ExecStart=/opt/polys-server/server
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create .env file on server with your configuration
# Add: POLYS_POLYMARKET_API_KEY, POLYS_POLYMARKET_SECRET,
#      POLYS_POLYMARKET_PASSPHRASE, POLYS_API_TOKENS
sudo nano /opt/polys-server/.env

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable polys-server
sudo systemctl start polys-server

# Check status
sudo systemctl status polys-server
```

## Docker

### Basic Docker Setup

Create a `Dockerfile` in `polys/apps/server`:

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["bun", "run", "start"]
```

Build and run:

```bash
# Build the image
docker build -t polys-server .

# Run with environment variables from file
docker run -p 8080:8080 --env-file .env polys-server

# Or with inline environment variables
docker run -p 8080:8080 \
  -e POLYS_POLYMARKET_API_KEY=your_key \
  -e POLYS_POLYMARKET_SECRET=your_secret \
  -e POLYS_POLYMARKET_PASSPHRASE=your_passphrase \
  -e POLYS_API_TOKENS=token1,token2,token3 \
  polys-server
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  polys-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - POLYS_POLYMARKET_API_KEY=${POLYS_POLYMARKET_API_KEY}
      - POLYS_POLYMARKET_SECRET=${POLYS_POLYMARKET_SECRET}
      - POLYS_POLYMARKET_PASSPHRASE=${POLYS_POLYMARKET_PASSPHRASE}
      - POLYS_API_TOKENS=${POLYS_API_TOKENS}
      - POLYS_SERVER_HOSTNAME=0.0.0.0
      - POLYS_SERVER_PORT=8080
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Deploy:

```bash
docker-compose up -d
```

## Cloud Platforms

### AWS

#### EC2 with Single-file Executable

1. Launch an EC2 instance (Amazon Linux 2 or Ubuntu)
2. Copy the executable: `rsync -avz server ec2-user@your-instance:/home/ec2-user/`
3. Set up systemd service as shown in the VPS section
4. Configure security groups to allow inbound traffic on port 8080

#### ECS/Fargate

1. Push Docker image to ECR:
   ```bash
   aws ecr create-repository --repository-name polys-server
   docker tag polys-server:latest <account-id>.dkr.ecr.<region>.amazonaws.com/polys-server:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/polys-server:latest
   ```

2. Create task definition with environment variables from Secrets Manager
3. Create ECS service
4. Set up Application Load Balancer with SSL certificate

### Google Cloud

#### Cloud Run

```bash
# Build and push to Artifact Registry
gcloud builds submit --tag gcr.io/<project-id>/polys-server

# Deploy to Cloud Run
gcloud run deploy polys-server \
  --image gcr.io/<project-id>/polys-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars POLYS_POLYMARKET_API_KEY=your_key \
  --set-secrets POLYS_POLYMARKET_SECRET=secret-name:latest \
  --port 8080
```

#### GCE with Docker

1. Create a Compute Engine instance
2. Install Docker
3. Pull and run your Docker image
4. Use Cloud Load Balancing for SSL termination

### Digital Ocean

#### App Platform

1. Connect your GitHub repository
2. Select the `apps/server` directory
3. Configure environment variables in the dashboard
4. Deploy automatically on git push

#### Droplet with Docker

1. Create a Droplet with Docker pre-installed
2. Copy `docker-compose.yml` and `.env`
3. Run `docker-compose up -d`
4. Use a firewall to restrict access

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set POLYS_POLYMARKET_API_KEY=your_key
railway variables set POLYS_POLYMARKET_SECRET=your_secret
railway variables set POLYS_POLYMARKET_PASSPHRASE=your_passphrase
railway variables set POLYS_API_TOKENS=token1,token2,token3

# Deploy
railway up
```

## Troubleshooting

### Server Won't Start

```bash
# Check logs
sudo journalctl -u polys-server -f  # systemd
docker logs polys-server            # Docker
pm2 logs polys-server               # PM2
```

### Port Conflicts

```bash
# Check what's using the port
sudo lsof -i :8080
sudo netstat -tulpn | grep 8080

# Use a different port
POLYS_SERVER_PORT=3000 ./server
```

## Next Steps

- **[Client Usage](/order-attribution/client-usage)** - Integrate with your application
- **[Troubleshooting](/order-attribution/troubleshooting)** - Solve common issues
- **[Monitoring Guide](#monitoring-and-alerts)** - Set up monitoring

## See Also

- [Setup Guide](/order-attribution/setup) - Initial configuration
- [Overview](/order-attribution/overview) - Understanding order attribution
- [Security Best Practices](#security-best-practices) - Production security
