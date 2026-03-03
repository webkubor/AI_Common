import json
import sys
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

# 配置
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHROMA_DATA_PATH = PROJECT_ROOT / "chroma_db"
COLLECTION_NAME = "cortexos_docs"
SCOPE_CONFIG_PATH = Path(__file__).resolve().parent / "retrieval_scope.json"


def load_scope_config():
    # 默认配置：当配置文件缺失时也可工作
    default_scope = {"top_k": 3}
    if not SCOPE_CONFIG_PATH.exists():
        return default_scope

    try:
        with open(SCOPE_CONFIG_PATH, "r", encoding="utf-8") as file:
            scope = json.load(file)
        if not isinstance(scope, dict):
            return default_scope
        top_k = scope.get("top_k")
        if isinstance(top_k, int) and top_k > 0:
            default_scope["top_k"] = top_k
    except Exception as error:
        print(f"⚠️ 检索配置读取失败，将使用默认值: {error}", file=sys.stderr)

    return default_scope


def query_brain(user_query, n_results=3):
    # 初始化
    ollama_ef = embedding_functions.OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="nomic-embed-text"
    )
    
    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    collection = client.get_collection(name=COLLECTION_NAME, embedding_function=ollama_ef)
    
    # 检索前 3 条最相关的背景
    results = collection.query(
        query_texts=[user_query],
        n_results=n_results
    )
    
    # 拼装返回
    context = ""
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    for index, doc in enumerate(documents):
        meta = metadatas[index] if index < len(metadatas) else {}
        source_path = meta.get("path", "unknown")
        context += f"---\n来源: {source_path}\n{doc}\n"
    
    return context

if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print('用法: python3 scripts/ingest/query_brain.py "查询词" [结果条数]', file=sys.stderr)
        sys.exit(1)

    scope = load_scope_config()
    top_k = scope["top_k"]
    if len(sys.argv) > 2:
        try:
            custom_top_k = int(sys.argv[2])
            if custom_top_k > 0:
                top_k = custom_top_k
        except ValueError:
            print("⚠️ 结果条数必须是正整数，已回退为默认值。", file=sys.stderr)

    print(query_brain(sys.argv[1], n_results=top_k))
