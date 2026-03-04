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
    const res = await fetch("/CortexOS/data/ai_team_status.json", { cache: "no-store", headers: { pragma: 'no-cache' } });
    if (!res.ok) throw new Error("HTTP 错误 " + res.status);
    data.value = await res.json();
  } catch (e) {
    error.value = "加载失败: " + (e && e.message ? e.message : String(e));
  } finally {
    loading.value = false;
  }
});

function isWorking(member) {
  return member.type === "active" && member.progress > 0 && member.progress < 100;
}

function statusTone(member) {
  if (member.type === "offline") return "offline";
  if (member.type === "queued") return "queued";
  if (member.isCaptain) return "captain";
  return "active";
}
</script>

<template>
  <div class="fleet-dashboard">
    <!-- 顶部状态栏 -->
    <header class="hero-panel">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-kicker">
          <span class="live-dot" :class="{ 'is-working': currentMembers.some(m => isWorking(m)) }"></span>
          CortexOS 阵列指挥部
        </div>
        <h2 class="hero-title">星际舰队实时态势</h2>
        <p class="hero-meta">大脑中枢同步: <span>{{ timeText }}</span></p>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon active-icon" :class="{ 'pulse-bg': currentMembers.some(m => isWorking(m)) }">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="summary-info">
            <div class="label">活跃神经元</div>
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
            <div class="label">归档意识体</div>
            <div class="value offline">{{ historyMembers.length }}</div>
          </div>
        </div>
        <div class="summary-card captain-special">
          <div class="summary-icon captain-icon">
            <svg viewBox="0 0 24 24" fill="none" class="icon">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="summary-info">
            <div class="label">当前指挥官</div>
            <div class="value captain">{{ captain ? captain.member.split('(')[0] : "无核心" }}</div>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="state-card loading">
      <div class="spinner"></div> 正在接入中枢神经系统...
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
      <!-- 活跃节点 -->
      <section class="section-container">
        <header class="section-head">
          <h3 class="section-title">全域节点矩阵</h3>
        </header>

        <div class="cards-grid">
          <div v-for="member in currentMembers" :key="member.member" class="member-card"
            :class="[statusTone(member), { 'is-captain': member.isCaptain, 'is-working': isWorking(member) }]">
            <div class="card-glow"></div>
            <div class="working-flow" v-if="isWorking(member)"></div>
            
            <div class="card-inner">
              <header class="card-header">
                <div class="member-info">
                  <h3 class="member-name">{{ member.member }}</h3>
                  <div class="badges">
                    <span class="badge agent">{{ member.agent }}</span>
                    <span v-if="member.isCaptain" class="badge captain-badge">首席指挥官</span>
                    <span v-if="member.hasTodo" class="badge todo-badge">客观进度背书</span>
                  </div>
                </div>
                <div class="status-indicator">
                  <span class="status-dot" :class="{ 'pulse': isWorking(member) }"></span>
                </div>
              </header>

              <div class="task-box">
                <div class="task-header" v-if="isWorking(member)">
                  <span class="working-label">正在执行...</span>
                </div>
                <p class="task-desc">{{ member.task || "等候指令..." }}</p>
              </div>

              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">当前神经负荷</span>
                  <span class="progress-value" :class="{ 'text-green-400': member.progress === 100 }">{{ member.progress }}%</span>
                </div>
                <div class="progress-track" :class="{ 'working-track': isWorking(member) }">
                  <div class="progress-fill" 
                       :class="{ 'working-fill': isWorking(member), 'completed-fill': member.progress === 100 }" 
                       :style="{ width: member.progress + '%' }">
                    <div class="progress-stripe" v-if="isWorking(member)"></div>
                  </div>
                </div>
              </div>

              <div class="meta-details">
                <div class="meta-row">
                  <span class="meta-label">物理坐标</span>
                  <code class="meta-value path" :title="member.workspace">{{ member.workspace }}</code>
                </div>
                <div class="meta-row">
                  <span class="meta-label">在线时长</span>
                  <span class="meta-value">{{ member.since }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 历史记录 -->
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
            历史意识体归档 ({{ historyMembers.length }})
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
  gap: 32px;
  font-family: var(--vp-font-family-base);
  --aurora-brand: #a855f7;
  --aurora-glow: rgba(168, 85, 247, 0.4);
  --sea-blue: #06b6d4;
  --sea-glow: rgba(6, 182, 212, 0.4);
  --gold-captain: #f59e0b;
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --panel-bg: rgba(9, 9, 11, 0.8);
}

