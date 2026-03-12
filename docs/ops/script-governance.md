# 脚本分级治理

日期：2026-03-11

## 结论先说

现在的问题不是“功能很多所以脚本多”，而是：

- 主线能力大约只有 6 类
- 但脚本被拆成了 50+ 个文件
- 其中一部分是系统主链
- 一部分是重复实现
- 一部分是个人辅助工具
- 一部分是单次治理脚本

所以后面治理不应该按“继续加目录”，而应该按“降文件数、收责任边界、减少重复入口”来做。

## 一、分级标准

### `S` 级：主链保留

仍然直接承担系统核心能力，短期不应删除，只能重构。

### `A` 级：重要但需收口

有价值，但入口过深、耦合过高，应该被更少的主脚本吸收。

### `B` 级：重复职责，优先合并

有两个或更多脚本在做接近的事，必须收敛成一套。

### `C` 级：冻结归档

保留源码以备参考，但不应再挂在主工作流里。

### `D` 级：删除候选

确认无主链依赖后可以删掉，或迁到私人脚本仓。

## 二、分级结果

### `S` 级：必须保留的主链

这些脚本承载今天仍在运行的主系统能力。

- `scripts/actions/fleet-claim.mjs`
- `scripts/actions/fleet-checkin.mjs`
- `scripts/actions/fleet-status.mjs`
- `scripts/actions/fleet-handover.mjs`
- `scripts/actions/fleet-cleanup.mjs`
- `scripts/actions/fleet-post-task.mjs`
- `scripts/actions/project-registry.mjs`
- `scripts/actions/sync-fleet-dashboard.mjs`
- `scripts/actions/init-ai-team-db.mjs`
- `scripts/lib/ai-team-db.mjs`
- `scripts/lib/ai-team-state.mjs`
- `scripts/services/fleet-control-bridge.mjs`
- `scripts/services/feishu-bot-bridge.mjs`
- `scripts/services/lark-service.mjs`
- `scripts/ingest/chroma_ingest.py`
- `scripts/ingest/build_memory_index.py`
- `scripts/ingest/query_brain.py`
- `scripts/maintenance/error-retro.mjs`
- `scripts/tools/health-check.js`

### `A` 级：有价值，但要收口

这些不是废物，但入口和职责太散。

- `scripts/core/auto-pilot.js`
  - 问题：权限过高，既做维护、又做通知、又做自动提交、又做索引更新
  - 建议：拆成 `maintenance runner` + `notification runner`，不要继续做“大一统总控”

- `scripts/core/sentinel.js`
  - 问题：日志、缓冲、通知三种职责耦合在一起
  - 建议：后续拆成 `log-store`、`buffer-store`、`notify-adapter`

- `scripts/wechat/push.mjs`
- `scripts/wechat/push-boiling-snow.mjs`
- `scripts/wechat/utils.mjs`
  - 问题：通用推送和单文章推送并存
  - 建议：保留一个通用入口，专用文章只保留 `articles/*.mjs`

- `scripts/actions/gemini-with-fleet.sh`
- `scripts/actions/claude-with-fleet.sh`
- `scripts/actions/codex-with-fleet.sh`
  - 问题：属于三套近似包装器
  - 建议：收成一个统一 runner，加 `--agent` 参数切换

### `B` 级：重复职责，优先合并

这是现在最影响“脚本一堆但功能没多少”的根源。

#### 1. docs 索引检查重复组

- `scripts/maintenance/check-docs-index.js`
- `scripts/sentinel/check-docs-index.js`

判断：
- 功能几乎同域，都是“docs 索引检查 + 归档建议”
- 应保留一份，另一份删除

执行结果：
- 保留 `scripts/maintenance/check-docs-index.js`
- 已删除 `scripts/sentinel/check-docs-index.js`

#### 2. docs 结构分析重复组

- `scripts/maintenance/analyze-docs-structure.js`
- `scripts/sentinel/analyze-docs-structure.js`

判断：
- 都在做 docs 结构扫描和建议输出

执行结果：
- 保留 `scripts/maintenance/analyze-docs-structure.js`
- 已删除 `scripts/sentinel/analyze-docs-structure.js`

#### 3. 健康校验重复组

- `scripts/maintenance/verify-health.js`
- `scripts/sentinel/verify-health.js`

判断：
- 都是健康检查
- 不应该同时存在两套“verify-health”

执行结果：
- 保留 `scripts/maintenance/verify-health.js`
- 已删除 `scripts/sentinel/verify-health.js`

#### 4. sentinel 命名重复组

- `scripts/core/sentinel.js`
- `scripts/sentinel/sentinel.js`

判断：
- 名字完全冲突，且都承担“sentinel”语义
- 这是认知负担最高的一组重复

执行结果：
- 保留 `scripts/core/sentinel.js` 作为主实现
- 已删除 `scripts/sentinel/sentinel.js`

### `C` 级：冻结归档

这些脚本不属于主入口认知。

- `scripts/g.sh`
- `scripts/gemini_manager.sh`
- `scripts/log.sh`
- `scripts/generate_wallpaper.py`
- `scripts/move-files.js`
- `scripts/maintenance/cleanup-docs.js`
- `scripts/maintenance/skill-health-check.sh`
- `scripts/maintenance/keep-alive.sh`
- `scripts/tools/xiaozhu_chat.mjs`

建议：
- 统一移到 `scripts/_legacy/` 或未来的 `tools/personal/`
- 不再出现在 `package.json` 主命令体系

### `D` 级：删除候选

这些在确认无人使用后，可以优先删。

- `scripts/generate_wallpaper.py`
  - 一次性图像生成测试脚本

- `scripts/move-files.js`
  - docs 搬运建议器，当前目录结构下不是日常主线

- `scripts/maintenance/cleanup-docs.js`
  - 面向旧 `docs/memory/journal` / `archive` 时代的清理器

- `scripts/log.sh`
  - 仍写 `docs/operation-logs/`，不是主线日志链路

## 三、真正的功能数其实只有这些

如果去掉非主线脚本和重复实现，当前系统主功能大致只有：

1. AI Team 状态管理
2. 项目索引与指挥中心
3. 本地看板快照
4. RAG 入库与查询
5. 健康检查与复盘
6. 飞书/通知桥接
7. 微信发布流水线

也就是说，你的直觉是对的：

- 功能没有很多
- 文件数量明显偏多

## 四、第一轮治理建议

只做最值当的四件事：

1. 冻结个人脚本到 `scripts/_legacy/`
2. 把三套 `*-with-fleet.sh` 合成一个统一 runner
3. 给 `package.json` 只保留主线命令，不再继续暴露历史脚本

## 五、我建议的目标状态

治理后，`scripts/` 最好收敛为：

- `scripts/actions/`
- `scripts/lib/`
- `scripts/services/`
- `scripts/ingest/`
- `scripts/maintenance/`
- `scripts/wechat/`
- `scripts/_legacy/`

这样你的认知会简单很多：

- 主链脚本只看前 6 个目录
- 非主线和个人工具统一扔到 `_legacy`

## 六、下一步

如果继续执行，我建议按这个顺序落地：

1. 先做“重复脚本合并”
2. 再做“个人脚本迁到 `_legacy`”
3. 最后再精简 `package.json` 命令入口
