# Gemini Agent Profile

## 📍 Configuration Topology
Location: `~/.gemini/` or Project Root `.gemini/`

### 📂 Directory Structure Definition
这是 Gemini Agent 的标准目录结构与功能定义。任何外部 Agent 修改配置时**必须**遵守此规范。

```text
.gemini/
├── GEMINI.md           # [Core] 核心身份文件 (Required)
│                       # 定义 System Prompt、角色设定、最高指令。
│                       # 修改此文件可直接改变 Agent 的行为模式。
│
├── skills/             # [Capabilities] 技能库 (Required)
│   ├── {skill-name}/   # 独立技能包
│   │   ├── SKILL.md    # 技能描述、触发条件、参数定义
│   │   └── rules/      # 具体的规则文档或代码片段
│   └── ...
│
├── memory/             # [Memory] 长期记忆 (Optional)
│   ├── facts.json      # 结构化事实 (用户偏好、项目背景)
│   └── scratchpad.md   # 非结构化草稿
│
├── tmp/                # [Runtime] 临时工作区 (Optional)
│   # 存放 Shell 命令输出、临时构建产物。
│   # Agent 可随时清空此目录，不可存放持久化数据。
│
└── extensions/         # [Extensions] 工具扩展配置 (Optional)
    # 存放 MCP Server 配置文件或特定工具的 token 配置。
```

## 📄 Manifest
参考 [manifest.md](./manifest.md)

## 🛠 Operation Guide
- **添加新技能**: 在 `skills/` 下新建目录，必须包含 `SKILL.md`。
- **调整人设**: 修改 `GEMINI.md`。
- **查看上下文**: 检查 `memory/` 下的文件。
