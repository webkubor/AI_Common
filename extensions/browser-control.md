# Browser Control Skill (浏览器操控)

## 🎯 核心逻辑
统一所有 AI 模型操作 Chrome 的标准流程。
无论你是 Gemini, Claude 还是 Codex，在需要调试网页、抓取数据或视觉验收时，遵循此协议。

## 🛠️ 启动 (Launch)
> **必须第一步执行**。只有启动了调试模式，MCP 才能连接。

- **指令**: `~/Documents/AI_Common/chrome-debug.sh [URL]`
- **说明**: 启动一个独立的 Chrome 实例，监听 9222 端口。

## 🎮 控制 (Control)
启动后，根据你的能力类型选择控制方式：

### A. Gemini / Claude (MCP 模式)
> 适用于已安装 `chrome-devtools-mcp` 的模型。

- **连接**: 自动连接 `localhost:9222`。
- **能力**:
    - `Console`: 查看报错日志。
    - `DOM`: 检查元素结构。
    - `Network`: 抓包。
    - `Screenshot`: 页面截图。

### B. Codex (Shell 模式)
> 适用于无 MCP 的环境。

- **打开**: 仅使用启动脚本打开页面。
- **截图**: 使用 `screencapture` 或 `html-to-image` 规则。

## ⚠️ 隐私边界
- 该调试模式使用独立的 `User Data Dir`，不会污染用户的日常浏览器数据（书签/密码）。
