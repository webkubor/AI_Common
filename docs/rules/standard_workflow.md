# AI 协作标准工作流 (Standard Workflow)

本规范定义了 AI 在参与软件开发任务时必须遵循的“计划-执行-复盘”闭环流程，确保任务的可追溯性和交付质量，同时通过结构化索引机制控制上下文 Token 消耗。

## 1. 核心流程 (The Loop)

1. **索引扫描 (Index First)**：任务启动前，优先读取项目根目录下的 `.agent/PROJECT.md` 或 `.agent/plans/README.md` 索引文件，而非扫描整个目录树。
2. **计划先行 (Plan)**：在开始任何代码改动前，必须在 `.agent/plans/` 目录下创建或更新计划文件（YYYY-MM-DD.md），并将其链接添加到 `.agent/plans/README.md` 索引中。
3. **执行与验证 (Implement & Verify)**：按照计划实施改动，并执行项目特定的验证命令（如 `type-check`, `build`, `lint`）。
4. **复盘记录 (Review)**：任务完成后，在 `.agent/reviews/` 目录下创建复盘文件，并更新 `.agent/reviews/README.md` 索引。
5. **原子提交 (Commit)**：Git 提交必须包含代码改动以及对应的 Plan 和 Review 文档更新。

## 2. 目录结构规范 (Directory Structure)

所有 AI 协作产生的元数据必须收敛于 `.agent/` 目录，避免污染项目根目录。

```text
.agent/
├── PROJECT.md           # [入口] 项目总览与导航
├── MODULE_INDEX.md      # [入口] 核心模块与文件映射索引
├── plans/               # [目录] 计划归档
│   ├── README.md        # [索引] 活跃计划列表 (AI 读取此文件)
│   └── 2024-03-20.md    # [内容] 具体计划
└── reviews/             # [目录] 复盘归档
    ├── README.md        # [索引] 复盘记录列表 (AI 读取此文件)
    └── 2024-03-20.md    # [内容] 具体复盘
```

## 3. 上下文管理原则 (Context Management)

- **分级注入 (Hierarchical Injection)**：严禁 AI 一开始就读取所有计划或复盘。必须先读取 `README.md` 索引，根据用户需求仅加载相关的具体文件。
- **索引维护 (Index Maintenance)**：每当新增 `.md` 文件时，**必须**同步更新同级目录下的 `README.md`，确保索引的时效性。
- **Token 节约**: 通过索引机制，AI 在理解项目时只需消耗极少的 Token（仅读取目录索引），而非加载海量历史文件。

## 4. 文档模板 (Templates)

### 4.1 计划模板 (.agent/plans/YYYY-MM-DD.md)
必须包含日期、任务类型、发起人、根据索引跳转的上下文链接。

### 4.2 复盘模板 (.agent/reviews/YYYY-MM-DD.md)
必须包含日期、执行人、审核人、关键决策点。

## 5. 交互原则

- **日期隔离**：按日期新建文件，避免单文件无限追加。
- **闭环提交**：文档更新（Plans/Reviews）必须随代码一同 Commit。
