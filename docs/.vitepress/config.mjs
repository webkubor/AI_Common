import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "小烛的外部大脑",
  description: "小烛 (Candle) 的外部大脑：集成标准化操作规范 (SOP)、工程实践深度复盘与知识路由的 统一协同中枢。",
  base: "/AI_Common/",
  srcExclude: [
    "**/secrets/**",
    "**/operation-logs/**",
    "**/scripts/**",
    "**/snippets/git_repos_inventory.md"
  ],
  head: [["link", { rel: "icon", href: "/AI_Common/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "路由总览", link: "/router" },
      { text: "规则中心", link: "/rules/" },
      { text: "技能库", link: "/skills/" },
      { text: "关于我", link: "/about" },
    ],
    sidebar: [
      {
        text: "🧠 核心配置 (Core)",
        items: [
          { text: "首页", link: "/" },
          { text: "路由总览", link: "/router" },
          { text: "技术栈偏好", link: "/tech_stack" },
          { text: "代码片段", link: "/snippets/" },
        ],
      },
      {
        text: "📏 规则中心 (Rules)",
        items: [
          { text: "总览", link: "/rules/" },
          { text: "编码规范", link: "/rules/coding_rules" },
          { text: "Git 提交规范", link: "/rules/git_commit_rules" },
          { text: "隐私与忽略规范", link: "/rules/privacy_excludes" },
          { text: "JSDoc 注释规范", link: "/rules/jsdoc_rules/" },
          { text: "标准化操作规范 (SOP)", link: "/rules/workflow" },
          { text: "Vibe 编程规则", link: "/rules/vibe_rules" },
        ],
      },
      {
        text: "💎 职能部门 (Departments)",
        items: [
          { text: "总览 (Skills Index)", link: "/skills/" },
          {
            text: "🤖 Agent 参谋矩阵",
            collapsed: true,
            items: [
              { text: "矩阵总览", link: "/agents/" },
              { text: "Claude (工程专家)", link: "/agents/claude/manifest" },
              { text: "Gemini (视觉与通用)", link: "/agents/gemini/manifest" },
              { text: "Codex (代码审计)", link: "/agents/codex/manifest" },
            ]
          },
          {
            text: "🧠 核心参谋部 (Core)",
            collapsed: true,
            items: [
              { text: "深度思考 Think", link: "/skills/core/think-skill" },
              { text: "技能孵化器", link: "/skills/core/skill-creator" },
              { text: "通用能力协议", link: "/skills/core/common_manifest" },
            ]
          },
          {
            text: "✍️ 内容创作部 (Writers)",
            collapsed: true,
            items: [
              { text: "掘金写作助手", link: "/skills/writers/juejin" },
              { text: "微信公众号助手", link: "/skills/writers/wechat" },
              { text: "飞书文档助手", link: "/skills/writers/feishu" },
              { text: "内部沟通专家", link: "/skills/writers/internal-comms" },
            ]
          },
          {
            text: "📢 账号运营部 (Ops)",
            collapsed: true,
            items: [
              { text: "掘金发布助手", link: "/skills/ops/juejin" },
              { text: "小红书矩阵运营", link: "/skills/ops/xhs" },
              { text: "GitHub 运营助手", link: "/skills/ops/github" },
              { text: "GitLab 管理员", link: "/skills/ops/gitlab" },
            ]
          },
          {
            text: "🛠️ 工程与自动化 (Eng)",
            collapsed: true,
            items: [
              { text: "Web 应用测试", link: "/skills/engineering/webapp-testing" },
              { text: "Supabase Master", link: "/skills/engineering/supabase-master" },
              { text: "PWA 离线方案", link: "/skills/engineering/pwa-master" },
              { text: "图床大师", link: "/skills/engineering/image-hosting-master" },
              { text: "VitePress 初始化", link: "/skills/engineering/vitepress-init" },
            ]
          },
          {
            text: "🎨 视觉与设计 (Visual & Design)",
            collapsed: true,
            items: [
              { text: "📏 Logo 设计标准", link: "/ucd/logo_design_standard" },
              { text: "📏 人设系统 (Persona)", link: "/ucd/persona_system" },
              { text: "📏 品牌一致性 DoD", link: "/checklists/brand_consistency_dod" },
              { text: "📏 掘金封面规范", link: "/ucd/juejin_tech_covers" },
              { text: "📏 Slack 动图标准", link: "/ucd/slack_gif_standard" },
              { text: "🛠️ 智能绘图引擎", link: "/skills/visual/smart-image-generator" },
              { text: "🛠️ 电影级分镜", link: "/skills/visual/cinematic-storyboard/SKILL" },
              { text: "🛠️ 前端 UI/UX 设计", link: "/skills/visual/frontend-design" },
              { text: "🛠️ Remotion 视频创作", link: "/skills/visual/remotion_master" },
            ]
          },
          {
            text: "📚 知识管理 (Knowledge)",
            collapsed: true,
            items: [
              { text: "自动复盘与 GC", link: "/skills/knowledge/auto-retro" },
              { text: "Milvus 工具集", link: "/skills/knowledge/milvus-toolkit" },
              { text: "碎片知识管家", link: "/skills/knowledge/snippet_master" },
            ]
          }
        ]
      },
      {
        text: "🕒 深度复盘 (Retrospectives)",
        items: [
          { text: "复盘总览", link: "/retrospectives/" },
          {
            text: "🏛️ 架构演进 (Arch)",
            collapsed: true,
            items: [
              { text: "总览", link: "/retrospectives/arch/" },
              { text: "SDK 架构转型", link: "/retrospectives/2026-02-06-chatbot-sdk-transformation" },
              { text: "Blob 性能优化", link: "/retrospectives/arch/blob-performance" },
              { text: "Schema 归一化", link: "/retrospectives/arch/schema-unification" },
              { text: "SSOT 资产管理", link: "/retrospectives/arch/ssot-assets" },
            ]
          },
          {
            text: "🏗️ 构建与部署 (Build)",
            collapsed: true,
            items: [
              { text: "总览", link: "/retrospectives/build/" },
              { text: "Vite PWA 实践", link: "/retrospectives/build/vite-pwa" },
            ]
          },
          {
            text: "🎨 前端实践 (Frontend)",
            collapsed: true,
            items: [
              { text: "总览", link: "/retrospectives/frontend/" },
              { text: "支付组件重构", link: "/retrospectives/2026-02-02-th-payment-web-refactor" },
              { text: "Mermaid 语法支持", link: "/retrospectives/frontend/mermaid-syntax" },
              { text: "Tailwind v4 升级", link: "/retrospectives/frontend/tailwind-v4" },
              { text: "Vue 结构重构", link: "/retrospectives/frontend/vue-refactor" },
            ]
          },
          {
            text: "⚙️ 运维与规则 (Ops)",
            collapsed: true,
            items: [
              { text: "总览", link: "/retrospectives/ops/" },
              { text: "视觉标准重构", link: "/retrospectives/2026-02-05-persona-and-visual-standard-refactor" },
              { text: "GitHub 认证修复", link: "/retrospectives/ops/github_auth_push_fail" },
              { text: "Playwright 脚手架", link: "/retrospectives/ops/playwright-scaffold" },
              { text: "外部大脑 2.0", link: "/retrospectives/ops/refactor_external_brain_2026_02_05" },
            ]
          },
        ],
      },
    ],

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "最后更新于",
  },
});
