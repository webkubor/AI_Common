#!/bin/bash

# Vibe Coding Initialization Script
# 用途：在当前项目快速挂载 AI 统一规范
# 使用方法：在项目根目录运行 `~/Documents/AI_Common/init_vibe.sh`

COMMON_DIR="$HOME/Documents/AI_Common"
TARGET_RULES="$COMMON_DIR/coding_rules.md"
TARGET_STACK="$COMMON_DIR/tech_stack.md"

echo "🔮 Initializing Vibe Coding Context..."

# 1. 针对 Cursor: 创建 .cursorrules 软链接
# Cursor 会自动读取 .cursorrules 文件作为系统 Prompt
if [ -f ".cursorrules" ]; then
    echo "⚠️  .cursorrules already exists. Skipping."
else
    ln -s "$TARGET_RULES" .cursorrules
    echo "✅ Linked .cursorrules -> coding_rules.md"
fi

# 2. 针对 Copilot / 通用: 挂载 Tech Stack
# 将 tech_stack 挂载为隐藏文件，避免干扰项目结构，但 AI 能读取到
if [ -f ".ai_context.md" ]; then
    echo "⚠️  .ai_context.md already exists. Skipping."
else
    ln -s "$TARGET_STACK" .ai_context.md
    echo "✅ Linked .ai_context.md -> tech_stack.md"
fi

echo "🚀 Vibe Coding environment ready! AI now knows your standards."
