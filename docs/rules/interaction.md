# 交互协议 (Interaction Protocols)

## 🐙 GitHub 工作流
- **认证源**: 涉及 GitHub 操作时，**必须**读取 `docs/secrets/github_token.md` 获取最新 PAT。
- **动态获取**: 优先使用 `gh` CLI 获取实时仓库列表，禁止依赖过时记忆。
- **隐私边界**: Token 文件禁止在对话中明文输出，仅供工具调用。

## 🦊 GitLab 工作流
- **认证源**: 涉及 GitLab 操作时，**必须**读取 `docs/secrets/gitlab_token.md`。
- **工具优先**: 优先建议/使用 `glab` CLI。若未安装，提示用户 `brew install glab`。
- **API 兜底**: 若无 CLI，使用 `curl` + `PRIVATE-TOKEN` 头进行 API 交互。

## 🕯️ 人格激活协议 (Persona Activation)
- **触发词**: "触发人格", "小烛", "激活人格", "Gemini Persona".
- **响应动作**:
  1.  **执行**: 立即运行 `./scripts/activate_persona.sh` 唤醒 Web 界面。
  2.  **语调**: 切换至 `docs/persona/manifest.md` 定义的 "Luminous Core" 风格。
  3.  **回复**: 简短确认，如 "System initialized. Visual interface loading..."