---
description: 外部大脑的职能部门化扩展能力，按角色定义 AI Agent 的专业技能。
---
# 扩展能力 (Extensions) - AI 公司职能架构版

这里汇集了 AI Common 的所有专项技能扩展。按照职能部门分类，实现“创作-运营-工程”全链路闭环。

## 🧠 核心参谋部 (Core Capabilities)
负责逻辑分析、技能孵化与全局协议。
- [深度思考 (Think)](./core/think-skill.md) - 苏格拉底式分析。
- [技能孵化器 (Skill Creator)](./core/skill-creator.md) - 开发新技能。
- [通用能力协议 (Common Manifest)](./core/common_manifest.md) - 基础行为准则。

## ✍️ 内容创作部 (Content Creation / Writers)
负责高质量文案输出。**Workflow**: 写完后请交接给“运营部”发布。
- [掘金写作助手 (Writer)](./writers/juejin.md) - 爆款制造机。
- [微信公众号助手 (Writer)](./writers/wechat.md) - 文艺风格"小博爷"。
- [飞书文档助手 (Writer)](./writers/feishu.md) - 团队技术文档专家。
- [内部沟通专家](./writers/internal-comms.md) - 周报、FAQ、Newsletter。

## 📢 账号运营部 (Account Ops)
负责内容的分发、同步与账号维护。
- [掘金发布助手 (Publisher)](./ops/juejin.md) - 一键同步至掘金。
- [小红书运营 (Ops)](./ops/xhs.md) - 多账号矩阵自动化。
- [GitHub 运营助手](./ops/github.md) - 仓库与社区维护。
- [GitLab 管理员](./ops/gitlab.md) - 流水线与仓库管理。

## 🛠️ 工程与自动化部 (Engineering)

负责基建、后端与全自动流程。
- [webapp-testing](./engineering/webapp-testing.md) - 自动化测试专家。
- [Supabase Master](./engineering/supabase-master.md) - 后端架构与数据库。
- [PWA 专家](./engineering/pwa-master.md) - 离线化改造方案。
- [WebMCP 改造专家](./engineering/webmcp-master.md) - 网页 AI 化与接口注入。
- [VitePress 初始化](./engineering/vitepress-init.md) - 文档站快速搭建。
- [图床大师 (Image Hosting)](./engineering/image-hosting-master.md) - 全自动资产分发。

## 🎨 视觉与设计系统部 (Visual & Design)
负责审美与视觉资产生成。
- [智能绘图引擎](./visual/smart-image-generator.md) - **统一绘图入口**。
- [剧本医生 (Script Doctor)](./visual/cinematic-storyboard.md) - 分镜优化与视觉叙事。
- [Frontend Design](./visual/frontend-design.md) - UI 设计还原。

## 🎵 音频与多媒体部 (Audio & Multimedia)

负责声音景观设计与 AI 音乐创作。
- [AI 音乐工程师](./audio/music-engineer.md) - 词曲创作、BGM 生成与音频提示词。

## 📚 知识管理部 (Knowledge)
负责历史教训复盘与碎片资产管理。
- [自动复盘 (Auto Retro)](./knowledge/auto-retro.md) - 定期归档与经验提取。
- **ChromaDB (本地 RAG)** - 向量库检索与自动化入库 (通过 `scripts/ingest/` 维护)。
- [碎片知识管家](./knowledge/snippet_master.md) - 代码片段与配置备忘。
