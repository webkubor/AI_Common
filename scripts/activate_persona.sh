#!/bin/bash

# activate_persona.sh
# 作用: 启动 Gemini 的人格化 Web 界面 (Live Mode)

WEB_DIR="scripts/persona-web"
PORT=8899

# 清理旧进程
lsof -ti:$PORT | xargs kill -9 2>/dev/null

echo "Gemini Persona Activating (Hot Reload Mode)..."

# 检查 npx 是否可用
if command -v npx &> /dev/null; then
    echo "Starting live-server on port $PORT..."
    
    # 使用 npx 启动 live-server
    # --no-browser: 我们手动打开，避免 npx 还没准备好就打开了
    # --quiet: 减少输出
    (npx -y live-server "$WEB_DIR" --port=$PORT --no-browser &> /dev/null) &
    SERVER_PID=$!
    
    echo "Waiting for server..."
    sleep 3
    
    echo "Opening interface..."
    open "http://127.0.0.1:$PORT"
    
    echo "Persona Loaded with Hot Reload. (PID: $SERVER_PID)"
    echo "Edit files in '$WEB_DIR' and the browser will auto-update."
    
else
    echo "Error: npx not found. Falling back to Python..."
    (cd "$WEB_DIR" && python3 -m http.server $PORT &> /dev/null) &
    sleep 1
    open "http://localhost:$PORT"
fi