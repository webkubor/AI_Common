<script setup>
import { computed } from "vue";

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  deletingTaskId: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["delete", "hover-enter", "hover-leave"]);

function missionStatusClass(status) {
  const text = String(status || "").trim();
  if (text === "执行中") return "working";
  if (text === "待处理") return "pending";
  if (text === "待启动") return "pending";
  if (text === "已完成") return "done";
  return "unknown";
}

function canDeleteMission(task) {
  return String(task?.status || "").trim() === "待启动" && Boolean(String(task?.taskId || "").trim());
}

function normalizePriorityLabel(priority) {
  const text = String(priority || "").trim();
  if (!text || text === "未标注") return "中";
  return text;
}

function priorityClass(priority) {
  const text = normalizePriorityLabel(priority);
  if (text.includes("🔴") || text.includes("紧急") || text.includes("高")) return "high";
  if (text.includes("🟡") || text.includes("中") || text.toLowerCase().includes("medium")) return "medium";
  if (text.includes("🟢") || text.includes("低") || text.toLowerCase().includes("low")) return "low";
  return "plain";
}
</script>

<template>
  <section
    class="mission-glass-card"
    @mouseenter="(e) => emit('hover-enter', e, task)"
    @mouseleave="() => emit('hover-leave')"
  >
    <div class="card-edge"></div>
    <div class="m-top">
      <div class="m-top-left">
        <span class="m-id">{{ task.id }}</span>
        <span
          class="m-priority-orb"
          :class="priorityClass(task.priority)"
          :title="'优先级 ' + normalizePriorityLabel(task.priority)"
        ></span>
      </div>
      <div class="m-top-actions">
        <button
          v-if="canDeleteMission(task)"
          class="mission-delete-btn"
          :disabled="deletingTaskId === task.taskId"
          @click="emit('delete', task)"
          title="删除待启动任务"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
        <div class="m-status-badge" :class="missionStatusClass(task.status)">
          <span class="status-dot"></span>
          {{ task.status }}
        </div>
      </div>
    </div>
    <p class="m-title">{{ task.title }}</p>
    <div class="m-owner">
      <span class="text-ellipsis owner-name" :title="task.owner">{{ task.owner }}</span>
      <span v-if="(task.assigneeAgent || task.assigneeRole) && (task.assigneeAgent !== task.owner)" class="m-owner-meta text-ellipsis" :title="[task.assigneeAgent, task.assigneeRole].filter(Boolean).join(' / ')">
        {{ [task.assigneeAgent, task.assigneeRole].filter(Boolean).join(' / ') }}
      </span>
      <span v-else-if="task.assigneeRole" class="m-owner-meta text-ellipsis" :title="task.assigneeRole">
        {{ task.assigneeRole }}
      </span>
    </div>
    <div v-if="task.workspace" class="m-workspace" :title="'工作路径 ' + task.workspace">工作路径 {{ task.workspace }}</div>
    <div v-if="task.publishedAt" class="m-published-at text-ellipsis" :title="'发布时间 ' + task.publishedAt">发布时间 {{ task.publishedAt }}</div>
  </section>
</template>

<style scoped>
.mission-glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.6);
  padding: 12px 16px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: var(--delay, 0s);
  transition: all 0.4s ease;
}

.mission-glass-card:hover {
  transform: translateX(4px);
  border-color: rgba(245, 200, 123, 0.2);
  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(245, 200, 123, 0.03), 0 12px 32px rgba(0, 0, 0, 0.8);
}

.mission-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.m-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.m-top-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.m-top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-id {
  font-size: 11px;
  font-weight: 800;
  color: #666;
  letter-spacing: 0.1em;
}

.m-priority-orb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.m-priority-orb.high {
  background: #f87171;
  box-shadow: 0 0 10px rgba(248, 113, 113, 0.42);
}

.m-priority-orb.medium,
.m-priority-orb.plain {
  background: #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.38);
}

.m-priority-orb.low {
  background: #4ade80;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.34);
}

.m-status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  letter-spacing: 0.05em;
}

.m-status-badge.working {
  background: rgba(245, 200, 123, 0.1);
  border-color: rgba(245, 200, 123, 0.3);
  color: var(--c-aureate-base, #f5c87b);
}

.m-status-badge.pending {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ddd;
}

.m-status-badge.done {
  background: rgba(107, 214, 163, 0.12);
  border-color: rgba(107, 214, 163, 0.28);
  color: #8ce0b7;
}

.mission-delete-btn {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.025);
  color: rgba(255, 255, 255, 0.38);
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.mission-delete-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  color: #ff8e8e;
  border-color: rgba(255, 102, 102, 0.28);
  background: rgba(255, 102, 102, 0.08);
}

.mission-delete-btn:disabled {
  opacity: 0.45;
  cursor: wait;
}

.mission-delete-btn svg {
  width: 13px;
  height: 13px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.m-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px 0;
  line-height: 1.3;
  letter-spacing: 0.02em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: break-word;
}

.m-owner {
  font-size: 10px;
  color: #777;
  font-family: ui-monospace;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  width: 100%;
}

.owner-name {
  flex-shrink: 0;
  max-width: 50%;
}

.m-owner-meta {
  font-size: 9px;
  color: #6a6a6a;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 8px;
  flex: 1;
}

.m-published-at {
  font-size: 9px;
  color: #6a6a6a;
  font-family: ui-monospace;
  margin-bottom: 4px;
}

.m-workspace {
  font-size: 9px;
  color: #7d7d7d;
  font-family: ui-monospace;
  margin-bottom: 4px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
