## 📝 [2026-01-19] Playwright 临时运行的最佳实践
- **问题现象**: 试图直接使用 `npx playwright-cli` 或 `npx playwright` 带参数截图时，因版本参数废弃 (`--screenshot` flag removed) 和依赖未安装 (`npm install` warning) 导致失败。
- **根本原因**: Playwright CLI 主要用于安装浏览器或生成代码，而非直接执行复杂的自动化任务。且全局 npx 运行极易受环境脏数据影响。
- **解决方案 (The "Scaffold" Pattern)**:
  不要纠结于 CLI 参数，直接创建一个临时环境运行脚本：
  ```bash
  mkdir -p temp-pw && cd temp-pw && npm init -y && npm install playwright
  # 写入 node 脚本控制浏览器
  node script.js
  # 清理
  cd .. && rm -rf temp-pw
  ```
- **行动准则**: 当需要临时调用浏览器能力（且项目未配置 Playwright）时，**直接生成脚本**，严禁尝试猜测 CLI 参数。
