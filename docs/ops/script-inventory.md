# 脚本清单与输出地图

日期：2026-03-11

## 目标

这份文档回答 3 个问题：

1. `scripts/` 里每类脚本负责什么
2. 它们的典型输出写到哪里
3. 哪些是当前主线，哪些是可选辅助工具

关联治理：

- [脚本分级治理](./script-governance.md)

## 一、当前主线脚本分层

### 1. `scripts/actions/`

这是主线入口层，负责 AI Team 状态变更、项目索引同步、看板同步。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `fleet-claim.mjs` | Agent 开工打卡，登记任务、角色、工作路径 | 控制台 JSON；更新 `.memory/sqlite/ai-team.db`；刷新 `.memory/projects/registry.json`、`.memory/projects/index.md`、`.memory/plans/projects/*-command-center.md`；刷新 `.memory/cache/ai_team_status.local.json` |
| `fleet-checkin.mjs` | Agent 心跳/续命打卡 | 控制台 JSON；更新 AI Team DB、项目索引、看板快照 |
| `fleet-status.mjs` | 查看当前 AI Team 状态 | 控制台文本或 JSON，不直接写文件 |
| `fleet-handover.mjs` | 队长移交 | 控制台 JSON；更新 AI Team DB；刷新本地看板快照 |
| `fleet-cleanup.mjs` | 清理超时离线节点，必要时自动继任 | 控制台清理日志；更新 AI Team DB；刷新看板快照 |
| `fleet-post-task.mjs` | 任务结束后的统一钩子 | 顺序执行 `memory:retro`、`fleet:cleanup`、`fleet:sync-dashboard`，输出流水日志 |
| `project-registry.mjs` | 项目索引核心脚本 | 写 `.memory/projects/registry.json`、`.memory/projects/index.md`、`.memory/projects/README.md`、`.memory/plans/projects/*-command-center.md` |
| `sync-fleet-dashboard.mjs` | 生成本地 AI Team 看板 JSON | 写 `.memory/cache/ai_team_status.local.json` |
| `init-ai-team-db.mjs` | 初始化 AI Team SQLite | 建表并输出 DB 文件及表名 |
| `vitepress-with-fleet-bridge.mjs` | 启动文档站时附带状态桥接 | 控制台输出；通常配合 VitePress dev/preview |
| `gemini-with-fleet.sh` / `claude-with-fleet.sh` / `codex-with-fleet.sh` | 带舰队协议的启动包装器 | 启动对应 Agent CLI，作为工作入口 |
| `setup-codex-alias.sh` | Codex 命令别名初始化 | 改本机 shell 配置，输出安装提示 |

### 2. `scripts/lib/`

这是状态内核层，不是直接给人手跑的脚本。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `ai-team-db.mjs` | SQLite 打开、建表、元信息 | 被 `actions/*` 调用，主输出是 `.memory/sqlite/ai-team.db` |
| `ai-team-state.mjs` | 队长、节点、心跳、离线、继承等状态操作 | 被 `fleet-*` 调用，直接改 DB 状态 |

### 3. `scripts/services/`

这是对外桥接层，给页面、飞书、通知系统用。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `fleet-control-bridge.mjs` | 本地 HTTP 服务，暴露 `/api/fleet/state` 和 `/api/fleet/action` | 对外提供 HTTP JSON；内部会触发看板同步 |
| `feishu-bot-bridge.mjs` | 飞书事件回调桥 | 启动 HTTP 服务，接收 `/feishu/events`，转发到大脑接口，再回消息 |
| `lark-service.mjs` | 飞书/Lark Webhook 推送服务 | 发消息到飞书；本地写 `.last_notif.json` 去重 |
| `lark-cli.mjs` | Lark CLI 触发器 | 控制台输出，通常用于手工发通知 |

### 4. `scripts/core/`

这是自动运转内核，属于高权限脚本。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `auto-pilot.js` | 自动维护总控：读缓冲、跑维护任务、检查 git diff、可自动 commit、可触发向量入库、发飞书/本机通知 | 写 `.memory/logs/*.md`、`.memory/cache/ai_team_status.local.json`、`.last_notif.json`，并调用 `error-retro` / `fleet-cleanup` / `memory:index` |
| `sentinel.js` | 日志与缓冲区原子操作 | 写 `.memory/logs/*.md`、`.memory/logs/raw/*.md`、`.context_buffer.json` |
| `kernel.mjs` | “小烛内核”能力汇总 | 被 `xiaozhu_chat.mjs` 调用，负责读身份、秘钥、记忆 |
| `init-owner-profile.mjs` | 初始化主人人格档案 | 写 owner/profile 相关基础资料 |
| `init-project.sh` | 项目初始化脚本 | 生成项目骨架或模板输出 |

### 5. `scripts/maintenance/`

这是健康检查、清理、复盘与守护层。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `verify-health.js` | 文档结构、router 更新时间、日志目录、未引用文件检查 | 控制台检查报告 |
| `health-gate.js` | 发布前总闸门，串行执行核心检查和 `docs:build` | 控制台 gate 结果，失败直接退出非 0 |
| `error-retro.mjs` | 从 `.memory/logs` 自动抽取错误，生成复盘和重试模式 | 写 `.memory/retros/YYYY-MM-error-retro.md`、`.memory/meta/error-retro-seen.json`，可补写 `.memory/persona/retry_patterns.md` |
| `check-docs-index.js` | 检查 docs 是否被 router/sidebar 收录 | 控制台报告与建议归档目标 |
| `check-skill-paths.mjs` | 检查 Skill 路径是否有效 | 控制台报告 |
| `mcp-guard.mjs` | MCP 守护检查 | 控制台报告 |
| `verify-clean.js` | 工作区干净度检查 | 控制台报告 |
| `keep-alive.sh` | 常驻保活脚本 | 日志写到 `.memory/logs/daemon-status.log` 一类路径 |
| `cleanup-docs.js` | 文档清理脚本 | 控制台操作建议 |
| `analyze-docs-structure.js` | docs 结构分析与归档建议 | 控制台分析报告 |
| `skill-health-check.sh` | Skill 健康巡检 | 控制台报告 |

