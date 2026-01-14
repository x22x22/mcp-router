import type { TokenServerAccess } from "./token-types";
export interface McpApp {
    name: string;
    installed: boolean;
    configPath: string;
    configured: boolean;
    token?: string;
    serverAccess?: TokenServerAccess;
    isCustom?: boolean;
    hasOtherServers?: boolean;
    icon?: string;
}
export interface McpAppsManagerResult {
    success: boolean;
    message: string;
    app?: McpApp;
}
export interface PackageUpdateInfo {
    packageName: string;
    currentVersion: string | null;
    latestVersion: string | null;
    updateAvailable: boolean;
}
export interface ServerPackageUpdates {
    packages: PackageUpdateInfo[];
    hasUpdates: boolean;
}
//# sourceMappingURL=mcp-app-types.d.ts.map