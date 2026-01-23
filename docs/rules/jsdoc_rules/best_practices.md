# JSDoc/TSDoc 最佳实践

> 基于行业标准和团队经验总结的注释最佳实践指南

## 1. 注释原则

### 1.1 何时需要注释

**必须注释的场景：**
- ✅ 所有公开的 API（函数、类、接口、方法）
- ✅ 复杂的业务逻辑和算法
- ✅ 工具函数和公共模块
- ✅ 带有副作用的函数
- ✅ 需要特殊参数说明的函数
- ✅ 可能抛出异常的函数

**不需要注释的场景：**
- ❌ 简单的 getter/setter
- ❌ 显而易见的代码（如 `return a + b`）
- ❌ 私有的辅助函数（如果命名足够清晰）

### 1.2 注释的质量标准

好的注释应该：
- **准确**：描述必须与代码行为一致
- **简洁**：用最少的文字传达最多的信息
- **完整**：涵盖所有重要的参数、返回值和异常
- **有用**：帮助开发者理解"为什么"而不是"怎么做"

## 2. 描述编写规范

### 2.1 简短描述

**规则：**
- 第一行必须是简短描述（一句话概括功能）
- 以动词开头，使用祈使语气
- 不要重复函数名称

**好的示例：**
```javascript
/**
 * 计算两个数的和
 */
function add(a, b) { }
```

**不好的示例：**
```javascript
/**
 * add 函数用于计算两个数的和
 */
function add(a, b) { }
```

### 2.2 详细描述

**规则：**
- 简短描述后空一行
- 详细描述可以多行
- 说明函数的目的、使用场景和注意事项

**好的示例：**
```javascript
/**
 * 计算两个数的和
 *
 * 此函数用于执行基本的加法运算。适用于任何数值类型的参数，
 * 包括整数和浮点数。如果参数不是数字类型，会尝试进行类型转换。
 *
 * @param {number} a - 第一个加数
 * @param {number} b - 第二个加数
 * @returns {number} 两个数的和
 */
function add(a, b) { }
```

## 3. 参数说明规范

### 3.1 基本格式

**标准格式：**
```javascript
@param {类型} 参数名 - 参数说明
```

### 3.2 可选参数

**使用方括号标注：**
```javascript
/**
 * 格式化日期
 *
 * @param {Date} date - 日期对象
 * @param {string} [format] - 格式化模板（可选）
 */
function formatDate(date, format) { }
```

### 3.3 默认值

**在参数说明中标注默认值：**
```javascript
/**
 * 创建用户
 *
 * @param {string} name - 用户名称
 * @param {string} [role='user'] - 用户角色，默认为 'user'
 */
function createUser(name, role = 'user') { }
```

### 3.4 多种类型

**使用联合类型：**
```javascript
/**
 * 设置配置项
 *
 * @param {string|number} value - 配置值，可以是字符串或数字
 */
function setConfig(value) { }
```

### 3.5 参数说明的最佳实践

**好的示例：**
```javascript
/**
 * 验证用户输入
 *
 * @param {string} input - 用户输入的文本
 * @param {Object} [options] - 验证选项
 * @param {boolean} [options.required=true] - 是否必填
 * @param {number} [options.minLength=0] - 最小长度
 * @param {number} [options.maxLength=100] - 最大长度
 * @returns {boolean} 验证是否通过
 */
function validateInput(input, options) { }
```

**不好的示例：**
```javascript
/**
 * 验证用户输入
 *
 * @param {string} input - 输入
 * @param {Object} options - 选项
 */
function validateInput(input, options) { }
```

## 4. 返回值说明规范

### 4.1 基本格式

**标准格式：**
```javascript
@returns {类型} 返回值说明
```

### 4.2 多种返回值

**明确说明不同情况：**
```javascript
/**
 * 查找用户
 *
 * @param {string} userId - 用户 ID
 * @returns {User|null} 找到的用户对象，未找到返回 null
 */
function findUser(userId) { }
```

### 4.3 Promise 返回值

**使用 Promise 类型：**
```javascript
/**
 * 获取用户信息
 *
 * @param {string} userId - 用户 ID
 * @returns {Promise<User>} 用户信息对象
 */
async function getUser(userId) { }
```

### 4.4 无返回值

**使用 void 类型：**
```javascript
/**
 * 记录日志
 *
 * @param {string} message - 日志消息
 * @returns {void} 无返回值
 */
function log(message) { }
```

