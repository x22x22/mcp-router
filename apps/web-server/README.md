# MCP Router Web Server

A standalone web server for MCP Router that can be deployed to servers and accessed through a browser.

## 🌐 Overview

This package provides a web-based deployment mode for MCP Router, allowing you to:
- Deploy MCP Router to a server
- Access the UI through a web browser
- Manage MCP servers remotely
- Use MCP Router without installing the desktop application

## 🚀 Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm --filter @mcp_router/web-server dev
```

The server will start on `http://localhost:3000` by default.

### Production Build

```bash
# Build the server
pnpm --filter @mcp_router/web-server build

# Start the production server
pnpm --filter @mcp_router/web-server start
```

### Environment Variables

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)

## 📁 Project Structure

```
apps/web-server/
├── src/
│   └── server.ts       # Main server entry point
├── public/             # Static files served to the browser
│   └── index.html      # Main HTML file
├── scripts/            # Build scripts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development Status

This is an initial implementation providing:
- ✅ Basic web server setup
- ✅ Static file serving
- ✅ Health check endpoint
- 🚧 Full UI integration (in progress)
- 🚧 REST API for MCP operations (in progress)
- 🚧 Authentication (planned)

## 📝 License

See the root LICENSE.md file for details.
