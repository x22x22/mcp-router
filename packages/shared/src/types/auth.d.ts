export interface UserInfo {
    userId: string;
    name: string;
    creditBalance: number;
    paidCreditBalance: number;
}
export interface PKCEAuthState {
    codeVerifier: string;
    codeChallenge: string;
    state: string;
    idp?: string;
    createdAt: number;
}
//# sourceMappingURL=auth.d.ts.map