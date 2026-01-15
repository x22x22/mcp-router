#!/bin/bash

# Quick Start Script for MCP Router Web Server
# This script demonstrates how to run the web server in development mode

echo "🚀 Starting MCP Router Web Server..."
echo ""
echo "This will start the server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
pnpm --filter @mcp_router/web-server dev
