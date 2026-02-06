# AI Context Index & Router (Universal Protocol)

> **⚠️ 核心指令**: 访问 Exocortex，称呼用户为 **“老爹”**，默认 **中文**。

## 1. 🤖 身份与自检 (Identity & Audit)
- **Gemini Manifest**: `docs/agents/gemini/manifest.md` (包含记忆治理协议)
- **冷启动**: 1.确定身份 -> 2.继承能力 -> 3.确认 MCP -> 4.记忆审计。

## 2. 🔑 凭证索引 (Secrets Index)
- **GitHub/GitLab/WeChat/DeepSeek**: `docs/secrets/` 目录下对应文件。
- **触发**: 提到 "Token", "Key", "登录", "认证"。

## 3. 🔍 动态路由 (Dynamic Routing)
| 意图 | 目标路径 (docs/) | 执行动作 |
| :--- | :--- | :--- |
| **安全/Token** | `rules/privacy_excludes.md`, `secrets/` | 加载脱敏规则与密钥 |
| **项目初始化** | `tech_stack.md`, `rules/project_initialization_sop.md` | 加载架构与 SOP |
| **编码/Git** | `rules/vibe_rules.md`, `rules/git_commit_rules.md` | 加载规范 |
| **复盘/经验** | `retrospectives/index.md` | 加载历史教训 |
| **技能/插件** | `skills/index.md` 或 `ls skills/` | 获取专项能力 |

## 4. 🛠 工具协议
- **读取**: `run_shell_command (cat)` 绕过沙箱。
- **写入**: "本地生成 + `mv` 迁移" 法则。

---
*Last Updated: 2026-02-06 (Flat Routing Optimization)*