/**
 * リクエストログ関連の型定義
 */
import { CursorPaginationOptions, CursorPaginationResult } from "./pagination";
/**
 * リクエストログエントリのインターフェース
 */
export interface RequestLogEntry {
    id: string;
    timestamp: number;
    clientId: string;
    clientName: string;
    serverId: string;
    serverName: string;
    requestType: string;
    requestParams: any;
    responseStatus: "success" | "error";
    responseData?: any;
    duration: number;
    errorMessage?: string;
}
/**
 * リクエストログ新規作成時の入力インターフェース（idとtimestampは自動生成）
 */
export type RequestLogEntryInput = Omit<RequestLogEntry, "id" | "timestamp">;
/**
 * リクエストログクエリのフィルターオプション
 */
export interface RequestLogFilters {
    clientId?: string;
    serverId?: string;
    requestType?: string;
    startDate?: Date;
    endDate?: Date;
    responseStatus?: "success" | "error";
}
/**
 * リクエストログクエリのオプション
 */
export interface RequestLogQueryOptions extends RequestLogFilters, CursorPaginationOptions {
}
/**
 * リクエストログクエリの結果
 */
export interface RequestLogQueryResult extends CursorPaginationResult<RequestLogEntry> {
    logs: RequestLogEntry[];
}
/**
 * MCP Manager用のシンプルなリクエストログエントリ
 */
export interface McpManagerRequestLogEntry {
    timestamp: string;
    requestType: string;
    params: any;
    result: "success" | "error";
    errorMessage?: string;
    response?: any;
    duration: number;
    clientId: string;
}
/**
 * MCP Aggregatorサーバーの定数
 */
export declare const AGGREGATOR_SERVER_ID = "mcp-router-aggregator";
export declare const AGGREGATOR_SERVER_NAME = "MCP Router Aggregator";
//# sourceMappingURL=log-types.d.ts.map