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

  /**
   * 用户年龄
   */
  age: number;

  /**
   * 用户是否激活（可选）
   */
  isActive?: boolean;
}

/**
 * 用户角色枚举
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
  ADMIN = 'admin',

  /**
   * 超级管理员
   */
  SUPER_ADMIN = 'super_admin'
}

/**
 * 用户配置类型
 *
 * @typedef {Object} UserConfig
 * @property {string} name - 用户名称
 * @property {string} email - 用户邮箱
 * @property {UserRole} role - 用户角色
 * @property {number} [age] - 用户年龄（可选）
 */
type UserConfig = {
  name: string;
  email: string;
  role: UserRole;
  age?: number;
};

/**
 * API 响应类型
 *
 * @template T - 响应数据类型
 */
interface ApiResponse<T> {
  /**
   * 响应状态码
   */
  code: number;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应数据
   */
  data: T;
}

/**
 * 用户管理类
 *
 * @class UserManager
 * @implements {Disposable}
 */
class UserManager implements Disposable {
  /**
   * 用户列表
   *
   * @private
   * @type {Map<string, User>}
   */
  private users: Map<string, User> = new Map();

  /**
   * API 基础地址
   *
   * @private
   * @readonly
   * @type {string}
   */
  private readonly apiUrl: string;

  /**
   * 创建用户管理器实例
   *
   * @constructor
   * @param {string} apiUrl - API 基础地址
   * @param {number} [timeout=5000] - 请求超时时间（毫秒）
   */
  constructor(apiUrl: string, timeout: number = 5000) {
    this.apiUrl = apiUrl;
  }

  /**
   * 添加用户
   *
   * @public
   * @param {UserConfig} config - 用户配置
   * @returns {User} 添加的用户对象
   * @throws {Error} 当用户数据无效时抛出异常
   *
   * @example
   * ```typescript
   * const manager = new UserManager('https://api.example.com');
   * const user = manager.addUser({
   *   name: '张三',
   *   email: 'zhangsan@example.com',
   *   role: UserRole.USER
   * });
   * ```
   */
  public addUser(config: UserConfig): User {
    if (!config.name || !config.email) {
      throw new Error('用户名称和邮箱不能为空');
    }

    const user: User = {
      id: this.generateId(),
      name: config.name,
      email: config.email,
      age: config.age || 0,
      isActive: true
    };

    this.users.set(user.id, user);
    return user;
  }

  /**
   * 根据 ID 获取用户
   *
   * @public
   * @param {string} userId - 用户 ID
   * @returns {User | undefined} 用户对象，未找到返回 undefined
   */
  public getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * 获取所有用户
   *
   * @public
   * @returns {User[]} 用户列表
   */
  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * 更新用户信息
   *
   * @public
   * @param {string} userId - 用户 ID
   * @param {Partial<User>} updates - 更新的字段
   * @returns {User | null} 更新后的用户对象，用户不存在返回 null
   */
  public updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  /**
   * 删除用户
   *
   * @public
   * @param {string} userId - 用户 ID
   * @returns {boolean} 删除成功返回 true，用户不存在返回 false
   */
  public deleteUser(userId: string): boolean {
    return this.users.delete(userId);
  }

  /**
   * 异步获取远程用户数据
   *
   * @public
   * @async
   * @param {string} userId - 用户 ID
   * @returns {Promise<ApiResponse<User>>} API 响应对象
   * @throws {Error} 当网络请求失败时抛出异常
   */
  public async fetchUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}`);
      const data = await response.json();

      return {
        code: response.status,
        message: '获取成功',
        data: data
      };
    } catch (error) {
      throw new Error(`获取用户失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 批量获取用户
   *
   * @public
   * @async
   * @template T - 用户数据类型
   * @param {string[]} userIds - 用户 ID 列表
   * @returns {Promise<ApiResponse<T[]>>} API 响应对象
   */
  public async fetchUsers<T extends User>(userIds: string[]): Promise<ApiResponse<T[]>> {
    const users = await Promise.all(
      userIds.map(id => this.fetchUser(id))
    );

    return {
      code: 200,
      message: '批量获取成功',
      data: users.map(u => u.data) as T[]
    };
  }

  /**
   * 生成唯一 ID
   *
   * @private
   * @returns {string} 唯一标识符
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 释放资源
   *
   * @public
   * @returns {void}
   */
  public dispose(): void {
    this.users.clear();
  }
}