## 5. 异常说明规范

### 5.1 基本格式

**标准格式：**
```javascript
@throws {错误类型} 错误说明
```

### 5.2 多种异常

**分别说明每种异常：**
```javascript
/**
 * 读取配置文件
 *
 * @param {string} filePath - 文件路径
 * @returns {Object} 配置对象
 * @throws {Error} 当文件不存在时抛出异常
 * @throws {Error} 当 JSON 解析失败时抛出异常
 * @throws {Error} 当权限不足时抛出异常
 */
function readConfig(filePath) { }
```

### 5.3 异常说明的最佳实践

**好的示例：**
```javascript
/**
 * 删除用户
 *
 * @param {string} userId - 用户 ID
 * @returns {boolean} 删除成功返回 true
 * @throws {Error} 当用户不存在时抛出异常
 * @throws {Error} 当用户是管理员时抛出异常
 */
function deleteUser(userId) { }
```

## 6. 示例代码规范

### 6.1 基本格式

**使用 @example 标签：**
```javascript
/**
 * 计算数组平均值
 *
 * @param {number[]} numbers - 数字数组
 * @returns {number} 平均值
 *
 * @example
 * ```javascript
 * average([1, 2, 3, 4, 5])
 * // 返回: 3
 * ```
 */
function average(numbers) { }
```

### 6.2 多个示例

**提供不同的使用场景：**
```javascript
/**
 * 格式化日期
 *
 * @param {Date} date - 日期对象
 * @param {string} [format='YYYY-MM-DD'] - 格式模板
 * @returns {string} 格式化后的字符串
 *
 * @example
 * ```javascript
 * formatDate(new Date())
 * // 返回: '2024-01-23'
 * ```
 *
 * @example
 * ```javascript
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * // 返回: '2024-01-23 10:30:00'
 * ```
 */
function formatDate(date, format) { }
```

### 6.3 示例代码的最佳实践

**好的示例：**
```javascript
/**
 * 深度克隆对象
 *
 * @param {*} obj - 要克隆的对象
 * @returns {*} 克隆后的对象
 *
 * @example
 * ```javascript
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2
 * ```
 */
function deepClone(obj) { }
```

**不好的示例：**
```javascript
/**
 * 深度克隆对象
 *
 * @example
 * deepClone({a:1})
 */
function deepClone(obj) { }
```

## 7. 类型定义规范

### 7.1 使用 @typedef

**定义复杂类型：**
```javascript
/**
 * 用户配置类型
 *
 * @typedef {Object} UserConfig
 * @property {string} name - 用户名称
 * @property {string} email - 用户邮箱
 * @property {number} [age] - 用户年龄（可选）
 * @property {boolean} [isActive=true] - 是否激活，默认 true
 */

/**
 * 创建用户
 *
 * @param {UserConfig} config - 用户配置
 * @returns {User} 用户对象
 */
function createUser(config) { }
```

### 7.2 使用 @template

**定义泛型类型：**
```javascript
/**
 * 数组去重
 *
 * @template T
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 去重后的数组
 */
function uniqueArray(arr) { }
```

## 8. 类和接口规范

### 8.1 类注释

**好的示例：**
```javascript
/**
 * 用户管理类
 *
 * 提供用户的增删改查功能，支持缓存和批量操作
 *
 * @class UserManager
 */
class UserManager {
  /**
   * 创建用户管理器实例
   *
   * @constructor
   * @param {string} apiUrl - API 基础地址
   * @param {number} [timeout=5000] - 请求超时时间（毫秒）
   */
  constructor(apiUrl, timeout = 5000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }

  /**
   * 添加用户
   *
   * @public
   * @param {User} user - 用户对象
   * @returns {boolean} 添加成功返回 true
   */
  addUser(user) { }
}
```

### 8.2 接口注释

**TypeScript 接口：**
```typescript
/**
 * 用户数据接口
 *
 * @interface User
 */
interface User {
  /**
   * 用户唯一标识符
   */
  id: string;

  /**
   * 用户名称
   */
  name: string;

  /**
   * 用户邮箱地址
   */
  email: string;
}
```

## 9. 常见错误和避免方法

### 9.1 注释与代码不一致

**错误示例：**
```javascript
/**
 * 计算两个数的和
 *
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两个数的乘积
 */
function add(a, b) {
  return a * b; // 实际是乘法
}
```

