# Auto Retrospective Skill (自动复盘助手 - Lite版)

## 简介
专注于**快速、轻量**地沉淀 Bug 经验。
主打“记了就走”，不打断开发心流。

## 触发命令
- `/retro` (默认): 快速记录。
- `/retro --full`: 触发深度复盘与维护（包含归档与规则提炼）。

## 核心工作流 (Lite Mode)
当你收到 `/retro` 指令时，请执行以下 **极简逻辑**：

1.  **提取关键信息 (Extract)**:
    *   一句话概括：**遇到什么坑 (Context) -> 怎么填的 (Solution) -> 学到了什么 (Key Lesson)**。

2.  **读取文件 (Read)**:
    *   读取 `~/Documents/AI_Common/retrospective.md`。

3.  **快速检查 (Quick Check)**:
    *   如果文件 < 15,000 字符：**直接跳转到步骤 4**。
    *   *只有当文件 > 15,000 字符时*: 执行简单的**头部剪切**（Head Cut），将前 50% 内容剪切并追加到 `archives/history.md`，然后保留后 50%。(仅做搬运，不做深度提炼)。

4.  **追加记录 (Append)**:
    *   使用紧凑的 **Log 格式** 追加到文件末尾：
    
    ```markdown
    - **[YYYY-MM-DD] {Title}**: {症状与根因} -> {解决方案}。 💡 {一句话教训}
    ```
    *(注意：保持单行或紧凑的多行，不要使用繁琐的列表格式)*

5.  **反馈 (Ack)**:
    *   仅回复：`✅ 已记录: {Title}`

---

## 示例
**User**: /retro
**AI**:
1. 分析: 用户刚才遇到了 `npm install` 报错 `EACCES`，通过 `sudo` 解决。
2. 格式化: `**[2026-01-14] npm 权限错误**: 全局安装包报 EACCES 权限拒绝 -> 使用 sudo 或 chown 修复目录权限。 💡 尽量使用 nvm 管理 node 版本以避免权限问题。`
3. 写入 `retrospective.md`。
4. 回复: `✅ 已记录: npm 权限错误`
