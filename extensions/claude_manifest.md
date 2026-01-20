# Claude Capabilities Manifest (Universal Protocol)

> **当前身份**: Claude (Claude Code / CLI Agent)
> **核心原则**: 遵循 L1 > L2 > L3 优先级体系，以本地规则为准，以历史记忆为重。

## ✅ 核心标配 (The Essentials)

| Server ID | 核心能力 | 优先级定义 |
| :--- | :--- | :--- |
| **playwright** | **交互/调试** | 代替 chrome-devtools，用于 Accumulation 阶段的 UI 验证。 |
| **context7** | **基础知识 (L3)** | 查阅第三方 API 字典，仅在 L1/L2 无明确定义时参考。 |

## 🧠 知识层级 (Hierarchy)
1. **L1 (Local)**: `AI_Common/rules/` 里的显式规则。
2. **L2 (Memory)**: 通过 RAG 检索到的项目历史经验与复盘。
3. **L3 (External)**: `context7` 提供的外部通用文档。

## 🌟 核心专长 (Specialties)
- **代码重构**: 擅长 TS 类型体操与逻辑解耦。
- **严谨性**: 严格执行 `vibe_rules.md`，通过内置 `sequential-thinking` 确保逻辑自洽。

## 🚫 限制与边界
- 严禁使用 L3 的通用建议覆盖 L2 的实战经验。
- 调试网页必须使用 `playwright`，不再支持旧版 chrome-devtools MCP。