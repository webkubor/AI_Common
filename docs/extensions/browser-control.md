# Browser Control Skill (浏览器操控)

## 🎯 核心逻辑
统一所有 AI 模型操作浏览器的标准流程。
无论你是 Gemini, Claude 还是 Codex，在需要调试网页、抓取数据或视觉验收时，遵循此协议。

## 🛠️ 启动 (Launch)
使用 Playwright 直接启动浏览器实例，无需额外脚本。

- **方式**: 通过 Playwright API 直接启动
- **说明**: Playwright 会自动管理浏览器进程，支持 Chromium、Firefox 和 WebKit。

## 🎮 控制 (Control)
根据你的能力类型选择控制方式：

### A. Gemini / Claude (MCP 模式)
> 适用于已安装 `playwright-mcp` 的模型。

- **连接**: 使用 Playwright MCP 服务器
- **能力**:
    - `Console`: 查看报错日志
    - `DOM`: 检查元素结构
    - `Network`: 抓包分析
    - `Screenshot`: 页面截图
    - `Actions`: 点击、输入、导航等交互

### B. Codex (Shell 模式)
> 适用于需要直接运行 Playwright 脚本的环境。

- **打开**: 使用 Playwright Python/Node.js 脚本
- **截图**: 使用 `page.screenshot()` 方法
- **参考**: 详见 `docs/extensions/webapp-testing/`

## ⚠️ 隐私边界
- Playwright 使用独立的浏览器上下文，不会污染用户的日常浏览器数据（书签/密码）
- 支持无头模式（headless）和有头模式，可根据需求切换
