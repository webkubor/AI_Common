### 7. 组件瘦身：ConfigPanel 模块化重构
- **背景**: `ConfigPanel.vue` 超过 500 行，包含了状态、截图逻辑、多个 UI 模块，维护极其困难。
- **解决方案**: 
    - **逻辑抽离**: 使用 Composables (`useToast`, `useExport`) 封装重型异步逻辑。
    - **UI 拆分**: 按职责划分为 `Basic`, `Advanced`, `Export`, `Footer` 四个子组件。
    - **通信优化**: 使用 `defineModel` 实现父子组件间简洁的双向绑定。
- **收益**: 主组件缩减 80% 代码；逻辑可复用性增强；各模块职责清晰，构建和调试效率显著提升。
