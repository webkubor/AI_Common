# Skill Vetting Report — tavily-search（2026-03-04）

## 1. 基础信息

- Skill 主题：Tavily 实时联网搜索
- 审查时间：2026-03-04
- 审查人：Codex-1
- 审查方式：仅 `inspect` 拉取元数据与源码，不执行安装

## 2. 候选清单与来源可信度

### A. openclaw-tavily-search（候选）

- slug：`openclaw-tavily-search`
- 版本：`0.1.0`
- 作者：`Jacky1n7`
- 指标：downloads `2519` / stars `1`
- 更新时间：2026-02-26

### B. tavily-tool（候选，推荐）

- slug：`tavily-tool`
- 版本：`0.1.1`
- 作者：`tylordius`
- 指标：downloads `388` / stars `0`
- 更新时间：2026-02-28
- 变更说明含安全条目：固定 Tavily endpoint，声明必需环境变量 `TAVILY_API_KEY`

### C. tavily-skill（候选）

- slug：`tavily-skill`
- 版本：`1.0.0`
- 作者：`fangkelvin`
- 指标：downloads `173` / stars `0`
- 更新时间：2026-03-01

## 3. 文件与行为审查

### A. openclaw-tavily-search

已审文件：

- `SKILL.md`
- `scripts/tavily_search.py`

行为摘要：

- 只请求 `https://api.tavily.com/search`
- 读取密钥来源：`TAVILY_API_KEY` 或 `~/.openclaw/.env`
- 不写本地文件，不执行系统改配置操作

风险观察：

- 读取 `~/.openclaw/.env` 会引入额外本地路径依赖，不完全符合 CortexOS 的“外置 secrets + 显式注入”习惯。

### B. tavily-tool

已审文件：

- `SKILL.md`
- `references/tavily-api.md`
- `scripts/tavily_search.js`
- `scripts/tavily_search.sh`

行为摘要：

- 只请求 `https://api.tavily.com/search`（硬编码）
- 密钥仅来自环境变量 `TAVILY_API_KEY`
- 无文件写入、无提权、无动态执行、无可疑外联
- 参数处理较完整（`max_results` 限制、错误码、HTTP/JSON 异常处理）

风险观察：

- 仍是外部联网与第三方 API 调用，属于中等风险类别的可控风险。

### C. tavily-skill

已审文件：

- `SKILL.md`
- `tavily-search.sh`

行为摘要：

- 通过 `curl` + `jq` 调 Tavily API
- 密钥来自环境变量 `TAVILY_API_KEY`
- 不写本地文件，无提权动作

风险观察：

- Shell 字符串拼接构造 JSON，请求参数鲁棒性较弱（特殊字符处理不如 JS/Python 版稳健）。

## 4. 权限面评估

需要读取：

- 进程环境变量：`TAVILY_API_KEY`
-（仅 A）`~/.openclaw/.env`

需要写入：

- 无

需要网络访问：

- `api.tavily.com:443`

需要执行命令：

- A：`python3`
- B：`node`（可选 shell wrapper）
- C：`bash` + `curl` + `jq`

## 5. 风险结论

- 风险等级：`MEDIUM`（联网 + API key）
- 结论：`谨慎通过`

推荐顺序：

1. **首选 B (`tavily-tool`)**：实现更稳、密钥策略更干净（env only）、endpoint 固定。
2. 次选 A (`openclaw-tavily-search`)：可用，但有 `~/.openclaw/.env` 读取分支。
3. 不优先 C (`tavily-skill`)：可用但脚本鲁棒性一般。

## 6. CortexOS 接入限制（安装前约束）

1. 仅允许通过环境变量注入 `TAVILY_API_KEY`，不从任意本地文件兜底读取。
2. 默认 `max_results <= 5`，防 token 膨胀。
3. 输出必须包含来源 URL，禁止只给结论不附来源。
4. 保持只读联网行为，禁止新增自动写文件或自动修复动作。

## 7. 最终建议

- 可进入安装阶段的对象：`tavily-tool`
- 进入安装前动作：沿用 `docs/rules/skill_vetting_gate.md`，并保留本报告归档。
