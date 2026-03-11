---
title: AI Team 大面板
description: CortexOS AI Team 独立态势大面板
layout: page
sidebar: false
aside: false
outline: false
pageClass: team-dashboard-page
---

<script setup>
import FleetDashboard from '../.vitepress/theme/components/FleetDashboard.vue'
</script>

<style>
/* 🔴 强行杀死 VitePress 文档 UI，实现全屏沉浸 */
.team-dashboard-page .VPNav,
.team-dashboard-page .VPFooter,
.team-dashboard-page .VPLocalNav {
  display: none !important;
}

.team-dashboard-page .VPContent {
  padding-top: 0 !important;
  background: #000 !important;
}

.team-dashboard-page .VPCentere,
.team-dashboard-page .container {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 强制 Body 溢出隐藏，像个真正的 App */
html.team-dashboard-page,
body.team-dashboard-page {
  overflow: hidden !important;
  background: #000 !important;
}
</style>

<div class="immersive-wrapper">
  <FleetDashboard />
</div>
