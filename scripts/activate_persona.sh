#!/bin/bash

# activate_persona.sh
# 作用: 启动 Gemini 的人格化 Web 界面

WEB_DIR="scripts/persona-web"
PORT=8899

# 检查是否有 python3 (macOS 默认有) 用于启动简单服务器
if command -v python3 &> /dev/null; then
    echo "Gemini Persona Activating..."
    echo "Opening interface at http://localhost:$PORT"
    
    # 在后台启动服务器 (不占用当前终端)
    (cd "$WEB_DIR" && python3 -m http.server $PORT &> /dev/null) &
    SERVER_PID=$!
    
    # 等待一秒确保启动
    sleep 1
    
    # 打开浏览器
    open "http://localhost:$PORT"
    
    echo "Persona Loaded. (PID: $SERVER_PID)"
    echo "Type 'kill $SERVER_PID' to stop the background server manually if needed."
    
else
    echo "Error: Python3 not found. Cannot start local server."
    open "$WEB_DIR/index.html" # Fallback: 直接打开文件
fi
