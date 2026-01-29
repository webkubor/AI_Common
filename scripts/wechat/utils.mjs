
import { openAsBlob } from 'node:fs';

const APPID = process.env.APPID;
const SECRET = process.env.APPSECRET;

/**
 * 获取微信 Access Token
 */
export async function getAccessToken() {
  if (!APPID || !SECRET) {
    throw new Error('APPID or APPSECRET env var missing');
  }
  const tokenRes = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`);
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

/**
 * 上传永久素材（图片）
 * @param {string} token 
 * @param {string} path 本地路径
 * @param {string} name 文件名
 */
export async function uploadImage(token, path, name) {
  console.log(`Uploading image: ${name} from ${path}...`);
  const form = new FormData();
  const blob = await openAsBlob(path);
  form.append('media', blob, name);
  
  // 使用新增永久素材接口，因为图文内容图片通常需要 url
  // 或者使用 'img' 类型的临时素材？微信对于图文内嵌图推荐使用 'uploadimg' 接口
  // 注意：uploadimg 接口返回 url，不返回 media_id，且不占用素材数量限制，专门用于图文内容
  // 如果是封面图，必须使用 add_material 返回 media_id
  
  // 这里我们统一逻辑：
  // 1. 如果需要 URL (正文图)，用 uploadimg
  // 2. 如果需要 MediaId (封面图)，用 add_material
}

/**
 * 上传图文内嵌图片 (返回 URL)
 */
export async function uploadContentImage(token, path, name) {
  const form = new FormData();
  const blob = await openAsBlob(path);
  form.append('media', blob, name);
  
  const res = await fetch(`https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${token}`, {
    method: 'POST',
    body: form
  });
  const data = await res.json();
  if (!data.url) throw new Error(`Upload content image failed: ${JSON.stringify(data)}`);
  return data.url;
}

/**
 * 上传封面图片 (返回 Media ID)
 */
export async function uploadCoverImage(token, path, name) {
  const form = new FormData();
  const blob = await openAsBlob(path);
  form.append('media', blob, name);
  
  const res = await fetch(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`, {
    method: 'POST',
    body: form
  });
  const data = await res.json();
  if (!data.media_id) throw new Error(`Upload cover image failed: ${JSON.stringify(data)}`);
  return data.media_id;
}

/**
 * 上传草稿
 */
export async function uploadDraft(token, articlePayload) {
  const res = await fetch(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articlePayload)
  });
  const data = await res.json();
  if (data.errcode && data.errcode !== 0) {
    throw new Error(`Upload draft failed: ${JSON.stringify(data)}`);
  }
  return data.media_id;
}
