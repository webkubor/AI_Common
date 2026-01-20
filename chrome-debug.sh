#!/bin/bash

# Chrome Debug Mode Launcher
# 统一启动脚本：供 Gemini/Claude/Codex 调用
# 作用：启动 Chrome 并开启远程调试端口 9222，以便 MCP 连接

PORT=9222
USER_DATA_DIR="$HOME/ChromeDevSession"

echo "🚀 Starting Google Chrome in Remote Debugging Mode (Port: $PORT)..."
echo "📂 User Data Dir: $USER_DATA_DIR"

# macOS 标准路径
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=$PORT \
  --user-data-dir="$USER_DATA_DIR" \
  --no-first-run \
  --no-default-browser-check \
  "$@" &

echo "✅ Chrome launched. AI Agents can now connect via chrome-devtools-mcp."
