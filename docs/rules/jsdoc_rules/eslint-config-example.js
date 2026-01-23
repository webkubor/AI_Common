/**
 * ESLint 配置示例 - JSDoc/TSDoc 注释规范
 *
 * 此配置文件展示了如何配置 ESLint 以强制执行 JSDoc/TSDoc 注释规范
 *
 * @module eslint.config
 */

import jsdoc from 'eslint-plugin-jsdoc';

/**
 * ESLint 配置对象
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    // 基础配置
    name: 'jsdoc-rules',
    plugins: {
      jsdoc
    },
    rules: {
      // ========== JSDoc 核心规则 ==========

      /**
       * 要求所有函数都有 JSDoc 注释
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-jsdoc': 'warn',

      /**
       * 要求所有参数都有 @param 标签
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-param': 'error',

      /**
       * 要求所有 @param 标签都有描述
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-param-description': 'error',

      /**
       * 要求所有返回值都有 @returns 标签
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-returns': 'error',

      /**
       * 要求所有 @returns 标签都有描述
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-returns-description': 'error',

      /**
       * 要求 @throws 标签有描述
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-throws': 'warn',

      /**
       * 要求 @example 标签存在（对于复杂函数）
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-example': 'off',

      /**
       * 要求 JSDoc 注释有描述
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-description': 'warn',

      /**
       * 检查 @param 标签名称是否与函数参数匹配
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-param-names': 'error',

      /**
       * 检查 @returns 标签是否存在返回值
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-returns-check': 'warn',

      /**
       * 检查 JSDoc 类型语法
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-types': 'error',

      /**
       * 检查 JSDoc 标签的有效性
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-tag-names': 'error',

      /**
       * 检查 JSDoc 注释的格式
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-alignment': 'warn',

      /**
       * 检查 JSDoc 注释的缩进
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-indentation': 'warn',

      /**
       * 检查 JSDoc 注释的空行
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/newline-after-description': 'warn',

      /**
       * 检查 JSDoc 注释的标点符号
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/check-syntax': 'warn',

      /**
       * 要求 @param 标签有类型
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-param-type': 'error',

      /**
       * 要求 @returns 标签有类型
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/require-returns-type': 'error',

      // ========== JSDoc 高级规则 ==========

      /**
       * 检查 JSDoc 注释的完整性
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/valid-types': 'error',

      /**
       * 检查 JSDoc 注释的重复标签
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/no-undefined-types': 'warn',

      /**
       * 检查 JSDoc 注释的拼写
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/match-description': 'off',

      /**
       * 检查 JSDoc 注释的格式一致性
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/sort-tags': 'off',

      /**
       * 检查 JSDoc 注释的空标签
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/no-blank-blocks': 'warn',

      /**
       * 检查 JSDoc 注释的多余标签
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/no-multi-asterisks': 'warn',

      /**
       * 检查 JSDoc 注释的空行
       *
       * @type {'warn'|'error'|'off'}
       */
      'jsdoc/empty-tags': 'warn'
    },
    settings: {
      // JSDoc 插件设置
      jsdoc: {
        /**
         * 模式设置
         *
         * @type {Object}
         */
        mode: 'typescript',

        /**
         * 上下文设置
         *
         * @type {Object}
         */
        contexts: {
          /**
           * 函数上下文
           *
           * @type {Array}
           */
          FunctionDeclaration: true,
          FunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          MethodDefinition: true,
          ArrowFunctionExpression: true
        },

        /**
         * 标签设置
         *
         * @type {Object}
         */
        tagNamePreference: {
          /**
           * 返回值标签偏好
           *
           * @type {string}
           */
          returns: 'returns',
          /**
           * 参数标签偏好
           *
           * @type {string}
           */
          param: 'param',
          /**
           * 异常标签偏好
           *
           * @type {string}
           */
          throws: 'throws'
        },

        /**
         * 类型设置
         *
         * @type {Object}
         */
        preferredTypes: {
          /**
           * 数组类型偏好
           *
           * @type {string}
           */
          array: 'Array',
          /**
           * 对象类型偏好
           *
           * @type {string}
           */
          object: 'Object',
          /**
           * 函数类型偏好
           *
           * @type {string}
           */
          function: 'Function',
          /**
           * Promise 类型偏好
           *
           * @type {string}
           */
          Promise: 'Promise'
        }
      }
    }
  },

  {
    // 针对 TypeScript 文件的特殊配置
    name: 'typescript-jsdoc-rules',
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript 文件可以放宽一些规则，因为类型已经在代码中定义
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/check-types': 'warn'
    }
  },

  {
    // 针对 Vue 文件的特殊配置
    name: 'vue-jsdoc-rules',
    files: ['**/*.vue'],
    rules: {
      // Vue 组件的 script 部分需要 JSDoc 注释
      'jsdoc/require-jsdoc': 'warn',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error'
    }
  },

  {
    // 排除不需要检查的文件
    name: 'ignore-files',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.min.js',
      '**/*.d.ts'
    ]
  }
];

/**
 * 使用说明
 *
 * 1. 安装依赖：
 *    ```bash
 *    npm install -D eslint eslint-plugin-jsdoc
 *    ```
 *
 * 2. 将此文件保存为 `eslint.config.js` 或 `eslint.config.mjs`
 *
 * 3. 在 package.json 中添加脚本：
 *    ```json
 *    {
 *      "scripts": {
 *        "lint": "eslint .",
 *        "lint:fix": "eslint . --fix"
 *      }
 *    }
 *    ```
 *
 * 4. 运行检查：
 *    ```bash
 *    npm run lint
 *    ```
 *
 * 5. 自动修复：
 *    ```bash
 *    npm run lint:fix
 *    ```
 *
 * @example
 * ```javascript
 * // 在项目中使用此配置
 * import jsdoc from 'eslint-plugin-jsdoc';
 *
 * export default [
 *   {
 *     plugins: { jsdoc },
 *     rules: {
 *       'jsdoc/require-jsdoc': 'warn',
 *       'jsdoc/require-param': 'error'
 *     }
 *   }
 * ];
 * ```
 */
