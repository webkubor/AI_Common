# 隐私 / 入库排除清单（默认不向量化、不公开）

> **⚠️ 同步指令**: 每当修改本文件时，**必须**同步更新项目根目录的 `.gitignore`，确保 Git 忽略规则与本清单保持严格一致。

> 目的：给“长期记忆 + 向量知识库落地”设置安全边界。
>
> 默认原则：
> - 除非你明确指令“允许入库/允许公开”，否则以下内容 **一律不做向量化**、**不复制到公开仓库/公开渠道**。
> - 对话中如需引用其中信息，优先“概述规则”，避免粘贴原文内容。

## 1) 明确禁止入库的目录/文件（高风险）

- `~/.ssh/`（私钥、公钥、known_hosts）
- `~/.aws/`、`~/.config/gcloud/`（云账号凭据）
- `~/.npmrc`、`~/.yarnrc*`、`~/.pnpmrc`（可能包含 registry token）
- `~/.git-credentials`、`~/.config/gh/`（Git/gh 凭据）
- `~/.gemini/` 中的以下文件：
  - `mcp-oauth-tokens.json`
  - `oauth_creds.json`
  - 任何 `*token*`、`*secret*`、`*creds*` 命名文件
- `~/.env`、`*.env`、`*.pem`、`*.p12`、`*.key`、`id_rsa*` 等密钥文件
- 任何包含以下字段的配置片段（即便在 Markdown 里）：
  - `API_KEY` / `SECRET` / `TOKEN` / `PASSWORD`

## 2) 允许备份但不建议入库的目录（中风险 / 噪音）

- `~/.gemini/tmp/`、`~/.gemini/state.json`、浏览器 profile（缓存/状态，容易污染语义检索）
- `.DS_Store`（系统噪音文件）
- `node_modules/`、`dist/`、`build/`（可再生产物）

## 3) 推荐“可备份/可共享”的 Gemini 配置范围（低风险）

如果你要迁移机器或复用配置，建议只备份：
- `~/.gemini/settings.json`
- `~/.gemini/extensions/`（你自己维护的技能定义）

> 备注：是否“可共享”取决于其中是否写入了真实密钥；建议使用环境变量注入密钥。

## 4) 向量化入库前的最小自检（防误入库）

- 扫描关键字：`API_KEY|SECRET|TOKEN|PASSWORD|BEGIN .* PRIVATE KEY|sk-`
- 排除目录：上述“明确禁止入库”的路径

---
*Last Updated: 2026-01-15*
