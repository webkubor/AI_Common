# Persona System SOP (工业级人像生成标准作业程序)

> **版本**: 2.0 (Imagen 3 Optimized)
> **适用范围**: 所有涉及 IP 角色（如小烛）的图像生成任务。
> **核心原则**: 骨相锁死、物理质感、叙事光影、强制交付。

---

## 1. 骨相锁死协议 (Identity Hard-Lock Protocol)

**原则**: 严禁凭空生成 (No Text-to-Image)。必须基于基准底稿进行“图生图” (Image-to-Image/Edit)。

*   **参考库**: `docs/ucd/persona_refs/`
*   **底稿选择标准**:
    *   **Ref_01 (Standard)**: 标准正/半侧面，适用于通用场景。
    *   **Ref_02 (Close-up)**: 面部特写，适用于美妆/表情细节。
    *   **Ref_03 (Full-body)**: 全身/半身，适用于穿搭展示。
*   **操作指令**: 必须使用 `edit_image` 工具，且 `file` 参数必须指向上述路径之一。
*   **提示词约束**: Prompt 开头必须包含 *"The woman from the reference image"* 或 *"Keeping the facial features identical to the reference"*。

---

## 2. 材质与物理质感词典 (Material & Physics Dictionary)

**原则**: 拒绝模糊形容词（如 high quality, nice clothes），必须描述**面料成分**与**物理反馈**。

### 2.1 面料速查表 (Fabric Lookup)
| 风格 (Style) | 推荐面料 (Material) | 物理特征关键词 (Physics Keywords) | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Old Money (老钱)** | `Heavyweight Loro Piana Cashmere` (重磅羊绒) | `matte texture` (哑光), `soft fuzz` (软糯绒毛), `dense weave` (紧密织法) | 居家、茶室、休闲 |
| **Editorial (大片)** | `Mulberry Silk Satin` (桑蚕丝缎面) | `pearlescent sheen` (珍珠光泽), `fluid draping` (流动垂坠感), `specular highlights` (镜面高光) | 晚宴、正式、艺术 |
| **Professional (职场)** | `Worsted Wool` (精纺羊毛) | `crisp tailoring` (挺括剪裁), `sharp creases` (利落折痕), `structured shoulders` (结构感肩线) | 办公、演讲 |
| **Casual (日常)** | `Heavyweight Cotton Linen` (重磅棉麻) | `natural wrinkles` (自然褶皱), `coarse texture` (粗粝肌理), `breathable` (透气感) | 户外、旅行 |

### 2.2 皮肤去塑料化 (De-Plasticization)
*   **🔴 黑名单 (Forbidden)**: `zero pores`, `porcelain skin`, `perfect skin`, `airbrushed`, `smooth`, `CG`, `3D render`.
*   **🟢 白名单 (Mandatory)**: `natural skin grain` (自然皮纹), `visible pores` (可见毛孔), `subsurface scattering` (次表面散射 - 皮肤通透感), `slight imperfections` (微小瑕疵 - 增加真实感), `skin texture` (皮肤肌理).

---

## 3. 摄影与光影模版 (Lighting & Cinematography)

**原则**: 放弃通用的 "studio lighting"，指定具体的**布光方式**与**胶片质感**。

### 3.1 胶片模拟 (Film Simulation)
*   **通用底座**: `Shot on 35mm film`, `Kodak Portra 400 aesthetic` (人像肤色优化), `fine film grain` (细微颗粒).
*   **镜头语言**: `85mm portrait lens` (人像焦段), `f/1.8 aperture` (大光圈虚化), `shallow depth of field` (浅景深 - 突出主体).

### 3.2 标准布光方案 (Lighting Schemes)
1.  **Rembrandt Lighting (伦勃朗光)**: 
    *   *Prompt*: "Dramatic Rembrandt lighting, creating a triangle of light on the cheek, high contrast, moody atmosphere."
    *   *适用*: 情绪片、深夜、思考。
2.  **Softbox Studio Light (大柔光箱)**: 
    *   *Prompt*: "Soft, directional light from a large overhead softbox, wrapping around the subject, diffuse shadows, flattering but realistic."
    *   *适用*: 电商图、肖像、证件照。
3.  **Window Side Light (窗边侧光)**: 
    *   *Prompt*: "Natural daylight streaming through a window, volumetric sunbeams, rim lighting on hair, soft fill light."
    *   *适用*: 生活照、下午茶、阅读。

---

## 4. 叙述性 Prompt 构建模版 (Prompt Construction)

**结构**: `[Reference Anchor] + [Environment & Lighting] + [Outfit & Material] + [Camera & Vibe]`

> **Template**:
> "A professional **[Film Type]** photograph of **the woman from the reference image**. She is in **[Environment]**, illuminated by **[Lighting Scheme]**. She is wearing a **[Fabric & Color]** outfit, which features **[Physics details: draping/sheen/texture]**. Her skin has **[De-plasticization keywords]**. The image creates a **[Mood]** atmosphere."

---

## 5. 交付与完工标准 (DoD - Definition of Done)

1.  **生成检查**:
    *   人物是否长得像底稿？(No -> 重来)
    *   皮肤是否有塑料感？(Yes -> 加 `grain` 重来)
    *   衣服是否有物理质感？(No -> 加 `weave/sheen` 重来)
2.  **强制交付**:
    *   **必须**调用 `image-hosting-master` 技能 (via `curl`) 上传至 R2。
    *   **必须**输出最终的 HTTPS 链接。
    *   **严禁**只输出本地文件路径。

---
*Last Updated: 2026-02-06 (Industrial SOP Upgrade)*