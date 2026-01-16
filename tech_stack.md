# 技术栈与环境上下文 (Context)

## 基础环境
- **OS**: macOS
- **Shell**: zsh
- **AI 路径**: ~/Documents/AI_Common

## 默认技术偏好 (Preferred Stack - 用于新项目)

> **原则**: AI 应优先探测项目根目录的 `package.json` 或配置文件，以实际环境为准。以下为用户最擅长且偏好的默认选型。

- **核心框架**: Vue 3 (Composition API / `<script setup>`)
- **语言**: TypeScript (Strict Mode)
- **构建工具**: Vite
- **包管理器**: pnpm (强制首选)
- **状态管理**: Pinia (推荐 Setup Store 模式)
- **后端/BaaS**: CloudBase (腾讯云开发 - 首选，微信生态最佳)，用于 Serverless 数据持久化
- **工具库**: VueUse (优先使用)
- **测试**: 按项目实际选择（未固定）
- **代码规范**: **StandardJS** (无分号, 2空格, 单引号)
- **样式**: SCSS (Scoped) 或 Tailwind CSS
- **截图/DOM 转图片**: html-to-image（优于 html2canvas，对现代 CSS 支持更好）(强制标准)

<!-- TEST_MARKER: Context Isolation Test -->
> ⚠️ 测试内容已迁移：见 `AI_Common/_test_context.md`

- **UI 组件库**: 禁止使用原生系统 `select` 标签，必须封装自定义 Select 组件（移动端支持 Bottom Sheet 抽屉效果）

## 架构与设计原则 (通用)
- **单一职责**: 每个函数、Composable 或组件只负责一件事。
- **可读性优先**: 逻辑清晰、命名规范，严禁为了简洁而牺牲可读性。
- **类型安全**: 必须定义明确的 Interface/Type，禁止滥用 `any`。

## 编程偏好 (General)

- **脚本语言**: Node.js (ESM) 为主；Python (3.10+, 强制使用 pathlib) 仅在明确需求时使用
- **注释**: 严禁使用英文注释。所有代码注释、文档备注、JSDoc 必须全部使用 **中文**。

## 设计与资源规范 (Design & Assets)

- **Logo/图标设计**:
  - **格式**: 优先使用 **SVG** 代码直接生成（无需外部素材）
  - **风格**: 极简几何风格（Geometric Minimalism），参考 Vite / Vue 的设计语言
  - **配色**: 严格遵循 **莫兰迪色系 (Morandi Palette)**，与 UI 主题保持一致
  - **构图**: 使用基础几何图形（圆、路径）组合，通常包含“核心主体”（如气泡）+“功能隐喻”（如 AI 闪光/火花）
