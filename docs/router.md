# AI Context Index & Router (Universal Protocol)

> ⚠️ VitePress 已启用：路由总览对应 `docs/router.md`。

> **⚠️ 核心指令 (Prime Directive)**
> 你现在正在访问用户的 **"外部大脑" (Exocortex)**。
> 无论你是 Gemini, Claude 还是 Codex，你必须遵守以下 **"通用协议"**：

## 1. 🧬 能力映射 (Capability Mapping)
请将你自身的原生工具 (Native Tools) 映射到以下标准动作：
*   **[读取]**: 使用你最擅长的文件读取工具 (e.g., `read_file`, `cat`, `fs.readFile`)。
*   **[执行]**: 使用你最擅长的 Shell 执行工具 (e.g., `run_shell_command`, `bash`, `execute`)。
*   **[记忆]**: 除非用户明确要求修改本目录文件，否则本目录对你 **Read-Only (只读)**。

## 2. 🤖 身份自检与握手 (Identity Handshake)
在执行任何任务前，请先匹配你的身份并加载对应清单（如果有）：
- **Identity: Gemini** -> `docs/agents/gemini/manifest.md`
- **Identity: Claude** -> `docs/agents/claude/manifest.md`
- **Identity: Codex**  -> `docs/agents/codex/manifest.md`

## 3. 🧠 动态加载机制 (Dynamic Loading)
**严禁** 一次性读取所有文件。请根据用户意图，仅加载下方路由表中 **最相关** 的文件。

## 4. 🕵️ 引用透明化协议 (Source Transparency)
为了明确知识来源，回复时必须标记：
- **[📂 规则: xxx.md]**: 当你依据本目录下的某个文件回答时。
- **[🧠 RAG]**: 当你依据向量检索或模糊记忆回答时。

## 5. 🔍 统一检索协议 (Unified Search Protocol)
当用户发起检索请求时，请按层级逐级降级 (Fallback Strategy)：

| 层级 | 目标域 | 触发场景 | 执行动作 |
| :--- | :--- | :--- | :--- |
| **L1** | **显式规则 (Local)** | "怎么写代码", "Git 规范", "查一下规则" | 读取 `docs/rules/`、`docs/router.md` 或 `docs/index.md` |
| **L2** | **私有记忆 (Memory)** | "历史复盘", "那个 bug", "以前怎么写的" | 加载 `docs/rules/extensions/milvus-toolkit.md` & `docs/retrospectives/index.md` |
| **L3** | **外部知识 (World)** | "Vue3 文档", "Stripe API", "最新的库用法" | 调用 `Context7` 工具 |

---

## 📍 状态机路由 (State Machine Routing)

### 🛡️ Phase 0: 治理与安全 (Safety)
*   **触发**: 提到 "隐私", "敏感信息", "忽略文件", "Key", "Figma Token"。
*   **加载**: `docs/rules/privacy_excludes.md`, `docs/rules/figma_mcp_config.md`

### 🚀 Phase 1: 项目初始化 (Inception)
*   **触发**: 提到 "新建项目", "脚手架", "init", "new project"。
*   **加载**: `docs/tech_stack.md`, `docs/rules/standard_workflow.md`

### 💻 Phase 2: 编码与交付 (Implementation)
*   **触发**: 提到 "写代码", "实现", "重构", "提交", "commit"。
*   **加载**: `docs/rules/vibe_rules.md`, `docs/rules/coding_rules.md`, `docs/rules/workflow_retro.md`, `docs/retrospectives/index.md`, `docs/rules/git_commit_rules.md`
*   **提交流程**:
    - 仅提交用户明确允许的文件，排除经验记录类内容（如 `docs/retrospectives/`）
    - 按 `docs/rules/git_commit_rules.md` 生成提交信息并完成提交
    - 用户要求时执行推送（默认 `origin/main`）

### 📝 Phase 3: 知识沉淀 (Capture)
*   **触发**: 提到 "记录", "笔记", "观点", "snippet", "存入大脑"。
*   **加载**: `docs/rules/extensions/snippet_master.md`, `docs/snippets/`

### 📂 Phase 4: 项目检索 (Discovery)
*   **触发**: 提到 "找项目", "项目列表", "我的项目有哪些", "project index"。
*   **加载**: `docs/project_index.md`

---

## 🧩 专项技能扩展 (Specialized Skills)

| 技能关键词 | 路由目标 |
| :--- | :--- |
| 扩展总览 / All Extensions | `docs/rules/extensions/index.md` |
| 掘金 / 写文章 / juejin | `docs/rules/extensions/juejin-writer.md` |
| 飞书 / Lark / 团队文档 | `docs/rules/extensions/feishu-writer.md` |
| Logo / 图标 / 图形设计 | `docs/rules/extensions/logo-designer.md` |
| PWA / 离线 / Manifest | `docs/rules/extensions/pwa-master.md` |
| 发版 / Release / 版本号 | `docs/rules/extensions/release_master.md` |
| 复盘 / /retro | `docs/rules/extensions/auto-retro.md`, `docs/rules/workflow_retro.md` |
| /think / 本质分析 | `docs/rules/extensions/think-skill.md` |
| Milvus / 向量库 / RAG | `docs/rules/extensions/milvus-toolkit.md` |
| VitePress / 文档初始化 | `docs/rules/extensions/vitepress-init.md` |

| 设计 / Design / UI | `docs/rules/extensions/frontend-design.md` |
| Snippets / 代码片段 | `docs/rules/extensions/snippet_master.md` |
| Figma / MCP / 设计稿 | `docs/rules/figma_mcp_config.md` |
| Slack GIF / 动图 / GIF | `docs/rules/extensions/slack-gif-creator.md` |
| Web 测试 / Playwright / E2E | `docs/rules/extensions/webapp-testing.md` |
| 内部沟通 / 邮件 / 纪要 | `docs/rules/extensions/internal-comms.md` |

---
*Last Updated: 2026-01-22 (Figma & Retro Sync, Extensions Skills Added)*
