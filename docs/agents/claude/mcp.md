# Claude MCP Servers (Logical Configuration)

> **定义**: Claude 环境中用于 UI 审计、代码研究与权限管理的 MCP 服务列表。

## 🛠 已就绪的服务

| Server ID | 核心职能 | 调用层级 | 状态 |
| :--- | :--- | :--- | :--- |
| **playwright** | 跨浏览器交互与视觉分析，用于验证 UI 还原度。 | **L3** | ✓ Connected |
| **context7** | 实时 API 文档检索，支持精确的代码重构。 | **L3** | ✓ Connected |
| **pencil** | UI 设计编辑器权限，用于协同设计执行。 | **L1** | ✓ Authorized |
| **chrome-devtools**| 浏览器底层快照与执行，用于深度前端调试。 | **Legacy** | ✓ Authorized |

## 🔗 权限管理 (Permissions)
Claude 拥有以下路径的 **自动授权 (Auto-Approve)** 权限：
- `/Users/webkubor/Documents/CortexOS`
- `/Users/webkubor/Documents/AI_Plan`
- `/Users/webkubor/.gemini/tmp`

---
*Last Sync: 2026-02-05*
