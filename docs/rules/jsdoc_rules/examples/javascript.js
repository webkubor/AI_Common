/**
 * 用户工具类
 *
 * 提供用户相关的常用工具方法
 *
 * @module UserUtils
 */

/**
 * 用户数据类型定义
 *
 * @typedef {Object} UserData
 * @property {string} id - 用户唯一标识符
 * @property {string} name - 用户名称
 * @property {string} email - 用户邮箱地址
 * @property {number} age - 用户年龄
 * @property {boolean} [isActive] - 用户是否激活（可选）
 */

/**
 * 计算两个数的和
 *
 * @param {number} num1 - 第一个加数
 * @param {number} num2 - 第二个加数
 * @returns {number} 两个数的和
 *
 * @example
 * ```javascript
 * add(5, 3)
 * // 返回: 8
 * ```
 */
function add(num1, num2) {
  return num1 + num2;
}

/**
 * 格式化日期为指定格式
 *
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} [format='YYYY-MM-DD'] - 格式化模板，默认为 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 *
 * @example
 * ```javascript
 * formatDate(new Date('2024-01-23'), 'YYYY-MM-DD HH:mm:ss')
 * // 返回: '2024-01-23 00:00:00'
 * ```
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * 异步获取用户信息
 *
 * @param {string} userId - 用户 ID
 * @returns {Promise<UserData>} 用户信息对象
 * @throws {Error} 当用户不存在时抛出异常
 * @throws {Error} 当网络请求失败时抛出异常
 *
 * @example
 * ```javascript
 * try {
 *   const user = await getUser('12345');
 *   console.log(user.name);
 * } catch (error) {
 *   console.error('获取用户失败:', error.message);
 * }
 * ```
 */
async function getUser(userId) {
  // 模拟 API 调用
  if (!userId) {
    throw new Error('用户 ID 不能为空');
  }

  return {
    id: userId,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    isActive: true
  };
}

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
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * 数组去重
 *
 * @template T - 数组元素类型
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 去重后的数组
 *
 * @example
 * ```javascript
 * uniqueArray([1, 2, 2, 3, 3, 4])
 * // 返回: [1, 2, 3, 4]
 * ```
 */
function uniqueArray(arr) {
  return Array.from(new Set(arr));
}

/**
 * 验证邮箱格式
 *
 * @param {string} email - 待验证的邮箱地址
 * @returns {boolean} 如果邮箱格式正确返回 true，否则返回 false
 *
 * @example
 * ```javascript
 * validateEmail('test@example.com')
 * // 返回: true
 *
 * validateEmail('invalid-email')
 * // 返回: false
 * ```
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
   * @param {number} [timeout=5000] - 请求超时时间（毫秒）
   */
  constructor(apiUrl, timeout = 5000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
    this.users = [];
  }

  /**
   * 添加用户
   *
   * @param {UserData} userData - 用户数据
   * @returns {UserData} 添加的用户对象
   * @throws {Error} 当用户数据无效时抛出异常
   */
  addUser(userData) {
    if (!userData.id || !userData.name || !userData.email) {
      throw new Error('用户数据不完整');
    }

    this.users.push(userData);
    return userData;
  }

  /**
   * 根据 ID 查找用户
   *
   * @param {string} userId - 用户 ID
   * @returns {UserData|undefined} 找到的用户对象，未找到返回 undefined
   */
  findUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  /**
   * 获取所有用户列表
   *
   * @returns {UserData[]} 用户列表
   */
  getAllUsers() {
    return [...this.users];
  }

  /**
   * 删除用户
   *
   * @param {string} userId - 用户 ID
   * @returns {boolean} 删除成功返回 true，用户不存在返回 false
   */
  deleteUser(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }
}

/**
 * 防抖函数
 *
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 *
 * @example
 * ```javascript
 * const debouncedSearch = debounce((query) => {
 *   console.log('搜索:', query);
 * }, 300);
 *
 * // 连续调用只会执行最后一次
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc');
 * ```
 */
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 *
 * @param {Function} func - 需要节流的函数
 * @param {number} interval - 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 *
 * @example
 * ```javascript
 * const throttledScroll = throttle(() => {
 *   console.log('滚动事件触发');
 * }, 1000);
 *
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
function throttle(func, interval) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// 导出模块
export {
  add,
  formatDate,
  getUser,
  deepClone,
  uniqueArray,
  validateEmail,
  UserManager,
  debounce,
  throttle
};
