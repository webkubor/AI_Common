# Slack GIF Creator (Animation Executor)

> **Description**: 用于生成 Slack 优化动图的执行工具。
> **Standard**: 遵循 `docs/ucd/slack_gif_standard.md` 规范。

## 🚀 工作流

1.  **参数设定**: 根据 `docs/ucd/slack_gif_standard.md` 设置尺寸、FPS 与色彩深度。
2.  **逻辑渲染**: 生成基于 PIL 的渲染脚本，利用 Easing 函数实现平滑运动。
3.  **保存交付**: 检查文件大小是否适合 Slack Emoji (建议 < 128KB)。