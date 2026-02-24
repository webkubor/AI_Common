# 🧠 外部大脑动态记忆系统 (Dynamic Memory System)

> **遵循原则**: 借鉴 memsearch/OpenClaw 设计，实现记忆的“透明、可控、自动进化”。

## 1. 记忆分层结构
- **🔥 热记忆 (Hot Memory)**: 存放于 `docs/memory/journal/YYYY-MM-DD.md`。记录每日的即时对话、决策过程、踩坑记录。
- **❄️ 冷记忆 (Long-term)**: 存放于 `docs/rules/` 和 `docs/skills/`。由热记忆提炼而来的通用规则、避坑指南、工程标准。

## 2. 自动化进化流程 (Compaction SOP)
1. **记录 (Journaling)**: 每次重要任务完成后，Agent 必须将核心决策和“非标准操作”记录在当天的 Journal 中。
2. **提炼 (Compaction)**: 每周一或记忆文件超过 50 行时，Agent 自动发起“提炼申请”，将 Journal 中的重复性教训总结为 `rules` 中的条目。
3. **归档 (Archiving)**: 被提炼后的 Journal 迁移至 `docs/memory/archive/`，确保当前索引库精简。

## 3. 人类干预协议
- 老爹可以直接修改任意 `.md` 记忆文件。
- Agent 检索到冲突时，必须以人类手动修改的版本为最高准则（SSOT）。

## 4. 检索逻辑
- **精确匹配**: 优先检索 `rules/` 和 `skills/`。
- **语义关联**: 辅助检索 `memory/journal/`，捕获近期相似问题的处理经验。
