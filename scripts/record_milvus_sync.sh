#!/usr/bin/env bash
set -euo pipefail

log_dir="${RAG_LOG_DIR:-/Users/webkubor/Documents/milvus}"
log_file="$log_dir/last_sync.md"
now="$(date '+%F %T')"

mkdir -p "$log_dir"

cat <<MD > "$log_file"
# Milvus 同步记录

- **上次同步时间**: $now
- **操作说明**: 通过 record_milvus_sync.sh 更新
- **检查时间**: $now
MD

echo "已记录: $log_file"
