/**
 * トークン関連の型定義
 */
/**
 * サーバーアクセス権限のマップ
 */
export type TokenServerAccess = Record<string, boolean>;
/**
 * トークンのインターフェース
 */
export interface Token {
    id: string;
    clientId: string;
    issuedAt: number;
    serverAccess: TokenServerAccess;
}
/**
 * トークン生成時のオプション
 */
export interface TokenGenerateOptions {
    clientId: string;
    serverAccess: TokenServerAccess;
    expiresIn?: number;
}
/**
 * トークン検証の結果
 */
export interface TokenValidationResult {
    isValid: boolean;
    clientId?: string;
    error?: string;
}
//# sourceMappingURL=token-types.d.ts.map