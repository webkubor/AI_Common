---
name: tts-voice
description: 本地文字转语音/生成声音技能。基于 Qwen3-TTS (CustomVoice-0.6B)。
license: Apache 2.0
---

# 生成语音 / 生成声音 / TTS

## 技能定位
基于本机项目 `/Users/webkubor/Desktop/Qwen3-TTS` 生成语音。
**核心原则**：优先使用项目自带的 `scripts/run_tts.py` 和 `configs/config.json`，不要手写 Python 脚本，除非为了极其复杂的定制逻辑。

## 触发条件
- “生成语音 / 生成声音 / tts / 把这段话读出来”
- “用我的声音 / 声音克隆 / 说话人是我”
- “导出 wav”

## 最佳实践流程 (Standard Workflow)

### 1. 修改配置
直接修改配置文件 `/Users/webkubor/Desktop/Qwen3-TTS/configs/config.json`。

**关键字段**：
- `defaults.text`: 要朗读的文案。
- `defaults.speaker`: 说话人（见下表）。
- `paths.output_directory`: 输出目录 (例如 `/Users/webkubor/Documents/voice`)。
- `paths.models_directory`: **必须**指向具体的 Snapshot 路径 (例如 `/Users/webkubor/Desktop/Qwen3-TTS/models/CustomVoice-0.6B/snapshots/85e237c12c027371202489a0ec509ded67b5e4b5`)。

### 2. 执行生成
运行项目自带脚本：
```bash
export PYTHONPATH=$PYTHONPATH:/Users/webkubor/Desktop/Qwen3-TTS
/Users/webkubor/Desktop/Qwen3-TTS/venv/bin/python /Users/webkubor/Desktop/Qwen3-TTS/scripts/run_tts.py
```

## 可用音色 (Speakers)
*   **Serena**: 温柔女声 (中文/英文) - *推荐*
*   **Vivian**: 明亮女声 (中文/英文)
*   **Uncle_Fu**: 磁性男声 (中文)
*   **Dylan**: 北京腔男声 (中文)
*   **Eric**: 四川话男声 (中文)
*   **Ryan/Aiden**: 英文男声
*   **Ono_Anna**: 日文女声
*   **Sohee**: 韩文女声

## 常见问题
- **RoPE Error**: 如果遇到 `KeyError: 'default'`，是因为 transformers 版本不兼容。项目源码已由 Agent 修复，使用了 `default_rope_init_fn`。
- **Tokenizer Error**: 必须设置 `fix_mistral_regex=True` (源码已修复) 或忽略该警告。
- **Import Error**: 确保 `PYTHONPATH` 包含项目根目录。

## 历史教训 (Retro)
- 不要一上来就 `import qwen_tts` 自己写脚本。
- 先看 `scripts/` 目录下有没有现成的 `run_xxx.py`。
- 依赖 `config.json` 管理参数比硬编码在脚本里更安全、更易维护。