export interface ToastMessage {
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
}
export interface DialogState {
    isOpen: boolean;
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export type Theme = "light" | "dark" | "system";
export interface ServerState {
    servers: any[];
    isLoading: boolean;
    isUpdating: string[];
    error: string | null;
    searchQuery: string;
    expandedServerId: string | null;
    selectedServerId: string | null;
}
export interface UIState {
    globalLoading: boolean;
    loadingMessage: string;
    toasts: ToastMessage[];
    dialog: DialogState;
    currentPage: string;
    sidebarOpen: boolean;
    theme: Theme;
}
export interface AuthStoreState {
    isAuthenticated: boolean;
    userId: string | null;
    authToken: string | null;
    userInfo: any | null;
    isLoggingIn: boolean;
    loginError: string | null;
    credits: number | null;
}
//# sourceMappingURL=index.d.ts.map