# 🧠 CortexOS: The Multi-Agent Exocortex (MCP Server)

[![MCP v1.0](https://img.shields.io/badge/MCP-v1.0-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-5.1.0-magenta.svg)](./CHANGELOG.md)

**CortexOS** 是基于 **Model Context Protocol (MCP)** 构建的个人外部大脑操作系统。它不仅仅是一个文档库，更是连接 AI 模型与开发者物理资产（规则、记忆、工作流）的“标准 USB-C 接口”。

---

## 🚀 核心价值：为什么需要 CortexOS？

在传统的 AI 交互中，上下文是“阅后即焚”的。CortexOS 通过物理锚定，实现了：
- **物理资产主权**：将规则（Rules）与记忆（Memory）存在本地，不被模型厂商锁定。
- **跨模型协议对齐**：无论是 Gemini, Claude 还是 Codex，插上 MCP 接口，立即继承统一的思维逻辑。
- **多智能体防撞车 (Fleet Guard)**：通过 `fleet:claim` 机制，让多个并行工作的 AI 节点实现任务态势感知。

---

## 🔌 快速开始 (Quick Start)

### 1. 前置要求
- [uv](https://github.com/astral-sh/uv) (Python 包管理工具)
- Node.js & pnpm

### 2. 本地部署
```bash
git clone git@github.com:webkubor/CortexOS.git
cd CortexOS
pnpm install
```

### 3. 接入 AI 客户端 (MCP Configuration)

将以下配置添加至你的 AI 客户端配置文件中：

#### **Claude Desktop**
`~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "cortexos-brain": {
      "command": "uv",
      "args": ["run", "/你的路径/CortexOS/mcp_server/server.py"]
    }
  }
}
```

#### **Gemini CLI**
`~/.gemini/settings.json`
```json
{
  "mcpServers": {
    "cortexos-brain": {
      "command": "uv",
      "args": ["run", "/你的路径/CortexOS/mcp_server/server.py"]
    }
  }
}
```

---

## 🛠 已暴露的原子化工具 (MCP Tools)

CortexOS 暴露出以下 8 个强类型工具，AI 可直接调用：

| 工具名 | 参数 | 功能描述 |
| :--- | :--- | :--- |
| `read_router` | 无 | 读取大脑宪法 (`router.md`)，获取全局索引 |
| `get_fleet_status` | 无 | 获取当前所有活跃 Agent 的任务进度与锁状态 |
| `fleet_claim` | `task`, `agent`, `workspace` | 注册入队，防跨目录修改冲突 |
| `fleet_handover` | `to_node` | 移交 0 号机（队长）指挥权 |
| `log_task` | `content` | 向今日日志追加操作记录，实现进化闭环 |
| `list_rules` | 无 | 罗列当前大脑中所有的工程与审美规范 |
| `load_rule` | `rule_name` | 按需加载单条规则，防上下文污染 |
| `fleet_sync` | 无 | 强制刷新可视化看板的 JSON 数据源 |

---

## 🚦 AI 舰队编排 (Fleet Management)

CortexOS 独创了 **“客观进度感知系统”**：
- 每个任务必须在工作区包含 `TODO.md`。
- 系统的 `fleet_sync` 会自动解析勾选框状态，并在 [可视化看板](/ai-team) 上显示实时动效。
- **队长锁**：确保全局性操作仅由 0 号机发起，其余节点环视辅助。

---

## ⚖️ 审美与规范 (Vibe Manifesto)

所有接入 CortexOS 的 Agent 必须强制遵循 [《webkubor 开发与审美准则》](./docs/rules/webkubor_vibe_manifesto.md)：
- **Morandi Palette**: 莫兰迪色系 UI 规范。
- **Anti-AI Clichés**: 拒绝廉价标题党，保持硬核全栈专家人格。
- **Physical Anchoring**: 关键凭证严禁脱离 `brain/secrets/` 物理目录。

---

## ✅ 健康巡检
```bash
pnpm run health:gate
```
执行核心目录结构、文档索引、以及 VitePress 构建的 100% 完整性扫描。

---

*“雪落江湖，热血难凉。一笔写风月，一心藏滚烫。”*  
**CortexOS — The OS for your digital soul.**
