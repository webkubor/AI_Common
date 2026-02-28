# 🧠 大脑演化史 (Brain Evolution History)

> **当前智力档位**: v3.8.0 (Skill-as-Project & Resilient)
> **核心原则**: 记录大脑在逻辑、协议、技术栈上的重大变更，指导 AI Agent 快速对齐上下文。

---

## [v3.8.0] - 2026-02-28 (重大变革：技能云端化与系统保活)

### 📦 技能生态 (Skill Ecosystem)

- **项目级抽离**: 核心技能（Visual, Storyboard, Sentinel 等）全部重构为独立 GitHub 仓库，不再于 `AI_Common` 本地耦合。
- **自动化武装**: 引入 `skill-health-check.sh`，实现基于 `gemini skills install` 的幂等自检与自动修复安装。

### 🛡️ 系统韌性 (Resilience)

- **保活哨兵**: 部署 `keep-alive.sh` 并挂载至 **Crontab (每 10 分钟执行)**，确保 `Auto-Pilot` 服务挂了秒重连。
- **双路通知**: 实现 **macOS Native (原生弹窗)** + **Lark (飞书战报)** 双路并行，全中文提示，零延迟反馈。

### 📝 文档工程 (Doc Engineering)

- **标准标准化**: 所有核心脚本 (`auto-pilot`, `sentinel`) 注入全中文 JSDoc 注释，符合生产级工程规范。
- **首页云化**: `skills/index.md` 重构为技能云端索引，支持一键定位远程仓库。

---

## [v3.7.0] - 2026-02-27 (重大变革：本地化与极简主义)

### 🏗 基础架构 (Architecture)

- **向量库重构**: 彻底移除远程 Milvus 依赖，全面切换至 **ChromaDB (Local)** + **Ollama (nomic-embed-text)**。
- **冷启动初始化**: 新增 `scripts/init-project.sh`，实现一键部署环境（pnpm, uv, ollama）。
- **Python 闭环**: 引入 `pyproject.toml` 使用 `uv` 管理 Python 依赖，确保检索脚本稳定性。

### 📡 自动驾驶 (Auto-Pilot)

- **推送脱水**: 飞书通知升级为 **V3.7 (Content-Aware)**，删除所有煽情模板，仅保留硬核数据。
- **语义抓取**: 新增 **Diff Snippets** 功能，推送中可直接看到 Markdown 文件的文字变动摘要。
- **意图映射**: 通知标题自动根据 `router.md` 的路由表匹配语义意图（如 [写文章]、[项目初始化]）。

### ⚖️ 协议变更 (Protocol)

- **入口锚定**: 明确 `docs/router.md` 为唯一真理来源 (SSOT)，强制所有新 Agent 进场首读。
- **README 重构**: 增加了 **智力进化路径** 指南。

---

## [v2.0.0] - 2026-02-02 (基础设施期)

- 引入 **Sentinel (哨兵)** 机制，实现 Agent 物理操作日志记录。
- 确立 **VitePress** 知识展示体系。
- 建立 `docs/retrospectives` 深度复盘文件夹。

---

## [v1.0.0] - 初始混沌期

- 建立 `AI_Common` 仓库，确立 `docs/` 结构与 `package.json` 基础。
