<script setup>
const props = defineProps({
  environment: {
    type: Object,
    default: () => ({})
  },
  realtimeStatus: {
    type: String,
    default: "连接中"
  },
  version: {
    type: String,
    default: "V0"
  }
});
</script>

<template>
  <footer class="cli-health-footer">
    <div class="footer-glass-blur"></div>
    <div class="footer-container">
      <div class="health-group">
        <span class="health-label">核心链路体检:</span>
        <div class="health-items">
          <div v-for="(status, key) in environment?.tools" :key="key" class="health-item"
            :class="status?.status">
            <span class="h-dot"></span>
            <span class="h-name">{{ key.toUpperCase() }}</span>
            <!-- 🧪 Tooltip 气泡 -->
            <div v-if="status?.status === 'offline'" class="h-tooltip">
              <div class="h-tooltip-arrow"></div>
              {{ status.reason }}
            </div>
          </div>
        </div>
      </div>

      <div class="footer-system-stats" v-if="environment">
        <div class="stat-item">
          <span class="stat-icon">📦</span>
          <span class="stat-label">SKILLS:</span>
          <span class="stat-value">{{ environment.skillsCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔌</span>
          <span class="stat-label">MCP:</span>
          <span class="stat-value">{{ environment.mcpCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🚀</span>
          <span class="stat-label">NODE:</span>
          <span class="stat-value">{{ environment.nodeVersion || '--' }}</span>
        </div>
      </div>

      <div class="footer-meta">
        <div class="sync-info">
          <span class="sync-label">实时通道: SSE ·</span>
          <span class="sync-status" :class="{ 'is-online': realtimeStatus === '在线' }">{{ realtimeStatus }}</span>
        </div>
        <span class="version-tag">{{ version || 'V5.6.5' }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.cli-health-footer {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: 20px;
  z-index: 100;
  pointer-events: none;
}

.footer-container {
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  border-radius: 22px;
  border: 1px solid rgba(245, 200, 123, 0.12);
  background:
    linear-gradient(180deg, rgba(12, 16, 22, 0.92), rgba(8, 10, 14, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 18px 40px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
  pointer-events: auto;
}

.health-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  min-width: 0;
}

.health-label {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.46);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.health-items {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.health-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.035);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
  cursor: help;
}

.health-item .h-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(30, 10, 10, 0.95);
  color: #ef4444;
  font-size: 11px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.health-item:hover .h-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.h-tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(239, 68, 68, 0.3);
}

.health-item .h-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #333;
}

.health-item .h-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(226, 232, 240, 0.48);
}

/* 🟢 Online State */
.health-item.online {
  border-color: rgba(34, 197, 94, 0.2);
  background: rgba(34, 197, 94, 0.05);
}

.health-item.online .h-dot {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
  animation: h-pulse 2s infinite;
}

.health-item.online .h-name {
  color: #22c55e;
}

/* 🔴 Offline State */
.health-item.offline {
  border-color: rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.05);
}

.health-item.offline .h-dot {
  background: #ef4444;
}

.health-item.offline .h-name {
  color: #ef4444;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-family: ui-monospace, sans-serif;
  white-space: nowrap;
  margin-left: auto;
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  letter-spacing: 0.05em;
}

.sync-label {
  color: rgba(226, 232, 240, 0.46);
}

.sync-status {
  font-weight: 600;
  color: rgba(226, 232, 240, 0.58);
}

.sync-status.is-online {
  color: #22c55e;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.footer-system-stats {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 8px 0 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  white-space: nowrap;
}

.stat-icon {
  font-size: 13px;
  opacity: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.stat-label {
  font-size: 10px;
  color: rgba(226, 232, 240, 0.46);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 11px;
  color: var(--c-aureate-glow, #F5C87B);
  font-weight: bold;
  font-family: ui-monospace, sans-serif;
  text-shadow: 0 0 8px rgba(245, 200, 123, 0.3);
}

.version-tag {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  color: var(--c-aureate-dim, #8B7347);
  background: rgba(139, 115, 71, 0.1);
  border: 1px solid rgba(139, 115, 71, 0.16);
  border-radius: 999px;
}

@keyframes h-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

@media (max-width: 1280px) {
  .footer-container {
    padding: 12px 14px;
  }

  .footer-meta {
    margin-left: 0;
  }
}

@media (max-width: 960px) {
  .cli-health-footer {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }

  .footer-container {
    gap: 12px;
  }

  .health-group,
  .footer-system-stats,
  .footer-meta {
    width: 100%;
  }

  .footer-meta {
    justify-content: space-between;
    white-space: normal;
  }
}
</style>