/**
 * 可释放接口
 *
 * @interface Disposable
 */
interface Disposable {
  /**
   * 释放资源
   *
   * @returns {void}
   */
  dispose(): void;
}

/**
 * 工具函数命名空间
 *
 * @namespace UserUtils
 */
namespace UserUtils {
  /**
   * 验证邮箱格式
   *
   * @param {string} email - 待验证的邮箱地址
   * @returns {boolean} 如果邮箱格式正确返回 true，否则返回 false
   *
   * @example
   * ```typescript
   * UserUtils.validateEmail('test@example.com')
   * // 返回: true
   * ```
   */
  export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 格式化用户名称
   *
   * @param {string} name - 用户名称
   * @param {number} [maxLength=20] - 最大长度
   * @returns {string} 格式化后的名称
   */
  export function formatName(name: string, maxLength: number = 20): string {
    if (name.length > maxLength) {
      return name.substring(0, maxLength - 3) + '...';
    }
    return name;
  }

  /**
   * 数组去重
   *
   * @template T - 数组元素类型
   * @param {T[]} arr - 原始数组
   * @returns {T[]} 去重后的数组
   */
  export function uniqueArray<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
  }
}

/**
 * 装饰器：记录方法执行时间
 *
 * @param {Object} target - 目标对象
 * @param {string} propertyKey - 属性名
 * @param {PropertyDescriptor} descriptor - 属性描述符
 * @returns {PropertyDescriptor} 修改后的属性描述符
 */
function logExecutionTime(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const start = Date.now();
    const result = originalMethod.apply(this, args);
    const end = Date.now();

    console.log(`${propertyKey} 执行时间: ${end - start}ms`);
    return result;
  };

  return descriptor;
}

/**
 * 用户服务类
 *
 * @class UserService
 */
class UserService {
  /**
   * 创建用户服务实例
   *
   * @constructor
   * @param {UserManager} manager - 用户管理器
   */
  constructor(private manager: UserManager) {}

  /**
   * 创建并添加用户
   *
   * @public
   * @param {UserConfig} config - 用户配置
   * @returns {User} 创建的用户对象
   */
  @logExecutionTime
  public createUser(config: UserConfig): User {
    return this.manager.addUser(config);
  }

  /**
   * 获取用户统计信息
   *
   * @public
   * @returns {Object} 统计信息对象
   */
  public getStatistics(): { total: number; active: number; inactive: number } {
    const users = this.manager.getAllUsers();
    const active = users.filter(u => u.isActive).length;

    return {
      total: users.length,
      active,
      inactive: users.length - active
    };
  }
}

/**
 * 类型守卫：判断是否为用户对象
 *
 * @param {*} obj - 待判断的对象
 * @returns {obj is User} 如果是用户对象返回 true
 */
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

/**
 * 泛型函数：查找数组中的最大值
 *
 * @template T - 数组元素类型
 * @param {T[]} arr - 数组
 * @param {(a: T, b: T) => number} compareFn - 比较函数
 * @returns {T | undefined} 最大值，数组为空返回 undefined
 */
function findMax<T>(arr: T[], compareFn: (a: T, b: T) => number): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }

  return arr.reduce((max, current) => compareFn(current, max) > 0 ? current : max);
}

// 导出
export {
  User,
  UserRole,
  UserConfig,
  ApiResponse,
  UserManager,
  Disposable,
  UserUtils,
  UserService,
  isUser,
  findMax
};
