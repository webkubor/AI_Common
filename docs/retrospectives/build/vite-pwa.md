## 2026-01-14: Vite PWA 构建失败 (Rollup resolve workbox-window)
- **现象**: Vercel 构建报错 `Rollup failed to resolve import "workbox-window" from "virtual:pwa-register/vue"`，以及项目出现 `npm` 与 `pnpm` 锁文件冲突。
- **根因**: 
    1. **依赖幽灵**: `vite-plugin-pwa` 内部使用 `workbox-window`，但在严格的 pnpm 环境下，未显式安装的依赖无法被提升或解析。
    2. **包管理混乱**: 在 pnpm 项目中使用了 `npm install`，导致 `package-lock.json` 生成，破坏了依赖树一致性。
- **解决方案**: 
    1. 删除 `package-lock.json` 并执行 `pnpm install` 修复锁文件。
    2. 显式执行 `pnpm add workbox-window` 将其加入项目依赖。
- **知识点**: Vite PWA 插件配合 pnpm 使用时，**必须显式安装** `workbox-window`；严禁在 pnpm 项目中混用 `npm`。