.icon {
  width: 1.25em;
  height: 1.25em;
}

/* ===== 顶部面板 (Hero Panel) ===== */
.hero-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.hero-glow {
  position: absolute;
  top: -150px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--aurora-glow) 0%, transparent 60%);
  pointer-events: none;
  filter: blur(40px);
  opacity: 0.6;
}

.hero-kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.25em;
  color: var(--aurora-brand);
  margin-bottom: 8px;
  text-transform: uppercase;
  text-shadow: 0 0 10px var(--aurora-glow);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #64748b;
  box-shadow: 0 0 8px #64748b;
}

.live-dot.is-working {
  background-color: var(--sea-blue);
  box-shadow: 0 0 12px var(--sea-blue);
  animation: pulse-dot 1.5s infinite alternate;
}

@keyframes pulse-dot {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 1; }
}

.hero-title {
  margin: 0 !important;
  font-size: 42px !important;
  font-weight: 900 !important;
  color: #ffffff;
  letter-spacing: -0.02em;
  border: none !important;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-meta {
  color: #94a3b8;
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
}
.hero-meta span {
  color: var(--sea-blue);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  position: relative;
  z-index: 2;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 20px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
}

.summary-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
}

.pulse-bg {
  animation: heartbeat-bg 2.5s infinite;
}

@keyframes heartbeat-bg {
  0% { box-shadow: 0 0 0 0 var(--aurora-glow); background: rgba(168, 85, 247, 0.2); }
  70% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); background: rgba(168, 85, 247, 0.1); }
  100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); background: rgba(168, 85, 247, 0.2); }
}

.summary-info .label { font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.summary-info .value { font-size: 26px; font-weight: 900; font-family: var(--vp-font-family-mono); color: #fff; margin-top: 4px; }

/* 队长卡片特别流光 */
.captain-special {
  position: relative;
  background: linear-gradient(var(--panel-bg), var(--panel-bg)) padding-box,
              linear-gradient(135deg, var(--gold-captain), var(--aurora-brand)) border-box;
  border: 1px solid transparent;
}
.captain-special .value.captain {
  background: linear-gradient(90deg, #fcd34d, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.captain-special .summary-icon {
  color: var(--gold-captain);
  background: rgba(245, 158, 11, 0.15);
}

/* ===== 节点矩阵 (Cards Grid) ===== */
.section-head { margin-bottom: 24px; }
.section-title { font-size: 24px !important; font-weight: 800 !important; color: #f8fafc; border: none !important; margin: 0 !important; }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 28px;
}

.member-card {
  position: relative;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.member-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.15);
}

.is-working {
  border-color: rgba(6, 182, 212, 0.3);
}
.is-working:hover {
  border-color: var(--sea-blue);
  box-shadow: 0 20px 40px -10px var(--sea-glow);
}

.is-captain {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, var(--panel-bg) 100%);
}

.card-glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background: radial-gradient(800px circle at top left, rgba(255, 255, 255, 0.03), transparent 40%);
}

/* 顶部工作流扫光 */
.working-flow {
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--sea-blue), #fff, var(--sea-blue), transparent);
  background-size: 200% 100%;
  animation: scan-line 2s linear infinite;
}

