# Milvus 检索注入标记（让你一眼知道“这次用了 Milvus”）

> 目的：当 Codex/Gemini 在回答前使用 Milvus 检索（RAG 注入）时，必须输出一个统一标记，让你确认“这次确实走了语义搜索”。

## 1) 统一标记格式（建议固定）

在最终回答的第一行添加：

```
[RAG:Milvus] query="..." topK=... collection=ai_common_chunks embed=ollama:nomic-embed-text dim=768
```

字段说明：
- `query`：本次检索的原始问题
- `topK`：检索返回条数
- `collection`：Milvus collection
- `embed`：embedding 提供方与模型
- `dim`：向量维度

## 2) 结果引用（最少 3 条）

在回答中（或回答末尾）列出最少 3 条来源，便于你核对：

- `AI_Common/<file>.md`（可附带 `section` 标题）

> 注意：不要把整段文档全文贴出来；只粘贴必要片段。

## 3) 去重与稳定性

- 同一次回答：按 `chunk_id` 去重
- 当你更新文档并全量重建后：同一个 query 命中可能会变化，这是正常的（因为向量与索引更新了）

## 4) 触发条件

当用户说以下任一意图时，优先走 Milvus 检索：
- "搜一下" / "语义搜索" / "在知识库里找" / "问一下 AI_Common" / "用向量库查" / "RAG"

如果用户明确要求“只用 AI_Common 原文（不走检索）”，则不要输出该标记。
