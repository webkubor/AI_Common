<template>
  <section class="team-command-deck">
    <div class="deck-noise"></div>
    <div class="deck-beam deck-beam-left"></div>
    <div class="deck-beam deck-beam-right"></div>

    <div class="deck-main">
      <div class="deck-brand">
        <div class="deck-kicker">AI TEAM LOCAL CONTROL</div>
        <div class="deck-title-row">
          <h1 class="deck-title">星际舰队中枢</h1>
          <span class="deck-chip">LOCAL ONLY</span>
        </div>
        <p class="deck-subtitle">本地控制面板 · 队长调度 · 任务池协作 · 实时 SSE 同步</p>
      </div>

      <div class="deck-metrics">
        <div class="deck-metric">
          <span class="metric-label">模式</span>
          <span class="metric-value">WAR ROOM</span>
        </div>
        <div class="deck-metric">
          <span class="metric-label">数据源</span>
          <span class="metric-value">SQLITE</span>
        </div>
        <div class="deck-metric">
          <span class="metric-label">链路</span>
          <span class="metric-value">BRIDGE + SSE</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-command-deck {
  position: relative;
  max-width: 1480px;
  margin: 24px auto 10px;
  padding: 18px 24px;
  border-radius: 26px;
  border: 1px solid rgba(245, 200, 123, 0.16);
  background:
    radial-gradient(circle at top left, rgba(245, 200, 123, 0.12), transparent 26%),
    radial-gradient(circle at top right, rgba(106, 163, 255, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(14, 18, 26, 0.94), rgba(7, 10, 16, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 30px 70px rgba(0, 0, 0, 0.36);
  overflow: hidden;
}

.deck-noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 22px 22px;
}

.deck-beam {
  position: absolute;
  top: -30%;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.22;
  pointer-events: none;
}

.deck-beam-left {
  left: -60px;
  background: rgba(245, 200, 123, 0.5);
}

.deck-beam-right {
  right: -60px;
  background: rgba(83, 148, 255, 0.42);
}

.deck-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.deck-brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.deck-kicker {
  color: rgba(245, 200, 123, 0.82);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.deck-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.deck-title {
  margin: 0;
  color: #f7f9fb;
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.deck-chip {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(245, 200, 123, 0.2);
  background: rgba(245, 200, 123, 0.1);
  color: rgba(245, 200, 123, 0.95);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.deck-subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.64);
  font-size: 13px;
  line-height: 1.6;
}

.deck-metrics {
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.deck-metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 132px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.metric-label {
  color: rgba(148, 163, 184, 0.68);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.metric-value {
  color: #f8fafc;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

@media (max-width: 960px) {
  .team-command-deck {
    margin: 18px 16px 8px;
    padding: 16px 18px;
  }

  .deck-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .deck-title {
    font-size: 28px;
  }

  .deck-metrics {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
