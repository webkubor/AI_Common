# Milvus 本机 UI（Attu）使用指南

> 目标：当你说“milvus / 打开 Milvus / 看向量数据库界面”时，AI 能直接把你带到可用的 UI 页面（而不是打开 health 页）。

## 1. 你要看的“Milvus 页面”是什么？

- Milvus（向量数据库）本体：默认只暴露 gRPC（`127.0.0.1:19530`）+ health（`127.0.0.1:9091/healthz`）
- 可视化 UI：使用 Attu（Milvus 的管理界面）

## 2. 本机入口

- Attu UI：`http://127.0.0.1:8000`

> 如果页面提示连接 Milvus，一般默认值是 `milvus-standalone:19530`（docker compose 内网），也可填 `127.0.0.1:19530`。

## 3. AI 自动化约定（给 Codex/Gemini 都能用）

### 3.1 触发词

- 用户只说：`milvus`
- 或包含："打开 Milvus" / "看 Milvus UI" / "向量数据库界面"

### 3.2 自动化动作（优先 Chrome DevTools MCP，保留标签页）

1. 在 Chrome 打开：`http://127.0.0.1:8000/#/connect`（或直接 `http://127.0.0.1:8000`）
2. 如停留在连接页，点击“连接”
3. 成功标志：页面出现数据库/collection 列表入口（例如显示 `default` 数据库与 collection 数量）

## 4. 常见问题

- Q：为什么不直接打开 health 页？
  - A：health 只用于运维诊断，你的目标是“看界面管理 collection/数据”，所以默认打开 Attu。

- Q：Attu 是开源的吗？
  - A：Attu 2.6.x 起官方声明不再开源；但本机开发使用通常没问题。如果你有严格的开源合规要求，需要另行选型（或使用旧版本/替代 UI）。
