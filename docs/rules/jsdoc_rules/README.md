# JSDoc/TSDoc 中文注释规范

本目录包含团队代码注释的详细规范和示例，旨在统一代码注释风格，提高代码可维护性和文档生成质量。

## 📁 目录结构

```
jsdoc_rules/
├── README.md                    # 本文件
├── index.md                     # 完整规范文档
├── quick_reference.md           # 快速参考指南
├── eslint-config-example.js     # ESLint 配置示例
└── examples/                    # 示例代码
    ├── javascript.js            # JavaScript 示例
    ├── typescript.ts            # TypeScript 示例
    └── vue-component.vue        # Vue 组件示例
```

## 📖 文档导航

### [完整规范文档](./index.md)
详细的 JSDoc/TSDoc 注释规范，包含：
- 基本原则和语法
- 常用标签说明
- TypeScript 特有规范
- 最佳实践
- 工具配置建议

### [快速参考指南](./quick_reference.md)
快速查阅常用标签和语法，包含：
- 基础模板
- 标签速查表
- 类型语法速查
- 常见场景示例
- 检查清单

### [示例代码](./examples/)
实际代码示例，展示如何应用规范：
- [JavaScript 示例](./examples/javascript.js) - 包含函数、类、工具函数等
- [TypeScript 示例](./examples/typescript.ts) - 包含接口、泛型、装饰器等
- [Vue 组件示例](./examples/vue-component.vue) - 包含组件 Props、Emits、方法等

### [最佳实践](./best_practices.md)
基于行业标准和团队经验总结的注释最佳实践指南，包含：
- 注释原则和质量标准
- 描述、参数、返回值、异常说明规范
- 示例代码和类型定义规范
- 类和接口规范
- 常见错误和避免方法
- 性能和维护性考虑
- 团队协作规范

### [ESLint 配置示例](./eslint-config-example.js)
完整的 ESLint 配置示例，用于强制执行 JSDoc/TSDoc 注释规范。

## 🎯 核心要求

### 必须注释的场景
- ✅ 所有公开的函数、方法、类、接口
- ✅ 复杂的业务逻辑函数
- ✅ 工具函数和公共 API
- ✅ 带有副作用的函数
- ✅ Vue 组件的 Props、Emits、方法

### 基本格式
```javascript
/**
 * 函数的简短描述（一句话说明功能）
 *
 * @param {类型} 参数名 - 参数说明
 * @returns {类型} 返回值说明
 */
```

### 必需标签
- `@param` - 所有参数必须说明类型和用途
- `@returns` - 必须说明返回值类型和含义
- `@throws` - 可能抛出的异常必须说明

### 推荐标签
- `@example` - 提供使用示例
- `@typedef` - 定义复杂类型
- `@template` - 泛型类型说明
- `@deprecated` - 标记已废弃的 API

## 🔧 工具支持

### ESLint 配置
使用 `eslint-plugin-jsdoc` 进行自动检查：
```bash
npm install -D eslint eslint-plugin-jsdoc
```

参考 [ESLint 配置示例](./eslint-config-example.js) 进行配置。

### VSCode 插件
推荐安装以下插件：
- **Document This** - 快速生成 JSDoc 注释
- **JSDoc** - 提供 JSDoc 语法高亮和智能提示
- **TypeScript Importer** - 自动导入类型

### 在线工具
- [JSON to JSDoc](https://transform.tools/json-to-jsdoc) - 将 JSON 转换为 JSDoc 类型定义

## 🔗 相关资源

- [JSDoc 官方文档](https://jsdoc.app/)
- [TSDoc 规范](https://tsdoc.org/)
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)
- [TypeScript JSDoc 参考](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

## 📝 使用建议

1. **开发前**：阅读[完整规范文档](./index.md)了解详细要求
2. **开发中**：使用[快速参考指南](./quick_reference.md)快速查阅标签
3. **遇到问题**：参考[示例代码](./examples/)中的实际应用
4. **提升质量**：学习[最佳实践](./best_practices.md)中的经验总结
5. **提交前**：使用检查清单确保注释完整
6. **自动化**：配置 ESLint 进行自动检查和修复

## ✅ 检查清单

提交代码前，请确认：
- [ ] 所有公开函数都有 JSDoc 注释
- [ ] 注释使用中文描述
- [ ] @param 和 @returns 标签完整
- [ ] 复杂逻辑有详细说明
- [ ] 提供了使用示例（@example）
- [ ] 注释格式符合规范
- [ ] 通过 ESLint 检查

## 🤝 贡献

如果你有改进建议或发现文档问题，欢迎提出反馈。

## 📄 许可

本规范文档遵循项目整体许可证。