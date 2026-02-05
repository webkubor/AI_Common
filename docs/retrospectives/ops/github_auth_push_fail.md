# GitHub 认证与自动推送复盘 (GitHub Auth & Auto-Push)

> **Date**: 2026-02-05
> **Incident**: 推送 gemini-xhs-vision 插件时，因 Token 路径错误和格式解析问题导致流程中断，需手动干预。
> **Outcome**: 优化了 Token 检索逻辑，确立了“精准提取”法则。

## 1. 问题根因 (Root Cause Analysis)

### ❌ 路径硬编码失效 (Brittle Paths)
- **现象**: 脚本尝试读取 `docs/snippets/github_token.md`，但实际 Token 位于 `docs/secrets/github_token.md`。
- **原因**: 记忆中的路径与实际文件系统结构不一致，Agent 盲目依赖过时记忆，未先执行 `ls` 验证。

### ❌ 凭证格式污染 (Credential Contamination)
- **现象**: `cat` 读取的文件包含 Markdown 标题和说明文本（`## [2026-01-16] ...`），直接将全文作为 Token 传入 `git remote add`。
- **后果**: Git 报错 `URL path contains newline`，认证失败。
- **教训**: `secrets` 目录下的文件通常是给人看的文档（含 Metadata），而非纯文本 Token。

## 2. 解决方案 (Correction)

### ✅ 先验路径检查 (Path Verification)
在读取敏感文件前，必须先确认文件位置：
```bash
find docs/secrets -name "*token*" # 模糊搜索优于精确路径
```

### ✅ 智能 Token 提取 (Smart Extraction)
严禁直接使用 `cat` 的全部输出。必须使用 `grep` 或 `awk` 提取符合 Token 特征的字符串：
```bash
# 针对 GitHub PAT 的通用提取模式
TOKEN=$(cat file.md | grep -o 'github_pat_[a-zA-Z0-9_]*')
```

## 3. 标准化操作规范 (SOP Update)

**Rule: GitHub Automated Push Protocol**

1.  **Locate**: 使用 `find` 或 `ls` 确认 Token 文件路径，优先查找 `docs/secrets/`。
2.  **Extract**: 读取内容后，**必须**使用正则清洗数据，仅提取 `ghp_` 或 `github_pat_` 开头的字符串。
3.  **Validate**: 在执行写操作前，先 `echo "Token length: ${#TOKEN}"` 验证提取是否成功（不打印 Token 本身）。
4.  **Execute**: 使用提取后的纯净 Token 构建 Git URL。

---
*Applied to: `docs/skills/gitlab-manager.md` & `docs/agents/gemini/manifest.md`*
