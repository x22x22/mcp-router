"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Export all domain APIs
__exportStar(require("./domains/app-api"), exports);
__exportStar(require("./domains/auth-api"), exports);
__exportStar(require("./domains/log-api"), exports);
__exportStar(require("./domains/package-api"), exports);
__exportStar(require("./domains/projects-api"), exports);
__exportStar(require("./domains/server-api"), exports);
__exportStar(require("./domains/settings-api"), exports);
__exportStar(require("./domains/workspace-api"), exports);
__exportStar(require("./domains/workflow-api"), exports);
// Export main platform API interface
__exportStar(require("./platform-api"), exports);
//# sourceMappingURL=index.js.map