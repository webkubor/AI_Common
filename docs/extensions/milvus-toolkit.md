# Milvus Toolkit (本地向量库全能助手)

## 🎯 技能定位
统一管理本地 Milvus 向量库的所有操作：检索 (RAG)、入库 (Ingest)、维护 (Rebuild) 与可视化 (UI)。
底层依赖 `~/Desktop/AI-tools/milvus-tools` 下的专用脚本。

## 🔒 隐私声明
本文件涉及本地绝对路径，**严禁上传**到公开仓库。默认加入 `.gitignore`。

## 🛠️ 功能清单

### 1. 🔍 私有检索 (Private Search)
> 当用户询问历史 Bug、私有代码或需要 RAG 支持时触发。

- **动作**: `cd ~/Desktop/AI-tools/milvus-tools && node scripts/search/milvus-search.mjs "{query}"`
- **引用标记**: `[🧠 Local RAG]`
- **可见性对比工具**: `~/Documents/AI_Common/scripts/rag_probe.sh "{query}" [root]`
  - 作用：同时跑 Milvus 与 rg，并生成日志用于对比命中与耗时。

### 2. 📥 知识入库 (Ingest)
> 当用户要求“把这个文档存进去”、“记住这段代码”或“同步 AI_Common”时触发。

- **全量同步 AI_Common**: 
  `cd ~/Desktop/AI-tools/milvus-tools && node scripts/ingest/milvus-ingest-ai-common.mjs`
- **单文件入库**:
  （需确认工具是否支持单文件参数，目前默认全量同步）
- **同步后记录时间**:
  `~/Documents/AI_Common/scripts/record_milvus_sync.sh`
- **一键入库 + 记录时间**:
  `~/Documents/AI_Common/scripts/milvus_ingest_and_record.sh`

### 3. 🖥️ 可视化管理 (UI)
> 当用户说“打开 Milvus”、“看数据库”时触发。

- **动作**: 提示用户访问 `http://127.0.0.1:8000` (Attu)。
- **操作指南**: 详见 `~/Desktop/AI-tools/milvus-tools/UI_GUIDE.md`。

### 4. 🧨 库重建 (Rebuild)
> ⚠️ 危险操作：当向量库脏数据太多或 Schema 变更时使用。

- **动作**: `cd ~/Desktop/AI-tools/milvus-tools && node milvus-rebuild.mjs`
- **确认**: 执行前必须请求用户二次确认。

## ⚙️ 环境依赖
- Docker 容器 (Milvus Standalone) 必须在运行中。
- Node.js 环境 (推荐 v18+)。
