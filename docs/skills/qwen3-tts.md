---
name: tts-voice
description: 本地文字转语音/生成声音技能。用户说“生成语音/生成声音/tts/把这段话读出来/用我的声音读/导出 wav”时使用。默认中文与第一人称风格，输出 WAV 到 /Users/webkubor/Documents/voice。
license: Apache 2.0
---

# 生成语音 / 生成声音 / TTS

## 技能定位
基于本机项目 `/Users/webkubor/Desktop/Qwen3-TTS` 生成语音，默认输出 WAV，保存到 `/Users/webkubor/Documents/voice`。

## 触发条件
- “生成语音 / 生成声音 / tts / 把这段话读出来”
- “用我的声音 / 声音克隆 / 说话人是我”
- “导出 wav”

## 默认行为
- 输出格式：`wav`
- 输出目录：`/Users/webkubor/Documents/voice`（不存在则创建）
- 默认语言：中文（`language="Chinese"`，不确定时可用 `Auto`）
- 第一人称：若文案不是第一人称，先确认是否需要改写为第一人称再生成
- 说话人=我：优先使用 **Voice Clone**（需要参考音频）

## 必要输入
- 文案 `text`
- 参考音频 `ref_audio`（本地路径或 URL）
- 参考文本 `ref_text`（若无文本，可用 `x_vector_only_mode=True`，但效果可能下降）
- 可选：情感/语气 `instruct`

## 标准工作流

### 阶段 A：环境检查
1. 确认仓库存在：`/Users/webkubor/Desktop/Qwen3-TTS`
2. 进入仓库并安装：
   - `pip install -e .`
3. 检查运行设备：
   - 默认使用 GPU（`device_map="cuda:0"`）。若无 CUDA，停止并询问是否改用 API 或更轻量方案。

### 阶段 B：生成语音（Voice Clone）
优先使用 `Qwen/Qwen3-TTS-12Hz-1.7B-Base`，若资源不足可改 `0.6B-Base`。

```python
import os, time
import soundfile as sf
from qwen_tts import Qwen3TTSModel

out_dir = "/Users/webkubor/Documents/voice"
os.makedirs(out_dir, exist_ok=True)

model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
    device_map="cuda:0",
    dtype="bfloat16",
    attn_implementation="flash_attention_2",
)

wavs, sr = model.generate_voice_clone(
    text=TEXT,
    language="Chinese",
    ref_audio=REF_AUDIO,
    ref_text=REF_TEXT,
)
name = time.strftime("%Y%m%d_%H%M%S") + "_tts.wav"
sf.write(os.path.join(out_dir, name), wavs[0], sr)
```

### 阶段 C：复用同一说话人（批量多句）
若要批量生成同一说话人的多句文案，先创建 `voice_clone_prompt`：

```python
prompt = model.create_voice_clone_prompt(ref_audio=REF_AUDIO, ref_text=REF_TEXT)
wavs, sr = model.generate_voice_clone(
    text=[...],
    language=["Chinese", ...],
    voice_clone_prompt=prompt,
)
```

## 验收清单
- [ ] 生成的 `.wav` 在 `/Users/webkubor/Documents/voice`
- [ ] 文案符合第一人称
- [ ] 语种为中文（或用户确认的其他语言）

## 备注
- 参考音频建议 3–10 秒，干净无噪。
- 若用户不提供参考音频，不要假设“我的声音”已存在，必须询问。
