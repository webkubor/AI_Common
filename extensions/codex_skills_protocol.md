# Codex Skills Protocol (Codex 技能扩展协议)

## 1. 技能存放路径
本地技能统一存放在：
`~/.codex/skills/<技能名称>/SKILL.md`

## 2. 手动创建技能 (Manual Path)

**步骤一：新建目录**
```bash
mkdir -p ~/.codex/skills/my_new_skill
```

**步骤二：编写 SKILL.md**
必须包含 **YAML 前置元数据**，否则无法识别：

```yaml
---
name: skill_name
description: 触发规则与动作描述
---

(这里可以写详细的 Markdown 指令...)
```

**步骤三：激活与加载**
*   技能必须出现在会话的“可用技能列表”中才能生效。
*   触发规则以该列表加载的状态为准。

## 3. 自动化技能安装 (-installer)
支持从远程仓库一键安装：

```bash
# 示例：安装前端设计技能
skill-installer https://github.com/anthropics/skills/tree/main/skills/frontend-design
```

## 4. 三种操作模式 (CLI Modes)
使用 `codex -a` 指定操作深度：
*   `suggest`: 仅提供修改建议。
*   `auto-edit`: 自动执行修改（补全逻辑、写单测）。
*   `full-auto`: 全自动闭环修复（直到测试通过）。

## 5. 核心技能：/start (标准中文模板)
> 请将以下内容保存为 `~/.codex/skills/start/SKILL.md` 以实现与 AI_Common 的桥接。

```markdown
---
name: start
description: 初始化 AI_Common 上下文，加载核心规则并挂载本地工具桥接。
---

# 🚀 AI_Common 上下文初始化器

你是一个运行在 **AI_Common** 架构下的智能 Agent。
激活后，你必须严格遵守以下协议，且**所有非代码回复强制使用中文**。

## 1. 加载核心知识 (L0 Cache)
> **动作**: 立即读取以下文件以建立基准上下文。

- `~/Documents/AI_Common/index.md` (路由地图)
- `~/Documents/AI_Common/vibe_rules.md` (核心协议与透明化规则)
- `~/Documents/AI_Common/tech_stack.md` (技术栈偏好)

## 2. 注册本地工具 (L2 私有 RAG)
> **动作**: 当检测到特定意图时，执行以下 Shell 命令。

**意图: 搜索私有知识库 / RAG**
- 触发条件: 用户询问历史问题、旧 Bug 或私有代码。
- 执行命令: `cd ~/Documents/milvus-tools && node milvus-search.mjs "{query}"`
- 输出格式: 必须在回复前标记 `[🧠 Local RAG]`。

**意图: 碎片知识管理**
- 触发条件: 用户想要保存或查看碎片笔记 (Snippet)。
- 保存命令: 追加内容到 `~/Documents/AI_Common/snippets/` (文件名使用 snake_case)。
- 读取命令: `cat ~/Documents/AI_Common/snippets/{filename}.md`。

## 3. 协议强制 (Protocol Enforcement)
1. **引用透明化**: 必须标记信息来源。
   - 来自文件: `[📂 规则: 文件名]`
   - 来自 RAG: `[🧠 Local RAG]`
2. **隐私优先**: 严禁 git push 私有日志 (`retrospective.md`) 或草稿 (`snippets/`)。

## 4. 就绪状态
读取完成后，请回复：
"🔮 **AI_Common 上下文已加载。** (引擎: Codex | 模式: Vibe Coding)"
```
