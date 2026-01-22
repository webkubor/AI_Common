import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Common',
  description: 'AI Common 外部大脑：知识路由、规则与项目索引的统一入口。',
  base: '/AI_Common/',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '路由总览', link: '/router' },
      { text: '规则中心', link: '/rules/' },
      { text: '扩展能力', link: '/extensions/' },
      { text: '项目索引', link: '/project_index' }
    ],
    sidebar: [
      {
        text: '核心',
        items: [
          { text: '首页', link: '/' },
          { text: '路由总览', link: '/router' },
          { text: 'README', link: '/README' },
          { text: '技术栈偏好', link: '/tech_stack' },
          { text: '项目索引', link: '/project_index' }
        ]
      },
      {
        text: '规则中心',
        items: [
          { text: '总览', link: '/rules/' },
          { text: 'coding_rules', link: '/rules/coding_rules' },
          { text: 'git_commit_rules', link: '/rules/git_commit_rules' },
          { text: 'privacy_excludes', link: '/rules/privacy_excludes' },
          { text: 'standard_workflow', link: '/rules/standard_workflow' },
          { text: 'vibe_rules', link: '/rules/vibe_rules' },
          { text: 'workflow_retro', link: '/rules/workflow_retro' },
          { text: 'figma_mcp_config', link: '/rules/figma_mcp_config' }
        ]
      },
      {
        text: '复盘与经验',
        items: [
          { text: '总览', link: '/retrospectives/' },
          { text: '架构', link: '/retrospectives/arch/' },
          { text: '构建', link: '/retrospectives/build/' },
          { text: '前端', link: '/retrospectives/frontend/' },
          { text: '运维', link: '/retrospectives/ops/' },
          { text: '规则', link: '/retrospectives/rules/' }
        ]
      },
      {
        text: '扩展能力',
        items: [
          { text: '总览', link: '/extensions/' },
          { text: 'milvus-toolkit', link: '/extensions/milvus-toolkit' },
          { text: 'browser-control', link: '/extensions/browser-control' },
          { text: 'webapp-testing', link: '/extensions/webapp-testing/' },
          { text: 'internal-comms', link: '/extensions/internal-comms/' },
          { text: 'slack-gif-creator', link: '/extensions/slack-gif-creator/' }
        ]
      }
    ]
  }
});
