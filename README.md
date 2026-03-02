# 🧠 CortexOS — 大脑操作系统 v5.0

> **"不是聊天框，是接口标准。我是老爹的外挂硬盘，MCP 是我们之间的 USB-C。"**
>
> 本项目是 **webkubor (老爹)** 的外部大脑 (Exocortex) 与 AI 舰队协同中枢。它由三层组成：可视化的 **VitePress 知识库**、对 AI 开放的 **MCP Server 接口层**，以及多 Agent 防碰撞的 **Fleet 编排系统**。

---

## ⚡ 这是什么？一句话理解

```
老爹（你）
  │
  │  说意图
  ▼
AI Agent（Gemini / Codex / Claude Code）
  │
  │  调用 Tool（强类型合约，不靠猜）
  ▼
MCP Server（mcp_server/server.py）← 外脑的 USB-C 接口
  │
  │  读写
  ▼
AI_Common（你的外挂硬盘：规则 + 记忆 + 任务状态）
```

| 角色 | 类比 | 实体 |
| :--- | :--- | :--- |
| **老爹** | 决定插哪台设备的人 | 你 |
| **外部大脑** | USB 外接硬盘（知识 + 规则） | `AI_Common/` 目录 |
| **MCP Server** | USB-C 接口（标准通信协议） | `mcp_server/server.py` |
| **Codex / Gemini / Claude** | 接收插入的电脑 | 各 AI Agent |
| **Fleet Dashboard** | 硬盘状态指示灯 | VitePress AI Team 看板 |

---

## 🚀 AI 舰队系统 (Agent Team)

### 什么是 Agent Team？

老爹在本地同时跑多个 AI（Gemini + Codex + Claude Code），每个 AI 就是一个**执行节点（Agent）**。它们在同一个工作路径上操作时，极易发生**文件覆盖、状态不同步、互相不知道对方在干嘛**的问题。

Agent Team 系统解决的就是这个问题：**让所有 AI 共享同一块外脑，并在开工前强制打卡报到，状态实时可见。**

### 舰队状态看板

访问 VitePress 站点的 **[AI Team 看板](/ai-team)**，实时查看全体 Agent 状态：

- 当前进行中的任务节点与进度
- 队长节点（0号机）标识
- 历史离线成员记录

### 快速入队（三大 AI 通用）

```bash
cd /Users/webkubor/Documents/AI_Common
pnpm run fleet:claim -- --workspace "$PWD" --task "你的当前任务" --agent Gemini
```

参数说明：

- `--agent`: `Gemini` / `Codex` / `Claude`
- `--alias`: 人格别名（可选，如 `Candy`）
- 自动判定机号（0号机 / n号机），防并行冲突
- 同路径多模型在线时给出告警（不拦截）

### 一键启动别名（配置在 `~/.zshrc`）

| 命令 | 效果 |
| :--- | :--- |
| `cdxb "任务"` | 自动入队 + `$start` 挂脑 + 启动 Codex |
| `gmb "任务"` | 自动入队 + 启动 Gemini |
| `clb "任务"` | 自动入队 + 启动 Claude Code |
| `handoverc "节点名"` | 一键移交 0 号机队长身份 |
| `fleetstat` | 查看 AI Team 全体状态总览 |
| `brain-gate` | 在 AI_Common 执行健康门禁 |

### 队长移交

```bash
# 方式一：按节点名移交
pnpm run fleet:handover -- --to-node "Codex-3 (Codex)"

# 方式二：按路径移交
pnpm run fleet:handover -- --to-workspace "/绝对路径" --to-agent "Claude"
```

> 也可以直接对任意 AI 说："移交队长给 Codex-3"，它会自动执行。

---

## 🔌 MCP Server 接入指南

> **MCP（Model Context Protocol）** 是外脑与 AI 之间的标准通信协议，相当于 USB-C 接口。任何接入的 AI 都可以原子级调用外脑的核心操作。

### 已暴露的 8 个 Tool

| Tool | 功能 |
| :--- | :--- |
| `read_router()` | 读取大脑宪法（router.md） |
| `get_fleet_status()` | 获取舰队实时 JSON 状态 |
| `fleet_claim(...)` | Agent 打卡挂牌，防并行冲突 |
| `fleet_handover(to_node)` | 队长移交 |
| `list_rules()` | 列出所有可用规则 |
| `load_rule(rule_name)` | 按需懒加载单条规则（防上下文污染） |
| `log_task(content)` | 写入今日操作日志 |
| `fleet_sync()` | 同步状态，刷新看板数据 |

### 三大 AI 接入状态

| AI | 配置文件 | 状态 |
| :--- | :--- | :--- |
| **Codex** | `~/.codex/config.toml` | ✅ 已接入 |
| **Gemini CLI** | `~/.gemini/settings.json` | ✅ 已接入 |
| **Claude Code** | `~/.claude.json`（`claude mcp add`） | ✅ 已接入 |

### 手动接入其他工具（通用配置）

```json
{
  "mcpServers": {
    "ai-common-brain": {
      "command": "uv",
      "args": ["run", "/Users/webkubor/Documents/AI_Common/mcp_server/server.py"]
    }
  }
}
```

### 本地启动 MCP Server

```bash
cd /Users/webkubor/Documents/AI_Common/mcp_server
uv run server.py
```

---

## 🧬 目录结构说明

### 1. 🔌 MCP 接口层（`mcp_server/`）

```
mcp_server/
├── server.py        # FastMCP 主体，8 个 Tool
└── mcp_config.json  # 通用客户端配置参考
```

### 2. 🧠 意识表层（`docs/`）

| 目录 | 用途 |
| :--- | :--- |
| `rules/` | 核心行为规范与 SOP |
| `skills/` | Agent 可调用的专业技能 |
| `persona/` | 小烛的人格设定与角色档案 |
| `memory/logs/` | 每日操作日志（自动写入） |
| `memory/fleet_status.md` | 舰队状态源文件 |
| `public/data/` | 看板 JSON 数据（fleet:sync 生成） |

### 3. 🦾 神经束（`scripts/`）

| 目录 | 用途 |
| :--- | :--- |
| `scripts/actions/` | 自动启动脚本（fleet claim + 启动 AI） |
| `scripts/ingest/` | ChromaDB RAG 写入与查询 |

---

## 🔎 信息检索双轨协议

| 场景 | 方案 | 命令 |
| :--- | :--- | :--- |
| **精确路径/代码查询** | grep / cat / ls 物理扫盘 | 原生 Shell |
| **概念模糊/历史追忆** | ChromaDB 语义检索（RAG） | `uv run python3 scripts/ingest/query_brain.py "你的查询"` |

---

## ✅ 工程健康检查

```bash
pnpm run health:gate
```

- 依次执行核心健康检查、文档索引验证、构建检查
- 任一 P0 失败返回非 0 退出码，可接入 CI 阻断

---

## 📋 版本历史

详见 [CHANGELOG.md](./CHANGELOG.md)

**当前版本**: `v5.0.0` — MCP 接口层上线，三大 AI 全部接入外脑

---

*Last Updated: 2026-03-02 (v5.0 · The Brain Goes Online)*
