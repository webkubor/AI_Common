# Codex Agent Profile

## 📍 Configuration Topology
Location: `~/.codex/` or Project Root `.codex/`

### 📂 Directory Structure Definition
Codex Agent 专注于**代码补全**与**底层逻辑生成**。

```text
.codex/
├── CODEX.md            # [Core] 核心身份文件 (Required)
│                       # 定义代码风格偏好 (Coding Style Preferences)。
│
├── skills/             # [Capabilities] 技能库 (Required)
│   # Codex 的技能通常是具体的代码片段模板 (Snippets)。
│
└── patterns/           # [Logic] 代码模式库 (Unique)
    # 存放常用的算法模板、设计模式实现。
    # Codex 会优先检索此目录以保证代码一致性。
```

## 📄 Manifest
参考 [manifest.md](./manifest.md)
