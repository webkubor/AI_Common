# JSDoc/TSDoc 中文注释规范

> 目标：统一团队代码注释风格，提高代码可维护性和文档生成质量。

## 1. 基本原则

### 1.1 必须注释的场景
- 所有公开的函数、方法、类、接口
- 复杂的业务逻辑函数
- 工具函数和公共 API
- 带有副作用的函数
- 需要特殊参数说明的函数

### 1.2 注释位置
- 注释必须放在被注释代码的**紧前面**
- 使用 `/**` 开始（两个星号）
- 每行以 `*` 开头，与 `/**` 对齐

## 2. 基本语法

### 2.1 标准格式
```javascript
/**
 * 函数的简短描述（一句话说明功能）
 *
 * 详细描述（可选，可以多行）
 *
 * @param {类型} 参数名 - 参数说明
 * @returns {类型} 返回值说明
 */
```

### 2.2 中文规范
- **优先使用中文**进行注释说明
- 技术术语保持英文（如 API、JSON、Promise 等）
- 描述要清晰、简洁、准确
- 避免使用模糊词汇（如"处理一下"、"弄个"等）

## 3. 常用标签说明

### 3.1 @param - 参数说明
```javascript
/**
 * 计算两个数的和
 *
 * @param {number} num1 - 第一个加数
 * @param {number} num2 - 第二个加数
 * @returns {number} 两个数的和
 */
function add(num1, num2) {
  return num1 + num2;
}
```

### 3.2 @returns - 返回值说明
```javascript
/**
 * 获取用户信息
 *
 * @param {string} userId - 用户 ID
 * @returns {Promise<User>} 用户信息对象
 */
async function getUser(userId) {
  // ...
}
```

### 3.3 @example - 使用示例
```javascript
/**
 * 格式化日期
 *
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} [format='YYYY-MM-DD'] - 格式化模板
 * @returns {string} 格式化后的日期字符串
 *
 * @example
 * ```javascript
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * // 返回: '2024-01-23 10:30:00'
 * ```
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  // ...
}
```

### 3.4 @throws - 异常说明
```javascript
/**
 * 读取配置文件
 *
 * @param {string} filePath - 配置文件路径
 * @returns {Object} 配置对象
 * @throws {Error} 当文件不存在时抛出异常
 * @throws {Error} 当 JSON 解析失败时抛出异常
 */
function readConfig(filePath) {
  // ...
}
```

### 3.5 @type - 类型说明
```javascript
/**
 * 用户配置对象
 *
 * @typedef {Object} UserConfig
 * @property {string} name - 用户名称
 * @property {number} age - 用户年龄
 * @property {boolean} [isAdmin] - 是否为管理员（可选）
 */

/**
 * 创建用户
 *
 * @param {UserConfig} config - 用户配置
 * @returns {User} 用户对象
 */
function createUser(config) {
  // ...
}
```

## 4. TypeScript 特有规范

### 4.1 接口注释
```typescript
/**
 * 用户数据接口
 *
 * @interface User
 */
interface User {
  /**
   * 用户唯一标识
   */
  id: string;
  
  /**
   * 用户名称
   */
  name: string;
  
  /**
   * 用户邮箱
   */
  email: string;
}
```

### 4.2 类注释
```typescript
/**
 * 用户管理类
 *
 * @class UserManager
 */
class UserManager {
  /**
   * 创建用户管理器实例
   *
   * @constructor
   * @param {string} apiUrl - API 基础地址
   */
  constructor(private apiUrl: string) {}
  
  /**
   * 获取用户列表
   *
   * @returns {Promise<User[]>} 用户列表
   */
  async getUsers(): Promise<User[]> {
    // ...
  }
}
```

### 4.3 泛型注释
```typescript
/**
 * 数组去重
 *
 * @template T - 数组元素类型
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 去重后的数组
 */
function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
```

## 5. 注释内容规范

### 5.1 描述部分
- **第一行**：简短描述（一句话概括功能）
- **第二行**：空行
- **后续行**：详细描述（可选）

### 5.2 参数说明
- 参数名与类型之间用空格分隔
- 参数说明前使用 `-` 分隔
- 可选参数用方括号 `[]` 标注

### 5.3 返回值说明
- 明确返回值的类型和含义
- 如果有多种可能的返回值，需要分别说明
- 如果没有返回值，使用 `@returns {void}`

## 6. 最佳实践

### 6.1 保持简洁
```javascript
// ✅ 好的注释
/**
 * 计算数组平均值
 *
 * @param {number[]} numbers - 数字数组
 * @returns {number} 平均值
 */
function average(numbers) {
  // ...
}

// ❌ 不好的注释（过于冗长）
/**
 * 这个函数的作用是接收一个数字类型的数组作为输入参数，
 * 然后遍历这个数组中的所有元素，将它们相加起来，
 * 最后除以数组的长度，计算出平均值并返回。
 */
```

