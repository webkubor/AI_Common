<template>
  <section class="aureate-hero">
    <div class="aureate-hero-media">
      <img src="/CortexOS/images/aureate-hero.png" alt="Aureate Industrial Control" class="hero-img" />
      <div class="aureate-overlay"></div>
    </div>
    
    <div class="aureate-content">
      <div class="aureate-badge">AUREATE PROTOCOL v2.5</div>
      <h1 class="aureate-title">CORTEX COMMAND DECK</h1>
      <p class="aureate-subtitle">
        Industrial Grade Intelligence · Agentic Neural Hub · Barbaric Minimalism
      </p>
      
      <div class="aureate-stats-strip">
        <div class="stat-item"><span class="label">SECURE_TUNNEL:</span> <span class="value">ESTABLISHED</span></div>
        <div class="stat-item"><span class="label">NEURAL_DENSITY:</span> <span class="value">OPTIMIZED</span></div>
        <div class="stat-item"><span class="label">UCD_LOCK:</span> <span class="value">ACTIVE</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aureate-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  min-height: 320px;
  background: #000;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.aureate-hero-media {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.1);
  opacity: 0.7;
}

.aureate-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.9) 100%),
              radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.aureate-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  z-index: 2;
  font-family: var(--vp-font-family-mono);
}

.aureate-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f59e0b;
  color: #000;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.aureate-title {
  font-size: clamp(32px, 5vw, 48px) !important;
  font-weight: 900 !important;
  color: #fff;
  letter-spacing: -0.04em;
  margin: 0 0 8px 0 !important;
  border: none !important;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.aureate-subtitle {
  color: #94a3b8;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.aureate-stats-strip {
  display: flex;
  gap: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 20px;
}

.stat-item {
  font-size: 11px;
}

.stat-item .label {
  color: #64748b;
  margin-right: 8px;
}

.stat-item .value {
  color: #34d399;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.4);
}

@media (max-width: 768px) {
  .aureate-hero { aspect-ratio: 16 / 9; }
  .aureate-stats-strip { display: none; }
  .aureate-content { bottom: 20px; left: 20px; right: 20px; }
}
</style>
