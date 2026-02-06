# 图床大师 (Image Hosting Master)

> **核心目标**: 实现跨平台图像资产的“一键分发”。Agent 根据上下文自动选择最优图床，严禁用户手动执行 cURL。

## 🤖 智能路由逻辑 (Routing Logic)
当需要上传图片并获取链接时，Agent 必须遵循以下决策：

1.  **GitHub 图床 (`upic-images`)**:
    *   **适用场景**: 开源项目 Logo、文档配图、追求极长生命周期的静态资产。
    *   **优点**: 免费、全球 CDN (via raw.githubusercontent.com)、易于版本管理。
    *   **存储路径**: `webkubor/upic-images/uPic/YYYY/MM/`

2.  **Cloudflare R2 图床**:
    *   **适用场景**: 临时图片、私有 Web 应用资产、大体积素材。
    *   **优点**: 极速访问、高性能分发。
    *   **上传地址**: `https://r2-upload-proxy.webkubor.workers.dev/` (POST, file parameter)

## 🚀 自动化 SOP (Standard Operating Procedure)
收到上传需求后，Agent 必须**静默且完整**地执行：
1.  **路径识别**: 确定本地文件路径。
2.  **图床选择**: 根据上述逻辑自主决策使用 GitHub 或 R2。
3.  **鉴权与上传**:
    *   若是 GitHub：读取 `docs/secrets/github_token.md` 执行 API 写入。
    *   若是 R2：执行 `curl` 到代理地址。
4.  **链接返回**: 直接返回最终可访问的 HTTPS 链接，严禁只输出“已完成”。

## 示例命令
- **R2**: `curl -X POST -F "file=@/path/to/img.png" https://r2-upload-proxy.webkubor.workers.dev/`
- **GitHub**: 使用 GitHub API PATCH/PUT。
