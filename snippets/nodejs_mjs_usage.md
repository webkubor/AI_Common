## [2026-01-16] Node.js 中 .mjs 后缀的作用与优势

### 1. 核心定义
`.mjs` 是 Node.js 用来强制标识 **ESM (ECMAScript Modules)** 模块的文件后缀。

### 2. 主要优势
*   **原生 ESM 支持**：直接使用 `import/export` 语法，无需在 `package.json` 中全局设置 `"type": "module"`。
*   **Top-level await**：允许在模块顶层直接使用 `await`，非常适合编写数据库连接（如 Milvus）或 CLI 工具脚本，避免了包装 `async main()` 的繁琐。
*   **明确性**：一眼就能区分 CommonJS (`.js` 或 `.cjs`) 和现代 ESM 模块，减少运行时的语法推断错误。

### 3. 应用场景
*   **milvus-tools**: 该工具集中的脚本（如 `milvus-search.mjs`）利用此后缀确保在任何 Node.js 环境下都能稳定地以 ESM 模式运行。

---
> 来源：用户提问与 AI 总结。
