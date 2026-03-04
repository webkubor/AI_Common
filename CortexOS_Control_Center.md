# 🎮 CortexOS 指挥中心 (AI Fleet Control Center)

> **“感知全量武装，掌控协议矩阵。这是外部大脑的唯一真理来源。”**

---

## 🛠️ 1. 自动化基础设施 (Infrastructure & Extensions)
这些是赋予 Agent 物理操作能力的**底层工具 (MCP Servers)**。

| 工具名称 | 核心能力 (About) | 装载时间 | 调用方式 (Method) |
| :--- | :--- | :--- | :--- |
| **`chrome-devtools-mcp`** | **agent-browser**：浏览器自动化、A11y 语义识别。 | 2026-03-04 | `browser_*` / `chrome-devtools` |
| **`nanobanana`** | **视觉画师**：AI 图像生成、编辑、修复与 Story 设计。 | 2026-02-19 | `generate_image` / `G()` |
| **`context7`** | **文档库**：实时拉取第三方库的最新 API 文档。 | 2026-02-24 | `query-docs` |
| **`mcp-toolbox`** | **数据管家**：连接本地/云端数据库的向量协议。 | 2026-02-24 | `mcp-toolbox` |
| **`github-mcp`** | **GitHub 交互**：通过 MCP 操作 Issue、PR 与 Repo。 | 2026-03-04 | `github_*` |

---

## 🛡️ 2. AI 核心技能兵器谱 (Skills Manifest)
这些是定义了 SOP 和业务逻辑的**协议包 (Skills)**。

| 技能名称 | 核心职能 (About) | 状态 | 安装路径 (Package) |
| :--- | :--- | :--- | :--- |
| **`cinematic-storyboard-skill`** | **视觉大导**：写实武侠逻辑、15s 分镜、AI 视频 Prompt。 | 🌟 旗舰 | `.agents/skills/cinematic-storyboard-skill` |
| **`xhs-manager-skill`** | **小红书官**：agent-browser 驱动、矩阵发布、账号隔离。 | ✅ 已武装 | `.agents/skills/xhs-manager-skill` |
| **`scm-ops-skill`** | **运维总管**：Git/GitHub 自动化、Release 循环、多实例。 | ✅ 已武装 | `.agents/skills/scm-ops-skill` |
| **`brain-sentinel-skill`** | **记忆哨兵**：Exocortex 健康监测、记忆日志、审计。 | 🚨 激活中 | `.agents/skills/brain-sentinel-skill` |
| **`visual-studio-skill`** | **视觉大师**：Persona 锁死、UI/UX 实现、品牌 IP。 | ✅ 已安装 | `.agents/skills/visual-studio-skill` |
| **`audio-music-engineer-skill`**| **音乐工程师**：BGM 创作、SFX 音效设计。 | ✅ 已安装 | `.agents/skills/audio-music-engineer-skill` |
| **`omni-publisher-skill`** | **全能分发**：跨平台同步（掘金、微信、小红书）。 | ✅ 已安装 | `.agents/skills/omni-publisher-skill` |

---

## 🚦 3. 执行与维护协议 (Management SOP)

### 📥 技能安装与更新
- **安装新技能**: `gemini skills install <URL>`
- **安装新工具**: `gemini extensions install <URL>`

### 🔄 技能管理
- **激活/切换**: `activate_skill(name)`
- **状态巡检**: `pnpm run fleet:status` (来自 `CortexOS` 根目录)

### 📝 记忆同步
- **操作留痕**: 每一项基础设施变动必须记入 `logs/YYYY-MM-DD-infra.md`。
- **兵器谱同步**: 每次安装/卸载后必须更新本指挥中心文档。

---
*Managed by Little Candle (小烛) | Last Updated: 2026-03-04*
