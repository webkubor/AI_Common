---
id: xhs-publisher
triggers: ["小红书", "xhs", "司南烛", "小烛", "发笔记"]
mcp_requirements: ["chrome-devtools"]
priority: 1
---
# XHS Publisher Skill (小红书运营专家)

## 🎯 核心目标
利用 Chrome MCP 实现多账号（司南烛、小烛）的自动化登录注入与发布管理。

## 🛠 工作流 (Workflows)

### 1. 身份注入 (Identity Injection)
- **凭证源**: `/Users/webkubor/Documents/AI_Common/docs/secrets/accounts_unified.md`
- **注入逻辑**: 
    - 读取指定账户的 JSON Cookies。
    - 使用 `browser_run_code` 执行 `page.context().addCookies(cookies)`。
    - **隔离性**: 默认使用 `newContext()` 开启独立会话，支持账号双开。

### 2. 内容发布 (Publishing)
- **入口**: `https://creator.xiaohongshu.com/publish/publish`
- **感知**: 若被重定向至登录页，说明 Cookie 过期，需提示老爹重登录。
- **填充**:
    - 标题: `input[placeholder*="标题"]`
    - 正文: `.ql-editor`
    - 图片: `browser_file_upload` 

### 3. 数据感知 (Perception)
- **笔记管理**: `https://creator.xiaohongshu.com/new/note-manager`
- **容错提取**: 结构化选择器失效时，降级使用 `innerText('body')` 全文扫描。

## ⚠️ 故障排查
- **注入失败**: 检查 `page.context().browser()` 是否为空，若为空则降级为 Python 物理进程模式。
- **验证码**: 遇到人机验证，立即调用 `debug_screenshot` 并告知老爹手动处理。
