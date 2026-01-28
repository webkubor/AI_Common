# 交互协议 (Interaction Protocols)

## 🐙 GitHub 工作流
- **认证源**: 涉及 GitHub 操作时，**必须**读取 `docs/snippets/github_token.md` 获取最新 PAT。
- **动态获取**: 优先使用 `gh` CLI 获取实时仓库列表，禁止依赖过时记忆。
- **隐私边界**: Token 文件禁止在对话中明文输出，仅供工具调用。
