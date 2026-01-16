# Codex MCP Configuration Guide (Codex MCP 配置与管理指南)

## 1. 安装与初始化
Codex CLI 要求 **Node.js 22+**。
```bash
brew install --cask codex
```

## 2. 核心配置文件 (手动操作必看)
**配置文件路径**: `~/.codex/config.toml`

### 手动新增 MCP 服务 (Verified)
在 `~/.codex/config.toml` 中新增 `[mcp_servers.<name>]` 段：

**模式 A: 本地 StdIO 方式**
```toml
[mcp_servers.服务名称]
command = "npx"
args = ["-y", "package-name@latest"]
```

**模式 B: 远程 SSE 方式**
```toml
[mcp_servers.服务名称]
url = "http://localhost:XXXX/sse"
```

## 3. 已验证的真实配置 (Verified Examples)
- **chrome-devtools**:
  ```toml
  [mcp_servers.chrome-devtools]
  command = "npx"
  args = ["chrome-devtools-mcp@latest"]
  ```
- **playwright**:
  ```toml
  [mcp_servers.playwright]
  command = "npx"
  args = ["-y", "@playwright/mcp@latest"]
  ```

## 4. 自动化快捷指令 (CLI 方式)
如果您不想手动编辑 TOML，可使用以下指令：
- **添加 Chrome DevTools**: `codex mcp add chrome-devtools -- npx chrome-devtools-mcp @latest`
- **添加 Playwright**: `codex mcp add playwright -- npx -y @playwright/mcp@latest`
- **添加 GitHub**: `codex mcp add github -- npx -y @modelcontextprotocol/server-github@latest`

## 5. 常用 SOP：连接本机数据库/控制台

### 5.0 Milvus 连接测试与建表（走 Codex skill）

当用户说“连接 Milvus/初始化 Milvus/创建 collection/向量库建表/检查 milvus 状态”时：
- 优先使用 Codex skill：`milvus-setup`
- 默认创建 collection：`ai_common_chunks`
- 默认向量维度：`1536`（可通过 `EMBEDDING_DIM` 覆盖）

如果用户说“打开 Milvus 页面/看 Milvus UI”，或用户只说“milvus”，则使用 Codex skill：`milvus`（会在 Chrome 打开 Attu：`http://127.0.0.1:8000` 并尽量完成连接）。

### 5.1 MinIO 登录（优先 chrome-devtools MCP，在 Chrome 保持标签页）

当用户说“连接数据库 / 打开控制台 / 登录 MinIO / 打开 9001”时：

- 目标：在用户的 **Google Chrome** 中打开并登录，最终停留在 `http://127.0.0.1:9001/browser`。

登录信息（本机开发环境默认值）：
- 地址：`http://127.0.0.1:9001/login`
- 用户名：`minioadmin`
- 密码：`minioadmin`

执行步骤（chrome-devtools MCP）：
1. `list_pages` 获取/确认当前 Chrome 标签页
2. `navigate_page` 打开 `http://127.0.0.1:9001/login`
3. `take_snapshot` 获取表单元素 uid
4. `fill_form` 填充 Username/Password
5. `click` 点击 Login
6. 再次 `take_snapshot` 确认 URL 已变为 `http://127.0.0.1:9001/browser`

> 说明：该方式会在 Chrome 中保留标签页，不会像脚本那样执行完就退出。

### 5.2 退路（Playwright MCP）

- 若 chrome-devtools MCP 因页面结构变化无法稳定定位元素，可退回 Playwright MCP 做更强的定位与操作。