@keyframes scan-line {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card-inner { position: relative; z-index: 2; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.member-name { font-size: 22px !important; font-weight: 800 !important; color: #f8fafc !important; margin: 0 0 10px 0 !important; letter-spacing: -0.02em; }

.badges { display: flex; flex-wrap: wrap; gap: 8px; }

.badge {
  font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.04em;
}
.badge.agent { background: rgba(255, 255, 255, 0.1); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.05); }
.badge.captain-badge { background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
.badge.todo-badge { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3); }

.status-indicator { margin-top: 6px; }
.status-dot { display: block; width: 10px; height: 10px; border-radius: 50%; background-color: #475569; }
.status-dot.pulse {
  background-color: var(--sea-blue);
  box-shadow: 0 0 12px var(--sea-blue);
  animation: pulse-dot 1.5s infinite alternate;
}

.task-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px; padding: 20px; margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.working-label {
  font-size: 11px; color: var(--sea-blue); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
  display: block; margin-bottom: 8px; animation: blink 2s infinite; text-shadow: 0 0 8px var(--sea-glow);
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.task-desc {
  font-family: var(--vp-font-family-mono); font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0;
}

/* 进度条动画 */
.progress-section { margin-bottom: 24px; }

.progress-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.progress-label { font-size: 12px; color: #94a3b8; font-weight: 600; }
.progress-value { font-size: 13px; color: #f8fafc; font-weight: 800; font-family: var(--vp-font-family-mono); }

.progress-track {
  height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}

.progress-fill {
  height: 100%; background: #475569; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; border-radius: 10px;
}

.working-fill {
  background: linear-gradient(90deg, var(--aurora-brand), var(--sea-blue));
  box-shadow: 0 0 10px var(--sea-glow);
}

.completed-fill {
  background: linear-gradient(90deg, #10b981, #34d399) !important;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.6) !important;
}

.text-green-400 {
  color: #34d399 !important;
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
}

.progress-stripe {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-image: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent);
  background-size: 20px 20px;
  animation: stripe-move 1s linear infinite;
}

/* ===== 底部物理坐标等 Meta 数据 ===== */
.meta-details { display: flex; flex-direction: column; gap: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }

.meta-row { display: flex; justify-content: space-between; align-items: center; }
.meta-label { font-size: 12px; color: #64748b; font-weight: 600; }

.meta-value { font-size: 13px; color: #94a3b8; font-family: var(--vp-font-family-mono); }
.meta-value.path {
  background: rgba(0, 0, 0, 0.4); padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #cbd5e1;
  max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid rgba(255,255,255,0.05);
}

/* ===== 历史面板 (Accordion) ===== */
.history-accordion {
  margin-top: 24px;
  background: var(--glass-bg);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition: all 0.3s;
}

.history-accordion:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: var(--panel-bg);
}

.history-summary {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 32px; cursor: pointer; user-select: none; list-style: none;
}
.history-summary::-webkit-details-marker { display: none; }

.summary-content {
  display: flex; align-items: center; gap: 14px; font-size: 16px; font-weight: 800; color: #e2e8f0;
}
.summary-content svg { width: 20px; height: 20px; color: #94a3b8; }
.chevron { width: 20px; height: 20px; color: #64748b; transition: transform 0.3s ease; }
details[open] .chevron { transform: rotate(180deg); }

.history-content {
  padding: 0 32px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.history-item {
  display: flex; flex-direction: column; gap: 10px;
  padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.03); transition: all 0.2s;
}
.history-item:hover {
  border-color: rgba(255,255,255,0.1); transform: translateY(-2px); background: rgba(0, 0, 0, 0.3);
}

.h-header { display: flex; align-items: center; gap: 12px; }
.h-name { font-size: 15px; font-weight: 800; color: #e2e8f0; }
.h-agent {
  font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px;
  background: rgba(255,255,255,0.08); color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;
}

.h-task {
  margin: 0; font-size: 13px; line-height: 1.6; color: #94a3b8; font-family: var(--vp-font-family-mono);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.h-meta { font-size: 12px; color: #64748b; font-family: var(--vp-font-family-mono); }
</style>
