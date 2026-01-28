---
name: snippet-master
description: Manage scattered non-systematic knowledge fragments like config scripts, command memos, temporary inspiration. Use when user requests to save a snippet, remember a command, or organize loose knowledge.
license: Apache 2.0
---

# Snippet Master (碎片知识管家)

用于管理零散的、非系统性的知识片段（如配置脚本、命令备忘、临时灵感）。

## 🎯 技能定位

存储目录：`docs/snippets/`

## 🔒 隐私声明

本目录默认私有，**严禁上传**到公开仓库。默认加入 `.gitignore`。

## 🛠️ 功能清单

### 1. 📝 记录碎片 (Save)
**触发**：用户说"记一下这个命令"、"保存这段配置"。

**动作**：
- 创建或追加文件
- **命名规范**：使用下划线命名法，如 `nginx_config.md`, `python_venv.md`
- **内容格式**：
  ```markdown
  ## [YYYY-MM-DD] 标题
  ```code
  ...
  ```

**备注**...

### 2. 🔍 查阅碎片 (Read)
**触发**：用户说"查一下那个 nginx 配置"、"怎么清 docker 缓存来着"。

**动作**：
1. 先 `ls snippets/` 查看文件名
2. 再 `read_file snippets/xxx.md` 读取具体内容

### 3. 🧹 整理 (Organize)
**触发**：用户说"整理一下碎片"。

**动作**：
- 建议用户将过于庞大的碎片文件合并到 `index.md` 体系或入库 Milvus
