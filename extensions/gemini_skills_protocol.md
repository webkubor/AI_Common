# Gemini Skills Protocol (Gemini 技能扩展协议)

## 1. 技能存放路径
Gemini 技能采用目录隔离模式，每个技能是一个独立的 Markdown 文档：
`~/.gemini/extensions/<技能名称>/GEMINI.md`

## 2. 标准文档结构
Gemini 技能不强制使用 YAML 头，但必须包含以下语义化区块以供 AI 深度解析：

- **# <Skill Name> Skill**: 技能标题与简述。
- **## 角色定义**: 明确 AI 的专业身份（如：资深技术博主、系统架构师）。
- **## 触发条件**: 定义激活此技能的关键词（如：“写一篇掘金”、“审查代码”）。
- **## 核心工作流**: 详细的步骤（1, 2, 3...），通常包含工具调用的顺序。
- **## 输出规范**: 格式要求（Markdown 排版、StandardJS 代码风格、中文注释）。

## 3. 触发与执行逻辑
- **关键词感知**: Gemini 在全局 Context 中监听触发词。一旦匹配，立即静默加载对应的 `GEMINI.md` 内容。
- **工具绑定 (Tool-Calling)**: 技能的核心是**自动化**。必须明确指示 AI 何时调用 `write_file` 保存结果，或调用 `run_shell_command` 执行系统操作。
- **上下文注入**: 加载后，技能定义的规则将具有最高优先级，覆盖通用的系统提示词。

## 4. 实战案例：Juejin Writer (简化版)
**文件**: `~/.gemini/extensions/juejin-writer/GEMINI.md`

```markdown
# Juejin Writer Skill
## 触发条件
- 当用户要求“写掘金文章”时。

## 核心工作流
1. 构思标题。
2. 生成 Markdown 内容。
3. **必须调用** `write_file` 将文件保存至 `~/Desktop/工作/运营/掘金/`。

## 输出规范
- 必须包含 Emoji，排版精美。
```

## 5. 如何创建新技能
1. **创建目录**: `mkdir -p ~/.gemini/extensions/my_skill`
2. **编写 GEMINI.md**: 按照上述结构描述逻辑。
3. **即时生效**: 无需重启，Gemini 在下一次扫描 Extensions 目录时会自动识别并应用。
