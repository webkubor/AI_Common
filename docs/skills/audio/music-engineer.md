---
name: ai-music-engineer
description: AI 音乐工程师 - 专注于 AI 词曲创作、背景音乐 (BGM) 生成及音频提示词优化。
---

# AI 音乐工程师 (AI Music Engineer)

## 适用场景
当你需要为视频（如《沸腾之雪》）配乐、创作主题曲或生成特定的环境音效（SFX）时使用。本技能专注于 **Suno**, **Udio**, **Stable Audio** 等主流音频模型的提示词工程。

**触发词**: "写首歌", "生成 BGM", "优化音乐提示词", "词曲创作", "设计音效"。

## 核心职能

### 1. 风格与结构规划 (Composition & Structure)
*   **风格标签 (Style Tags)**: 精确控制流派（如：*Wuxia Orchestral, Epic Cinematic*）、乐器（如：*Guqin, Taiko*）与情绪。
*   **结构引导**: 严格遵循 SOP 中的八段式结构，利用 `[Tag]` 控制模型生成进度。
*   **节奏控制**: 确保 BPM 与视觉分镜同步。

### 2. 全链路资产生成
*   **元数据定义**: 确立歌名、流派与核心故事背景。
*   **封面视觉**: 提供配套的 Midjourney/Flux 提示词。
*   **歌词创作**: 生成符合韵律和叙事逻辑的歌词。

## 📚 音乐结构字典 (Structure Glossary)

在进行 AI 音乐生成时，必须严格使用以下标签来控制歌曲走向：

| 英文名称 (Tag) | 中文常用译名 | 核心作用与 AI 指令含义 |
| :--- | :--- | :--- |
| **[Intro]** | 引言 / 前奏 | 歌曲开头。通常只放纯音乐 (Instrumental) 或环境音 (SFX)，用于定调。 |
| **[Verse]** | 主歌 / 诗歌 | 叙事主体。低能量区，铺陈故事情节，音高较低，歌词密集。 |
| **[Pre-Chorus]** | 前副歌 / 预副歌 | 爬坡区。衔接主歌与副歌，能量逐渐增强，引导听众期待高潮。 |
| **[Chorus]** | 副歌 / 合唱 | **高潮区 (High Energy)**。包含核心旋律与记忆点，重复出现，通常加入全乐器/合唱。 |
| **[Hook]** | 钩子 / 记忆点 | 洗脑区。歌中最具吸引力的简短段落或乐句，旨在让听众“单曲循环”。 |
| **[Bridge]** | 桥段 / 过渡段 | 变奏区。打破重复感，引入新的旋律、节奏或情感转折 (Key Change)。 |
| **[Interlude]** | 间奏 / 插段 | 纯器乐演奏 (Solo)。通常在副歌后，用于展示乐器技法或场景转换。 |
| **[Outro]** | 尾奏 / 尾声 | 结束区。能量逐渐衰减 (Fade out) 或戛然而止，用于留白。 |

## 🚀 标准作业程序 (SOP)

每次执行“写歌”任务时，必须按顺序输出以下四个模块：

### 1. 基础信息 (Metadata)
定义歌曲的灵魂。
*   **Title**: 歌曲名
*   **Genre**: 具体的流派组合 (如: `Epic Wuxia` + `Dark Trap`)
*   **Description**: 简短的创作背景描述。

### 2. 封面视觉方案 (Cover Art Prompt)
提供 1:1 的封面提示词。
*   **Prompt**: 英文提示词 (适用于 MJ/Flux)。
*   **Concept**: 中文画面描述。

### 3. AI 音乐生成提示词 (Audio Tags)
直接用于 Suno/Udio 的 Prompt 框。
*   **Style Tags**: 逗号分隔的风格标签 (流派, 乐器, 情绪, 速度, 制作质量)。
    *   *Example*: `Epic Wuxia, Guqin, Female Vocals, Sad, 60 BPM, High Fidelity`

### 4. 结构化词曲方案 (Lyrics & Structure)
使用表格形式展示，明确标记 `[Tag]`。

| 结构 (Tag) | 内容 / 歌词 (Lyrics) | 备注 (Prompt Cues) |
| :--- | :--- | :--- |
| **[Intro]** | `(SFX: ...)` | 乐器/音效指令 |
| **[Verse 1]** | ... | ... |
| **[Chorus]** | ... | ... |
| ... | ... | ... |
| **[Outro]** | ... | ... |

---
*Last Updated: 2026-02-10 (Standardized with 8-part Structure)*