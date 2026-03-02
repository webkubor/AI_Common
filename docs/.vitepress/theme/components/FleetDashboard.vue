<script setup>
import { computed, onMounted, ref } from "vue";

const loading = ref(true);
const error = ref("");
const data = ref({
  generatedAt: "",
  total: 0,
  active: 0,
  offline: 0,
  queued: 0,
  members: [],
});

const currentMembers = computed(() =>
  data.value.members.filter((m) => m.type === "active" || m.type === "queued")
);

const historyMembers = computed(() =>
  data.value.members.filter((m) => m.type === "offline")
);

const captain = computed(() => currentMembers.value.find((m) => m.isCaptain) || null);

const timeText = computed(() => {
  if (!data.value.generatedAt) return "未同步";
  try {
    return new Date(data.value.generatedAt).toLocaleString("zh-CN");
  } catch {
    return data.value.generatedAt;
  }
});

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("/AI_Common/data/ai_team_status.json", { cache: "no-store", headers: { pragma: 'no-cache' } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    data.value = await res.json();
  } catch (e) {
    error.value = "加载失败: " + (e && e.message ? e.message : String(e));
  } finally {
    loading.value = false;
  }
});

function statusTone(member) {
  if (member.type === "offline") return "offline";
  if (member.type === "queued") return "queued";
  if (member.isCaptain) return "captain";
  return "active";
}
</script>

<template>
  <div class="fleet-dashboard">
    <!-- Hero Section -->
    <header class="hero-panel">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-kicker">
          <span class="live-dot"></span>
          AI TEAM LIVE BOARD
        </div>
        <h2 class="hero-title">当前执行态势</h2>
        <p class="hero-meta">最后同步: <span>{{ timeText }}</span></p>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon active-icon">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="summary-info">
            <div class="label">进行中任务</div>
            <div class="value active">{{ currentMembers.length }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon history-icon">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path
                d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="summary-info">
            <div class="label">历史离线</div>
            <div class="value offline">{{ historyMembers.length }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon captain-icon">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="summary-info">
            <div class="label">阵列核心节点</div>
            <div class="value captain">{{ captain ? captain.member : "暂无可调度核心" }}</div>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="state-card loading">
      <div class="spinner"></div> 正在同步阵列数据...
    </div>
    <div v-else-if="error" class="state-card error">
      <svg viewBox="0 0 24 24" fill="none" class="icon">
        <path
          d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      {{ error }}
    </div>
    <template v-else>
      <!-- Active Members -->
      <section class="section-container">
        <header class="section-head">
          <h3 class="section-title">活跃节点</h3>
        </header>

        <div class="cards-grid">
          <div v-for="member in currentMembers" :key="member.member" class="member-card"
            :class="[statusTone(member), { 'is-captain': member.isCaptain }]">
            <div class="card-glow"></div>
            <div class="card-inner">
              <header class="card-header">
                <div class="member-info">
                  <h3 class="member-name">{{ member.member }}</h3>
                  <div class="badges">
                    <span class="badge agent">{{ member.agent }}</span>
                    <span v-if="member.isCaptain" class="badge captain">CAPTAIN NODE</span>
                  </div>
                </div>
                <div class="status-indicator">
                  <span class="status-dot"></span>
                </div>
              </header>

              <div class="task-box">
                <p class="task-desc">{{ member.task || "Waiting for incoming directives..." }}</p>
              </div>

              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">Task Progress</span>
                  <span class="progress-value">{{ member.progress }}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: member.progress + '%' }"></div>
                </div>
              </div>

              <div class="meta-details">
                <div class="meta-row">
                  <span class="meta-label">Path</span>
                  <code class="meta-value path" :title="member.workspace">{{ member.workspace }}</code>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Uptime</span>
                  <span class="meta-value">{{ member.since }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- History -->
      <details class="history-accordion">
        <summary class="history-summary">
          <span class="summary-content">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            离线历史记录 ({{ historyMembers.length }})
          </span>
          <svg viewBox="0 0 24 24" fill="none" class="chevron">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </summary>
        <div class="history-content">
          <div v-for="member in historyMembers" :key="member.member" class="history-item">
            <div class="h-header">
              <strong class="h-name">{{ member.member }}</strong>
              <span class="h-agent">{{ member.agent }}</span>
            </div>
            <p class="h-task">{{ member.task }}</p>
            <div class="h-meta">
              <span>{{ member.since }}</span>
            </div>
          </div>
        </div>
      </details>
    </template>
  </div>
</template>

<style scoped>
.fleet-dashboard {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: var(--vp-font-family-base);
}

/* Base Colors and Variables */
.fleet-dashboard {
  --neon-brand: var(--vp-c-brand-1);
  --neon-brand-dim: var(--vp-c-brand-soft);
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-border);
  --text-main: var(--vp-c-text-1);
  --text-muted: var(--vp-c-text-2);
  --text-dim: var(--vp-c-text-3);

  --color-active: var(--vp-c-brand-1);
  --color-captain: var(--vp-custom-block-warning-text, var(--vp-c-warning-1));
  --color-queued: var(--vp-c-warning-2);
  --color-offline: var(--vp-c-text-3);
}

.icon {
  width: 1.25em;
  height: 1.25em;
}

/* ===== Hero Section ===== */
.hero-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card-border);
  border-radius: 16px;
  background: var(--card-bg);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.05);
}

