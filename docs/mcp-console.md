# 🎛️ CortexOS MCP 工具控制台 (MCP Console)

> **“工具是手的延伸。感知每一项 MCP 能力，掌控全量自动化接口。”**

---

## 🛠️ 1. MCP 服务全量索引 (MCP Service Index)

这是目前全舰队已装载的 **MCP Tool Servers**。它们是 Agent 与物理世界交互的唯一窗口。

| 服务名称 | 核心工具 (Tools) | 配置路径 (Config) | 状态 |
| :--- | :--- | :--- | :--- |
| **`chrome-devtools`** | `browser_navigate`, `browser_click`, `browser_snapshot` | `~/.gemini/extensions/chrome-devtools-mcp` | 🟢 活跃 |
| **`mcp-obsidian`** | **`write_note`**, `read_note`, `patch_note`, `search_notes` | `Obsidian MCP Server (External)` | 🟢 活跃 |
| **`nanobanana`** | `generate_image`, `edit_image`, `generate_story` | `~/.gemini/extensions/nanobanana` | 🟢 活跃 |
| **`github-mcp`** | `github_get_issue`, `github_create_pull_request` | `~/.gemini/extensions/github` | 🟢 活跃 |
| **`context7`** | `query-docs`, `resolve-library-id` | `~/.gemini/extensions/context7` | 🟢 活跃 |
| **`mcp-toolbox`** | `list_databases`, `query_table`, `analyze_schema` | `~/.gemini/extensions/mcp-toolbox` | 🟢 活跃 |

---

## 🔍 2. 语义查询与执行 SOP (Reusable Query Protocol)

> **Agent 必读：当你进入本项目且由于沙箱限制无法感知全局时，必须按此顺序操作：**

1.  **[入口感知]**: 首先读取 `docs/router.md`。这是大脑的最高协议，包含了所有动态路由。
2.  **[技能对齐]**: 读取 `docs/skills.md` (或 `CortexOS_Control_Center.md`)。确认你是否拥有处理当前任务所需的 **Skill 包**。
3.  **[工具自检]**: 访问本页面 (`docs/mcp-console.md`)。确认你是否拥有操作物理文件的 **MCP 工具**。
4.  **[语义 RAG]**: 如果以上路径均无果，执行 `search_knowledge` 或调用 `query_brain.py` 进行跨目录语义检索。
5.  **[操作留痕]**: 任何针对基础设施（MCP/Skill）的安装或修改，必须在 `logs/` 下创建独立的 `infra-install` 日志。

---

## 🚦 3. 管理与调试指令

- **查看所有扩展**: `gemini extensions list`
- **更新 MCP 配置**: `gemini extensions update <name>`
- **验证工具连通性**: 执行该 MCP 对应的 `validate` 脚本或调用简单的 `list` 类工具。

---
*Managed by Brain Sentinel | Little Candle (小烛) | 2026-03-04*
