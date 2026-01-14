export interface McpRouterConfig {
    command: string;
    args: string[];
    env?: {
        MCPR_TOKEN?: string;
    };
}
export interface StandardAppConfig {
    mcpServers: {
        "mcp-router": McpRouterConfig;
    };
}
export interface VSCodeAppConfig {
    servers: {
        "mcp-router": McpRouterConfig;
    };
}
export type ClientType = "vscode" | "claude" | "cline" | "windsurf" | "cursor" | "codex";
export interface ClientConfig {
    type: ClientType;
    path: string;
    content?: any;
}
//# sourceMappingURL=mcp-apps.d.ts.map