### 6.2 避免重复代码
```javascript
// ❌ 不好的注释（重复代码逻辑）
/**
 * 将字符串转为小写
 * 使用 toLowerCase() 方法
 */
function toLower(str) {
  return str.toLowerCase();
}

// ✅ 好的注释（说明目的和注意事项）
/**
 * 将字符串转为小写
 *
 * 注意：此函数不会处理特殊字符和本地化需求
 */
function toLower(str) {
  return str.toLowerCase();
}
```

### 6.3 使用 @example 提供示例
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

## 7. 工具配置

### 7.1 ESLint 配置
推荐使用 `eslint-plugin-jsdoc` 进行注释检查：

```json
{
  "plugins": ["jsdoc"],
  "rules": {
    "jsdoc/require-jsdoc": "warn",
    "jsdoc/require-param": "error",
    "jsdoc/require-returns": "error",
    "jsdoc/require-description": "warn"
  }
}
```

### 7.2 VSCode 配置
安装 `Document This` 插件，使用快捷键快速生成注释模板。

## 8. 参考资源

- [JSDoc 中文文档](https://jsdoc.zcopy.site/)
- [TSDoc 官方文档](https://tsdoc.org/)
- [TypeScript JSDoc 参考](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

## 9. 工具配置

### 9.1 ESLint 配置
使用 `eslint-plugin-jsdoc` 进行自动检查和强制执行规范：

#### 安装依赖
```bash
npm install -D eslint eslint-plugin-jsdoc
```

#### 基础配置
```javascript
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    plugins: { jsdoc },
    rules: {
      // 要求所有函数都有 JSDoc 注释
      'jsdoc/require-jsdoc': 'warn',
      
      // 要求所有参数都有 @param 标签
      'jsdoc/require-param': 'error',
      
      // 要求所有 @param 标签都有描述
      'jsdoc/require-param-description': 'error',
      
      // 要求所有返回值都有 @returns 标签
      'jsdoc/require-returns': 'error',
      
      // 要求所有 @returns 标签都有描述
      'jsdoc/require-returns-description': 'error',
      
      // 检查 @param 标签名称是否与函数参数匹配
      'jsdoc/check-param-names': 'error',
      
      // 检查 JSDoc 类型语法
      'jsdoc/check-types': 'error',
      
      // 检查 JSDoc 标签的有效性
      'jsdoc/check-tag-names': 'error',
      
      // 检查 JSDoc 注释的格式
      'jsdoc/check-alignment': 'warn',
      
      // 要求 @param 标签有类型
      'jsdoc/require-param-type': 'error',
      
      // 要求 @returns 标签有类型
      'jsdoc/require-returns-type': 'error'
    }
  }
];
```

#### TypeScript 特殊配置
对于 TypeScript 项目，可以放宽一些规则，因为类型已经在代码中定义：

```javascript
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/check-types': 'warn'
    }
  }
];
```

完整配置示例请参考：[ESLint 配置示例](./eslint-config-example.js)

### 9.2 VSCode 插件
推荐安装以下插件以提高开发效率：

#### Document This
- **功能**：快速生成 JSDoc 注释模板
- **快捷键**：`Ctrl+Alt+D` (Windows/Linux) 或 `Cmd+Alt+D` (Mac)
- **安装**：在 VSCode 扩展市场搜索 "Document This"

#### JSDoc
- **功能**：提供 JSDoc 语法高亮和智能提示
- **安装**：在 VSCode 扩展市场搜索 "JSDoc"

#### TypeScript Importer
- **功能**：自动导入类型，减少手动输入
- **安装**：在 VSCode 扩展市场搜索 "TypeScript Importer"

### 9.3 VSCode 配置
在项目根目录创建 `.vscode/settings.json`，添加以下配置：

```json
{
  "editor.quickSuggestions": {
    "comments": true,
    "strings": true,
    "other": true
  },
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "typescript.suggest.autoImports": true,
  "typescript.suggest.completeFunctionCalls": true,
  "files.associations": {
    "*.js": "javascript"
  }
}
```

### 9.4 自动化脚本
在 `package.json` 中添加自动化脚本：

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.ts,.tsx,.vue",
    "lint:fix": "eslint . --ext .js,.ts,.tsx,.vue --fix",
    "lint:jsdoc": "eslint . --ext .js,.ts,.tsx,.vue --rule 'jsdoc/require-jsdoc: error'"
  }
}
```

### 9.5 在线工具
- **JSON to JSDoc**：将 JSON 转换为 JSDoc 类型定义
  - 网址：https://transform.tools/json-to-jsdoc
- **JSDoc 速查表**：快速查阅 JSDoc 标签
  - 网址：https://devhints.io/jsdoc
- **TypeScript JSDoc 参考**：TypeScript 支持的 JSDoc 类型
  - 网址：https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

## 10. 检查清单

在提交代码前，请确认：

- [ ] 所有公开函数都有 JSDoc 注释
- [ ] 注释使用中文描述
- [ ] @param 和 @returns 标签完整
- [ ] 复杂逻辑有详细说明
- [ ] 提供了使用示例（@example）
- [ ] 注释格式符合规范
- [ ] 通过 ESLint 检查
- [ ] 代码已格式化