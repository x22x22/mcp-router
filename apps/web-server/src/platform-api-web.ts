/**
 * Web-compatible Platform API stub
 * This provides a basic implementation for the web environment
 * In a full implementation, this would connect to REST APIs
 */

// Make it globally available for the web environment
if (typeof window !== 'undefined' && !(window as any).electronAPI) {
  const noop = () => Promise.resolve(false);
  const noopCallback = () => () => {};
  
  (window as any).electronAPI = {
    // Authentication
    login: noop,
    logout: noop,
    getAuthStatus: () => Promise.resolve({ authenticated: false }),
    handleAuthToken: noop,
    onAuthStatusChanged: noopCallback,

    // MCP Servers
    listMcpServers: () => Promise.resolve([]),
    startMcpServer: noop,
    stopMcpServer: noop,
    addMcpServer: noop,
    serverSelectFile: () => Promise.resolve(null),
    removeMcpServer: noop,
    updateMcpServerConfig: noop,
    listMcpServerTools: () => Promise.resolve([]),
    updateToolPermissions: () => Promise.resolve(null),

    // Logging
    getRequestLogs: () => Promise.resolve({ logs: [], total: 0, hasMore: false }),

    // Settings
    getSettings: () => Promise.resolve({
      showWindowOnStartup: true,
      launchAtLogin: false,
      theme: 'system',
      analyticsEnabled: false,
      userId: '',
    }),
    saveSettings: noop,
    incrementPackageManagerOverlayCount: () => Promise.resolve({ success: true, count: 0 }),

    // MCP Apps
    listMcpApps: () => Promise.resolve([]),
    addMcpAppConfig: () => Promise.resolve({ success: false }),
    deleteMcpApp: noop,
    updateAppServerAccess: () => Promise.resolve({ success: false }),
    unifyAppConfig: () => Promise.resolve({ success: false }),

    // Commands
    checkCommandExists: noop,

    // Package Management
    resolvePackageVersionsInArgs: () => Promise.resolve({ success: false }),
    checkMcpServerPackageUpdates: () => Promise.resolve({ success: false }),

    // Feedback
    submitFeedback: noop,

    // Updates
    checkForUpdates: () => Promise.resolve({ updateAvailable: false }),
    installUpdate: noop,
    onUpdateAvailable: noopCallback,

    // Protocol
    onProtocolUrl: noopCallback,

    // Package Managers
    checkPackageManagers: () => Promise.resolve({ node: false, pnpm: false, uv: false }),
    installPackageManagers: () => Promise.resolve({ success: false, installed: { node: false, pnpm: false, uv: false } }),
    restartApp: noop,

    // Workspaces
    listWorkspaces: () => Promise.resolve([]),
    createWorkspace: () => Promise.resolve(null),
    updateWorkspace: () => Promise.resolve({ success: false }),
    deleteWorkspace: () => Promise.resolve({ success: false }),
    switchWorkspace: () => Promise.resolve({ success: false }),
    getCurrentWorkspace: () => Promise.resolve(null),
    getWorkspaceCredentials: () => Promise.resolve({ token: null }),
    onWorkspaceSwitched: noopCallback,
    onWorkspaceConfigChanged: noopCallback,

    // Projects
    listProjects: () => Promise.resolve([]),
    createProject: () => Promise.resolve(null),
    updateProject: () => Promise.resolve(null),
    deleteProject: () => Promise.resolve(),

    // Workflows
    listWorkflows: () => Promise.resolve([]),
    getWorkflow: () => Promise.resolve(null),
    createWorkflow: () => Promise.resolve(null),
    updateWorkflow: () => Promise.resolve(null),
    deleteWorkflow: noop,
    setActiveWorkflow: noop,
    disableWorkflow: noop,
    executeWorkflow: () => Promise.resolve(null),
    getEnabledWorkflows: () => Promise.resolve([]),
    getWorkflowsByType: () => Promise.resolve([]),

    // Hook Modules
    listHookModules: () => Promise.resolve([]),
    getHookModule: () => Promise.resolve(null),
    createHookModule: () => Promise.resolve(null),
    updateHookModule: () => Promise.resolve(null),
    deleteHookModule: noop,
    executeHookModule: () => Promise.resolve(null),
    importHookModule: () => Promise.resolve(null),
    validateHookScript: () => Promise.resolve({ valid: false }),
  };
  
  console.log('Web Platform API initialized');
}
