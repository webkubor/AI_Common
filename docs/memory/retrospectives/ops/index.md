# 运维复盘 (Ops Retrospectives)

这里记录了环境配置、自动化脚本编写以及跨系统同步的运维经验。

## 📂 复盘列表

- **[安全文件写入法则 (Safe File Write)](./safe-file-write)**
  - 解决 Shell 写入长文本截断问题，确立了“本地生成 + mv 迁移”的黄金法则。

- **[Playwright 临时运行脚手架](./playwright-scaffold)**
  - 摒弃 CLI 参数纠结，采用临时目录 + 脚本方式执行一次性自动化任务的最佳实践。

- **[技能部署同步事故](./skill-sync)**
  - 针对技能安装后本地缓存未同步导致的环境不一致问题，建立的同步检查协议。

- **[GitHub 认证自动推送复盘](./github_auth_push_fail)**
  - 解决了 Token 路径错误和 Markdown 格式污染导致 Git 推送失败的问题，确立了“先验路径 + 正则提取”的鉴权SOP。
