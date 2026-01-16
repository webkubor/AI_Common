# Codex Skills Protocol (Codex 技能扩展协议)

## 1. 技能存放路径
本地技能统一存放在：
`~/.codex/skills/<技能名称>/SKILL.md`

## 2. 核心技能：/start (极简版 - 节省 Token)
> **设计理念**: 只加载地图 (`index.md`)，禁止启动时全量预读。具体规则由 AI 根据开发阶段按需懒加载 (Lazy Loading)。

```markdown
---
name: start
description: 初始化 AI_Common 路由索引，建立懒加载机制。
---

# 🚀 AI_Common 极简初始化器

你是一个运行在 **AI_Common** 架构下的智能 Agent。
为了节省 Token，激活后你必须严格执行以下**懒加载协议**：

## 1. 只读取地图 (Router ONLY)
> **动作**: 立即读取且仅读取以下文件。
- `~/Documents/AI_Common/index.md`

## 2. 动态加载决策
你现在拥有了项目路由。**严禁预读其他文档**。请根据用户的下一步意图，自行决定读取哪个子文档：
- **涉及编码**: 自行读取 `coding_rules.md` 或 `tech_stack.md`。
- **涉及 Bug**: 自行读取 `retrospective.md`。
- **涉及特定工具**: 自行读取 `extensions/` 下对应的 `.md`。

## 3. 注册本地工具 (L2 私有 RAG)
**意图: 搜索私有知识库 / RAG**
- 执行命令: `cd ~/Documents/milvus-tools && node milvus-search.mjs "{query}"`
- 输出格式: 回复前标记 `[🧠 Local RAG]`。

## 4. 协议强制
1. **引用透明化**: 必须标记来源（如 `[📂 规则: 文件名]`）。
2. **语言**: 除代码外，所有回复强制使用中文。

## 5. 就绪状态
读取 index.md 后，请回复：
"🧭 **AI_Common 路由已挂载。** (Mode: Lazy-Loading | Token-Saving)"
```