.hero-glow {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, var(--vp-c-brand-soft) 0%, transparent 60%);
  opacity: 0.8;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--neon-brand);
  margin-bottom: 12px;
}

.live-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--neon-brand);
  box-shadow: 0 0 10px var(--neon-brand);
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-title {
  margin: 0 0 8px 0 !important;
  font-size: 32px !important;
  font-weight: 800 !important;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-main);
  border: none !important;
  padding: 0 !important;
}

.hero-meta {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.hero-meta span {
  font-family: var(--vp-font-family-mono);
  color: var(--text-main);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  position: relative;
  z-index: 1;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--card-border);
  padding: 16px 20px;
  border-radius: 12px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.05);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.summary-icon.active-icon {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.summary-icon.history-icon {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.summary-icon.captain-icon {
  background: var(--vp-c-warning-soft);
  color: var(--color-captain);
}

.summary-info .label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.summary-info .value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  font-family: var(--vp-font-family-mono);
}

.summary-info .value.active {
  color: var(--text-main);
}

.summary-info .value.offline {
  color: var(--text-dim);
}

.summary-info .value.captain {
  color: var(--color-captain);
  font-size: 18px;
}

/* ===== Loading & Error ===== */
.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px dashed var(--card-border);
}

.state-card.error {
  color: var(--vp-c-danger-1);
  border-color: var(--vp-c-danger-soft);
  background: var(--vp-c-danger-soft);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--card-border);
  border-top-color: var(--neon-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Cards Grid Section ===== */
.section-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-head {
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 8px;
}

.section-title {
  margin: 0 !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em;
  color: var(--text-main);
  border: none !important;
  padding: 0 !important;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

.member-card {
  position: relative;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  border-color: var(--neon-brand);
}

.card-inner {
  position: relative;
  padding: 24px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, var(--color-active) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.member-card:hover .card-glow {
  opacity: 0.04;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-name {
  margin: 0 !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  color: var(--text-main);
  line-height: 1.2;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge.agent {
  background: var(--vp-c-default-soft);
  color: var(--text-muted);
}

.badge.captain {
  background: var(--vp-c-warning-soft);
  color: var(--color-captain);
  border: 1px solid var(--vp-c-warning-dimm);
}

.status-indicator {
  padding: 4px;
}

.status-dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--text-dim);
}

/* Card Specific Theme Colors */
.member-card.active .status-dot {
  background-color: var(--color-active);
  box-shadow: 0 0 8px var(--color-active);
}

.member-card.queued .status-dot {
  background-color: var(--color-queued);
}

.member-card.offline .status-dot {
  background-color: var(--color-offline);
}

.member-card.is-captain .status-dot {
  background-color: var(--color-captain);
  box-shadow: 0 0 8px var(--color-captain);
}

.member-card.is-captain {
  border-color: var(--vp-c-warning-dimm);
}

.member-card.is-captain:hover {
  border-color: var(--color-captain);
}

.member-card.is-captain:hover .card-glow {
  background: linear-gradient(180deg, var(--color-captain) 0%, transparent 100%);
}

.task-box {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 14px;
  border: 1px solid var(--card-border);
}

.task-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--vp-font-family-mono);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-value {
  font-size: 13px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--text-main);
}

.progress-track {
  height: 6px;
  background: var(--vp-c-default-soft);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--neon-brand);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-card.is-captain .progress-fill {
  background: var(--color-captain);
}

.meta-details {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px dashed var(--card-border);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.meta-label {
  color: var(--text-muted);
  font-weight: 500;
}

.meta-value {
  color: var(--text-main);
  font-family: var(--vp-font-family-mono);
}

.meta-value.path {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
  background: var(--vp-c-bg-soft);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--card-border);
}

/* ===== History Accordion ===== */
.history-accordion {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.history-accordion:hover {
  border-color: var(--neon-brand-dim);
}

.history-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  list-style: none;
}

.history-summary::-webkit-details-marker {
  display: none;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.summary-content svg {
  color: var(--text-muted);
}

.chevron {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

details[open] .chevron {
  transform: rotate(180deg);
}

.history-content {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--card-border);
  transition: transform 0.2s, border-color 0.2s;
}

.history-item:hover {
  border-color: var(--neon-brand-dim);
  transform: translateX(4px);
}

.h-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.h-name {
  font-size: 15px;
  color: var(--text-main);
}

.h-agent {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--text-muted);
  text-transform: uppercase;
}

.h-task {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  font-family: var(--vp-font-family-mono);
}

.h-meta {
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--vp-font-family-mono);
  margin-top: 4px;
}
</style>
