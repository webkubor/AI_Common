# 主流 Agent 配置总览

这页专门回答一个问题：**你的 Agent 配置文件到底在哪。**

## 快速定位

| Agent | 配置文件 | Skills 目录 | 说明 |
| :--- | :--- | :--- | :--- |
| Gemini CLI | `~/.gemini/settings.json` | `~/.gemini/skills/` | MCP 用 JSON 配置 |
| Codex | `~/.codex/config.toml` | `~/.codex/skills/` | MCP 用 TOML 配置 |
| Claude | `~/.claude/settings.json` | `~/.claude/skills/` | 以 Claude 本地配置为准 |
| OpenCode | 项目内 `.opencode/` | `.opencode/skills/` | 通常是项目级配置 |

## CortexOS MCP 要加到哪里

- Gemini CLI：加到 `~/.gemini/settings.json` 的 `mcpServers`
- Codex：加到 `~/.codex/config.toml` 的 `[mcp_servers]`
- Claude：加到 `~/.claude/settings.json` 的 `mcpServers`

## 详细档案

- [Gemini 配置档案](./gemini/README.md)
- [Gemini MCP 清单](./gemini/mcp.md)
- [Codex 配置档案](./codex/README.md)
- [Codex MCP 清单](./codex/mcp.md)
- [Claude 配置档案](./claude/README.md)
- [Claude MCP 清单](./claude/mcp.md)
- [OpenCode 配置档案](./opencode/README.md)

## 维护约定

- 新增一个 Agent，就在 `docs/agents/<agent>/` 建目录并补 `README.md` 与 `mcp.md`。
- 配置有变更时，必须同步更新这页的“快速定位”表，保证用户入口不失效。
