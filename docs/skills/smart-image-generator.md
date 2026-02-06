---
id: smart-image-generator
triggers: ["画图", "生成图片", "image", "drawing", "logo", "封面", "小红书", "xhs"]
mcp_requirements: ["nanobanana", "xhs-vision"]
priority: 1
---

# Smart Image Generator (全链路智能绘图引擎)

## 1. 核心调度逻辑 (The Pipeline)

所有绘图任务必须遵循 **A-I-G-U** 闭环模型，且必须明确调度 **nanobanana** MCP 服务：

### 1️⃣ Analyze (分析与锁相)
- **人像一致性 (Character Consistency)**: 严格遵循 Imagen 3 人像一致性协议。
- **动作**: 扫描 `docs/ucd/persona_refs/` 下的所有 3+ 张参考图。
- **挂载**: 必须将所有参考图路径作为 `input_paths` 传入 **nanobanana** 的 `banana_generate` 工具。

### 2️⃣ Inject (审美注入)
- **审美驱动**: 优先调度 **xhs-vision** 插件注入 "冷白皮"、"胶原蛋白" 等中式审美因子。
- **规范依赖**: 必须加载 `docs/ucd/persona_system.md` 提取镜头与光影参数。

### 3️⃣ Generate (生成执行)
- **核心工具**: 强制调度 **nanobanana** MCP。
- **函数**: `banana_generate`。
- **提示词约束**: 必须包含 "Strictly maintain character consistency based on the attached reference images"，并描述 85mm 镜头、电影级光影。

### 4️⃣ Upload (自动分发)
- **动作**: 生成后立即调用图床大师逻辑，上传至 `picx-images-hosting`，交付 Markdown 链接。

## 2. 强制执行标准 (Enforcement)
- **MCP**: 必须显示 "Using nanobanana MCP..."。
- **Input**: Persona 任务严禁单图生成，必须挂载全部参考图。
- **Delivery**: 严禁仅返回本地路径，必须完成云端上传。
