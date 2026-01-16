# Milvus 入库 Skill：切片 → 向量化 → 写入（面向 AI_Common）

> 目标：你只维护 `AI_Common` 文档；当你说“入库/向量化/切片/更新索引”时，AI 按固定流程把内容写入 Milvus（collection：`ai_common_chunks`）。

## 0. 核心原则（先对齐）

- `AI_Common` 是根（Source of Truth）；Milvus 是语义检索层（Retrieval）。
- 默认只入库 `AI_Common` 目录下允许的文档；严格遵循 `privacy_excludes.md`。
- 入库前优先保证“可控、可复现”：先全量重建（MVP），再做增量。

## 1) 触发条件（用户说什么就启动）

- 关键词："入库" / "向量化" / "切片" / "ingest" / "重建索引" / "更新 Milvus" / "同步到 Milvus" / "写入 Milvus"
- 典型指令：
  - “把 AI_Common 切片入库到 Milvus”
  - “更新 Milvus 索引（全量重建）”
  - “只入库 index.md 和 project_index.md”

## 2) 前置检查（必须）

### 2.1 服务与端口
- Milvus gRPC：`127.0.0.1:19530`
- UI（可选）：Attu `http://127.0.0.1:8000`

### 2.2 Collection 约定
- 默认 collection：`ai_common_chunks`
- 关键字段（约定，不在此文件展开）：`chunk_id`, `vector`, `content`, `path`, `title`, `section`, `doc_type`, `updated_at`

### 2.3 embedding 选择（入库前必须明确）
- 你必须指定一种 embedding 来源：
  - 本地 Ollama（免费策略） / Gemini / OpenAI
- 你必须明确向量维度 `EMBEDDING_DIM`（必须与 Milvus collection 一致）。

当前已落地的免费方案：
- `EMBED_PROVIDER=ollama`
- `OLLAMA_MODEL=nomic-embed-text`
- 维度：`768`

## 3) 入库内容范围（默认 + 可选）

### 默认入库范围（推荐）
- `~/Documents/AI_Common/*.md`
- `~/Documents/AI_Common/extensions/**/*.md`

### 默认排除
- `.DS_Store`
- `privacy_excludes.md` 中标注的任何高风险目录/文件（例如 `~/.gemini/`、token/secret 等）

### 自定义范围（用户可指定）
- 例如只入库：`index.md` + `project_index.md`

## 4) 切片策略（Chunking：Markdown 标题驱动）

- 基于 `#` / `##` / `###` 切分为语义块
- 建议长度：`minChars=200`，`maxChars=1200`
- `chunk_id`（稳定、可迁移）：
  - `sha1(path + "::" + heading_path + "::" + chunk_index)`

> 目的：保证以后增量更新与双库（MongoDB）都能平滑升级。

## 5) 写入策略（两种模式）

### 模式 A：全量重建（MVP 推荐）
- drop collection → recreate → 重新入库全部 chunks
- 优点：最稳、实现最快
- 缺点：数据量大时慢

### 模式 B：增量更新（后续再做）
- 维护本地状态：`path -> mtime -> chunk_id[]`
- 文件变更时：删除旧 chunk_id 再插入新 chunk

## 6) 检索注入逻辑（RAG：每次会注入哪些信息）

> 这里的“注入”指：回答用户问题前，从 Milvus 检索出 TopK chunks，把它们作为上下文附加到提示词中。

### 6.1 默认注入的字段（建议）

每条命中 chunk 注入：
- `content`：段落内容（用于给模型提供事实依据）
- `path`：来源文件路径（用于定位与可追溯）
- `title/section`：标题层级（用于快速理解上下文位置）
- `doc_type`：文档类型（用于结果聚类/过滤）
- `score`：相似度（用于调参/诊断，不一定展示给用户）
- `updated_at`：更新时间（可用于避免引用过时规则）

### 6.2 注入条数与长度控制（避免上下文爆炸）

- 默认 `topK = 8~15`
- 单条 `content` 建议截断到 `800~1500` 字符
- 总注入文本建议控制在“能明显提升回答质量但不挤爆窗口”的量级

### 6.3 会不会重复注入？（去重原则）

- 同一次检索：按 `chunk_id` 去重（相同 chunk 不重复注入）
- 同一次回答：如果你同时手动加载了原文（例如直接读了 `index.md`），则优先避免把同一段落再注入一遍

> 结论：只要 `chunk_id` 稳定且检索结果去重，重复注入是可控的。

### 6.4 输出标记（让你确认“这次确实用了 Milvus 检索”）

- 当回答前实际执行了 Milvus 检索并注入 chunks 时，必须在最终回答第一行输出：
  - `[RAG:Milvus] query="..." topK=... collection=ai_common_chunks embed=ollama:nomic-embed-text dim=768`
- 详细约定见：`extensions/milvus_rag_marker.md`

## 7) 更新策略（你更新文档后怎么更新 Milvus）

### 7.1 MVP：全量重建（推荐你先用这个）

- 你更新 `AI_Common` 文档后，直接再跑一次“全量入库”
- 机制：drop collection → recreate → ingest all
- 优点：不会产生重复、不会残留旧 chunk

现阶段（本地 Ollama 免费方案）建议这样跑：

1) 全量重建（注意维度 768）：
- `cd ~/Documents/milvus-tools && EMBEDDING_DIM=768 pnpm run milvus:rebuild`

2) 全量入库（切片→向量化→写入）：
- `cd ~/Documents/milvus-tools && EMBED_PROVIDER=ollama OLLAMA_MODEL=nomic-embed-text EMBEDDING_DIM=768 pnpm run milvus:ingest`

3) 检索验证：
- `cd ~/Documents/milvus-tools && EMBED_PROVIDER=ollama OLLAMA_MODEL=nomic-embed-text EMBEDDING_DIM=768 pnpm run milvus:search -- "你的问题"`

### 7.2 进阶：增量更新（后续再做）

- 维护状态：`path -> mtime -> chunk_id[]`
- 文件变更时：按 `path` 或 `chunk_id` 删除旧数据，再写入新 chunks
- 注意：Milvus 不像 MongoDB 有真正的 upsert；增量通常是“删旧再插入”

## 8) 验收标准（入库后必须验证）

- Milvus 中 collection 存在且已 load
- chunk 数量符合预期（至少能看到你入库的文件对应 chunks）
- 随机抽 1~2 条 query 在 Attu 或脚本里能搜到合理结果

## 9) 建议的执行口令（以后你就这么说）

- “入库 AI_Common 到 Milvus（全量重建），embedding 维度 1536”
- “只入库 index.md + project_index.md（验证检索效果）”
- “增量更新：只更新过去 24h 改动的文件（如果已支持）”
