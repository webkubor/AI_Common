# 大脑自动运转系统 (Auto-Pilot)

> **目标**: 明确后台任务由谁跑、何时跑、怎么启停与验活。

## 1. 真正运行的后台任务

- **进程名**: `brain-cortex-pilot`
- **脚本**: `scripts/core/auto-pilot.js`
- **托管器**: PM2
- **调度节奏**: `--cron-restart "*/5 * * * *"`（每 5 分钟触发一次）
- **统一配置文件**: `config/brain-runtime.json`（记录后台任务开关、调度与用途）

## 2. 自动运转内容（当前实现）

每次触发会执行：

1. 自动维护：`fleet-cleanup`（清理僵尸节点）+ `fleet-sync`（同步舰队看板）
2. MCP 监护：`mcp-guard`（检查并修复 Gemini 的 `cortexos-brain` 配置漂移，兼容迁移旧名，异常时推送通知）
3. 收集 AI Team 态势：在线/排队/离线/僵尸、队长、任务清单、进度
4. 汇总本轮改动文件（按路由意图分组）
5. 写入 `.memory/logs/YYYY-MM-DD.md`
6. 若有文件变更则自动提交，并执行知识入库
7. 发送本地通知；如已配置 Webhook，再额外发送飞书通知

## 3. 启动时机（必须执行）

- **首次安装后**: 必须启动一次后台任务
- **每天开工前**: 检查进程是 `online`
- **修改 auto-pilot 或相关脚本后**: 重启进程使新逻辑生效

## 4. 启动与管理命令

统一命令清单见：

- [运行命令总表（SSOT）](./runtime-command-reference.md)

## 5. 开机自启（建议一次配置）

开机自启命令也已收敛到 [运行命令总表（SSOT）](./runtime-command-reference.md)。

## 6. 故障排查

- `status=stopped`：先 `pm2 restart brain-cortex-pilot`
- 高频重启：查看 `pm2 logs brain-cortex-pilot` 定位报错
- 日志无新增：检查 `.memory/logs/` 当天文件是否更新，确认当前目录是项目根
