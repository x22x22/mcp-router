/**
 * Platform API interface with consolidated domain structure
 */
import { AuthAPI } from "./domains/auth-api";
import { ServerAPI } from "./domains/server-api";
import { AppAPI } from "./domains/app-api";
import { PackageAPI } from "./domains/package-api";
import { SettingsAPI } from "./domains/settings-api";
import { LogAPI } from "./domains/log-api";
import { WorkspaceAPI } from "./domains/workspace-api";
import { WorkflowAPI } from "./domains/workflow-api";
import { ProjectsAPI } from "./domains/projects-api";
/**
 * Main Platform API interface with domain-driven structure
 * Consolidates related functionality into logical domains
 */
export interface PlatformAPI {
    auth: AuthAPI;
    servers: ServerAPI;
    apps: AppAPI;
    packages: PackageAPI;
    settings: SettingsAPI;
    logs: LogAPI;
    workspaces: WorkspaceAPI;
    workflows: WorkflowAPI;
    projects: ProjectsAPI;
}
//# sourceMappingURL=platform-api.d.ts.map