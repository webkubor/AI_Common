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
    const res = await fetch("/AI_Common/data/ai_team_status.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    data.value = await res.json();
  } catch (e) {
    error.value = "加载失败: " + (e && e.message ? e.message : String(e));
  } finally {
    loading.value = false;
  }
});

function statusTone(member) {
  if (member.type === "offline") return "tone-offline";
  if (member.type === "queued") return "tone-queued";
  if (member.isCaptain) return "tone-captain";
  return "tone-active";
}
</script>

<template>
  <div class="fleet-dashboard">
    <section class="hero-panel">
      <div class="hero-head">
        <p class="hero-kicker">AI TEAM LIVE BOARD</p>
        <h2>当前执行态势</h2>
        <p class="meta">最后同步: {{ timeText }}</p>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="label">进行中成员</div>
          <div class="value active">{{ currentMembers.length }}</div>
        </div>
        <div class="summary-card">
          <div class="label">离线历史</div>
          <div class="value offline">{{ historyMembers.length }}</div>
        </div>
        <div class="summary-card">
          <div class="label">队长节点</div>
          <div class="value">{{ captain ? captain.member : "暂无" }}</div>
        </div>
      </div>
    </section>

    <div v-if="loading" class="state-card">正在加载看板数据…</div>
    <div v-else-if="error" class="state-card error">{{ error }}</div>
    <template v-else>
      <section class="section-head">
        <h3>进行中的成员</h3>
        <p>主视图仅保留当前正在执行任务的成员。</p>
      </section>

      <div class="cards">
        <div
          v-for="member in currentMembers"
          :key="member.member"
          class="member-card"
          :class="[statusTone(member), { captain: member.isCaptain }]"
        >
          <header class="card-header">
            <h3>{{ member.member }}</h3>
            <span class="agent">{{ member.agent }}</span>
          </header>

          <p v-if="member.isCaptain" class="captain-badge">队长节点</p>
          <p class="task">{{ member.task || "待补充任务" }}</p>

          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: member.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ member.progress }}%</span>
          </div>

          <ul class="meta-list">
            <li><strong>状态:</strong> {{ member.status }}</li>
            <li><strong>路径:</strong> {{ member.workspace }}</li>
            <li><strong>领命时间:</strong> {{ member.since }}</li>
          </ul>
        </div>
      </div>

      <details class="history-panel">
        <summary>历史成员（离线）{{ historyMembers.length }} 人</summary>
        <div class="history-list">
          <div v-for="member in historyMembers" :key="member.member" class="history-row">
            <div>
              <strong>{{ member.member }}</strong>
              <span class="history-agent">{{ member.agent }}</span>
            </div>
            <p>{{ member.task }}</p>
            <small>{{ member.status }} · {{ member.since }}</small>
          </div>
        </div>
      </details>
    </template>
  </div>
</template>

<style scoped>
.fleet-dashboard {
  --board-bg: linear-gradient(160deg, rgba(16, 185, 129, 0.08), rgba(14, 165, 233, 0.05) 42%, transparent 100%);
  --ink: #1f2937;
  margin-top: 12px;
  font-family: "Avenir Next", "PingFang SC", "Helvetica Neue", sans-serif;
  color: var(--ink);
}

.hero-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 16px;
  background: var(--board-bg);
  margin-bottom: 14px;
}

.hero-kicker {
  margin: 0 0 4px;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #0f766e;
  font-weight: 700;
}

.hero-head h2 {
  margin: 0;
  font-size: 24px;
  font-family: "Georgia", "Times New Roman", serif;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.summary-card {
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
}

.label {
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
  word-break: break-word;
}

.value.active {
  color: #047857;
}

.value.offline {
  color: #64748b;
}

.meta {
  margin: 6px 0 0;
  color: #475569;
}

.state-card {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
}

.state-card.error {
  color: #b42318;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}

.section-head h3 {
  margin: 12px 0 2px;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 20px;
}

.section-head p {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 13px;
}

.member-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 14px;
  background: linear-gradient(165deg, #f8fafc, #ffffff);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.member-card.captain {
  border-color: #0ea5e9;
}

.tone-active {
  border-left: 4px solid #10b981;
}

.tone-captain {
  border-left: 4px solid #0284c7;
  box-shadow: 0 0 0 1px rgba(2, 132, 199, 0.15) inset;
}

.tone-queued {
  border-left: 4px solid #d97706;
}

.tone-offline {
  border-left: 4px solid #94a3b8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-family: "Georgia", "Times New Roman", serif;
}

.agent {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
}

.captain-badge {
  display: inline-block;
  margin: 8px 0 0;
  font-size: 12px;
  color: #0369a1;
  font-weight: 700;
}

.task {
  margin: 8px 0 10px;
  line-height: 1.5;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 11px;
  background: rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #22c55e 65%, #84cc16);
}

.progress-text {
  font-size: 12px;
  color: #334155;
  font-weight: 700;
}

.meta-list {
  margin: 10px 0 0;
  padding-left: 18px;
}

.meta-list li {
  margin: 2px 0;
}

.history-panel {
  margin-top: 14px;
  border: 1px dashed rgba(100, 116, 139, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
}

.history-panel summary {
  cursor: pointer;
  font-weight: 700;
}

.history-list {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.history-row {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px;
  background: rgba(248, 250, 252, 0.75);
}

.history-row p {
  margin: 6px 0;
  font-size: 13px;
}

.history-row small {
  color: #64748b;
}

.history-agent {
  font-size: 12px;
  color: #475569;
  margin-left: 8px;
}
</style>
