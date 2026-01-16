# Codex Skills Protocol (Codex 技能扩展协议)

## 1. 技能存放路径
本地技能统一存放在：
`~/.codex/skills/<技能名称>/SKILL.md`

## 2. 手动创建技能 (Manual Path)
1. **新建目录**: `mkdir -p ~/.codex/skills/my_new_skill`
2. **编写 SKILL.md**: 必须包含 **YAML 前置元数据**，否则无法识别。
   ```yaml
   ---
   name: skill_name
   description: 触发规则与动作描述
   ---
   ```
3. **激活与加载**: 
   - 技能必须出现在会话的“可用技能列表”中才能生效。
   - 触发规则以该列表加载的状态为准。

## 3. 自动化技能安装 (-installer)
支持从远程仓库一键安装：
```bash
$skill-installer https://github.com/anthropics/skills/tree/main/skills/frontend-design
```

## 4. 三种操作模式 (CLI Modes)
使用 `codex -a` 指定操作深度：
- `suggest`: 仅提供修改建议。
- `auto-edit`: 自动执行修改（补全逻辑、写单测）。
- `full-auto`: 全自动闭环修复（直到测试通过）。

## 5. 实战案例：/start 技能 (Manual Template)
```yaml
---
name: env_initializer
description: When a user message contains `/start`, read `~/Documents/AI_Common/index.md` first, then load only the required sub-documents based on the router rules before proceeding.
---
```
