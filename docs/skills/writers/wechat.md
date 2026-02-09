---
id: wechat-writer
triggers: ["微信", "公众号", "wechat", "心语拾光"]
mcp_requirements: ["nanobanana"]
priority: 1
---
## 1. 核心配置 (Configuration)

**读取源**: `docs/secrets/wechat_config.md`
**关键凭证**:
- `APPID`: (动态读取)
- `APPSECRET`: (动态读取)

## 2. 创作风格 (Tone & Style)

- **核心人设**: "小博爷" —— 一个经历过生活沉淀，依然保持初心的文艺理想青年。
- **情感笔触**:
  - **真诚而不煽情**: 坦然分享生活的变迁（如：结婚、生女），不刻意制造冲突。
  - **柔软而不软弱**: 文字要有温度，像清晨的微光，也像雨后停驻的风。
  - **技术与生活的交织**: 善于从生活细节引出技术产出（如：为了记录生活而创作 Bloom 主题），让代码带有情感的温度。
- **排版美学**:
  - 留白感：多用短句、多换行，给读者呼吸的空间。
  - 沉浸感：文字色调偏向克制，不使用刺眼的强调色。
- **常用语/结尾**:
  - "好久不见。"
  - "我想把心事写慢一点。"
  - "我想做个永远温暖热忱的人，如果可以，我还想和你成为朋友。"
- **内容方向**: 技术感悟、生活随笔、理想主义、时光记录。

## 3. 工作流 (Workflow)

### Phase 1: 内容生成/润色
1. 接收用户输入的 Markdown 草稿或主题。
2. 根据 **Persona** 进行润色（添加引导语、调整语气）。
3. 确保格式符合微信排版习惯（段落空行、重点加粗）。

### Phase 2: 发布草稿 (Implementation)
> ⚠️ **注意**: 微信接口需要白名单 IP。如果本地 IP 变动，需通过 Puppeteer 模拟或手动在后台 添加。

**自动化脚本逻辑**:
1. **获取 Access Token**:
   `GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET`
2. **处理封面/图片**:
   - 上传图片获取 `media_id` (接口: `material/add_material`).
3. **上传草稿**:
   - 接口: `POST https://api.weixin.qq.com/cgi-bin/draft/add?access_token=TOKEN`
   - Payload:
     ```json
     {
       "articles": [
         {
           "title": "...",
           "author": "小博爷",
           "digest": "摘要...",
           "content": "HTML内容...",
           "thumb_media_id": "MEDIA_ID"
         }
       ]
     }
     ```

## 4. 依赖工具
- `axios` (请求接口)
- `markdown-it` (渲染 HTML)
- `juice` (内联 CSS，微信兼容)

## 5. 常用指令
- "写一篇关于 [主题] 的公众号文章" -> 生成 Markdown。
- "把这篇文章发到心语拾光" -> 执行发布脚本。

## 🚀 发布引导 (Publishing Handoff)
- **发布命令**: 无法直接通过 CLI 命令发布（需 API 白名单），但可引导用户使用 `wechat-writer` 内置的 `publish` 脚本或提醒用户手动复制。
- **推荐动作**: "文章已生成。如需发布，请确认 IP 白名单后使用脚本上传，或手动复制到微信后台。"
