# 🚀 CortexOS 上手指南（小白版）

这份指南给第一次接触 CortexOS 的同学使用，目标是 10 分钟内完成三件事：

1. 本地跑起来。  
2. 接进 AI 客户端。  
3. 学会扩展自己的外部大脑（知识、规则、技能、MCP）。  

---

## 0. 你会得到什么

- 一个可被 AI 调用的本地外部大脑（不是云端黑盒）。
- 一套可沉淀的记忆系统（文档长期可追溯）。
- 多 AI 协作不撞车的调度机制（fleet）。

---

## 1. 前置准备（5 项）

请先确认本机具备以下环境：

- Node.js 20+（推荐 22）
- pnpm 9+
- Python 3.11+（推荐 3.12）
- uv（Python 包管理）
- Git

快速检查：

```bash
node -v
pnpm -v
python3 --version
uv --version
git --version
```

---

## 2. 第一次安装（复制即用）

```bash
git clone git@github.com:webkubor/CortexOS.git
cd CortexOS
pnpm install
uv sync
```

成功判定：

- 命令无报错。
- 项目目录下出现 `.venv`（Python 虚拟环境）。

---

## 3. 挂载到 AI 客户端（MCP）

### 3.1 CortexOS MCP（必配）

将以下配置加入你的客户端 MCP 配置文件：

```json
{
  "mcpServers": {
    "cortexos-brain": {
      "command": "uv",
      "args": ["run", "/你的路径/CortexOS/mcp_server/server.py"]
    }
  }
}
```

### 3.2 Obsidian MCP（推荐，连接 memory 仓库）

如果你把外部记忆放在 `~/Documents/memory`，配置示例：

```toml
[mcp_servers.obsidian]
command = "npx"
args = ["-y", "@mauricio.wolff/mcp-obsidian@latest", "~/Documents/memory"]
```

成功判定：

- 在 AI 客户端能看到 `cortexos-brain` 可用。
- 调用 `read_router` 能返回路由内容。

---

## 4. 日常只用这 6 条命令

先记住高频命令，其他命令先不用学：

| 命令 | 什么时候用 |
| :--- | :--- |
| `pnpm run dev` | 本地看文档站 |
| `pnpm run health:core` | 快速体检核心结构 |
| `pnpm run fleet:status` | 看 AI 队列和冲突风险 |
| `pnpm run fleet:claim -- --workspace "$PWD" --task "任务名" --agent "Codex" --alias "Codex"` | 开工前打卡 |
| `pnpm run fleet:sync-dashboard` | 同步舰队看板 |
| `pnpm run secrets:init -- --target ~/Documents/memory/secrets/_templates` | 生成秘钥模板 |

---

## 5. 目录怎么理解（用户视角）

- `docs/router.md`：总入口，AI 每次启动先看这里。
- `docs/rules/`：规则库（工程规范、协作协议、隐私协议）。
- `docs/memory/logs/`：操作日志（过程记录）。
- `../memory/knowledge/`：长期知识库（复盘、方案、经验）。
- `~/Documents/memory/secrets/`：高敏凭证区（不进 Git）。

---

## 6. 如何扩展这个大脑（实操）

### 6.1 扩展知识库（最常用）

适合：新增经验、技术结论、复盘。

1. 把 Markdown 放到 `~/Documents/memory/knowledge/...`。  
2. 执行入库：`uv run ./scripts/ingest/chroma_ingest.py`。  
3. 用 `uv run ./scripts/ingest/query_brain.py "你的问题"` 验证是否可召回。  

建议：

- 一篇文档只讲一个主题。
- 标题明确写场景，便于检索。

### 6.2 扩展规则库

适合：团队新增约束、流程、标准。

1. 在 `docs/rules/` 新建规则文档。  
2. 在 `docs/router.md` 增加路由入口或触发描述。  
3. 通过 `load_rule` 做按需加载验证。  

### 6.3 扩展技能（Skill）

适合：沉淀可复用工作流（例如发版、运维、内容生成）。

1. 在本地 `skills` 目录创建技能文档（`SKILL.md`）。  
2. 在对应 Agent 技能索引里登记。  
3. 给出触发语句和输入输出格式。  

### 6.4 扩展 MCP 能力

适合：连接外部系统（Obsidian、Figma、数据库等）。

1. 在客户端 MCP 配置新增 server。  
2. 先做最小可用调用（例如 list/read）。  
3. 通过规则文档定义“何时触发、谁能用、写入边界”。  

---

## 7. 秘钥与隐私（必须看）

- 凭证默认路径：`~/Documents/memory/secrets`。
- 不要把密钥写进仓库或 `docs/`。
- 先生成模板再填值：

```bash
pnpm run secrets:init -- --target ~/Documents/memory/secrets/_templates
```

规范文档：`docs/rules/privacy_secret_protection_protocol.md`

---

## 8. 常见报错速查

### `uv: command not found`

先安装 uv，再执行 `uv sync`。

### `ValueError: ollama package is not installed`

执行：

```bash
uv pip install ollama
```

### `fleet:claim` 冲突警告

表示同路径已有 Agent 在跑，不是致命错误。先 `pnpm run fleet:status` 看清当前占用，再决定并行还是切路径。

---

## 9. 下一步建议

完成上面后，建议你做一次最小闭环：

1. 新建一篇知识文档到 `~/Documents/memory/knowledge`。  
2. 重新入库并查询验证。  
3. 新增一条你自己的规则到 `docs/rules/`。  
4. 让 AI 按新规则执行一次真实任务。  
