# Brand & Design Consistency DoD (Definition of Done)

> **触发条件**: 任何涉及 Logo、品牌名称、主色调、图标等视觉资产的变更任务。
> **执行原则**: 修改一处，必须检查全局。严禁“品牌分裂”。

## Phase 1: 准备阶段 (SSOT Check)
- [ ] **检索设计标准**: 必须先读取 `docs/ucd/logo_design_standard.md` 或相关设计规范。
- [ ] **确认唯一性**: 确认项目中当前只允许存在一个品牌名和一个主 Logo 变体。

## Phase 2: 实施与同步 (Implementation)
- [ ] **源文件更新**: 更新 `src/`, `public/`, `docs/public/` 等目录下的源文件。
- [ ] **代码内联检查**: 检查 `index.html`、`.tsx/.vue` 组件中是否有硬编码的 SVG 代码或 Base64 字符串，必须同步更新。
- [ ] **文档资源更新**: 检查 `README.md` 和 `docs/**/*.md` 中的图片链接 (`<img src="...">`) 是否指向新资源。

## Phase 3: 全局一致性验证 (Verification)
- [ ] **全项目搜索 (Grep)**:
    - 执行 `grep -rn "OldBrandName" .` 确保旧名称完全清除。
    - 执行 `grep -rn "logo.svg" .` 检查所有引用路径是否有效。
- [ ] **构建产物刷新**:
    - **必须**运行构建命令 (如 `npm run build`)。
    - 检查 `dist/` 或 `build/` 目录下的产物是否已包含新资产（防止缓存导致的旧资源残留）。

## Phase 4: 交付 (Delivery)
- [ ] **Git 状态检查**: 确保所有修改（包括 `dist/` 和文档）都已加入暂存区。
- [ ] **最终预览**: 打开 `index.html` 或文档页面进行视觉确认。
