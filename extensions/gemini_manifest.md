# Agent Capabilities Manifest (Universal Essentials)

> **当前身份**: Gemini (CLI Agent)
> **扩展协议**: Model Context Protocol (MCP)
> **核心原则**: 无论使用哪个大模型，Context7 与 Playwright 均为不可缺失的开发标配。

## ✅ 核心标配 (The Essentials - Must Have)

| Server ID | 核心能力 | 价值定义 |
| :--- | :--- | :--- |
| **playwright** | **交互/调试** | 浏览器自动化、前端 UI 验证、隔离环境运行、视觉抓取。 |
| **context7** | **实时知识** | 第三方库最新文档检索，解决 LLM 数据滞后问题。 |

## 🛠 专项技能 (Specialized Tools - Optional)

| Server ID | 核心能力 | 状态 |
| :--- | :--- | :--- |
| **milvus** | 向量库检索 | 脚本化运行 (Shell) |
| **juejin-writer** | 掘金自动化 | SOP 指导 (read-only) |
| **think-tank** | 深度思考 | 原生逻辑 + `think.md` |

## 🚫 历史遗留 (Deprecated/Legacy)
- `chrome-devtools-mcp`: 已由 `playwright` 替代，更稳定且支持隔离运行。

## 🤖 模型兼容性建议
1. **Gemini**: 善用 `google_web_search` 配合 `context7`。
2. **Claude**: 强调对 `playwright` 截图的视觉分析能力。
3. **Codex**: 侧重于利用上述工具生成的上下文进行代码补全。