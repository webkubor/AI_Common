#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/Users/webkubor/Documents/AI_Common"
TASK="${FLEET_TASK:-待分配任务}"

if [[ "${1:-}" == "--task" && -n "${2:-}" ]]; then
  TASK="$2"
  shift 2
fi

if ! command -v codex >/dev/null 2>&1; then
  echo "未找到 codex 命令，请先安装并确保在 PATH 中。"
  exit 1
fi

node "$ROOT_DIR/scripts/actions/fleet-claim.mjs" \
  --workspace "$PWD" \
  --task "$TASK" \
  --agent "Codex" \
  --alias "Codex"

exec codex "$@"
