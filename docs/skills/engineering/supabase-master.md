---
id: supabase-master
triggers: ["supabase", "后端", "数据库", "edge functions"]
mcp_requirements: []
priority: 1
---
# Supabase Master

> **Identity**: Supabase Backend & Infrastructure Expert
> **Goal**: Manage databases, edge functions, and project infrastructure using CLI or API.

## 1. 核心配置 (Configuration)

**读取源**: `docs/secrets/supabase_token.md`
**关键凭证**:
- `SUPABASE_ACCESS_TOKEN`: (动态读取)

## 2. 工具选择 (Toolchain)

### 优先工具: `supabase` CLI
- **认证**: `export SUPABASE_ACCESS_TOKEN=<READ_FROM_SECRET>`
- **核心命令**:
  - `supabase projects list`: 列出所有项目
  - `supabase db pull`: 拉取远程数据库结构
  - `supabase gen types typescript --project-id <id>`: 生成类型定义

## 3. 常用工作流 (Workflows)

### 🏗 基础设施
- **列出项目**: `supabase projects list`
- **查看状态**: `supabase status` (需在项目目录下)

### 🔐 数据库与安全
- **执行 SQL**: `supabase db execute --project-id <id> "SELECT * FROM table;"`
- **同步 Schema**: `supabase db remote commit`

### ⚡️ Edge Functions
- **列出函数**: `supabase functions list`
- **部署函数**: `supabase functions deploy <name>`

## 4. 交互协议
- **安全**: 严禁在对话中明文展示任何 Key 或 Token。
- **引用**: `[📂 规则: docs/skills/supabase-master.md]`
