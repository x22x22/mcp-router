# MCP Router Server Deployment Mode

MCP Router can be deployed as a standalone web server, allowing you to access the UI through a web browser instead of the Electron desktop application.

## Features

- 🌐 Access MCP Router UI from any web browser
- 🖥️ Deploy on a server for team access
- 🔒 All data remains on your server
- 🚀 Simple deployment process

## Building for Server Mode

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Build Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the web UI:**
   ```bash
   cd apps/electron
   pnpm run build:web
   ```

3. **Build the server:**
   ```bash
   pnpm run build:server
   ```

   Or build both at once:
   ```bash
   pnpm run build:standalone
   ```

## Running the Server

### Development Mode

For development with hot reloading:

```bash
cd apps/electron
pnpm run dev:server
```

### Production Mode

After building:

```bash
cd apps/electron
pnpm run start:server
```

Or directly:

```bash
node apps/electron/.webpack/server/server.js
```

## Configuration

You can configure the server using environment variables:

- `PORT` - Web UI port (default: 3000)
- `MCP_API_PORT` - MCP API port (default: 3282)

Example:

```bash
PORT=8080 MCP_API_PORT=8282 pnpm run start:server
```

## Accessing the Application

Once the server is running, you can access:

- **Web UI**: `http://localhost:3000` (or your configured PORT)
- **MCP API**: `http://localhost:3282` (or your configured MCP_API_PORT)

## Deployment

### Using PM2 (Recommended for Production)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the server with PM2:
   ```bash
   pm2 start apps/electron/.webpack/server/server.js --name mcp-router
   ```

3. Save the PM2 process list:
   ```bash
   pm2 save
   ```

4. Set PM2 to start on system boot:
   ```bash
   pm2 startup
   ```

### Using Docker

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine

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

# Build the application
WORKDIR /app/apps/electron
RUN pnpm run build:standalone

# Expose ports
EXPOSE 3000 3282

# Start the server
CMD ["node", ".webpack/server/server.js"]
```

Build and run:

```bash
docker build -t mcp-router .
docker run -p 3000:3000 -p 3282:3282 mcp-router
```

### Using systemd

Create a systemd service file `/etc/systemd/system/mcp-router.service`:

```ini
[Unit]
Description=MCP Router Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/mcp-router/apps/electron
ExecStart=/usr/bin/node .webpack/server/server.js
Restart=on-failure
Environment="PORT=3000"
Environment="MCP_API_PORT=3282"

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable mcp-router
sudo systemctl start mcp-router
```

## Data Storage

In server mode, all data is stored in the same locations as the Electron app:

- **Linux**: `~/.config/mcp-router/`
- **macOS**: `~/Library/Application Support/mcp-router/`
- **Windows**: `%APPDATA%/mcp-router/`

## Security Considerations

When deploying to a server:

1. **Use a reverse proxy** (nginx, Apache) with HTTPS
2. **Set up authentication** if exposing to the internet
3. **Configure firewall rules** to restrict access
4. **Regular backups** of the data directory
5. **Keep the application updated**

### Example nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /mcp/ {
        proxy_pass http://localhost:3282/mcp/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Limitations

The server deployment mode has some limitations compared to the Electron desktop app:

- No native OS integration (tray icon, native menus)
- Some keyboard shortcuts may not work
- File system access is limited to server-side operations
- Automatic updates are not available

## Troubleshooting

### Port Already in Use

If you see an error about ports being in use, either:
1. Stop the process using the port
2. Configure different ports using environment variables

### Cannot Access from Remote Machine

Make sure:
1. The server is listening on 0.0.0.0 (not just localhost)
2. Firewall rules allow incoming connections
3. Use the correct server IP address

### UI Not Loading

Check that:
1. The web UI was built correctly (`pnpm run build:web`)
2. The `.webpack/renderer` directory exists and contains `index.html`
3. Check server logs for errors

## Support

For issues and questions:
- 💬 [Discord Community](https://discord.com/invite/dwG9jPrhxB)
- 🐦 [Follow us on X (Twitter)](https://x.com/mcp_router)
- 🐛 [GitHub Issues](https://github.com/mcp-router/mcp-router/issues)
