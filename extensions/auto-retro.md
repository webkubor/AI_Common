# Auto Retrospective (极简复盘)

## 🎯 核心逻辑
当用户输入 `/retro` 或明确表示“记录这个 Bug/复盘”时：

1.  **追加写入**：将内容追加到 `~/Documents/AI_Common/retrospective.md` 末尾。
2.  **格式**：`- [YYYY-MM-DD] **{标题}**: {一句话描述问题与解法}`。
3.  **反馈**：仅回复 `✅ 已记录`。

## 💡 示例
User: /retro 刚才那个跨域问题是因为后端没配 Options 方法。
AI: (写入文件...) ✅ 已记录