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
          { text: "工程实践深度复盘", link: "/retrospectives/" },
        ],
      },
      {
        text: "💎 职能部门 (Departments)",
        items: [
          { text: "总览 (Skills Index)", link: "/skills/" },
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
            text: "🎨 视觉与设计 (Visual)",
            collapsed: true,
            items: [
              { text: "智能绘图引擎", link: "/skills/visual/smart-image-generator" },
              { text: "电影级分镜", link: "/skills/visual/cinematic-storyboard/SKILL" },
              { text: "前端 UI/UX 设计", link: "/skills/visual/frontend-design" },
              { text: "Remotion 视频创作", link: "/skills/visual/remotion_master" },
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
        text: "经验萃取与深度复盘",
        items: [
          { text: "总览", link: "/retrospectives/" },
          { text: "架构", link: "/retrospectives/arch/" },
          { text: "构建", link: "/retrospectives/build/" },
          { text: "前端", link: "/retrospectives/frontend/" },
          { text: "运维", link: "/retrospectives/ops/" },
          { text: "规则", link: "/retrospectives/rules/" },
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
