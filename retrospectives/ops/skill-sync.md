## 🚨 [2026-01-22] 技能部署的“最后一公里”事故

### 问题描述
在 AI_Common 安装新 Skill (super-design) 后，未同步更新 ~/.codex/skills/ 下的本地文件，导致 Codex 运行时仍引用已删除的旧技能 (frontend-design)，引发配置不一致。

### 根本原因
- **认知偏差**：误以为 AI_Common 是唯一的运行时来源，忽略了各 Agent (Codex, Claude CLI) 往往有自己的本地缓存/配置目录。
- **流程缺失**：缺乏“安装 = 源码提交 + 本地部署”的完整闭环意识。

### 修正协议 (SOP)
**当修改 AI_Common/extensions 时，必须执行《多环境同步检查》：**
1.  **Codex**: 检查 `~/.codex/skills/` 是否存在同名旧目录需删除，新技能是否需 cp 过去。
2.  **Manifest**: 检查 `codex_manifest.md` / `claude_manifest.md` 是否引用了不存在的文件。
3.  **Config**: 检查 `~/.codex/config.toml` 是否有硬编码的技能路径。
