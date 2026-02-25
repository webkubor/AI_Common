---
id: webmcp-master
triggers: ["webmcp", "ai-mcp", "window.mcp", "网页AI化", "mcp改造", "实现webmcp规范"]
mcp_requirements: ["chrome-devtools"]
priority: 1
---
# WebMCP Master Skill (AI-Native Web Protocol v2.0)

## 技能定位
本技能旨在将网页进行 **WebMCP (Model Context Protocol)** 深度改造，使其具备“全自动 AI 探测性”与“结构化 AI 操作性”。通过建立“静态描述文件 + 运行时接口 + 异步就绪事件”的三位一体架构，让 AI 代理（如 Gemini, Claude）能够无缝感知网页上下文、执行导航与视觉分析。

## 触发条件
- "给网站加个 MCP 接口"
- "进行 webmcp 改造"
- "让 AI 能直接控制这个页面"
- "实现 WebMCP v2.0 规范"

## 标准化工作流 (Workflow v2.0)

### 阶段 A: 静态发现配置 (Static Discovery)
1. **埋桩声明**: 在 `index.html` 的 `<head>` 中添加：
   `<link rel="alternate" type="application/json" href="/.well-known/webmcp.json" />`
2. **描述文件**: 在 `public/.well-known/webmcp.json` 中定义元数据：
   - 包含 `name`, `version`, `entry`, `readyEvent`。
   - 详尽列出 `tools` 的名称、描述及 JSON Schema。

### 阶段 B: 核心驱动开发 (Infrastructure)
1. **定义接口**: 必须包含 `MCPTool` 和 `MCPPublicAPI`。
2. **增强 API**: `window.mcp` 必须暴露 `discovery` 对象（对齐静态配置）。
3. **实现 Registry**: 封装 `WebMCPRegistry` 类，管理工具注册与调度。
4. **注入环境**: 将 API 挂载至 `window.mcp`。

### 阶段 C: 基础工具集 (Core Tools)
默认必须集成（需包含详尽中文备注）：
- `getPageContext`: 获取标题、URL、SEO 元数据。
- `listPageLinks`: 提取页面所有交互链接。
- `capturePageSnapshot`: 利用 `dom-to-image-more` 捕获视觉快照。

### 阶段 D: 异步就绪与事件 (Events)
1. **抛出信号**: 初始化末尾必须派发 `CustomEvent('webmcp:ready')`。
2. **监听机制**: 允许外部 AI 代理通过事件监听实现“即插即用”。

### 阶段 E: 项目集成与控制 (Integration)
1. **初始化**: 在 `main.ts` 中调用 `setupWebMCP()`。
2. **开关控制**: 默认通过 `import.meta.env.DEV || import.meta.env.VITE_ENABLE_WEBMCP` 判断。

## 核心代码规范 (v2.0)

### 1. 运行时模板要求
- **中文备注**: 接口与核心逻辑必须配备“保姆级”中文注释。
- **参数校验**: (推荐) 在 `callTool` 中集成 JSON Schema 校验。

### 2. 截图优化
- 支持配置 `quality`, `bgcolor`, `includeData` 等参数，优化数据传输体积。

## 验收清单 (Checklist)
- [ ] `index.html` 是否有 `<link>` 探测桩？
- [ ] `/.well-known/webmcp.json` 是否已创建且工具定义完整？
- [ ] `window.mcp.discovery` 是否能正确返回入口与事件名？
- [ ] 是否观察到 `webmcp:ready` 事件抛出？
- [ ] 核心驱动代码是否包含详尽的中文备注？