**正确做法：**
- 保持注释与代码同步
- 修改代码时同时更新注释

### 9.2 过于冗长的注释

**错误示例：**
```javascript
/**
 * 这个函数的作用是接收一个数字类型的数组作为输入参数，
 * 然后遍历这个数组中的所有元素，将它们相加起来，
 * 最后除以数组的长度，计算出平均值并返回。
 */
function average(numbers) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
```

**正确做法：**
```javascript
/**
 * 计算数组平均值
 *
 * @param {number[]} numbers - 数字数组
 * @returns {number} 平均值
 */
function average(numbers) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
```

### 9.3 重复代码逻辑

**错误示例：**
```javascript
/**
 * 将字符串转为小写
 * 使用 toLowerCase() 方法进行转换
 */
function toLower(str) {
  return str.toLowerCase();
}
```

**正确做法：**
```javascript
/**
 * 将字符串转为小写
 *
 * 注意：此函数不会处理特殊字符和本地化需求
 *
 * @param {string} str - 原始字符串
 * @returns {string} 小写字符串
 */
function toLower(str) {
  return str.toLowerCase();
}
```

### 9.4 使用模糊词汇

**错误示例：**
```javascript
/**
 * 处理一下数据
 *
 * @param {*} data - 数据
 * @returns {*} 处理后的数据
 */
function processData(data) { }
```

**正确做法：**
```javascript
/**
 * 清理和格式化用户输入数据
 *
 * 移除首尾空格，转义 HTML 特殊字符，验证数据格式
 *
 * @param {string} input - 用户输入的原始数据
 * @returns {string} 清理后的安全数据
 */
function sanitizeInput(input) { }
```

## 10. 性能和维护性考虑

### 10.1 注释的性能影响

**原则：**
- JSDoc 注释不会影响运行时性能
- 但过多的注释会增加文件大小
- 保持注释简洁，避免冗余

### 10.2 注释的可维护性

**最佳实践：**
- 使用一致的格式和风格
- 定期审查和更新注释
- 删除过时的注释
- 使用工具自动检查注释质量

## 11. 团队协作规范

### 11.1 代码审查检查清单

在代码审查时，检查：
- [ ] 所有公开 API 都有 JSDoc 注释
- [ ] 注释使用中文描述
- [ ] @param 和 @returns 标签完整
- [ ] 异常用 @throws 说明
- [ ] 复杂逻辑有 @example
- [ ] 注释与代码一致
- [ ] 注释格式符合规范

### 11.2 文档生成

**使用工具生成文档：**
- JSDoc: `jsdoc` 命令
- TypeDoc: `typedoc` 命令
- VuePress: 集成到文档站点

## 12. 参考资源

### 12.1 官方文档
- [JSDoc 官方文档](https://jsdoc.app/)
- [TSDoc 规范](https://tsdoc.org/)
- [MDN JavaScript 文档指南](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/JavaScript)

### 12.2 最佳实践文章
- [JavaScript 文档最佳实践](https://docuwriter.ai/posts/definitive-guide-javascript-documentation-best-practices-tools)
- [代码文档和格式化最佳实践](https://peacockindia.mintlify.app/docs/code-documentation)
- [p5.js JSDoc 最佳实践](https://beta.p5js.org/contribute/jsdoc/)

### 12.3 工具和插件
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)
- [Document This (VSCode)](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)
- [JSDoc (VSCode)](https://marketplace.visualstudio.com/items?itemName=stevencl.addDocComments)

## 13. 总结

### 13.1 核心原则

1. **准确性**：注释必须与代码一致
2. **简洁性**：用最少的文字传达最多的信息
3. **完整性**：涵盖所有重要的参数、返回值和异常
4. **实用性**：帮助开发者理解代码的目的和用法

### 13.2 快速检查清单

提交代码前，确认：
- [ ] 公开函数有 JSDoc 注释
- [ ] 使用中文描述
- [ ] @param 标签完整
- [ ] @returns 标签完整
- [ ] 异常用 @throws 说明
- [ ] 复杂逻辑有 @example
- [ ] 注释格式符合规范
- [ ] 通过 ESLint 检查

### 13.3 持续改进

- 定期审查和更新注释规范
- 收集团队反馈，优化注释风格
- 使用自动化工具提高注释质量
- 分享好的注释示例和经验