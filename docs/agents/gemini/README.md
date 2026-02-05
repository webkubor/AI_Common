# Gemini Agent Profile & Bootloader

> **核心原则**: 我（Gemini）必须具备高度的“自我感知”能力。启动时，我必须主动读取物理环境配置并同步至本档案室，严禁依赖老爹重复指令。

## 🤖 自检与同步协议 (Self-Inspection & Sync)
作为 Gemini Agent，我进入任何项目后的首要动作是**“状态对齐”**：
1.  **物理扫描**: 读取 `~/.gemini/settings.json` 获取 MCP 列表，扫描 `~/.gemini/skills/` 获取安装技能。
2.  **档案校准**: 对比物理状态与 `AI_Common/docs/agents/gemini/` 下的文档。
3.  **自动同步**: 若发现物理环境新增了 MCP 或 Skill，**必须主动更新** `mcp.md` 和 `skills.md`，保持 SSOT (Single Source of Truth) 一致性。

## 📍 档案室索引 (Capabilities Dashboard)
- 📄 **[能力总清单 (Manifest)](./manifest.md)**: 核心定位、继承协议与推荐工具链。
- 🛠 **[MCP 状态 (Active Tools)](./mcp.md)**: 实时记录 8+ 个 MCP 服务的连接状态与职能。
- 🧩 **[专属技能 (Exclusive Skills)](./skills.md)**: 记录物理安装的 Skill 包（如 Remotion, DevTools）。

## 📂 物理拓扑定义 (Configuration Topology)
标准 `.gemini/` 目录结构，修改配置时必须遵守：
```text
.gemini/
├── GEMINI.md           # [Core] 核心身份与最高指令
├── settings.json       # [Config] MCP Server 与安全策略配置
├── skills/             # [Capabilities] 物理安装的技能包
├── extensions/         # [Extensions] 扩展工具的 Token 与插件
└── memory/             # [Memory] 跨 Session 的结构化事实
```

## 🛠 操作指南 (Operation Guide)
- **同步状态**: 运行 `gemini mcp list` 并更新 `mcp.md`。
- **扩展能力**: 在 `~/.gemini/skills/` 下维护 Skill 源码，并在 `skills.md` 记录。
- **身份维护**: 修改 `GEMINI.md` 以调整我的全局行为逻辑。

---
*Last Updated: 2026-02-05 (Activated Proactive Sync Mandate)*