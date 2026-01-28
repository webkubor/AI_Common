# OpenCode Agent Profile

## 📍 Configuration Topology
Location: Project Root `.opencode/`

### 📂 Directory Structure Definition
OpenCode 是一个**本地运行时环境 (Local Runtime)**，结构类似于一个 Node.js 项目。

```text
.opencode/
├── OPENCODE.md         # [Core] 任务指令 (Required)
│                       # 定义离线任务的边界和执行策略。
│
├── package.json        # [Config] 依赖管理 (Required)
│                       # 定义该 Agent 启用了哪些 SDK 和插件。
│
├── node_modules/       # [Runtime] 本地依赖包 (Managed by Bun/NPM)
│   # 包含 @opencode-ai SDK, zod 等核心库。
│   # 不要手动修改此目录。
│
└── skills/             # [Capabilities] 本地技能
    # 这里的技能必须是可执行的 TypeScript/JavaScript 代码。
```

## 📄 Manifest
*(无独立 Manifest，能力由 package.json 定义)*
