#!/usr/bin/env bash
set -euo pipefail

# --- 核心颜色定义 ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

printf "${BLUE}🚀 正在启动 AI_Common 大脑初始化程序...${NC}
"

# 1. 检查必备工具
check_tool() {
  if ! command -v "$1" &> /dev/null; then
    printf "${RED}❌ 错误: 未发现 $1。请先安装它！${NC}
"
    exit 1
  fi
}

check_tool "pnpm"
check_tool "uv"
check_tool "ollama"

# 2. 初始化 Node.js 依赖
printf "${GREEN}📦 正在安装 Node.js 依赖 (pnpm)...${NC}
"
pnpm install

# 3. 初始化 Python 虚拟环境与依赖
printf "${GREEN}🐍 正在配置 Python 环境 (uv)...${NC}
"
uv sync

# 4. 检查并拉取 Ollama 语义模型
printf "${GREEN}🧠 正在检查 Ollama 语义模型 (nomic-embed-text)...${NC}
"
ollama pull nomic-embed-text

# 5. 密钥模板引导
SECRETS_DIR="./docs/secrets"
LARK_ENV="$SECRETS_DIR/lark.env"
if [ ! -f "$LARK_ENV" ]; then
  printf "${YELLOW}⚠️ 未发现飞书推送配置。正在生成模版...${NC}
"
  mkdir -p "$SECRETS_DIR"
  echo "LARK_WEBHOOK_URL=https://open.larksuite.com/open-apis/bot/v2/hook/YOUR_TOKEN" > "$LARK_ENV.example"
  printf "   ✅ 已生成 $LARK_ENV.example，请填入 Token 并重命名为 lark.env
"
fi

# 6. 执行首次知识入库 (ChromaDB)
printf "${GREEN}📥 正在执行首次全量知识入库 (Ingest)...${NC}
"
uv run ./scripts/ingest/chroma_ingest.py

# 7. 完成
printf "
${GREEN}🎉 恭喜老爹 (或新朋友)！大脑初始化完成。${NC}
"
printf "----------------------------------------
"
printf "💡 ${BLUE}常用命令：${NC}
"
printf " - 启动文档服务: ${YELLOW}pnpm dev${NC}
"
printf " - 手动运行自动驾驶: ${YELLOW}node ./scripts/auto-pilot.js${NC}
"
printf " - 语义检索探测: ${YELLOW}./scripts/rag_probe.sh "你的查询"${NC}
"
printf "----------------------------------------
"
