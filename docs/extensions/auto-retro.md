# Auto Retrospective (智能复盘 + 自动 GC)

## 🎯 核心逻辑
当用户输入 `/retro` 或明确表示“记录这个 Bug/复盘”时，执行以下**写入与维护**流程。

## ⚙️ 1. 写入流程 (Write)
1.  **格式化内容**: 生成标准单行记录 `- [YYYY-MM-DD] **{标题}**: {一句话描述问题与解法}`。
2.  **追加写入**: 将内容追加到 `~/Documents/AI_Common/retrospective.md`。
3.  **用户反馈**: 回复 `✅ 已记录`。

## ♻️ 2. 垃圾回收流程 (Garbage Collection)
> **目的**: 防止热数据文件无限膨胀，保持 Context 轻量。

在每次写入完成后，**必须**检查 `retrospective.md` 的行数：

- **触发阈值**: 行数 > **50 行**。
- **执行动作**:
    1.  **切分**:
        -   **冷数据**: 提取 **最旧的** (总行数 - 20) 行。
        -   **热数据**: 保留 **最新的 20 行**。
    2.  **归档 (Archive)**:
        -   将 **冷数据** 追加写入到 `~/Documents/AI_Common/retrospective_archive.md`。
        -   (可选) 提示用户: `📦 已归档 N 条旧记录至 retrospective_archive.md`。
    3.  **重写 (Rewrite)**:
        -   用 **热数据** 覆盖 `~/Documents/AI_Common/retrospective.md`。

## 💡 Shell 实现参考 (供 AI 内部执行)
```bash
# 1. Check & Archive
LINE_COUNT=$(wc -l < ~/Documents/AI_Common/retrospective.md)
if [ "$LINE_COUNT" -gt 50 ]; then
  ARCHIVE_COUNT=$((LINE_COUNT - 20))
  # Archive old lines
  head -n "$ARCHIVE_COUNT" ~/Documents/AI_Common/retrospective.md >> ~/Documents/AI_Common/retrospective_archive.md
  # Keep new lines
  tail -n 20 ~/Documents/AI_Common/retrospective.md > ~/Documents/AI_Common/retrospective.md.tmp && mv ~/Documents/AI_Common/retrospective.md.tmp ~/Documents/AI_Common/retrospective.md
  echo "📦 GC Triggered: Archived $ARCHIVE_COUNT lines."
fi
```

## 🔍 交互示例
User: /retro 刚才那个跨域问题是因为后端没配 Options 方法。
AI: (写入...) 
(检测到行数=55, 触发 GC)
✅ 已记录
📦 自动维护: 已将 35 条早期记录归档至 `retrospective_archive.md`。
