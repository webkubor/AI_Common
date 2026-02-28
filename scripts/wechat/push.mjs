
import article from './articles/2026-01-28-return.mjs';
import { getAccessToken, uploadContentImage, uploadCoverImage, uploadDraft } from './utils.mjs';

/**
 * 微信推送核心逻辑 (肢体插件化)
 */
export async function push(params = {}) {
  const targetArticle = params.article || article;
  console.log(`🚀 肢体启动：开始处理微信推送 [${targetArticle.meta.title}]`);
  
  // 1. 获取 Token
  const token = await getAccessToken();

  // 2. 上传封面
  console.log(`   - 正在上传封面...`);
  const thumbMediaId = await uploadCoverImage(token, targetArticle.meta.cover_image, 'cover.png');

  // 3. 上传正文图片
  const imageUrls = {};
  for (const [key, path] of Object.entries(targetArticle.localImages)) {
    console.log(`   - 正在同步素材 [${key}]...`);
    const url = await uploadContentImage(token, path, key + '.png');
    imageUrls[key] = url;
  }

  // 4. 渲染与上传草稿
  console.log('   - 正在生成远程草稿...');
  const finalHtml = targetArticle.content(imageUrls);
  const payload = {
    articles: [
      {
        title: targetArticle.meta.title,
        author: targetArticle.meta.author,
        digest: targetArticle.meta.digest,
        content: finalHtml,
        thumb_media_id: thumbMediaId
      }
    ]
  };

  const draftId = await uploadDraft(token, payload);
  console.log('✅ 肢体动作完成：微信草稿已就绪。');
  return draftId;
}

// 兼容老爹手动 node push.mjs 的习惯
if (process.argv[1].endsWith('push.mjs')) {
  push().catch(console.error);
}
