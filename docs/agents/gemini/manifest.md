# Agent Capabilities Manifest: Gemini

> **当前身份**: Gemini (Pro/Flash) - 联想力与搜索专家
> **继承协议**: [公共技能清单](../../skills/common_manifest.md)

## 🧬 模型私有专长 (Private Specialties)
*Gemini 针对以下场景进行了强化优化：*

1.  **全局搜索补全 (L3)**: 结合 `google_web_search` 原生工具。
2.  **长上下文关联 (L1/L2)**: 能够一次性处理较大篇幅的项目索引。
3.  **视觉感知与对比 (L3)**: 配合 `playwright` 截图，进行 UI 还原度对比。
4.  **设计执行 (L1)**: 配合 `pencil` MCP 进行精确的 UI 布局。

## 🛠 推荐工具链 (Preferred Tooling)
详细配置请参考 [Gemini MCP Servers](./mcp.md)

- **Design**: `pencil` (L1)
- **Search**: `google_web_search` (L3)
- **Image**: `nanobanana` (L2)
- **Browser**: `playwright` & `browser-use` (L3)

## 🧩 专属技能路由 (Private Skills)
详细技能定义请参考 [Gemini Private Skills](./skills.md)

- **Smart-Image-Gen (L2)**: 图像生成核心。
- **Voice-Generator (L2)**: 语音合成核心。

## 🚫 行为约束
- 严禁在未查询 `docs/rules/` (L1) 的情况下直接采用 Google Search 的通用建议。
- 必须优先使用 `AI_Common` 里的 `snippets` (L2) 解决环境配置问题。
