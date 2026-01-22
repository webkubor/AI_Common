## 1. 文本处理与保存 (Text Handling)

### 1.1 长文本跨目录写入黄金法则
- **痛点**: 在执行 `run_shell_command` 使用 `heredoc` (EOF) 或 `printf` 写入包含复杂字符（如颜文字、Mermaid 语法、JSON）的长文本时，极易触发 Shell 缓冲区截断或转义错误（尤其在 Gemini 模型下）。
- **标准解法**: 
  1. **本地生成**: 优先在当前项目工作目录（如 `public/`）内使用 `write_file` 生成完整、无损的文件。
  2. **跨目录迁移**: 文件生成后，使用 `run_shell_command` 执行 `mv` 命令将文件迁移至目标外部目录（如 `AI_Common` 或 `AI_Plan`）。
- **优势**: 彻底规避了 Shell 解释器的字符干扰，确保 100% 内容完整性。
