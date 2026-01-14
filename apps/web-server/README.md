# MCP Router Web Server

A standalone web server for MCP Router that can be deployed to servers and accessed through a browser.

![MCP Router Web Server UI](https://github.com/user-attachments/assets/162e7ec6-3c3a-4792-b2a7-e67c40fdfa60)

## 🌐 Overview

This package provides a web-based deployment mode for MCP Router, allowing you to:
- Deploy MCP Router to a server
- Access the UI through a web browser
- Manage MCP servers remotely
- Use MCP Router without installing the desktop application

## 🚀 Getting Started

### Quick Start

```bash
# From the root of the repository
pnpm install

# Build the web server (required before first run)
pnpm --filter @mcp_router/web-server build

# Start the development server
pnpm --filter @mcp_router/web-server dev

# Or use the convenience script
cd apps/web-server
./start-dev.sh
```

The server will start on `http://localhost:3000` by default.

### Development

```bash
# Install dependencies (from root)
pnpm install

# Build the project (compiles server + UI)
pnpm --filter @mcp_router/web-server build

# Start the development server (with hot reload)
pnpm --filter @mcp_router/web-server dev

# Type check
pnpm --filter @mcp_router/web-server typecheck
```

The server will start on `http://localhost:3000` by default.

### Production Build

```bash
# Build the server and UI
pnpm --filter @mcp_router/web-server build

# Start the production server
pnpm --filter @mcp_router/web-server start

# Or run directly
cd apps/web-server
node dist/server.js
```

**Important:** You must run `build` before `start` in production. The build process:
1. Compiles the TypeScript server code → `dist/server.js`
2. Bundles the React UI with Webpack → `dist/public/`
3. Prepares all assets for serving

### Environment Variables

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)
- `NODE_ENV`: Environment mode (development/production)

Example:
```bash
PORT=8080 NODE_ENV=production pnpm --filter @mcp_router/web-server start
```

## 📁 Project Structure

```
apps/web-server/
├── src/
│   └── server.ts       # Main server entry point
├── public/             # Static files served to the browser
│   └── index.html      # Main HTML file
├── scripts/            # Build scripts
│   └── build.js        # Build script for copying assets
├── dist/               # Compiled output (generated)
├── package.json
├── tsconfig.json
├── start-dev.sh        # Convenience script for development
└── README.md
```

## 🔧 Development Status

This is an initial implementation providing:
- ✅ Basic web server setup with Express
- ✅ Static file serving
- ✅ Health check endpoint (`/api/health`)
- ✅ CORS support
- ✅ Production build support
- 🚧 Full UI integration (in progress)
- 🚧 REST API for MCP operations (in progress)
- 🚧 Authentication (planned)
- 🚧 WebSocket support (planned)

## 🌐 API Endpoints

Current endpoints:

- `GET /api/health` - Health check endpoint
  ```json
  {
    "status": "ok",
    "message": "MCP Router Web Server is running"
  }
  ```

- `GET /*` - Serves the static UI (SPA fallback)

Coming soon:
- `POST /mcp` - MCP protocol endpoint (authentication required)
- `GET /api/servers` - List MCP servers
- `POST /api/servers` - Add MCP server
- And more...

## 🚀 Deployment

### Local Deployment

```bash
# Build the project
pnpm --filter @mcp_router/web-server build

# Start the server
PORT=3000 node apps/web-server/dist/server.js
```

### Docker Deployment (Coming Soon)

```bash
# Build the Docker image
docker build -t mcp-router-web -f apps/web-server/Dockerfile .

# Run the container
docker run -p 3000:3000 mcp-router-web
```

### Traditional Server Deployment

1. Build the project:
   ```bash
   pnpm --filter @mcp_router/web-server build
   ```

2. Copy these directories to your server:
   - `apps/web-server/dist/`
   - `apps/web-server/node_modules/` (or run `pnpm install --prod` on the server)
   - `apps/web-server/package.json`

3. Start the server:
   ```bash
   PORT=3000 NODE_ENV=production node dist/server.js
   ```

4. (Recommended) Use a process manager like PM2:
   ```bash
   pm2 start dist/server.js --name mcp-router-web
   ```

## 🔒 Security Considerations

When deploying to a production server:

1. **Use HTTPS**: Always deploy behind a reverse proxy (nginx/Apache) with SSL/TLS
2. **Firewall**: Configure firewall rules to restrict access
3. **Environment Variables**: Store sensitive data in environment variables, never in code
4. **Authentication**: Enable authentication (coming soon)
5. **Regular Updates**: Keep dependencies up to date
6. **Monitoring**: Set up logging and monitoring

Example nginx configuration:
```nginx
server {
    listen 443 ssl;
    server_name mcp-router.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🆚 Differences from Desktop App

The web server mode differs from the desktop app:

| Feature | Desktop App | Web Server |
|---------|-------------|------------|
| Platform | Electron | Node.js + Express |
| UI Access | Native window | Web browser |
| Communication | IPC | REST API |
| Multi-user | Single user | Multi-user (future) |
| Installation | Download & install | Deploy to server |
| Updates | Auto-update | Manual deployment |
| Remote Access | No | Yes |

## 🛣️ Roadmap

- [ ] Full React UI integration
- [ ] Complete REST API implementation
- [ ] User authentication and authorization
- [ ] WebSocket support for real-time updates
- [ ] Multi-user support with user management
- [ ] Docker image and Kubernetes manifests
- [ ] Database persistence
- [ ] API rate limiting
- [ ] Comprehensive logging and monitoring
- [ ] Health check dashboard
- [ ] Configuration management UI

## 📝 License

See the root LICENSE.md file for details.

## 🤝 Contributing

Contributions are welcome! Please see the root CONTRIBUTING.md file for guidelines.

## 📚 Additional Documentation

For more detailed deployment instructions and architecture information, see:
- [Server Deployment Guide](../../docs/SERVER_DEPLOYMENT.md)
- [Main README](../../README.md)

