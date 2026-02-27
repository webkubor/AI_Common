# 泰国收银台 (th-payment-web) 重构复盘

## ⚠️ 核心教训 (Anti-Patterns)
1. **Sass 升级断层**: 
   - 现象：使用 `@import` 报废弃警告，重写变量表导致组件 Undefined variable。
   - 解决：现代 Vite 项目必须使用 `@use`；全局变量应在 `vite.config.ts` 的 `additionalData` 中注入；必须保留旧组件的变量名兼容性。
2. **模块边界模糊**:
   - 现象：`message.ts` 相对路径错误；`api` 漏掉导出。
   - 解决：建立全量类型检查 `vue-tsc` 并在 Commit 前强制运行。
3. **Shell 写入风险**:
   - 现象：使用 `cat << EOF` 写入包含 `$` 符号的 Vue 组件代码导致转义失败。
   - 解决：遵循“安全写入法则”，复杂组件必须使用 `write_file` 接口。

## 🚀 进度状态
- **Status**: Production-Ready
- **Tech Stack**: Vite + Vue3 + TS + pnpm + ky
- **Feature**: 扁平化路由 (/bank, /qr, /result)、自研玻璃拟态 UI、BottomSheet 交互。
