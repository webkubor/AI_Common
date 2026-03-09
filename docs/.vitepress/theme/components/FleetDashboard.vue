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
  if (!data.value.generatedAt) return "OFFLINE";
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
    if (!res.ok) throw new Error("HTTP 404 / 500");
    data.value = await res.json();
  } catch (e) {
    error.value = "NEURAL_LINK_FAILED: " + (e && e.message ? e.message : String(e));
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
  <div class="aureate-dashboard">
    <!-- 顶部状态栏 -->
    <header class="aureate-status-bar">
      <div class="status-summary">
        <div class="summary-node">
          <span class="label">NEURAL_ID:</span>
          <span class="value">CORTEX_ARRAY_01</span>
        </div>
        <div class="summary-node">
          <span class="label">ACTIVE_AGENTS:</span>
          <span class="value green">{{ currentMembers.length }}</span>
        </div>
        <div class="summary-node">
          <span class="label">COMMANDER:</span>
          <span class="value amber">{{ captain ? captain.alias : "UNASSIGNED" }}</span>
        </div>
        <div class="summary-node last-sync">
          <span class="label">SYNC_TIME:</span>
          <span class="value">{{ timeText }}</span>
        </div>
      </div>
    </header>

    <!-- 加载与错误状态 -->
    <div v-if="loading" class="aureate-alert">
      <span class="blink">>>></span> ESTABLISHING NEURAL LINK...
    </div>
    <div v-else-if="error" class="aureate-alert error">
      <span>!!!</span> {{ error }}
    </div>

    <template v-else>
      <!-- 全域矩阵 -->
      <section class="aureate-matrix">
        <div class="matrix-header">
          <span class="matrix-title">AGENT_NEURAL_MATRIX</span>
          <span class="matrix-sub">DENSITY: OPTIMIZED</span>
        </div>

        <div class="matrix-grid">
          <div v-for="member in currentMembers" :key="member.member" 
               class="agent-card"
               :class="[statusTone(member), { 'is-working': isWorking(member) }]">
            
            <div class="agent-header">
              <div class="agent-id">
                <span class="agent-alias">{{ member.alias || member.member.split('(')[0] }}</span>
                <span class="agent-role">{{ member.role || 'OP' }}</span>
              </div>
              <div class="agent-pulse" :class="{ 'active': isWorking(member) }"></div>
            </div>

            <div class="agent-task">
              <div class="task-tag">{{ member.agent }}</div>
              <p class="task-text">{{ member.task || "IDLE_AWAITING_COMMAND" }}</p>
            </div>

            <div class="agent-metrics">
              <div class="metric-row">
                <span class="m-label">LOAD:</span>
                <div class="m-track">
                  <div class="m-fill" :style="{ width: member.progress + '%' }" :class="{ 'busy': isWorking(member) }"></div>
                </div>
                <span class="m-value">{{ member.progress }}%</span>
              </div>
              <div class="metric-row">
                <span class="m-label">PATH:</span>
                <span class="m-value truncate" :title="member.workspace">{{ member.workspace }}</span>
              </div>
            </div>
            
            <div class="agent-footer" v-if="member.isCaptain">
              <span class="captain-flag">CORE_COMMANDER_LOCKED</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 归档意识体 -->
      <section class="aureate-archive">
        <div class="archive-header">ARCHIVED_NEURAL_PATTERNS ({{ historyMembers.length }})</div>
        <div class="archive-list">
          <div v-for="member in historyMembers" :key="member.member" class="archive-item">
            <span class="a-name">{{ member.alias || member.member.split('(')[0] }}</span>
            <span class="a-task">{{ member.task }}</span>
            <span class="a-time">{{ member.since }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.aureate-dashboard {
  --amber: #f59e0b;
  --green: #34d399;
  --bg: #000;
  --border: rgba(255, 255, 255, 0.1);
  --grey: #64748b;
  
  font-family: var(--vp-font-family-mono);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  margin-top: 24px;
}

/* Status Bar */
.aureate-status-bar {
  background: var(--bg);
  padding: 12px 20px;
}

.status-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.summary-node {
  font-size: 11px;
}

.summary-node .label { color: var(--grey); margin-right: 8px; }
.summary-node .value { font-weight: 700; }
.value.green { color: var(--green); text-shadow: 0 0 8px rgba(52, 211, 153, 0.4); }
.value.amber { color: var(--amber); text-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }

/* Matrix */
.aureate-matrix {
  background: var(--bg);
  padding: 0;
}

.matrix-header {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  background: rgba(255,255,255,0.02);
}

.matrix-title { font-size: 12px; font-weight: 900; letter-spacing: 0.1em; }
.matrix-sub { font-size: 10px; color: var(--grey); }

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1px;
  background: var(--border);
}

.agent-card {
  background: var(--bg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.agent-card.captain { border-left: 2px solid var(--amber); }

.agent-header {
  display: flex;
  justify-content: space-between;
}

.agent-alias { font-size: 16px; font-weight: 900; margin-right: 8px; }
.agent-role { font-size: 10px; color: var(--grey); border: 1px solid var(--border); padding: 1px 4px; }

.agent-pulse {
  width: 6px; height: 6px; background: #334155;
}
.agent-pulse.active {
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: pulse-dot 1s infinite alternate;
}

@keyframes pulse-dot { from { opacity: 0.4; } to { opacity: 1; } }

.agent-task {
  background: #0a0a0a;
  border: 1px solid var(--border);
  padding: 12px;
}

.task-tag { font-size: 9px; color: var(--grey); margin-bottom: 4px; }
.task-text { font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0; }

.agent-metrics { display: flex; flex-direction: column; gap: 8px; }

.metric-row { display: flex; align-items: center; gap: 12px; font-size: 10px; }
.m-label { color: var(--grey); width: 40px; }
.m-track { flex: 1; height: 2px; background: #1e293b; }
.m-fill { height: 100%; background: #475569; }
.m-fill.busy { background: var(--green); }
.m-value { color: var(--grey); font-size: 10px; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }

.captain-flag {
  font-size: 9px; color: var(--amber); font-weight: 900; letter-spacing: 0.1em;
}

/* Archive */
.aureate-archive { background: var(--bg); border-top: 1px solid var(--border); }
.archive-header { padding: 12px 20px; font-size: 10px; color: var(--grey); background: rgba(255,255,255,0.01); }
.archive-list { padding: 0 20px 20px; }
.archive-item {
  display: flex; gap: 16px; font-size: 11px; padding: 8px 0; border-bottom: 1px dotted var(--border);
  color: #475569;
}
.a-name { font-weight: 700; color: #64748b; width: 80px; }
.a-task { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Global */
.blink { animation: blinker 1s linear infinite; }
@keyframes blinker { 50% { opacity: 0; } }

.aureate-alert {
  padding: 20px;
  background: var(--bg);
  font-size: 12px;
  letter-spacing: 0.1em;
}
</style>
