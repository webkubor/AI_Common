# Git 提交规范（Angular Convention）

> 目标：提交信息可读、可追溯、便于生成变更日志。

格式：`<type>(<scope>): <subject>`

## 1. type（必须）

- `feat`: 新增功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式调整（不影响逻辑）
- `refactor`: 重构（非新增功能/非修 bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程/辅助工具/依赖变动
- `revert`: 回滚

## 2. scope（可选）

影响范围，例如组件名、模块名、文件夹名。

## 3. subject（必须）

- 使用中文
- 动词开头
- 不超过 50 字

示例：
- `fix(pwa): 修复 workbox-window 解析失败`
- `refactor(search): 拆分检索结果渲染逻辑`
- `chore(deps): 升级 pnpm 锁文件`
