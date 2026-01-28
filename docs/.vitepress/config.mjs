import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "AI Common",
  description: "培养您的外部大脑：集成标准化操作规范 (SOP)、工程实践深度复盘与知识路由的统一协同中枢。",
  base: "/AI_Common/",
  head: [["link", { rel: "icon", href: "/AI_Common/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "路由总览", link: "/router" },
      { text: "规则中心", link: "/rules/" },
      { text: "技能库", link: "/skills/" },
      { text: "项目索引", link: "/project_index" },
    ],
    sidebar: [
      {
        text: "核心",
        items: [
          { text: "首页", link: "/" },
          { text: "路由总览", link: "/router" },
          { text: "技术栈偏好", link: "/tech_stack" },
          { text: "项目索引", link: "/project_index" },
          { text: "代码片段", link: "/snippets/" },
        ],
      },
      {
        text: "规则中心",
        items: [
          { text: "总览", link: "/rules/" },
          { text: "编码规范", link: "/rules/coding_rules" },
          { text: "Git 提交规范", link: "/rules/git_commit_rules" },
          { text: "隐私与忽略规范", link: "/rules/privacy_excludes" },
          { text: "标准化操作规范 (SOP)", link: "/rules/standard_workflow" },
          { text: "Vibe 编程规则", link: "/rules/vibe_rules" },
          { text: "工程实践深度复盘", link: "/rules/workflow_retro" },
        ],
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
      {
        text: "专项技能 (Skills)",
        items: [
          { text: "总览", link: "/skills/" },
          { text: "Milvus 智能工具", link: "/skills/milvus-toolkit" },
          { text: "智能复盘与 GC", link: "/skills/auto-retro" },
          { text: "掘金文章撰写", link: "/skills/juejin-writer" },
          { text: "飞书文档协作", link: "/skills/feishu-writer" },
          { text: "Logo 与图形设计", link: "/skills/logo-designer" },
          { text: "前端 UI/UX 设计", link: "/skills/frontend-design" },
          { text: "Remotion 视频创作", link: "/skills/remotion_master" },
          { text: "代码片段大师", link: "/skills/snippet_master" },
          { text: "PWA 离线方案", link: "/skills/pwa-master" },
          { text: "发版与版本管理", link: "/skills/release_master" },
          { text: "Web 应用测试", link: "/skills/webapp-testing" },
          { text: "本质分析 (/think)", link: "/skills/think-skill" },
          { text: "内部沟通与纪要", link: "/skills/internal-comms" },
          { text: "Slack GIF 生成", link: "/skills/slack-gif-creator" },
          { text: "技能创建器", link: "/skills/skill-creator" },
          { text: "VitePress 快速初始化", link: "/skills/vitepress-init" },
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
