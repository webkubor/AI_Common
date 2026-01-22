#!/usr/bin/env bash
set -euo pipefail

cd ~/Desktop/AI-tools/milvus-tools
node scripts/ingest/milvus-ingest-ai-common.mjs

~/Documents/AI_Common/scripts/record_milvus_sync.sh
