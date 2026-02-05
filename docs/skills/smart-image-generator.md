# Smart Image Generator Skill

> **Description**: 智能绘图路由，自动根据场景匹配 UCD 规范，并执行保存与云端上传。
> **Trigger**: "Generate image", "Make a cover", "Create a persona", "画图", "生成图片", "设计Logo", "做个GIF".

## 1. 🧠 Context Analysis & Routing (场景分析与路由)

当收到绘图请求时，分析关键词并匹配对应的 **UCD 规范文件**：

| 关键词 | 模式 | 对应 UCD 规范 |
| :--- | :--- | :--- |
| `tech`, `cover`, `掘金`, `封面` | **Tech Share Cover** | `docs/ucd/juejin_tech_covers.md` |
| `person`, `human`, `avatar`, `girl`, `人像`, `角色` | **Persona System** | `docs/ucd/persona_system.md` |
| `logo`, `icon`, `svg`, `标识` | **Vector Logo** | `docs/ucd/logo_design_standard.md` |
| `gif`, `slack`, `emoji`, `动图` | **Slack GIF** | `docs/ucd/slack_gif_standard.md` |
| *其他* | *General Mode* | 按通用美学逻辑处理 |

## 2. ⚙️ Execution Workflow (执行流程)

### Step 1: 加载规范
读取匹配的 UCD 规范文件 (`read_file`)，获取 Prompt 模板、骨相锁死或技术参数。

### Step 2: 确定执行方式
*   **人像 (Persona)**: 检查 `docs/ucd/girl.png`。
    *   **有参考图**: 使用 `edit_image` ("保持面部一致，将姿态改为...")。
    *   **无参考图**: 使用 `generate_image` 或 `/xhs` (若需小红书美学)。
*   **Logo**: 直接生成 SVG 代码并保存为 `.svg`。
*   **GIF**: 生成 Python 脚本利用 PIL 逐帧渲染。

### Step 3: 后处理 (Save & Upload)
1.  **保存**: `mv [Generated_Path] ~/Desktop/[Meaningful_Name].png`
2.  **上传**: 调用 R2 Proxy 进行云端归档。
3.  **交付**: 同时返回本地路径与远程 URL。