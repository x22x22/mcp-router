# Server Deployment Mode

MCP Router now supports a server deployment mode, allowing you to deploy it to a server and access the UI through a web browser.

![Web Server UI](https://github.com/user-attachments/assets/162e7ec6-3c3a-4792-b2a7-e67c40fdfa60)

## 🌐 Web Server

The web server mode provides a browser-accessible interface for MCP Router without requiring the Electron desktop application.

### Quick Start

1. **Development Mode**
   ```bash
   pnpm --filter @mcp_router/web-server dev
   ```

2. **Production Build**
   ```bash
   pnpm --filter @mcp_router/web-server build
   pnpm --filter @mcp_router/web-server start
   ```

3. **Access the UI**
   - Open your browser to `http://localhost:3000`
   - The server will serve the MCP Router UI

### Configuration

You can configure the server using environment variables:

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)

### Deployment

#### Docker (Coming Soon)

```bash
# Build the Docker image
docker build -t mcp-router-web .

# Run the container
docker run -p 3000:3000 mcp-router-web
```

#### Traditional Server

```bash
# Build the project
pnpm --filter @mcp_router/web-server build

# Copy the dist directory and node_modules to your server
# Start the server
PORT=3000 node dist/server.js
```

### Architecture

The web server mode consists of:

1. **Express Server**: Serves the web UI and provides REST API endpoints
2. **React UI**: The same UI used in the Electron app, built as a standalone web app
3. **REST API**: Exposes MCP functionality through HTTP endpoints
4. **Static File Serving**: Serves the built React application

### API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /mcp` - MCP protocol endpoint (authentication required)
- `GET /*` - Serves the React UI (SPA fallback)

### Development Status

Current implementation status:

- ✅ Basic web server setup
- ✅ Static file serving
- ✅ Health check endpoint
- 🚧 Full UI integration (in progress)
- 🚧 REST API for all MCP operations (in progress)
- 🚧 WebSocket support for real-time updates (planned)
- 🚧 Authentication and authorization (planned)

### Security Considerations

When deploying to a server:

1. **Use HTTPS**: Always deploy behind a reverse proxy with SSL/TLS
2. **Authentication**: Implement proper authentication (coming soon)
3. **Firewall**: Configure firewall rules to restrict access
4. **Environment Variables**: Store sensitive data in environment variables
5. **Regular Updates**: Keep dependencies up to date

### Differences from Desktop App

The web server mode differs from the desktop app in the following ways:

- **No Electron**: Runs as a pure Node.js application
- **Browser UI**: Accessed through a web browser instead of a native window
- **REST API**: Uses HTTP instead of IPC for communication
- **Multi-user** (future): Can be configured to support multiple users
- **Remote Access**: Can be accessed from any device on the network

### Future Enhancements

- Full React UI integration
- Complete REST API implementation
- User authentication and authorization
- Multi-user support
- WebSocket for real-time updates
- Docker image
- Kubernetes deployment manifests
- Environment-specific configurations
- Logging and monitoring

## Desktop App (Existing)

The Electron desktop application continues to work as before with no changes required.

For desktop app documentation, see the main README.md file.
