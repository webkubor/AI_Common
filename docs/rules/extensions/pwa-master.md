---
name: pwa-master
description: PWA (Progressive Web App) setup and migration expert for Vite projects. Use when user requests to add PWA support, fix/refactor PWA, or execute PWA extensions. Ensures offline caching, update notifications, adaptive icons, and iOS/Android installation prompts.
license: Apache 2.0
---

# PWA Master Skill (Vite Universal PWA Protocol)

## 技能定位
本技能旨在为任意 **Vite** 项目（Vue / React / Preact / Svelte / Vanilla）提供标准化的 PWA 离线化改造方案。确保应用具备离线缓存、更新提醒、全平台图标自适应 以及 iOS/Android 安装引导能力。

## 触发条件
当用户提出以下请求时自动激活：
- "增加 PWA 支持"
- "重构/修复 PWA"
- "执行 PWA 扩展"

## 标准化工作流 (Phase-based Workflow)

### 阶段 A: 环境与基建 (Setup)
1. **依赖安装**:
   - 核心依赖: `pnpm add -D vite-plugin-pwa sharp`
   - **关键**: 显式安装运行时依赖 `pnpm add workbox-window` (用于处理 SW 生命周期)。
   - **检查**: 确认项目根目录锁文件一致性（推荐 pnpm）。
2. **类型支持**:
   - 修改 `tsconfig.json` 或 `tsconfig.app.json`。
   - 在 `compilerOptions.types` 中注入通用类型 `"vite-plugin-pwa/client"`。
   - 若为 React 项目，额外注入 `"vite-plugin-pwa/react"`；若为 Vue 项目，额外注入 `"vite-plugin-pwa/vue"`。
3. **资源自动化**: 创建 `scripts/generate-icons.js`，读取 `public/logo.svg` (或项目现有 Logo) 并利用 `sharp` 物理生成 192/512 尺寸的 PNG 图标。

### 阶段 B: 构建配置 (Vite Config)
1. **插件集成**: 在 `vite.config.ts` 中配置 `VitePWA` 插件。
2. **更新策略 (Critical)**:
   - 强制使用 `registerType: 'prompt'`。
   - **Workbox 配置**: 必须显式开启 `skipWaiting` 和 `clientsClaim`，防止新旧 SW 死锁。
     ```typescript
     workbox: {
       cleanupOutdatedCaches: true,
       clientsClaim: true, // 让新 SW 立即接管页面
       skipWaiting: true   // 允许新 SW 跳过等待期
     }
     ```
3. **Manifest 规范**:
   - 开启 `includeAssets` 包含 `favicon.ico`, `logo.svg` 等资源。
   - `icons` 配置必须包含 standard (192/512) 和 `purpose: 'any maskable'` (自适应) 图标。

### 阶段 C: 运行时与 UI (Runtime & Components)
1. **引导组件**: 创建 `PWAPrompt` 组件。
   - **智能安装检测**:
     - 利用 `window.matchMedia('(display-mode: standalone)').matches` 判断是否已在 PWA 模式运行。
     - **规则**: 如果已是 Standalone 模式，**严禁**显示安装提示（Install Banner），仅保留版本更新提示。
   - **更新防抖 (Debounce & Loading)**:
     - 点击"更新"按钮后，必须立即将按钮设为 `disabled` 或 `loading` 状态。
     - UI 文案从"立即更新"变为"正在更新..."，防止用户重复点击。
     - **兜底**: 若 5秒内未触发页面刷新，提示用户"请手动刷新"。
   - **核心逻辑 (Vue/React)**:
     必须监听 `controllerchange` 事件以确保页面刷新。单纯调用 `updateServiceWorker()` 在某些浏览器可能不会触发重载。
     ```javascript
     // 鲁棒的刷新逻辑示例
     const isUpdating = ref(false)

     const handleUpdate = async () => {
       isUpdating.value = true // 1. 立即上锁
       if (navigator.serviceWorker.controller) {
         // 2. 监听变化，准备刷新
         navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload()
         })
       }
       // 3. 执行更新 (会触发 skipWaiting)
       await updateServiceWorker(true)
     }
     ```
   - **iOS 特配**: 检测 iOS 环境，显示"添加到主屏幕"的手动引导（iOS Safari 不支持自动安装事件）。
2. **全局注入**: 将组件挂载到应用的最顶层（`App.tsx` 或 `App.vue`）。
3. **版本生效检验**:
   - 在 `vite.config.ts` 中通过 `define` 注入构建版本常量：`__APP_VERSION__: JSON.stringify(pkg.version)`
   - 应用启动时在入口文件（`main.tsx` 或 `main.ts`）对比当前版本与 `localStorage.getItem('pwa_last_version')`
   - 若版本不同，弹出提示：`已更新到新版本 vX.X.X（之前 vY.Y.Y）`
   - 更新 `localStorage.setItem('pwa_last_version', __APP_VERSION__)`

## 关键技术规范
- **框架无关性**: 代码逻辑应适配当前项目的技术栈。
- **UI/UX**: 必须包含 iOS 用户的安装指引；**已安装用户不打扰**；**更新过程有反馈**。
- **防死锁机制**: 必须包含 `clientsClaim: true` 和 `controllerchange` 监听，杜绝点击更新后页面无反应。
- **语言**: 所有代码注释、Log 信息、UI 文案必须使用 **中文**。

## 验收清单 (Checklist)

- [ ] `pnpm build` 成功且无 Rollup/Type 错误？
- [ ] `public/` 目录下是否存在物理生成的 PNG 图标 (pwa-192x192.png, pwa-512x512.png)？
- [ ] `vite.config.ts` 中是否包含 `workbox: { clientsClaim: true, skipWaiting: true }`？
- [ ] 离线模式下页面是否能正常打开？
- [ ] **关键**: PWA 模式（Standalone）启动时，是否**不**显示"安装应用"提示？
- [ ] **关键**: 点击"更新"按钮后，按钮是否立即变灰/显示Loading，且页面最终自动刷新？
