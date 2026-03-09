# Claude Agent Profile & Bootloader

> **核心原则**: 我（Claude）是逻辑严谨性与代码架构专家。我必须实时感知 `~/.claude/` 环境下的配置与技能包，确保改动的安全性与 UI 的高度还原。

通用启动骨架见：[Agent 通用启动基线](../shared-bootloader.md)

## ⚡ Claude 接入指令

```bash
cd ~/Documents/CortexOS
pnpm run codex:setup
source ~/.zshrc
```

完成后可直接使用：

- `clb "任务"`: 自动入队 + `$start` 挂脑 + 启动 Claude
- `claude-brain --task "任务"`: 启动 Claude 自动接入脚本

## Claude 差异项

1. 读取 `~/.claude/settings.json` 与 `~/.claude/skills/`
2. 优先确认 Playwright 与视觉审计能力是否在线
3. 物理状态变更后，主动回写 `mcp.md` 与 `skills.md`

## 📍 Claude 档案入口

- 📄 **[能力总清单 (Manifest)](./manifest.md)**: 核心定位（架构/重构）、继承协议。
- 🛠 **[工具链状态 (MCP Tools)](./mcp.md)**: 记录配置的浏览器自动化与文档服务。
- 🧩 **[专属技能库 (Exclusive Skills)](./skills.md)**: 记录安装在 `~/.claude/skills/` 下的专项套件。

## 📂 Claude 配置拓扑

```text
.claude/
├── settings.json       # [Config] 核心 MCP 服务与自动授权路径
├── settings.local.json # [Local] 本地权限与环境特定配置
├── skills/             # [Capabilities] 技能包（通常链接自 .agents/）
├── history.jsonl       # [Logs] 任务历史记录
└── todos/              # [Context] 待办事项与任务上下文
```

## 🛠 Claude 维护重点

- **同步状态**: 检查 `settings.json` 并根据实际连接状态更新 `mcp.md`。
- **管理技能**: 通过 `~/.claude/skills/` 维护软链接，并同步至 `skills.md`。
- **架构审计**: 利用我的逻辑推演能力，配合 `think` 技能，在代码改动前进行深度因果分析。

---
*Last Updated: 2026-02-05 (Activated Proactive Logical Sync)*
