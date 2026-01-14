export interface ServerVariable {
    name: string;
    value: string;
    description?: string;
    source: "env" | "arg" | "inputParam";
    required?: boolean;
}
export interface ParsedPaymentError {
    isPaymentError: boolean;
    displayMessage: string;
    originalMessage: string;
    code?: string;
    purchaseUrl?: string;
}
export interface LogEntry {
    timestamp: number;
    level: "info" | "warn" | "error" | "debug";
    message: string;
    metadata?: any;
}
export interface PlatformLogEntry {
    id: string;
    timestamp: Date;
    clientId: string;
    serverId: string;
    requestType: string;
    responseStatus: "success" | "error";
    duration?: number;
    error?: string;
    details?: any;
}
export type MCPConnectionResult = {
    status: "success";
    client: any;
} | {
    status: "error";
    error: string;
};
//# sourceMappingURL=utils.d.ts.map