### 6. `scripts/ingest/`

这是 RAG / 索引层。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `chroma_ingest.py` | 向量化入库 | 写本地 Chroma / 向量索引数据 |
| `build_memory_index.py` | 构建记忆索引 | 刷新本地索引数据 |
| `query_brain.py` | 查询记忆索引 | 控制台查询结果 |
| `retrieval_scope.json` | 检索范围配置 | 配置文件，不直接执行 |
| `injection_policy.json` | 注入策略配置 | 配置文件，不直接执行 |

### 7. `scripts/tools/`

这是运维和个人工作流工具层。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `health-check.js` | P0 核心体检，重点看 router、关键目录、向量库环境 | 控制台健康报告；strict 模式会返回非 0 |
| `sync-skills-management.mjs` | 同步 skills 管理数据 | 刷新 skills 管理结果 |
| `rag_probe.sh` | RAG 探针，对同一查询同时跑语义检索和物理检索 | 写 `.memory/rag_logs/*_rag_probe.md` |
| `up.sh` | 图片上传路由器，转 GitHub 或 R2 | 上传结果输出到控制台 |
| `xiaozhu_chat.mjs` | 终端版“小烛 CLI” | 控制台交互；调用 kernel、云端模型与本地记忆 |

### 8. `scripts/wechat/`

这是公众号/微信图文发布流水线。

| 脚本 | 作用 | 典型输出 |
| --- | --- | --- |
| `push.mjs` | 通用微信图文推草稿 | 微信草稿 `draftId`；控制台进度日志 |
| `push-boiling-snow.mjs` | 《沸腾之雪》专用推送脚本 | 微信草稿 `draftId`；控制台进度日志 |
| `preview.mjs` | 本地预览文章 HTML | 写 `tmp/wechat_preview.html` |
| `utils.mjs` | 微信 token、正文图、封面图、草稿上传工具 | 被 `push*.mjs` 调用，向微信 API 发请求 |

## 二、可选辅助脚本

这批属于个人效率或单点场景辅助，不属于 CortexOS 主链。

| 脚本 | 作用 | 当前判断 |
| --- | --- | --- |
| `g.sh` | Gemini 调用包装器，遇到 quota 自动切换账号重试 | 个人效率工具，仍可用，但不属于 CortexOS 主链 |
| `gemini_manager.sh` | 保存/切换 Gemini 多账号配置 | 个人账号管理工具，依赖 `memory/secrets/gemini_profiles`；当前机器默认物理路径为 `~/Documents/memory/secrets/gemini_profiles` |
| `log.sh` | 写 Markdown 操作日志表格 | 输出到 `docs/operation-logs/`，不属于主线日志链路 |
| `generate_wallpaper.py` | 调 Imagen 生成测试壁纸 | 一次性/实验脚本 |
| `move-files.js` | docs 搬运建议器 | 结构整理辅助脚本，非日常主线 |

## 三、主线输出路径总表

### 1. AI Team 状态

- `.memory/sqlite/ai-team.db`
- `.memory/cache/ai_team_status.local.json`

### 2. 项目索引

- `.memory/projects/registry.json`
- `.memory/projects/index.md`
- `.memory/projects/README.md`
- `.memory/plans/projects/*-command-center.md`

### 3. 操作日志与缓冲

- `.memory/logs/YYYY-MM-DD.md`
- `.memory/logs/raw/candy-YYYY-MM-DD.md`
- `.context_buffer.json`
- `.last_notif.json`

### 4. 自动复盘

- `.memory/retros/YYYY-MM-error-retro.md`
- `.memory/meta/error-retro-seen.json`
- `.memory/persona/retry_patterns.md`

### 5. RAG / 检索

- `chroma_db/` 或对应向量库目录
- `.memory/rag_logs/*_rag_probe.md`

### 6. 微信发布

- `tmp/wechat_preview.html`
- 微信远端草稿、封面素材、正文图 URL

## 四、现在应该怎么理解这套脚本

### 当前主线

如果只看今天仍然有系统价值的主线，核心是这 6 条：

1. `scripts/actions/*`
2. `scripts/lib/*`
3. `scripts/services/*`
4. `scripts/maintenance/error-retro.mjs`
5. `scripts/tools/health-check.js`
6. `scripts/ingest/*`

### 半主线

- `scripts/core/auto-pilot.js`
- `scripts/core/sentinel.js`

这两者仍然重要，但权限高、耦合多，属于“总控层”。

### 明显偏历史/个人化

- `scripts/g.sh`
- `scripts/gemini_manager.sh`
- `scripts/log.sh`
- `scripts/generate_wallpaper.py`
- `scripts/move-files.js`
- `scripts/maintenance/cleanup-docs.js`

## 五、我对这套脚本系统的判断

问题不在“脚本太多”，而在“同一时期写出来的脚本层级不一致”：

- 有的是系统主线入口
- 有的是个人效率工具
- 有的是一次性迁移脚本
- 有的是检查器
- 有的是对外桥接服务

所以后面治理时不要按“文件多少”收，而要按“是否仍在主链路上”收。

最值得你后续继续收敛的点是：

1. 把 `scripts/core/` 和 `scripts/maintenance/` 的边界再切清楚
2. 把个人脚本和系统脚本彻底分开
3. 给 `scripts/` 再补一个“主线入口索引”，避免以后忘了哪个才是生产链路
