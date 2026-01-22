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
          { text: '技术栈偏好', link: '/tech_stack' },
          { text: '项目索引', link: '/project_index' }
        ]
      },
      {
        text: '规则中心',
        items: [
          { text: '总览', link: '/rules/' },
          { text: '编码规范', link: '/rules/coding_rules' },
          { text: 'Git 提交规范', link: '/rules/git_commit_rules' },
          { text: '隐私与忽略规范', link: '/rules/privacy_excludes' },
          { text: '标准工作流', link: '/rules/standard_workflow' },
          { text: 'Vibe 编程规则', link: '/rules/vibe_rules' },
          { text: '工作流复盘', link: '/rules/workflow_retro' },

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
          { text: 'Milvus 工具集', link: '/extensions/milvus-toolkit' },
          { text: '浏览器自动化控制', link: '/extensions/browser-control' },
          { text: 'Web 应用测试', link: '/extensions/webapp-testing/' },
          { text: '内部沟通', link: '/extensions/internal-comms/' },
          { text: 'Slack GIF 生成器', link: '/extensions/slack-gif-creator/' }
        ]
      }
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '最后更新于'
  }
});
