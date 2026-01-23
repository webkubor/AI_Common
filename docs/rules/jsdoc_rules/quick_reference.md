# JSDoc/TSDoc 快速参考指南

> 快速查阅常用标签和语法

## 基础模板

### 函数注释
```javascript
/**
 * 函数简短描述
 *
 * @param {类型} 参数名 - 参数说明
 * @returns {类型} 返回值说明
 */
```

### 类注释
```javascript
/**
 * 类的简短描述
 *
 * @class ClassName
 */
```

### 接口注释
```typescript
/**
 * 接口描述
 *
 * @interface InterfaceName
 */
```

## 常用标签速查

| 标签 | 用途 | 示例 |
|------|------|------|
| `@param` | 参数说明 | `@param {string} name - 用户名称` |
| `@returns` | 返回值说明 | `@returns {number} 计算结果` |
| `@throws` | 异常说明 | `@throws {Error} 参数错误` |
| `@example` | 使用示例 | `@example \`\`\`javascript foo() \`\`\`` |
| `@typedef` | 类型定义 | `@typedef {Object} User` |
| `@property` | 属性说明 | `@property {string} id - 用户ID` |
| `@template` | 泛型类型 | `@template T` |
| `@async` | 异步函数 | `@async` |
| `@private` | 私有成员 | `@private` |
| `@public` | 公开成员 | `@public` |
| `@deprecated` | 已废弃 | `@deprecated 请使用新方法` |

## 类型语法速查

### 基本类型
```javascript
@param {string} str      // 字符串
@param {number} num      // 数字
@param {boolean} bool    // 布尔值
@param {Object} obj      // 对象
@param {Array} arr       // 数组
@param {Function} fn     // 函数
@param {*} any           // 任意类型
```

### 可选参数
```javascript
@param {string} [name]           // 可选参数
@param {string=} name            // 可选参数（另一种写法）
@param {string} [name='默认值']  // 带默认值的可选参数
```

### 多种类型
```javascript
@param {(string|number)} value   // 字符串或数字
@param {string|null} value       // 字符串或null
```

### 数组类型
```javascript
@param {string[]} arr            // 字符串数组
@param {Array<number>} arr       // 数字数组
```

### 对象类型
```javascript
@param {Object} options          // 普通对象
@param {{name: string, age: number}} user  // 具体结构
```

### Promise 类型
```javascript
@param {Promise<string>} promise  // 返回字符串的Promise
@returns {Promise<User>}          // 返回User的Promise
```

## 常见场景示例

### 1. 简单函数
```javascript
/**
 * 计算两个数的和
 *
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 和
 */
function add(a, b) {
  return a + b;
}
```

### 2. 异步函数
```javascript
/**
 * 获取用户信息
 *
 * @async
 * @param {string} userId - 用户ID
 * @returns {Promise<User>} 用户信息
 * @throws {Error} 用户不存在
 */
async function getUser(userId) {
  // ...
}
```

### 3. 带可选参数的函数
```javascript
/**
 * 格式化日期
 *
 * @param {Date} date - 日期对象
 * @param {string} [format='YYYY-MM-DD'] - 格式模板
 * @returns {string} 格式化后的字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  // ...
}
```

### 4. 类型定义
```javascript
/**
 * 用户类型定义
 *
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} name - 用户名称
 * @property {number} [age] - 用户年龄（可选）
 */

/**
 * 创建用户
 *
 * @param {User} userData - 用户数据
 * @returns {User} 创建的用户
 */
function createUser(userData) {
  // ...
}
```

### 5. 泛型函数
```javascript
/**
 * 数组去重
 *
 * @template T
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 去重后的数组
 */
function uniqueArray(arr) {
  return Array.from(new Set(arr));
}
```

### 6. 类方法
```javascript
/**
 * 用户管理类
 *
 * @class UserManager
 */
class UserManager {
  /**
   * 添加用户
   *
   * @public
   * @param {User} user - 用户对象
   * @returns {boolean} 添加成功返回true
   */
  addUser(user) {
    // ...
  }
}
```

### 7. 带示例的函数
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
function deepClone(obj) {
  // ...
}
```

## TypeScript 特有

### 接口属性
```typescript
interface User {
  /**
   * 用户ID
   */
  id: string;
  
  /**
   * 用户名称
   */
  name: string;
}
```

### 枚举
```typescript
/**
 * 用户角色
 *
 * @enum {string}
 */
enum UserRole {
  /**
   * 普通用户
   */
  USER = 'user',
  
  /**
   * 管理员
   */
  ADMIN = 'admin'
}
```

## 最佳实践速查

✅ **推荐做法**
- 使用中文描述
- 第一行写简短描述
- 所有参数都要说明
- 复杂函数提供示例
- 异常情况用 `@throws` 说明

❌ **避免做法**
- 注释重复代码逻辑
- 使用模糊词汇（"处理一下"）
- 遗漏参数说明
- 过于冗长的描述
- 使用英文（除非明确要求）

## 快速检查清单

提交代码前检查：
- [ ] 公开函数有 JSDoc 注释
- [ ] 使用中文描述
- [ ] `@param` 标签完整
- [ ] `@returns` 标签完整
- [ ] 异常用 `@throws` 说明
- [ ] 复杂逻辑有 `@example`

## 参考资源

- [JSDoc 官方文档](https://jsdoc.app/)
- [JSDoc 速查表](https://devhints.io/jsdoc)
- [TSDoc 规范](https://tsdoc.org/)