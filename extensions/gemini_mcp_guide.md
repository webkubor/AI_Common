# Gemini MCP Configuration Guide (MCP 配置与管理指南)

## 1. 核心配置文件
Gemini CLI 的所有 MCP Server 配置统一存储在：
`~/.gemini/settings.json`

## 2. 配置结构 (JSON)
在 `mcpServers` 对象下添加新的服务。每个服务需要定义 `command`（执行命令）、`args`（参数）和可选的 `env`（环境变量）。

### 配置模板：
```json
{
  "mcpServers": {
    "服务名称": {
      "command": "npx",
      "args": ["@scope/package-name", "--option"],
      "env": {
        "API_KEY": "your_secret_here"
      }
    }
  }
}
```

## 3. 手动安装与添加步骤
1. **获取包名**: 确认要安装的 MCP Server 的 npm 包名或本地脚本路径。
2. **修改配置**: 使用编辑器打开 `~/.gemini/settings.json`。
3. **追加服务**: 在 `mcpServers` 字段中新增配置项。
4. **重启 CLI**: 保存文件后，重启 Gemini CLI。启动时顶部应显示 `Using: X MCP servers`。

## 4. 实战案例：CloudBase MCP
```json
"cloudbase": {
  "command": "npx",
  "args": ["@cloudbase/cloudbase-mcp@latest"],
  "env": {
    "INTEGRATION_IDE": "Gemini"
  }
}
```

## 5. 验证与调试
- **启动检查**: 观察 CLI 入口处的 `Using: X MCP servers` 数量是否符合预期。
- **工具确认**: 输入 `/help`，检查列表中是否出现了该 Server 提供的对应 Tools。
- **错误定位**: 如果 Server 未加载，检查 `settings.json` 的 JSON 语法是否正确，以及 `command` 是否在系统 PATH 中（或使用绝对路径）。
