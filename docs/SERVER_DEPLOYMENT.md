# MCP Router Server Deployment Mode

MCP Router supports deployment as a standalone web server, allowing you to access the UI through a web browser instead of the Electron desktop application.

## Quick Start

### Option 1: Use Electron in Headless Server Mode (Recommended)

The simplest way to deploy MCP Router as a server is to use the existing Electron application without the window interface:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the application:**
   ```bash
   pnpm run build
   ```

3. **Run in headless mode:**
   ```bash
   # The MCP API will be available on port 3282
   cd apps/electron
   pnpm start -- --no-sandbox --headless
   ```

### Option 2: Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-slim

# Install dependencies for Electron
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/electron/package.json ./apps/electron/
COPY packages/ ./packages/

# Install pnpm and dependencies
RUN npm install -g pnpm@10.22.0
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/electron/ ./apps/electron/
COPY turbo.json ./

# Build the application
WORKDIR /app
RUN pnpm run build --filter=@mcp_router/electron

# Expose ports
EXPOSE 3282

# Start the server
WORKDIR /app/apps/electron
CMD ["pnpm", "start", "--", "--no-sandbox", "--headless"]
```

Build and run:

```bash
docker build -t mcp-router .
docker run -p 3282:3282 -v ~/mcp-router-data:/root/.config/mcp-router mcp-router
```

## Accessing the MCP Router

Once running in server mode:

- **MCP API Endpoint**: `http://localhost:3282/mcp`
- **SSE Endpoint**: `http://localhost:3282/mcp/sse`

Connect your MCP clients (Claude, Cline, etc.) to `http://your-server:3282`

## Configuration

Configure the server using environment variables:

- `MCP_API_PORT` - MCP API port (default: 3282)
- `NODE_ENV` - Set to `production` for production deployments

Example:

```bash
MCP_API_PORT=8282 NODE_ENV=production pnpm start -- --no-sandbox --headless
```

## Production Deployment

### Using PM2

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Create an ecosystem file `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'mcp-router',
       cwd: './apps/electron',
       script: 'pnpm',
       args: 'start -- --no-sandbox --headless',
       env: {
         NODE_ENV: 'production',
         MCP_API_PORT: 3282
       },
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G'
     }]
   };
   ```

3. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Using systemd

Create `/etc/systemd/system/mcp-router.service`:

```ini
[Unit]
Description=MCP Router Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/mcp-router/apps/electron
ExecStart=/usr/bin/pnpm start -- --no-sandbox --headless
Restart=on-failure
Environment="NODE_ENV=production"
Environment="MCP_API_PORT=3282"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable mcp-router
sudo systemctl start mcp-router
```

## Reverse Proxy Setup

### nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /mcp/ {
        proxy_pass http://localhost:3282/mcp/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # For SSE support
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

## Data Storage

All data is stored locally in:

- **Linux**: `~/.config/mcp-router/`
- **macOS**: `~/Library/Application Support/mcp-router/`
- **Windows**: `%APPDATA%/mcp-router/`

For Docker deployments, mount this directory as a volume to persist data.

## Security Considerations

1. **Use HTTPS** - Always use a reverse proxy with SSL/TLS in production
2. **Network isolation** - Run on a private network or use firewall rules
3. **Authentication** - The MCP protocol supports token-based authentication
4. **Regular updates** - Keep the application updated for security patches
5. **Backup data** - Regularly backup the data directory

## Troubleshooting

### Port Already in Use

```bash
# Find and kill the process using the port
lsof -ti:3282 | xargs kill -9
```

### Permission Denied

```bash
# Run with appropriate permissions or use a higher port number (> 1024)
MCP_API_PORT=8282 pnpm start -- --no-sandbox --headless
```

### Display Error in Headless Mode

Make sure to use the `--no-sandbox` and `--headless` flags:

```bash
xvfb-run -a pnpm start -- --no-sandbox --headless
```

## Limitations

When running in server/headless mode:

- No GUI/tray interface
- No native OS notifications  
- No automatic updates
- Configuration must be done via files or API

## Support

For issues and questions:
- 💬 [Discord Community](https://discord.com/invite/dwG9jPrhxB)
- 🐦 [Follow us on X (Twitter)](https://x.com/mcp_router)
- 🐛 [GitHub Issues](https://github.com/mcp-router/mcp-router/issues)

