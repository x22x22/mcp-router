#!/usr/bin/env node

/**
 * Standalone Server Mode Entry Point
 * This file starts MCP Router in server mode without Electron,
 * serving the UI through a web browser.
 */

import path from "node:path";
import express from "express";
import { MCPServerManager } from "./main/modules/mcp-server-manager/mcp-server-manager";
import { AggregatorServer } from "./main/modules/mcp-server-runtime/aggregator-server";
import { MCPHttpServer } from "./main/modules/mcp-server-runtime/http/mcp-http-server";
import { getPlatformAPIManager } from "./main/modules/workspace/platform-api-manager";
import { getWorkspaceService } from "./main/modules/workspace/workspace.service";
import { getSharedConfigManager } from "./main/infrastructure/shared-config-manager";
import { initializeEnvironment } from "./main/utils/environment";

// Global references
let serverManager: MCPServerManager;
let aggregatorServer: AggregatorServer;
let mcpHttpServer: MCPHttpServer;
let webServer: express.Application;

const WEB_UI_PORT = parseInt(process.env.PORT || "3000", 10);
const MCP_API_PORT = parseInt(process.env.MCP_API_PORT || "3282", 10);

/**
 * Initialize the database
 */
async function initDatabase(): Promise<void> {
  try {
    // Initialize shared config manager (includes migration from existing data)
    await getSharedConfigManager().initialize();

    // Workspace service automatically initializes metadata database
    const workspaceService = getWorkspaceService();

    // Get active workspace
    const activeWorkspace = await workspaceService.getActiveWorkspace();
    if (!activeWorkspace) {
      // Create default workspace if none exists
      await workspaceService.switchWorkspace("local-default");
    }
  } catch (error) {
    console.error("Error during database migration:", error);
    throw error;
  }
}

/**
 * Initialize MCP-related services
 */
async function initMCPServices(): Promise<void> {
  // Initialize Platform API Manager (configure workspace DB)
  getPlatformAPIManager().setServerManagerProvider(() => serverManager);
  await getPlatformAPIManager().initialize();

  // Initialize MCPServerManager
  serverManager = new MCPServerManager();

  // Load server list from database
  await serverManager.initializeAsync();

  // Initialize AggregatorServer
  aggregatorServer = new AggregatorServer(serverManager);

  // Initialize and start MCP HTTP server
  mcpHttpServer = new MCPHttpServer(serverManager, MCP_API_PORT, aggregatorServer);

  try {
    await mcpHttpServer.start();
    console.log(`✓ MCP API Server started on port ${MCP_API_PORT}`);
  } catch (error) {
    console.error("Failed to start MCP HTTP Server:", error);
    throw error;
  }
}

/**
 * Start the web UI server
 */
function startWebServer(): void {
  webServer = express();
  
  // Serve static files from the webpack build output
  const staticPath = path.join(__dirname, "../renderer");
  webServer.use(express.static(staticPath));
  
  // SPA fallback - serve index.html for all routes
  webServer.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  
  webServer.listen(WEB_UI_PORT, () => {
    console.log(`✓ Web UI Server started on port ${WEB_UI_PORT}`);
  });
}

/**
 * Main server initialization
 */
async function startServer(): Promise<void> {
  try {
    console.log("🚀 Starting MCP Router in server mode...");
    console.log("");
    
    // Initialize environment
    initializeEnvironment();
    
    // Initialize database
    console.log("📦 Initializing database...");
    await initDatabase();
    
    // Initialize MCP services
    console.log("🔧 Initializing MCP services...");
    await initMCPServices();
    
    // Start web server
    console.log("🌐 Starting web UI server...");
    startWebServer();
    
    console.log("");
    console.log("✨ MCP Router server started successfully!");
    console.log("");
    console.log(`📱 Web UI:  http://localhost:${WEB_UI_PORT}`);
    console.log(`🔌 MCP API: http://localhost:${MCP_API_PORT}`);
    console.log("");
    console.log("Press Ctrl+C to stop the server.");
    console.log("");
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
async function shutdown(signal: string): Promise<void> {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  
  try {
    if (mcpHttpServer) {
      await mcpHttpServer.stop();
    }
    if (aggregatorServer) {
      aggregatorServer.shutdown();
    }
    if (serverManager) {
      serverManager.shutdown();
    }
    console.log("✓ Server stopped");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Start the server
startServer();

