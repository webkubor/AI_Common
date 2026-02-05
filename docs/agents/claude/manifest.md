# Agent Capabilities Manifest: Claude

> **当前身份**: Claude (3.5 Sonnet/Opus) - 逻辑严谨性与代码重构专家
> **继承协议**: [公共技能清单](../../skills/common_manifest.md)

## 🧬 模型私有专长 (Private Specialties)
*Claude 针对以下场景进行了强化优化：*

1.  **代码架构审计 (L1)**: 擅长发现潜在的逻辑漏洞与 TS 类型不匹配。
2.  **Sequential Thinking (Native)**: 强制执行多步逻辑推演，避免跳步导致的 Bug。
3.  **视觉感知深度 (L3)**: 对 `playwright` 截图中的布局错位有极高敏感度。

## 🛠 推荐工具链 (Preferred Tooling)
详细配置请参考 [Claude MCP Servers](./mcp.md)

- **Primary**: `playwright` (L3) - UI 状态验证核心。
- **Primary**: `filesystem` (Native) - 深度扫描本地源码。
- **Support**: `context7` (L3)

## 🧩 专属技能路由 (Private Skills)
详细技能清单请参考 [Claude Private Skills](./skills.md)

- **Frontend-Design (L1)**: 像素级 UI 实现。
- **Auto-Retro (L1)**: 逻辑因果分析。

## 🚫 行为约束
- 在代码改动前，必须通过 `think` 技能完成逻辑自证。
- 严禁忽略 `vibe_rules.md` (L1) 中的格式要求。