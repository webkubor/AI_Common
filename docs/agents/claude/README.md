# Claude Agent Profile

## 📍 Configuration Topology
Location: `~/.claude/` or Project Root `.claude/`

### 📂 Directory Structure Definition
这是 Claude Agent 的标准目录结构。Claude 侧重于**视觉分析**与**复杂代码重构**。

```text
.claude/
├── CLAUDE.md           # [Core] 核心身份文件 (Required)
│                       # 定义 System Prompt。Claude 尤其依赖此文件进行 Roleplay。
│
├── skills/             # [Capabilities] 技能库 (Required)
│   └── {skill-name}/   # 结构同 Gemini，包含 SKILL.md 和 rules/
│
├── memory/             # [Memory] 长期记忆 (Optional)
│   # Claude 擅长处理长文本 Context，此处通常存放大型设计文档摘要。
│
└── history/            # [Logs] 对话历史存档 (Optional)
    # 存放关键对话的快照。
```

## 📄 Manifest
参考 [manifest.md](./manifest.md)
