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
  echo "# RAG Probe"
  echo "- 时间: $(date '+%F %T')"
  echo "- 查询: $query"
  echo "- 根目录: $root"
} > "$log_file"

# Milvus (语义检索)
start_ts=$(date +%s)
milvus_out="$(cd ~/Desktop/AI-tools/milvus-tools && node scripts/search/milvus-search.mjs "$query" 2>&1 || true)"
end_ts=$(date +%s)
milvus_secs=$((end_ts - start_ts))

{
  echo
  echo "## Milvus"
  echo "- 耗时(秒): $milvus_secs"
  echo "- 输出:"
  echo '```text'
  echo "$milvus_out"
  echo '```'
} >> "$log_file"

# rg (关键词精确检索)
start_ts=$(date +%s)
rg_out="$(rg -n -F --no-heading --color=never --no-ignore "$query" "$root" 2>&1 || true)"
end_ts=$(date +%s)
rg_secs=$((end_ts - start_ts))
rg_count=$(printf '%s\n' "$rg_out" | sed '/^$/d' | wc -l | tr -d ' ')

{
  echo
  echo "## rg"
  echo "- 耗时(秒): $rg_secs"
  echo "- 命中行数: $rg_count"
  echo "- 输出:"
  echo '```text'
  echo "$rg_out"
  echo '```'
} >> "$log_file"

{
  echo
  echo "## 结论提示"
  echo "- 若 Milvus 输出为空或相关性低，但 rg 命中清晰：本地搜索足够。"
  echo "- 若 rg 无命中，但 Milvus 命中且相关：RAG 在起作用。"
  echo "- 若两者都有：先用 Milvus 找方向，再用 rg 精确定位。"
} >> "$log_file"

printf '完成: %s\n' "$log_file"
