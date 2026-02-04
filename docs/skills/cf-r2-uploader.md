# Cloudflare R2 图床上传技能

## 接口详情
- **URL**: `https://r2-upload-proxy.webkubor.workers.dev/`
- **方法**: `POST`
- **参数**: `file` (Multipart FormData)
- **返回**: `{ "success": boolean, "url": string }`

## 使用场景
- 本地脚本/工具直接上传图片并获取公共访问链接。
- 商户后台图片素材快速同步。

## 示例命令 (cURL)
```bash
curl -X POST -F "file=@/path/to/img.png" https://r2-upload-proxy.webkubor.workers.dev/
```
