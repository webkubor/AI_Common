<template>
  <div class="user-card">
    <div class="user-avatar">
      <img :src="avatarUrl" :alt="`${user.name}的头像`" />
    </div>

    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <p class="user-role">{{ roleText }}</p>
    </div>

    <div class="user-actions">
      <button
        v-if="!user.isActive"
        @click="handleActivate"
        class="btn btn-activate"
      >
        激活
      </button>
      <button
        v-if="user.isActive"
        @click="handleDeactivate"
        class="btn btn-deactivate"
      >
        停用
      </button>
      <button
        @click="handleEdit"
        class="btn btn-edit"
      >
        编辑
      </button>
    </div>

    <slot name="extra-content"></slot>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户数据接口
 *
 * @interface UserData
 */
interface UserData {
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
   * 用户角色
   */
  role: 'user' | 'admin' | 'super_admin';

  /**
   * 用户是否激活
   */
  isActive: boolean;

  /**
   * 用户头像 URL（可选）
   */
  avatar?: string;
}

/**
 * 用户卡片组件
 *
 * 用于展示用户基本信息，提供激活/停用和编辑功能
 *
 * @component UserCard
 *
 * @example
 * ```vue
 * <UserCard
 *   :user="userData"
 *   @activate="onUserActivate"
 *   @deactivate="onUserDeactivate"
 *   @edit="onUserEdit"
 * >
 *   <template #extra-content>
 *     <p>额外的用户信息</p>
 *   </template>
 * </UserCard>
 * ```
 */

import { computed } from 'vue';

/**
 * 组件 Props 定义
 *
 * @typedef {Object} UserCardProps
 * @property {UserData} user - 用户数据对象
 * @property {boolean} [showActions=true] - 是否显示操作按钮
 */

/**
 * 组件 Props
 *
 * @type {UserCardProps}
 */
const props = withDefaults(
  defineProps<{
    /**
     * 用户数据对象
     */
    user: UserData;

    /**
     * 是否显示操作按钮
     *
     * @default true
     */
    showActions?: boolean;
  }>(),
  {
    showActions: true
  }
);

/**
 * 组件 Emits 定义
 *
 * @typedef {Object} UserCardEmits
 * @property {(userId: string) => void} activate - 激活用户事件
 * @property {(userId: string) => void} deactivate - 停用用户事件
 * @property {(userId: string) => void} edit - 编辑用户事件
 */

/**
 * 组件事件定义
 *
 * @type {UserCardEmits}
 */
const emit = defineEmits<{
  /**
   * 激活用户事件
   *
   * @event activate
   * @param {string} userId - 用户 ID
   */
  (e: 'activate', userId: string): void;

  /**
   * 停用用户事件
   *
   * @event deactivate
   * @param {string} userId - 用户 ID
   */
  (e: 'deactivate', userId: string): void;

  /**
   * 编辑用户事件
   *
   * @event edit
   * @param {string} userId - 用户 ID
   */
  (e: 'edit', userId: string): void;
}>();

/**
 * 计算用户头像 URL
 *
 * @returns {string} 头像 URL
 */
const avatarUrl = computed((): string => {
  return props.user.avatar || '/default-avatar.png';
});

/**
 * 计算用户角色文本
 *
 * @returns {string} 角色显示文本
 */
const roleText = computed((): string => {
  const roleMap = {
    user: '普通用户',
    admin: '管理员',
    super_admin: '超级管理员'
  };
  return roleMap[props.user.role] || '未知角色';
});

/**
 * 处理激活用户操作
 *
 * @throws {Error} 当用户 ID 不存在时抛出异常
 */
const handleActivate = (): void => {
  if (!props.user.id) {
    throw new Error('用户 ID 不能为空');
  }

  emit('activate', props.user.id);
};

/**
 * 处理停用用户操作
 *
 * @throws {Error} 当用户 ID 不存在时抛出异常
 */
const handleDeactivate = (): void => {
  if (!props.user.id) {
    throw new Error('用户 ID 不能为空');
  }

  emit('deactivate', props.user.id);
};

/**
 * 处理编辑用户操作
 *
 * @throws {Error} 当用户 ID 不存在时抛出异常
 */
const handleEdit = (): void => {
  if (!props.user.id) {
    throw new Error('用户 ID 不能为空');
  }

  emit('edit', props.user.id);
};

/**
 * 验证邮箱格式
 *
 * @param {string} email - 待验证的邮箱地址
 * @returns {boolean} 如果邮箱格式正确返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * validateEmail('test@example.com')
 * // 返回: true
 * ```
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 格式化用户名称
 *
 * @param {string} name - 用户名称
 * @param {number} [maxLength=20] - 最大长度
 * @returns {string} 格式化后的名称
 */
const formatName = (name: string, maxLength: number = 20): string => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + '...';
  }
  return name;
};

// 组件挂载时的初始化逻辑
/**
 * 组件挂载时的初始化逻辑
 *
 * @returns {void}
 */
onMounted(() => {
  console.log(`用户卡片组件已挂载，用户 ID: ${props.user.id}`);
});

// 组件卸载时的清理逻辑
/**
 * 组件卸载时的清理逻辑
 *
 * @returns {void}
 */
onUnmounted(() => {
  console.log(`用户卡片组件已卸载，用户 ID: ${props.user.id}`);
});
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 60px;
  margin-right: 16px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.user-email {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #666666;
}

.user-role {
  margin: 0;
  font-size: 12px;
  color: #999999;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-activate {
  background-color: #4caf50;
  color: white;
}

.btn-activate:hover {
  background-color: #45a049;
}

.btn-deactivate {
  background-color: #f44336;
  color: white;
}

.btn-deactivate:hover {
  background-color: #da190b;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-edit:hover {
  background-color: #0b7dda;
}
</style>
