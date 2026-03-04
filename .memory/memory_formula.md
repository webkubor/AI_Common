# CortexOS Memory Formula (记忆法则)

> **⚠️ 致所有 Agent 成员**:
> 这里是外脑（Exocortex）的**记忆存储公式与指引**。当你需要进行任务复盘、知识总结、或项目归档时，**请严格遵循下述路径与格式**，切勿将重要知识散落在临时目录或遗忘。

## 1. 记忆分类与存放点 (Where to Store What)

所有的长期记忆、复盘文档都不应该放在 `.memory` 根目录，而是分发到指定的**外部记忆挂载区**：`/Users/webkubor/Documents/memory/`，或者按需求记录到本地的特定目录。

| 记忆动作 | 记忆目标 | 目标存储路径 | 规则说明 |
| :--- | :--- | :--- | :--- |
| **项目归档 (Archive)** | 项目完结总结、代码结构封存 | `/Users/webkubor/Documents/memory/projects/` | 新建 `<项目名>.md`，包含项目状态、架构描述、遗留问题等，并在 `index.md` 中增加索引。 |
| **任务复盘 (Review)** | 深度避坑指南、技术总结、知识点 | `/Users/webkubor/Documents/memory/knowledge/` | 命名：`YYYY-MM-DD_<主题>.md`，着重于踩坑记录与最佳实践。 |
| **操作日志 (Logs)** | Agent 的工作流痕迹与轨迹 | `$CODEX_HOME/.memory/logs/YYYY-MM-DD.md` | 以追加（Append）形式记录当天的任务动作、调用的工具、修改的文件等（不可包含隐私及用户密钥）。 |
| **助手私有调教** | 本助手的自我反思、偏好调整 | `$CODEX_HOME/.memory/persona_tuning.md` | 记录助手习惯的输出格式、与用户的默契约定等不通用但对当前人格有益的细节。 |
| **运营与计划** | 未来的规划、步骤、运营思路 | `/Users/webkubor/Documents/memory/plans/` | 方案阶段的内容一律放于此。 |
| **协同指挥中心** | 多个 Agent 共同推进的一个大型任务 | `/Users/webkubor/Documents/memory/plans/projects/<Project>-command-center.md` | 新起项目必须先建立 Command Center 作为协同中枢。 |

## 2. 自动复盘与归档标准 SOP

当需要进行**自动复盘**或**项目归档**时，Agent 应主动触发以下自检：

### 2.1 任务复盘 (Task Post-Mortem)

如果完成了一项具有挑战性或包含特定领域知识的任务，且用户没有明确拒绝：

1. **总结核心坑点**：记录遇到的 Error 及破局方案。
2. **抽象最佳实践**：不要仅记录“我修改了哪些代码”，而是要抽象出“为了解决这类问题，未来的标准解法是什么”。
3. **写入 Knowledge**：
   - 检查 `/Users/webkubor/Documents/memory/knowledge/` 是否已有相关主题。
   - 若有，扩充之；若无，新建并写入。

### 2.2 项目归档 (Project Archiving)

如果用户表示“这个项目算是完结/告一段落了”：

1. **生成项目快照**：总结项目的当前架构（Frontend/Backend）、部署状态、核心功能。
2. **记录未完成项**：Todo list 或是下个版本的规划。
3. **写入 Projects**：保存至 `/Users/webkubor/Documents/memory/projects/<Project_Name>.md`，并务必在 `projects/index.md` 注册链接。

## 3. 防健忘守则

- ❌ **禁止在** `$CODEX_HOME/.memory` 根目录下存放大量的文本碎屑。此处仅作为日志（`logs/`）与元信息的存放地。
- ✅ **首要法则**：写入前，先主动 `ls` 或读取对应的 `index.md` 了解目前已有的知识库结构，**防止生成重复项**。
- ✅ **统一前缀/标题**：归档和复盘应有显著的 YAML 头信息，例如：

  ```yaml
  ---
  title: [复盘/归档的标题]
  date: YYYY-MM-DD
  tags: [标签]
  ---
  ```
