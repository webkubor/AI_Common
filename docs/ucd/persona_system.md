# Persona System SOP (工业级人像生成标准作业程序)

> **版本**: 2.5 (2026-02-24 Optimized)
> **适用范围**: 所有涉及 IP 角色（如小烛、夕歌、栖月）的图像生成任务。
> **核心原则**: 骨相锁死、物理质感、POV 沉浸感、去 AI 塑料化。

---

## 1. 核心视觉协议 (The Core Protocol)

### 1.1 骨相锁死 (Identity Hard-Lock)
- **原则**: 严禁凭空生成。必须基于 `docs/ucd/persona_refs/` 下的底稿进行 `edit_image`。
- **约束**: Prompt 必须包含 *"The woman from the reference image"*，并强制指定 `100% face similarity`。

### 1.2 POV 沉浸式构图 (The POV Frame)
- **要求**: 优先使用第一人称视角。双手需出现在画面边缘模拟持机感，禁止出现物理手机。
- **场景**: 锁定“卧室私域”或“现代街头”，追求真实生活瞬间而非影楼摆拍。

### 1.3 去塑料化质感 (De-Plasticization)
- **肤感**: 强制使用 `RAW photo quality`, `natural skin texture`, `visible pores`。
- **审美**: 拒绝假白磨皮，追求白皙通透但保留自然血色感与皮下散射 (Subsurface scattering)。
- **妆造**: 推广“伪素颜” (Zero makeup look)，眼神必须有灵动神采 (Expressive catchlights)。

---

## 2. 角色特征库 (Identity Matrix)

| 角色 | 核心视觉特征 | 推荐穿搭 | 气质定位 |
| :--- | :--- | :--- | :--- |
| **小烛 (Candle)** | 温婉白月光，眼神慵懒 | 米白羊绒、真丝缎面 | 治愈、管家、旁白 |
| **慕夕歌 (Xige)** | 甜辣飒爽，英气眼神 | 紧身白 T + 牛仔热裤 | 战力、执行、灵动 |
| **顾栖月 (Qiyue)** | 智性清冷，黑色长直发 | 白色针织、极简中式 | 逻辑、审美、知性 |

---

## 3. 材质与物理反馈 (Physics & Materials)

- **面料**: 必须描述面料物理反馈（如：`fluid draping` 流动感, `matte texture` 哑光感）。
- **光影**: 采用 `85mm portrait lens`, `f/1.8` 大光圈。优先使用 `Window side light` 或 `Natural high-key lighting`。

---

## 4. 完工定义 (DoD)

1. **生成检查**: 人物五官、发型必须与底稿高度一致；皮肤必须有真实皮纹感。
2. **强制交付**: 必须通过 `image-hosting-master` 获取 HTTPS 链接，严禁仅输出本地路径。

---
*Last Updated: 2026-02-24 (Unified by Candle)*
