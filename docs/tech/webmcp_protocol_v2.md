# WebMCP 现代发现与运行时协议规范 (v2.0)

## 1. 静态发现层 (Static Discovery)
- **入口声明**: `index.html` 必须包含 `<link rel="alternate" type="application/json" href="/.well-known/webmcp.json" />`。
- **描述文件**: `/.well-known/webmcp.json` 需定义 `name`, `version`, `entry`, `readyEvent` 及 `tools` 列表（含 JSON Schema）。

## 2. 运行时 API 层 (Runtime API)
- **挂载点**: `window.mcp`。
- **核心字段**:
  - `version`: 语义化版本号。
  - `discovery`: 包含 `entry`, `readyEvent`, `alternateLink` 的元数据对象。
  - `ping()`: 返回 `{ ok: true, version, timestamp }`。
- **管理方法**:
  - `registerTool(tool)`: 动态注册。
  - `getTools()`: 获取工具元数据。
  - `callTool(name, args)`: 执行调度。

## 3. 通信与同步 (Sync)
- **启动信号**: 初始化完成后必须抛出 `CustomEvent('webmcp:ready')`。
- **环境隔离**: 需支持通过 `VITE_ENABLE_WEBMCP` 环境变量进行开关控制。

## 4. 最佳实践
- **代码备注**: 驱动层逻辑强制要求详尽的中文备注。
- **参数校验**: (建议) 在 `callTool` 中集成基于 JSON Schema 的参数预校验。
