import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

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
  vite: {
    plugins: [
      llmstxt({
        title: "Candle Cortex",
        description: "Standardized AI Context Engineering & Long-term Memory Infrastructure.",
      })
    ]
  },
  head: [["link", { rel: "icon", href: "/AI_Common/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "AI Team 看板", link: "/ai-team" },
      { text: "路由总览", link: "/router" },
      { text: "规则中心", link: "/rules/" },
      { text: "技能库", link: "/skills/" },
      { text: "关于我", link: "/about" },
    ],
    sidebar: [
      {
        text: "🧠 核心配置 (Core)",
        items: [
          { text: "AI Team 看板", link: "/ai-team" },
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
          { text: "标准化操作规范 (SOP)", link: "/rules/workflow" },
          { text: "Vibe 编程规则", link: "/rules/vibe_rules" },
        ],
      },
      {
        text: "💎 职能部门 (Departments)",
        items: [
          { text: "总览 (Skills Index)", link: "/skills/" },
          { text: "Skills GitHub 仓库总表", link: "/skills/github_repos" },
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
              { text: "该分组已迁移（待补充映射）", link: "/skills/" },
            ]
          },
          {
            text: "📢 账号运营部 (Ops)",
            collapsed: true,
            items: [
              { text: "运营总览", link: "/skills/ops/" },
              { text: "小红书矩阵运营", link: "/skills/ops/xhs" },
              { text: "GitHub 运营助手", link: "/skills/ops/github" },
              { text: "GitLab 管理员", link: "/skills/ops/gitlab" },
            ]
          },
          {
            text: "🛠️ 工程与自动化 (Eng)",
            collapsed: true,
            items: [
              { text: "Vercel 一键部署", link: "/skills/vercel_oneclick_deploy" },
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
            ]
          },
          {
            text: "📚 知识管理 (Knowledge)",
            collapsed: true,
            items: [
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
            text: "📚 规则复盘 (Rules)",
            collapsed: true,
            items: [
              { text: "规则复盘总览", link: "/retrospectives/rules/" },
              { text: "交互协议复盘", link: "/retrospectives/rules/interaction" },
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
