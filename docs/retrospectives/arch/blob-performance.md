### 8. 性能飞跃：Blob 资源库架构
- **痛点**: 背景图和多张头像转为 Base64 后，单次持久化（JSON.stringify）的数据量超过 2MB，导致 UI 线程在保存时出现肉眼可见的掉帧。
- **方案**: 实现 `localDB.saveResource` 逻辑，将图片实体剥离到独立仓库，主 Store 仅保留“资源指针”。
