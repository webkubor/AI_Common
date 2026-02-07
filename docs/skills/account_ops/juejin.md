---
id: juejin-publisher
triggers: ["掘金", "juejin", "发文章", "写博客"]
mcp_requirements: ["chrome-devtools"]
priority: 1
---
# Juejin Publisher Skill (掘金博主专家)

## 🎯 核心目标
自动化掘金技术文章的身份接管与Markdown一键发布。

## 🛠 工作流 (Workflows)

### 1. 身份注入 (Identity Injection)
- **凭证源**: `/Users/webkubor/Documents/AI_Common/docs/secrets/accounts_unified.md`
- **逻辑**: 从 `## Juejin` 节提取 Cookies 并注入。

### 2. 文章发布 (Publishing)
- **入口**: `https://juejin.cn/editor/drafts/new`
- **编辑器填充**:
    - 标题: `.title-input`
    - 内容: `.ace_text-input` (Markdown模式) 或 `.bytemd-editor`。
- **发布面板**: 点击“发布”后，需选择分类（Category）和添加标签（Tags）。

### 3. 矩阵同步 (Sync)
- **跨平台**: 支持从小红书笔记或 Aider 生成的文档中提取内容，自动转化为掘金格式。

## ⚠️ 故障排查
- **草稿冲突**: 发布前检查是否有未保存的草稿提示。
- **登录拦截**: 重定向至首页即为身份失效。
