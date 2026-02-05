# Gemini MCP Servers (Active Configuration)

> **定义**: 当前 Gemini Agent 环境中已配置并在线的 Model Context Protocol (MCP) 服务。

## 🛠 已连接的服务 (8 Servers)

| Server ID | 核心职能 | 调用层级 | 状态 |
| :--- | :--- | :--- | :--- |
| **playwright** | 跨浏览器测试、交互、截图与 UI 验证。 | **L3** | ✓ Connected |
| **context7** | 实时库文档检索（Upstash 驱动）。 | **L3** | ✓ Connected |
| **pencil** | `.pen` 设计文件编辑器（Antigravity 驱动）。 | **L1** | ✓ Connected |
| **nanobanana** | 图像生成、编辑、恢复与 AI 绘图核心。 | **L2** | ✓ Connected |
| **browser-use** | 自然语言驱动的高级浏览器自动化。 | **L3** | ✓ Connected |
| **figma-developer** | Figma 设计稿像素级读取与组件解析。 | **L3** | ✓ Connected |
| **chrome-devtools** | 浏览器底层控制与网络性能调试。 | **Legacy** | ✓ Connected |
| **stitch** | Google UI 自动生成服务（Stitch 驱动）。 | **L3** | ✗ Disconnected |

## 🔗 配置路径
所有 MCP 配置均由 `~/.gemini/settings.json` 管理。

---
*Last Sync: 2026-02-05*