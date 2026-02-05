# Smart Image Generator Skill

> **Description**: 唯一的图像生成执行器。它是一个智能路由，根据用户意图动态加载 `docs/ucd/` 下的规范，并调用底层工具（SVG 编码、PIL 脚本或 AI 绘图）完成交付。
> **Trigger**: "画图", "设计", "生成图片", "做个GIF", "Logo", "封面", "人像".

## 1. 🎯 意图路由与规范匹配

当收到请求时，识别意图并加载对应的 `docs/ucd/` 规范：

| 意图识别 | 动作类型 | 引用规范 (UCD) |
| :--- | :--- | :--- |
| **技术封面** | AI 生成 | `docs/ucd/juejin_tech_covers.md` |
| **人像/角色** | AI 锁相编辑 | `docs/ucd/persona_system.md` |
| **矢量 Logo** | SVG 代码生成 | `docs/ucd/logo_design_standard.md` |
| **Slack 动图** | Python/PIL 渲染 | `docs/ucd/slack_gif_standard.md` |

## 2. ⚙️ 统一执行引擎 (Execution Engine)

根据规范中定义的“动作类型”采取不同手段：

### A. 矢量模式 (Vector Mode)
*   **参数**: `viewBox="0 0 512 512"`.
*   **逻辑**: 直接输出 SVG 代码。

### B. 创意生成模式 (Generation Mode)
*   **模型**: 优先使用 `gemini-3-pro-image-preview` (Imagen 3).
*   **分辨率 (`image_size`)**: 支持 `1K`, `2K`, `4K` (需大写 K)。
*   **比例 (`aspect_ratio`)**: 支持 `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`.
*   **提示词**: 采用“描述性叙述”而非关键词。

### C. 锁相编辑模式 (Persona Mode)
*   **引用**: 最多支持 5 张人物参考图。
*   **逻辑**: 使用 `edit_image` 或多图混合生成，保持 `docs/ucd/girl.png` 的核心骨相。

## 3. 📦 后处理与交付
1.  **物理保存**: 统一移动至 `~/Desktop/`。
2.  **云端同步**: 调用 R2 Proxy 接口上传。
3.  **结果反馈**: 提供本地路径、Markdown 图片引用及 URL。
