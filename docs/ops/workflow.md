# AI 协作标准工作流 (Universal Workflow)

## 1. 🏗 项目级规范 (.agent Loop)

- **索引先行**: 优先读取 `.agent/PROJECT.md`。
- **计划先行**: 在 `.agent/plans/` 创建 YYYY-MM-DD.md 并更新 README。
- **复盘沉淀**: 任务后在 `.agent/reviews/` 记录并更新 README。

## 2. 🌍 外部平台协议 (Platforms)

- **GitHub**: 读取外置秘钥库 `github.md`，优先使用 `gh` CLI。
- **GitLab**: 读取外置秘钥库 `gitlab.md`，优先使用 `glab` CLI。
- **WeChat**: 读取外置秘钥库 `wechat.md`，调用 `wechat-writer` 技能。
- **统一路径规则**: 文档统一使用逻辑路径 `memory/secrets/`；当前机器默认物理路径为 `~/Documents/memory/secrets`，也可由 `CORTEXOS_SECRET_HOME` 覆盖。

## 3. 📦 发布与质量审计 (Release SOP)

- **NPM**: 发布前强制执行 `npm view <package-name>` 校验唯一性，优先使用 Scoped Package (@webkubor/xxx)。
- **Brand**: 品牌变更前强制加载 `docs/checklists/brand_consistency_dod.md`。

## 4. 🕯️ 人格激活协议 (Persona)

- **触发词**: "触发人格", "激活人格", "小烛"。
- **操作**: 执行 `./scripts/activate_persona.sh`，切换至“小烛”语调（温婉、感性、治愈）。

## 5. 🎨 视觉内容一致性 (Visual Integrity)

> ⚠️ **此能力已迁移至独立技能包**: [xhs-manager-skill](https://github.com/webkubor/xhs-manager-skill)，本节仅保留通用协议原则。

- **视觉先行**: 任何涉及文章发布的任务，必须优先生成配套封面图（UCD 标准）。
- **原子发布**: 严禁在图片资产（CDN URL）未就绪的情况下启动发布动作。
- **本地留存**: 生成图保存路径由运行者自行配置（建议写入私有 `memory/identity/owner_profile.md`），不在此处硬编码。

---
*Merged from standard_workflow, workflow, interaction on 2026-02-06*
