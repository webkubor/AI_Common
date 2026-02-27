# 前端复盘 (Frontend Retrospectives)

这里记录了前端开发过程中遇到的典型问题、构建错误以及重构经验。

## 📂 复盘列表

- **[组件模块化重构](./vue-refactor)**
  - 针对 `ConfigPanel` 臃肿问题，采用 Composables 和子组件拆分的重构实践。

- **[Tailwind CSS v4 升级踩坑](./tailwind-v4)**
  - 升级 v4 后样式丢失的排查，涉及标准 CSS 语法 `@import` 的变更。

- **[TypeScript 联合类型推断](./typescript-inference)**
  - 解决 `concat` 处理联合类型数组时的推断错误，确立了泛型 + 展开语法的最佳实践。

- **[Mermaid 渲染字符转义](./mermaid-syntax)**
  - 解决中文和特殊字符导致 Mermaid 图表渲染失败的问题。
