# MCP Router 服务器部署模式

MCP Router 支持作为独立的 Web 服务器部署，允许您通过 Web 浏览器访问 UI，而不是使用 Electron 桌面应用程序。

## 快速开始

### 方案 1：使用 Electron 无头服务器模式（推荐）

部署 MCP Router 作为服务器的最简单方法是使用现有的 Electron 应用程序，但不显示窗口界面：

1. **安装依赖：**
   ```bash
   pnpm install
   ```

2. **构建应用程序：**
   ```bash
   pnpm run build
   ```

3. **以无头模式运行：**
   ```bash
   # MCP API 将在 3282 端口上可用
   cd apps/electron
   pnpm start -- --no-sandbox --headless
   ```

### 方案 2：Docker 部署

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:20-slim

# 为 Electron 安装依赖
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/electron/package.json ./apps/electron/
COPY packages/ ./packages/

# 安装 pnpm 和依赖
RUN npm install -g pnpm@10.22.0
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/electron/ ./apps/electron/
COPY turbo.json ./

# 构建应用程序
WORKDIR /app
RUN pnpm run build --filter=@mcp_router/electron

# 暴露端口
EXPOSE 3282

# 启动服务器
WORKDIR /app/apps/electron
CMD ["pnpm", "start", "--", "--no-sandbox", "--headless"]
```

构建并运行：

```bash
docker build -t mcp-router .
docker run -p 3282:3282 -v ~/mcp-router-data:/root/.config/mcp-router mcp-router
```

## 访问 MCP Router

在服务器模式下运行后：

- **MCP API 端点**: `http://localhost:3282/mcp`
- **SSE 端点**: `http://localhost:3282/mcp/sse`

将您的 MCP 客户端（Claude、Cline 等）连接到 `http://your-server:3282`

## 配置

使用环境变量配置服务器：

- `MCP_API_PORT` - MCP API 端口（默认：3282）
- `NODE_ENV` - 生产环境部署时设置为 `production`

示例：

```bash
MCP_API_PORT=8282 NODE_ENV=production pnpm start -- --no-sandbox --headless
```

## 生产环境部署

### 使用 PM2

1. 全局安装 PM2：
   ```bash
   npm install -g pm2
   ```

2. 创建生态系统文件 `ecosystem.config.js`：
   ```javascript
   module.exports = {
     apps: [{
       name: 'mcp-router',
       cwd: './apps/electron',
       script: 'pnpm',
       args: 'start -- --no-sandbox --headless',
       env: {
         NODE_ENV: 'production',
         MCP_API_PORT: 3282
       },
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G'
       }]
   };
   ```

3. 使用 PM2 启动：
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### 使用 systemd

创建 `/etc/systemd/system/mcp-router.service`：

```ini
[Unit]
Description=MCP Router 服务器
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/mcp-router/apps/electron
ExecStart=/usr/bin/pnpm start -- --no-sandbox --headless
Restart=on-failure
Environment="NODE_ENV=production"
Environment="MCP_API_PORT=3282"

[Install]
WantedBy=multi-user.target
```

启用并启动：

```bash
sudo systemctl enable mcp-router
sudo systemctl start mcp-router
```

## 反向代理设置

### nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /mcp/ {
        proxy_pass http://localhost:3282/mcp/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # SSE 支持
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

## 数据存储

所有数据本地存储在：

- **Linux**: `~/.config/mcp-router/`
- **macOS**: `~/Library/Application Support/mcp-router/`
- **Windows**: `%APPDATA%/mcp-router/`

对于 Docker 部署，将此目录挂载为卷以持久化数据。

## 安全注意事项

1. **使用 HTTPS** - 生产环境中始终使用带 SSL/TLS 的反向代理
2. **网络隔离** - 在私有网络上运行或使用防火墙规则
3. **身份验证** - MCP 协议支持基于令牌的身份验证
4. **定期更新** - 保持应用程序更新以获取安全补丁
5. **备份数据** - 定期备份数据目录

## 故障排除

### 端口已被占用

```bash
# 查找并终止使用该端口的进程
lsof -ti:3282 | xargs kill -9
```

### 权限被拒绝

```bash
# 使用适当的权限运行或使用更高的端口号（> 1024）
MCP_API_PORT=8282 pnpm start -- --no-sandbox --headless
```

### 无头模式下的显示错误

确保使用 `--no-sandbox` 和 `--headless` 标志：

```bash
xvfb-run -a pnpm start -- --no-sandbox --headless
```

## 限制

在服务器/无头模式下运行时：

- 没有 GUI/托盘界面
- 没有原生操作系统通知  
- 没有自动更新
- 必须通过文件或 API 进行配置

## 支持

有关问题和疑问：
- 💬 [Discord 社区](https://discord.com/invite/dwG9jPrhxB)
- 🐦 [关注我们的 X (Twitter)](https://x.com/mcp_router)
- 🐛 [GitHub Issues](https://github.com/mcp-router/mcp-router/issues)
