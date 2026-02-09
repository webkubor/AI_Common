---
id: gitlab-manager
triggers: ["gitlab", "仓库", "流水线", "CI"]
mcp_requirements: []
priority: 1
---
# GitLab Manager Skill (GitLab 运维专家)

## 🎯 核心目标
支持官方 GitLab 与 Paylinker 私有实例的仓库管理及 CI/CD 自动化。

## 🛠 工作流 (Workflows)

### 1. 实例切换 (Instance Switch)
- **官方**: `gitlab.com`，使用注册表中的 Global Token。
- **私有**: `gitlab.paylinker.com`，使用指定的账号密码。

### 2. 核心操作 (Ops)
- **仓库管理**: `glab repo list/clone/view`。
- **CI/CD**: 查看流水线状态 (`glab ci list`) 或触发构建。

### 3. 自动化认证
- 每次执行前，自动根据目标实例提取对应 Token 并注入环境变量 `GITLAB_TOKEN`。

## ⚠️ 交互协议
- **隐私**: 严禁明文展示 Token。
- **环境**: 始终检查 `glab` CLI 是否已安装。
