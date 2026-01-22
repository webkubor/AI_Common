## 2026-01-09: Tailwind CSS v4 升级导致样式失效
- **现象**：Vite 项目启动后，页面样式完全丢失，控制台无明显报错。
- **根因**：项目依赖中安装了 Tailwind CSS v4 (v4.1.18)，但 CSS 入口文件 (`index.css`) 仍使用 v3 的非标准指令 (`@tailwind base` 等)。v4 版本已全面转向原生 CSS 语法。
- **解决方案**：将 `@tailwind` 指令替换为标准 CSS 语法 `@import "tailwindcss";`。
- **知识点**：检查 `package.json` 中的 Tailwind 版本；v4 必须使用 `@import "tailwindcss";` 且不再需要 `postcss.config.js` 的复杂配置（通过 `@tailwindcss/postcss` 处理）。
