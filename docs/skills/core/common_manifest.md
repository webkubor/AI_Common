# 公共技能清单 (Common Skills Manifest)

> **定义**: 所有 Agent (Gemini/Claude/Codex) 共享的基础能力，代表了“外部大脑”的标准功能。

## 🛠 基础 MCP 基础设施 (Common Infrastructure)
*所有 Agent 环境通常包含的标准工具（具体以各 Agent 的 `mcp.md` 为准）：*

- **Playwright (L3)**: 网页交互、截图与 UI 验证。
- **Context7 (L3)**: 实时库文档检索。
- **Filesystem (Native)**: 文件读写基础。

## 🧩 核心通用技能 (Core Common Skills)
*所有 Agent 启动后必须具备这些能力的索引：*

| 技能名称 | 路由路径 | 核心职能 | 层级 |
| :--- | :--- | :--- | :--- |
| **Think** | `docs/skills/think-skill.md` | 复杂问题拆解与多维分析。 | **L1** |
| **Auto-Retro** | `docs/skills/auto-retro.md` | 自动复盘、经验萃取与 GC。 | **L2** |
| **Snippet-Master** | `docs/skills/snippet_master.md` | 碎片化知识与代码片段管理。 | **L2** |
| **Vibe-Checker** | `docs/rules/vibe_rules.md` | 编码风格与交付质量对齐。 | **L1** |
| **Chroma-RAG** | `scripts/ingest/` | 本地向量库检索与长期记忆入库。 | **L2** |
| **Standard-Workflow** | `docs/rules/standard_workflow.md` | 遵循“计划-执行-复盘”闭环流程。 | **L1** |

## ✍️ 通用协作技能 (Collaboration Skills)
- **Feishu-Writer (L2)**: 团队文档撰写。
- **GitLab-Manager (L2)**: 仓库与 CI/CD 管理。
- **Release-Master (L2)**: 自动化版本发布。
- **Wechat-Writer (L2)**: 微信公众号“心语拾光”运营。

---
*注：Agent 应根据任务场景，通过 `router.md` 动态加载上述具体技能文件。*