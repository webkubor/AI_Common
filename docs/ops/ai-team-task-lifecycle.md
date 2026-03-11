# AI Team 任务生命周期标准

> 适用范围：本地 `AI Team` 中枢、SQLite `tasks` 表、成员卡片任务轨迹、任务池视图。

## 1. 唯一来源

AI Team 的正式任务唯一来源是：

- `.memory/sqlite/ai-team.db`
- 表：`tasks`

以下内容不再视为正式任务源：

- `member.task` 单行文本
- `.memory/tasks/*.md`
- JSON 投影文件

`member.task` 只用于表达成员当前 live 状态，不作为正式任务池主数据。

## 2. 任务状态

标准状态仅保留三类：

1. `待启动`
2. `执行中`
3. `已完成`

任务池必须展示这三类状态，不允许因为存在未完成任务就隐藏已完成任务。

## 3. 发布任务

发布任务时必须写入 `tasks` 表，至少包含：

- `taskId`
- `title`
- `workspace`
- `publishedAt`
- `status`

如果从左侧任务池全局发布：

- 优先尝试下发给同工作区的空闲成员
- 找到空闲成员：直接进入 `执行中`
- 找不到空闲成员：保留为 `待启动`

## 4. 成员自建任务

成员可以从自己的卡片直接新增任务。

标准行为：

1. 任务必须直接写入 `tasks` 表
2. 默认带上当前成员的：
   - `assigneeMemberId`
   - `assigneeAgent`
   - `assigneeRole`
   - `workspace`
3. 如果成员当前空闲：
   - 新任务进入 `执行中`
   - `member.task` 切到该任务
4. 如果成员当前忙碌：
   - 新任务写入任务池
   - 状态为 `待启动`
   - 不覆盖当前 live 任务

## 5. 认领任务

任务一旦被成员认领，必须补齐：

- `owner`
- `assigneeMemberId`
- `assigneeAgent`
- `assigneeRole`
- `workspace`

同一个正式任务不得只存在成员文本里，必须回写 `tasks` 表。

## 6. 标记完成

成员可以从自己的任务轨迹中把正式任务标记为完成。

标准行为：

1. 仅允许完成带 `taskId` 的正式任务
2. 完成动作必须更新 `tasks` 表：
   - `status = 已完成`
   - `completed = 1`
   - `updated_at = 完成时间`
3. 完成动作必须写入 `operation_logs`
4. 如果完成的是当前 live 任务：
   - `member.task` 回到 `待分配任务`
5. 已完成任务必须继续保留在成员任务轨迹与任务池中，不允许直接消失

## 7. 成员任务轨迹

成员卡片中的任务轨迹用于展示：

1. 当前 live 任务
2. 最近正式任务
3. 最近已完成任务

显示原则：

- 固定窗口高度
- 内部滚动
- 不允许因为内容长短把成员卡片外框拉变形

## 8. 删除规则

只允许删除：

- `待启动`

不允许删除：

- `执行中`
- `已完成`

执行中与已完成任务属于协作审计资产，不得直接抹掉。

## 9. 收工协议

成员完成任务后，除了在 UI 中标记完成，还必须继续执行大脑层收工动作：

1. `pnpm run fleet:post-task`
2. `task_handoff_check(task_id, agent, summary)`
3. `log_task()`

UI 完成只是任务池状态更新，不等于大脑留档完成。
