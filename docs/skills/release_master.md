---
id: release-master
triggers: ["发版", "release", "版本", "发布"]
mcp_requirements: []
priority: 1
---
# Release Master Skill (版本发布专家)

## 1. 技能定位
自动化处理项目版本升级、日志同步、需求文档追加、Git 提交以及远程推送，确保发布流程的完整性。

## 2. 触发条件
- 当用户说 “发新版”、“发布新版本”、“release” 时激活。

## 3. 核心工作流 (全自动闭环版)
1. **版本探测**: 读取 `package.json` 确认当前版本。
2. **原子化更新**: 合并执行以下操作：
    - 升级 `package.json` 版本号。
    - 在 `public/version.json` 顶层插入新版本日志。
    - 在 `CHANGELOG.md` 顶部追加更新内容。
    - 在 `AI_REQUIREMENTS.md` 追加改动记录。
3. **Git 闭环**: 
    - 执行 `git add .`。
    - 执行 `git commit -m "chore(release): vX.X.X"`。
    - **执行 `git push`** (默认推送到当前分支的 origin)。
4. **日志归档 (必须)**:
    - 调用 `~/Documents/AI_Common/docs/scripts/log.sh` 记录本次发布。
    - 格式: `log.sh "RELEASE" "Project: <ProjectName> | Version: v<NewVersion> | Changes: <Summary>"`

## 4. 操作规范
- **合并指令**: 必须将所有文件写入、Commit、Push 及 **Log 记录** 操作合并为一条 `run_shell_command`，实现真正的单次授权，全程静默。
- **版本逻辑**: 默认进行 Patch 升级 (0.0.1)。
- **异常处理**: 若 Push 失败，应立即告知用户原因（如需先 Pull）。

## 5. 行动指南
- 激活后，直接执行全量 Shell 指令。
- 确保 `log.sh` 执行成功，并在完成消息中确认日志已归档。
