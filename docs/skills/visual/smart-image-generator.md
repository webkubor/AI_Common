---
id: smart-image-generator
triggers: ["画图", "生成图片", "image", "drawing", "logo", "封面"]
mcp_requirements: ["nanobanana"]
priority: 1
---

# Smart Image Generator (全链路智能绘图引擎)

## 1. 核心调度逻辑 (The Pipeline)

所有绘图任务必须遵循 **A-I-G-U** 闭环模型，且必须明确调度 **nanobanana** MCP 服务：

### 1️⃣ Analyze (分析与锁相)
- **人像一致性 (Character Consistency)**: 严格遵循 Persona System SOP。
- **动作**: 扫描 `docs/ucd/persona_refs/` 下的底稿。
- **挂载**: 必须将参考图路径作为 `file` 参数传入 **nanobanana** 的 `edit_image` 工具。

### 2️⃣ Inject (审美注入)
- **审美驱动**: 依据 `docs/ucd/persona_system.md` 规范，手动注入镜头参数（如 85mm）、光影与肤色质感描述。

### 3️⃣ Generate (生成执行)
- **核心工具**: 强制调度 **nanobanana** MCP。
- **函数**: `edit_image` (锁相模式) 或 `generate_image` (技术封面模式)。
- **提示词约束**: 必须包含 "Strictly maintain character consistency based on the attached reference image"。

### 4️⃣ Upload (自动分发)
- **动作**: 生成后立即调用图床大师逻辑，上传至 `picx-images-hosting`，交付 Markdown 链接。

## 2. 强制执行标准 (Enforcement)
- **MCP**: 必须显示 "Using nanobanana MCP..."。
- **Input**: Persona 任务严禁单图生成，必须挂载全部参考图。
- **Delivery**: 严禁仅返回本地路径，必须完成云端上传。
