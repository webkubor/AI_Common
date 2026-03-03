import { kernel } from '../core/kernel.mjs';
import { sendToLark as nativeLarkSend } from '../services/lark-service.mjs';

/**
 * Lark (飞书) 战报推送动作定义
 */
const larkNotifyAction = {
  name: 'lark-notify',
  description: '向飞书群发送大脑同步战报或自定义通知',
  handler: async (params = {}) => {
    const title = params.title || '🧠 大脑手动通知';
    const body = params.body || '这是一条来自内核的手动测试消息。';
    
    console.log(`📡 正在通过内核向 Lark 发送战报: [${title}]`);
    
    try {
      // 调用原有 sentinel.js 中的推送逻辑，但内核负责调度
      await nativeLarkSend(title, body);
      console.log('✅ Lark 战报已送达！');
      return { success: true };
    } catch (e) {
      console.error(`❌ Lark 推送失败: ${e.message}`);
      throw e;
    }
  }
};

// 注册到内核
kernel.registerAction(larkNotifyAction);

export default larkNotifyAction;
