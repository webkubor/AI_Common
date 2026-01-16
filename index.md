# AI Context Index & Router

> **核心作用**: 这是 AI 长期记忆的统一入口。请根据当前的**开发阶段 (Development State)** 或 **用户意图 (Intent)**，按需读取下方的子文档。
> **原则**: 严禁一次性读取所有文件。先读此索引，再加载对应上下文。
> **语言要求**: 除非用户明确要求使用英文，否则所有回复、注释、文档内容必须使用 **中文** 输出。
>
> **隐私与同步提醒**: 本目录包含个人本机路径、项目入口与自动化规则，默认视为私人资料；除非你明确要求，否则 AI 不应将其内容直接复制到公开仓库或公开渠道。

## ⚡ 快速入口（环境/安装/依赖）

当用户提到以下内容时，优先加载 `env_profile.md` 与 `tech_stack.md`，避免“装错/版本不一致/包管理器混用”。

- **触发关键词**: "安装", "依赖", "install", "pnpm", "node 版本", "python 版本", "环境变量", "brew", "运行不了"
- **加载文档**:
  1. `env_profile.md`（本机运行时版本快照）
  2. `tech_stack.md`（默认技术偏好与工具选择）

建议先做最小检查：
- `node -v`
- `pnpm -v`
- `python3 -V`
- `zsh -lc 'source ~/.nvm/nvm.sh >/dev/null 2>&1; nvm --version; nvm current'`
- `java -version`
- `pm2 -v`
- `gemini --version`
- `codex --version`
- `docker --version`
- `docker compose version`
- `mongosh --version`
- `ollama --version`

如果需要打开本机数据库/存储控制台：
- Milvus UI (Attu): `http://127.0.0.1:8000`
- MinIO（Milvus 依赖的对象存储）: `http://127.0.0.1:9001/login`（默认 `minioadmin` / `minioadmin`）

当前环境快照（来自 `env_profile.md`，用于减少来回确认）：
- OS：macOS 15.6（Apple M3 Pro，18GB）
- Node.js：v22.19.0（via nvm）
- nvm：0.39.5
- pnpm：10.25.0（首选）
- Python：3.13.1
- Java：OpenJDK 20.0.1
- PM2：6.0.13
- Gemini CLI：0.23.0
- Codex CLI：0.80.0
- Docker：29.1.3
- Docker Compose：2.40.3
- MongoDB：mongod 7.0.14 / mongosh 2.4.0
- Shell：/bin/zsh

## 📍 状态机路由 (State Machine Routing)

请分析用户的 Prompt，判断当前处于哪个开发阶段，并加载对应的 Context 文件。

### 🚀 Phase 1: 项目初始化 (Inception & Setup)
*   **触发条件**: 用户提到 "新建项目", "脚手架", "技术选型", "init", "new project"。
*   **加载文档**:
    1.  `tech_stack.md` (技术栈偏好: Vue3, TS, Vite, CloudBase)
    2.  `init_vibe.sh` (初始化脚本参考)
    3.  `env_profile.md` (本地环境档案)

### 💻 Phase 2: 编码与实现 (Coding & Implementation)

*   **触发条件**: 用户提到 "写代码", "实现功能", "组件", "样式", "refactor", "重构", "安装依赖", "install"。

*   **加载文档**:

    1.  `retrospective.md` (🔥 **必须首选阅读**: 查阅近期复盘记录与知识点，确保不犯同样的错误)

    2.  `vibe_rules.md` (Vibe Coding 核心循环)

    3.  `workflow_retro.md` (协作工作流与自动复盘)
    4.  `coding_rules.md` (编码规范)
    5.  `git_commit_rules.md` (Git 提交规范)
    6.  `tech_stack.md` (技术栈偏好)
    7.  `env_profile.md` (环境依赖检查)


#### 🛠 专项任务扩展 (Specialized Skills)

*   **PWA 改造**: 提到 "PWA", "离线", "Service Worker", "Manifest"。

    -> 加载: `extensions/pwa_master.md`

*   **版本发布**: 提到 "Release", "发布", "版本号", "更新日志"。
*   **掘金写作**: 提到 "掘金", "写文章", "juejin", "发布文章"。
    -> 加载: `extensions/juejin-writer.md`

    -> 加载: `extensions/release_master.md`

*   **自动复盘**: 使用 `/retro` 或提到 "复盘"。

    -> 加载: `extensions/auto-retro/GEMINI.md`

*   **Milvus（向量数据库 UI）**: 提到 "milvus" / "向量数据库" / "打开 Milvus" / "看 Milvus UI"。

    -> 加载: `extensions/milvus_local_ui.md`

*   **Milvus 入库（切片→向量化→写入）**: 提到 "入库" / "向量化" / "切片" / "ingest" / "更新 Milvus" / "同步到 Milvus"。

    -> 加载: `extensions/milvus_ingest_skill.md`

*   **Milvus 检索注入标记**: 提到 "RAG" / "语义搜索" / "用 Milvus 查" / "向量库检索" / "注入"。

    -> 加载: `extensions/milvus_rag_marker.md`



### 🐛 Phase 3: 调试与复盘 (Debugging & Review)
*   **触发条件**: 用户提到 "报错", "bug", "修复", "异常", "分析原因", "review"。
*   **加载文档**:
    1.  `retrospective.md` (历史错误复盘与经验教训)
    2.  `vibe_rules.md` (查看 "复杂问题定义" 和 "错误日志标准")
    3.  （已移除）Google GenAI SDK 相关文档已删除；如需排查 AI SDK 调用问题，请明确说明使用的 SDK（OpenAI / Gemini / 其他）与报错日志

### 🧠 Phase 4: 深度思考与规划 (Deep Thinking)

*   **触发条件**: 用户使用 `/think` 命令，或提到 "架构设计", "方案评估"。
*   **加载文档**:
    1.  `vibe_rules.md` (参考 "角色定义": 切换为 Architect 模式)
    2.  `workflow_retro.md` (协作工作流与复盘约束)

---

## 📂 文件清单与简介

| 文件名 | 简介 | 核心关键词 |
| :--- | :--- | :--- |
| **index.md** | 本文件，总路由入口 | Router, Index |
| **tech_stack.md** | 技术栈选型与环境配置 | Vue3, Vite, TS, CloudBase |
| **vibe_rules.md** | Vibe Coding 核心协作协议 | 4-Step Loop, 规则, 流程 |
| **workflow_retro.md** | 协作工作流与自动复盘 | Workflow, Retro |
| **coding_rules.md** | 编码规范（通用） | StandardJS, TS, UI |
| **extensions/milvus_local_ui.md** | Milvus 本机 UI（Attu）使用指南 | Milvus, Attu, UI |
| **extensions/milvus_ingest_skill.md** | Milvus 入库 Skill（切片→向量化→写入） | Milvus, Ingest, Chunk |
| **extensions/milvus_rag_marker.md** | Milvus 检索注入标记 | RAG, Milvus, Marker |
| **git_commit_rules.md** | Git 提交规范（Angular） | Commit, Changelog |
| **retrospective.md** | 错误日志与复盘沉淀 | Error, Log, Fix, Lesson |
| **init_vibe.sh** | 项目初始化自动化脚本 | Script, Init, Bash |
| **env_profile.md** | 用户本地环境快照 | Env, OS, Node, Python |
| **project_index.md** | AI-tools 项目索引 | Projects, Index |
| **_test_context.md** | 上下文隔离测试内容（仅测试用） | TEST_MARKER, Context |
| **privacy_excludes.md** | 隐私/入库排除清单 | Privacy, Excludes |

