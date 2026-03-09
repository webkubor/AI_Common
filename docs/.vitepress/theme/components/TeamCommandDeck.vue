<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <section class="aureate-command-strip">
    <div class="strip-bg">
      <img :src="withBase('/images/aureate-hero.png')" alt="Hero" class="hero-img" />
      <div class="overlay"></div>
    </div>
    
    <div class="strip-content">
      <div class="brand">
        <span class="kicker">SYSTEM_ID:</span>
        <h1 class="title">CORTEX_COMMAND</h1>
      </div>
      
      <div class="quick-metrics">
        <div class="metric"><span class="m-label">UPLINK:</span> <span class="m-value">SECURE</span></div>
        <div class="metric"><span class="m-label">MODE:</span> <span class="m-value">WAR_ROOM</span></div>
        <div class="metric"><span class="m-label">VERSION:</span> <span class="m-value">AUREATE_2.5</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aureate-command-strip {
  position: relative;
  width: 100%;
  height: 100px; /* 大幅缩小，只占顶部一条 */
  background: #000;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 8px; /* 紧贴下面的矩阵 */
}

.strip-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  filter: grayscale(1) contrast(1.2);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #000 20%, transparent 60%, #000 100%);
}

.strip-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  font-family: var(--vp-font-family-mono);
}

.brand {
  display: flex;
  flex-direction: column;
}

.kicker { font-size: 10px; color: #f59e0b; letter-spacing: 0.2em; }
.title { 
  font-size: 24px !important; 
  font-weight: 900 !important; 
  color: #fff; 
  margin: 0 !important; 
  border: none !important;
  letter-spacing: -0.02em;
}

.quick-metrics {
  display: flex;
  gap: 24px;
}

.metric { font-size: 11px; }
.m-label { color: #64748b; margin-right: 8px; }
.m-value { color: #34d399; font-weight: 700; }

@media (max-width: 768px) {
  .quick-metrics { display: none; }
}
</style>
