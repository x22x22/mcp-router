/**
 * Web Platform API implementation for browser mode
 * This communicates with the local HTTP API server
 */

import type { PlatformAPI } from "@mcp_router/shared";
import type {
  AuthAPI,
  ServerAPI,
  AppAPI,
  PackageAPI,
  SettingsAPI,
  LogAPI,
  WorkspaceAPI,
  WorkflowAPI,
  ProjectsAPI,
  MCPServer,
  MCPTool,
  CreateServerInput,
  ServerStatus,
  LogQueryOptions,
  LogQueryResult,
  Settings,
  Workspace,
} from "@mcp_router/shared";

const API_BASE_URL = window.location.origin;

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Web implementation of the Platform API
export class WebPlatformAPI implements PlatformAPI {
  auth: AuthAPI;
  servers: ServerAPI;
  apps: AppAPI;
  packages: PackageAPI;
  settings: SettingsAPI;
  logs: LogAPI;
  workspaces: WorkspaceAPI;
  workflows: WorkflowAPI;
  projects: ProjectsAPI;

  constructor() {
    // Initialize auth domain
    this.auth = {
      signIn: async (provider) => {
        // In browser mode, authentication might be handled differently
        throw new Error("Authentication not yet implemented for browser mode");
      },
      signOut: async () => {
        throw new Error("Authentication not yet implemented for browser mode");
      },
      getStatus: async (forceRefresh) => {
        return {
          authenticated: false,
          userId: undefined,
          user: undefined,
          token: undefined,
        };
      },
      handleToken: async (token, state) => {
        throw new Error("Authentication not yet implemented for browser mode");
      },
      onChange: (callback) => {
        // No-op for now
        return () => {};
      },
    };

    // Initialize servers domain - using the existing MCP HTTP server endpoints
    this.servers = {
      list: async () => {
        return apiRequest<MCPServer[]>("/api/servers");
      },
      listTools: async (id) => {
        return apiRequest<MCPTool[]>(`/api/servers/${id}/tools`);
      },
      get: async (id) => {
        return apiRequest<MCPServer | null>(`/api/servers/${id}`);
      },
      create: async (input) => {
        return apiRequest<MCPServer>("/api/servers", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },
      update: async (id, updates) => {
        return apiRequest<MCPServer>(`/api/servers/${id}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        });
      },
      delete: async (id) => {
        await apiRequest(`/api/servers/${id}`, {
          method: "DELETE",
        });
      },
      getStatus: async (id) => {
        return apiRequest<ServerStatus>(`/api/servers/${id}/status`);
      },
      start: async (id) => {
        await apiRequest(`/api/servers/${id}/start`, {
          method: "POST",
        });
      },
      stop: async (id) => {
        await apiRequest(`/api/servers/${id}/stop`, {
          method: "POST",
        });
      },
      restart: async (id) => {
        await apiRequest(`/api/servers/${id}/restart`, {
          method: "POST",
        });
      },
      toggleTool: async (serverId, toolName, enabled) => {
        await apiRequest(`/api/servers/${serverId}/tools/${toolName}`, {
          method: "PUT",
          body: JSON.stringify({ enabled }),
        });
      },
      onChange: (callback) => {
        // TODO: Implement WebSocket or polling for real-time updates
        return () => {};
      },
    };

    // Placeholder implementations for other APIs
    this.apps = {
      list: async () => [],
      get: async (id) => null,
      create: async (input) => {
        throw new Error("Not implemented in browser mode");
      },
      update: async (id, updates) => {
        throw new Error("Not implemented in browser mode");
      },
      delete: async (id) => {
        throw new Error("Not implemented in browser mode");
      },
      onChange: (callback) => () => {},
    };

    this.packages = {
      npm: {
        install: async (packageName, version) => {
          throw new Error("Not implemented in browser mode");
        },
        uninstall: async (packageName) => {
          throw new Error("Not implemented in browser mode");
        },
        isInstalled: async (packageName) => false,
        getInstalledVersion: async (packageName) => null,
        getLatestVersion: async (packageName) => null,
      },
      system: {
        openExternal: async (url) => {
          window.open(url, "_blank");
        },
        getPlatform: async () => {
          const ua = navigator.userAgent;
          if (ua.indexOf("Mac") !== -1) return "darwin";
          if (ua.indexOf("Win") !== -1) return "win32";
          return "linux";
        },
        onProtocolUrl: (callback) => () => {},
      },
    };

    this.settings = {
      get: async () => {
        return apiRequest<Settings>("/api/settings");
      },
      update: async (updates) => {
        return apiRequest<Settings>("/api/settings", {
          method: "PUT",
          body: JSON.stringify(updates),
        });
      },
      onChange: (callback) => () => {},
    };

    this.logs = {
      query: async (options) => {
        return apiRequest<LogQueryResult>("/api/logs/query", {
          method: "POST",
          body: JSON.stringify(options),
        });
      },
      delete: async (options) => {
        await apiRequest("/api/logs", {
          method: "DELETE",
          body: JSON.stringify(options),
        });
      },
    };

    this.workspaces = {
      list: async () => {
        return apiRequest<Workspace[]>("/api/workspaces");
      },
      getActive: async () => {
        return apiRequest<Workspace | null>("/api/workspaces/active");
      },
      create: async (config) => {
        return apiRequest<Workspace>("/api/workspaces", {
          method: "POST",
          body: JSON.stringify(config),
        });
      },
      update: async (id, updates) => {
        return apiRequest<Workspace>(`/api/workspaces/${id}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        });
      },
      delete: async (id) => {
        await apiRequest(`/api/workspaces/${id}`, {
          method: "DELETE",
        });
      },
      switch: async (id) => {
        await apiRequest(`/api/workspaces/${id}/switch`, {
          method: "POST",
        });
      },
      onChange: (callback) => () => {},
    };

    this.workflows = {
      list: async () => [],
      get: async (id) => null,
      create: async (input) => {
        throw new Error("Not implemented in browser mode");
      },
      update: async (id, updates) => {
        throw new Error("Not implemented in browser mode");
      },
      delete: async (id) => {
        throw new Error("Not implemented in browser mode");
      },
      onChange: (callback) => () => {},
    };

    this.projects = {
      list: async () => [],
      get: async (id) => null,
      create: async (input) => {
        throw new Error("Not implemented in browser mode");
      },
      update: async (id, updates) => {
        throw new Error("Not implemented in browser mode");
      },
      delete: async (id) => {
        throw new Error("Not implemented in browser mode");
      },
      onChange: (callback) => () => {},
    };
  }
}

// Export a singleton instance
export const webPlatformAPI = new WebPlatformAPI();
