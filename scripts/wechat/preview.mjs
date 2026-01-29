
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import article from './articles/2026-01-28-return.mjs';

async function generatePreview() {
  console.log('Generating preview...');
  
  // 模拟图片 URL 为本地路径
  const mockImages = {};
  for (const [key, path] of Object.entries(article.localImages)) {
    // 相对路径调整，假设 preview.html 在 scripts/wechat/ 下，图片在 .playwright-mcp/ 下
    // 实际预览时直接用 file:// 协议打开，所以用绝对路径最稳，或者相对路径
    // 简单起见，直接用原始路径，只需确保浏览器能访问到（在同一根目录下）
    // 我们输出 preview.html 到项目根目录的 tmp/preview.html
    mockImages[key] = '../../' + path; 
  }

  const htmlBody = article.content(mockImages);
  
  const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览: ${article.meta.title}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f0f0f0;
      display: flex;
      justify-content: center;
    }
    .preview-container {
      width: 100%;
      max-width: 677px; /* 微信文章常见宽度 */
      background: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <h1>${article.meta.title}</h1>
    <p style="color: #888; font-size: 14px;">作者: ${article.meta.author}</p>
    <p style="color: #888; font-size: 14px;">摘要: ${article.meta.digest}</p>
    <hr>
    ${htmlBody}
  </div>
</body>
</html>
  `;

  const outputPath = 'tmp/wechat_preview.html';
  await writeFile(outputPath, fullHtml);
  
  console.log(`✅ Preview generated at: ${outputPath}`);
  console.log(`Open it with: open ${outputPath}`);
}

generatePreview().catch(console.error);
