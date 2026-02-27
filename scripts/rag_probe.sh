#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo '用法: rag_probe.sh "查询" [根目录]'
  exit 1
fi

query="$1"
root="${2:-/Users/webkubor/Documents/AI_Common}"
log_dir="${RAG_LOG_DIR:-/Users/webkubor/Documents/AI_Plan/rag_logs}"

ts_file_stamp="$(date '+%Y-%m-%d_%H-%M-%S')"
log_file="$log_dir/${ts_file_stamp}_rag_probe.md"

mkdir -p "$log_dir"

{
  echo "# RAG Probe (V2.0 - ChromaDB Edition)"
  echo "- 时间: $(date '+%F %T')"
  echo "- 查询: $query"
  echo "- 根目录: $root"
} > "$log_file"

# ChromaDB (语义检索 - 通过 query_brain.py)
echo "正在检索 ChromaDB..."
start_ts=$(date +%s)
chroma_out="$(python3 "$root/scripts/ingest/query_brain.py" "$query" 2>&1 || true)"
end_ts=$(date +%s)
chroma_secs=$((end_ts - start_ts))

{
  echo
  echo "## ChromaDB (Ollama Embeddings)"
  echo "- 耗时(秒): $chroma_secs"
  echo "- 输出:"
  echo '```text'
  if [ -z "$chroma_out" ]; then
    echo "(无结果或检索失败)"
  else
    echo "$chroma_out"
  fi
  echo '```'
} >> "$log_file"

# rg (关键词精确检索)
echo "正在检索关键词 (rg)..."
start_ts=$(date +%s)
rg_out="$(rg -n -F --no-heading --color=never --no-ignore "$query" "$root" 2>&1 || true)"
end_ts=$(date +%s)
rg_secs=$((end_ts - start_ts))
rg_count=$(printf '%s\n' "$rg_out" | sed '/^$/d' | wc -l | tr -d ' ')

{
  echo
  echo "## rg (Keyword Match)"
  echo "- 耗时(秒): $rg_secs"
  echo "- 命中行数: $rg_count"
  echo "- 输出:"
  echo '```text'
  if [ -z "$rg_out" ]; then
    echo "(无匹配)"
  else
    echo "$rg_out" | head -n 20 # 限制输出避免溢出
    [ "$rg_count" -gt 20 ] && echo "... (更多结果已省略)"
  fi
  echo '```'
} >> "$log_file"

{
  echo
  echo "## 结论提示"
  echo "- 若 ChromaDB 输出为空或相关性低，但 rg 命中清晰：本地搜索足够。"
  echo "- 若 rg 无命中，但 ChromaDB 命中且相关：RAG 在起作用。"
  echo "- 若两者都有：先用 ChromaDB 找方向，再用 rg 精确定位。"
} >> "$log_file"

printf '✅ 检索完成: %s\n' "$log_file"
