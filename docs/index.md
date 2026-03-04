---
layout: home
hero:
  name: "CortexOS"
  text: "星际舰队态势感知"
  tagline: "个人外部大脑操作系统"
  image:
    src: /logo.svg
    alt: CortexOS
  actions:
    - theme: brand
      text: 🚀 查阅舰队队列
      link: /guide/feature-matrix
---

<script setup>
import FleetDashboard from './.vitepress/theme/components/FleetDashboard.vue'
</script>

<div class="standalone-dashboard">
  <FleetDashboard />
</div>

<style>
.standalone-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
}
</style>
