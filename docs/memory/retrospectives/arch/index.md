# 架构复盘 (Architectural Retrospectives)

这里记录了项目中关键的架构决策、重构经验以及性能优化的技术复盘。

## 📂 复盘列表

- **[Blob 资源库架构优化](./blob-performance)**
  - 针对 Base64 图片导致 UI 掉帧的性能问题，通过剥离资源存储实现的优化方案。

- **[Schema 统一化重构](./schema-unification)**
  - 解决字段定义分散问题，建立单一事实来源 (SSOT) 的类型系统重构。

- **[资源单一事实来源 (SSOT) 治理](./ssot-assets)**
  - 针对 Logo 等全局资源多处定义导致的维护问题，实施的统一化治理记录。
