import fs from 'fs';
import path from 'path';

async function testLark() {
  const envPath = './docs/secrets/lark.env';
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const webhookUrl = envContent.match(/LARK_WEBHOOK_URL=(.+)/)?.[1];

  console.log('📡 正在尝试包含“关键词”的测试...');
  const payload = {
    msg_type: "post",
    content: {
      post: { 
        zh_cn: { 
          title: "🧠 大脑同步: 小烛自检", 
          content: [[{ tag: "text", text: "这是一条包含关键词【大脑】和【小烛】的测试消息。老爹，如果您收到了，说明我们找对密码了！" }]] 
        } 
      }
    }
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log('✅ 飞书返回状态:', response.status);
    console.log('📝 飞书返回详情:', result);
  } catch (e) {
    console.error('❌ 失败:', e.message);
  }
}

testLark();
