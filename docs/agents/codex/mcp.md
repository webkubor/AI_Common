# Codex MCP Servers (Engineering Configuration)

> **定义**: Codex 环境中用于支撑代码生成、截图验证与协作的 MCP 服务列表。

## 🛠 已就绪的服务 (6 Servers)

| Server ID | 核心职能 | 调用层级 | 状态 |
| :--- | :--- | :--- | :--- |
| **playwright** | 核心驱动，用于页面开发、截图与 UI 状态同步。 | **L3** | ✓ Configured |
| **context7** | 库文档查询，确保代码符合最新 API 规范。 | **L3** | ✓ Configured |
| **pencil** | UI 设计编辑器（Antigravity），执行像素级还原。 | **L1** | ✓ Configured |
| **figma** | 外部 Figma MCP 服务，用于读取设计资产。 | **L3** | ✓ URL Hook |
| **notion** | 协作文档服务，用于同步工程设计笔记。 | **L3** | ✓ URL Hook |
| **chrome-devtools**| 浏览器底层调试，收集 Accumulation 阶段日志。 | **Legacy** | ✓ Configured |

## 🔗 配置源 (Source)
所有工具链定义均位于物理文件 `~/.codex/config.toml` 的 `[mcp_servers]` 块中。

---
*Last Sync: 2026-02-05*
