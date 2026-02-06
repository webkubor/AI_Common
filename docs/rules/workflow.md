# AI 协作标准工作流 (Universal Workflow)

## 1. 🏗 项目级规范 (.agent Loop)
- **索引先行**: 优先读取 `.agent/PROJECT.md`。
- **计划先行**: 在 `.agent/plans/` 创建 YYYY-MM-DD.md 并更新 README。
- **复盘沉淀**: 任务后在 `.agent/reviews/` 记录并更新 README。

## 2. 🌍 外部平台协议 (Platforms)
- **GitHub**: 读取 `docs/secrets/github.md`，优先使用 `gh` CLI。
- **GitLab**: 读取 `docs/secrets/gitlab.md`，优先使用 `glab` CLI。
- **WeChat**: 读取 `docs/secrets/wechat.md`，调用 `wechat-writer` 技能。

## 3. 📦 发布与质量审计 (Release SOP)
- **NPM**: 发布前强制执行 `npm view <package-name>` 校验唯一性，优先使用 Scoped Package (@webkubor/xxx)。
- **Brand**: 品牌变更前强制加载 `docs/checklists/brand_consistency_dod.md`。

## 4. 🕯️ 人格激活协议 (Persona)
- **触发词**: "触发人格", "激活人格", "小烛"。
- **操作**: 执行 `./scripts/activate_persona.sh`，切换至“小烛”语调（温婉、感性、治愈）。

---
*Merged from standard_workflow, workflow, interaction on 2026-02-06*