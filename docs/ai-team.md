# AI Team 可视化看板

这个页面展示每个 AI 成员的当前任务、进度和状态。

- 数据源: [编排板原始记录](/memory/fleet_status)
- 同步命令: `pnpm run fleet:sync-dashboard`

> 更新 `fleet_status.md` 后执行一次同步命令，再刷新本页即可看到最新信息。

<FleetDashboard />
