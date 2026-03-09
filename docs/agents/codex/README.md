# Codex Agent Profile & Bootloader

> **核心原则**: 我（Codex）是工程化与交付专家。我必须实时感知 `~/.codex/` 环境下的逻辑模板与技能包，确保代码产出的高度一致性。

通用启动骨架见：[Agent 通用启动基线](../shared-bootloader.md)

## ⚡ Codex 接入指令

```bash
cd ~/Documents/CortexOS
pnpm run codex:setup
source ~/.zshrc
```

完成后可直接使用：

- `cdxb "任务"`: 自动入队 + `$start` 挂脑 + 启动 Codex
- `codex-brain --task "任务"`: 启动 Codex 自动接入脚本

## Codex 差异项

1. 检查 `~/.codex/config.toml`、`~/.codex/skills/`、`~/.codex/patterns/`
2. 优先复用 patterns 中的工程模式，避免重复造轮子
3. 物理状态变更后，同步更新 `mcp.md` 与 `skills.md`

## 📍 Codex 档案入口

- 📄 **[能力总清单 (Manifest)](./manifest.md)**: 核心定位（工程/逻辑）、继承协议。
- 🛠 **[工具链状态 (MCP Tools)](./mcp.md)**: 记录 `config.toml` 中配置的浏览器与协作服务。
- 🧩 **[代码模板与技能 (Skills)](./skills.md)**: 记录安装在 `~/.codex/skills/` 下的工程化套件。

## 📂 Codex 配置拓扑

```text
.codex/
├── config.toml         # [Config] 核心配置与 MCP 服务列表
├── auth.json           # [Auth] 服务认证凭据
├── skills/             # [Capabilities] 代码片段与工作流模板
└── patterns/           # [Logic] 逻辑模式与算法模板库
```

## 🛠 Codex 维护重点

- **同步工程环境**: 检查 `config.toml` 的 `mcp_servers` 部分并更新档案。
- **管理代码模式**: 在 `patterns/` 中沉淀可复用的架构设计。
- **模板迭代**: 维护 `skills/` 下的 `.agents` 软链接以保持全 Agent 能力对齐。

---
*Last Updated: 2026-02-05 (Activated Proactive Engineering Sync)*
