/**
 * Web-compatible Platform API with in-memory storage
 * This provides a basic implementation for the web environment
 * Data persists in memory during the session (browser localStorage for persistence across reloads)
 */

// In-memory storage for web mode
const webStorage = {
  servers: [] as any[],
  apps: [] as any[],
  workspaces: [] as any[],
  projects: [] as any[],
  workflows: [] as any[],
  hookModules: [] as any[],
};

// Try to load from localStorage if available
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const stored = localStorage.getItem('mcp-router-web-data');
    if (stored) {
      const data = JSON.parse(stored);
      Object.assign(webStorage, data);
      console.log('Loaded data from localStorage:', webStorage);
    }
  } catch (e) {
    console.warn('Failed to load data from localStorage:', e);
  }
}

// Save to localStorage
function saveToStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('mcp-router-web-data', JSON.stringify(webStorage));
      console.log('Saved data to localStorage');
    } catch (e) {
      console.warn('Failed to save data to localStorage:', e);
    }
  }
}

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

    // MCP Servers - with in-memory storage
    listMcpServers: () => {
      console.log('listMcpServers called, returning:', webStorage.servers);
      return Promise.resolve([...webStorage.servers]);
    },
    
    addMcpServer: (input: any) => {
      console.log('addMcpServer called with:', input);
      const newServer = {
        id: `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: input.name || 'Unnamed Server',
        config: input,
        status: { type: 'stopped' },
        createdAt: new Date().toISOString(),
        ...input,
      };
      webStorage.servers.push(newServer);
      saveToStorage();
      console.log('Server added:', newServer);
      console.log('All servers:', webStorage.servers);
      return Promise.resolve(newServer);
    },
    
    removeMcpServer: (id: string) => {
      console.log('removeMcpServer called with id:', id);
      const index = webStorage.servers.findIndex(s => s.id === id);
      if (index !== -1) {
        webStorage.servers.splice(index, 1);
        saveToStorage();
        console.log('Server removed, remaining servers:', webStorage.servers);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    
    updateMcpServerConfig: (id: string, config: any) => {
      console.log('updateMcpServerConfig called with id:', id, 'config:', config);
      const server = webStorage.servers.find(s => s.id === id);
      if (server) {
        Object.assign(server, config);
        saveToStorage();
        console.log('Server updated:', server);
        return Promise.resolve(server);
      }
      return Promise.resolve(null);
    },
    
    startMcpServer: (id: string) => {
      console.log('startMcpServer called with id:', id);
      const server = webStorage.servers.find(s => s.id === id);
      if (server) {
        server.status = { type: 'running' };
        saveToStorage();
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    
    stopMcpServer: (id: string) => {
      console.log('stopMcpServer called with id:', id);
      const server = webStorage.servers.find(s => s.id === id);
      if (server) {
        server.status = { type: 'stopped' };
        saveToStorage();
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    
    serverSelectFile: () => Promise.resolve(null),
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
    listMcpApps: () => Promise.resolve([...webStorage.apps]),
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
    listWorkspaces: () => Promise.resolve([...webStorage.workspaces]),
    createWorkspace: () => Promise.resolve(null),
    updateWorkspace: () => Promise.resolve({ success: false }),
    deleteWorkspace: () => Promise.resolve({ success: false }),
    switchWorkspace: () => Promise.resolve({ success: false }),
    getCurrentWorkspace: () => Promise.resolve(null),
    getWorkspaceCredentials: () => Promise.resolve({ token: null }),
    onWorkspaceSwitched: noopCallback,
    onWorkspaceConfigChanged: noopCallback,

    // Projects
    listProjects: () => Promise.resolve([...webStorage.projects]),
    createProject: () => Promise.resolve(null),
    updateProject: () => Promise.resolve(null),
    deleteProject: () => Promise.resolve(),

    // Workflows
    listWorkflows: () => Promise.resolve([...webStorage.workflows]),
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
    listHookModules: () => Promise.resolve([...webStorage.hookModules]),
    getHookModule: () => Promise.resolve(null),
    createHookModule: () => Promise.resolve(null),
    updateHookModule: () => Promise.resolve(null),
    deleteHookModule: noop,
    executeHookModule: () => Promise.resolve(null),
    importHookModule: () => Promise.resolve(null),
    validateHookScript: () => Promise.resolve({ valid: false }),
  };
  
  console.log('Web Platform API initialized with in-memory storage');
}
