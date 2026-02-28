import { kernel } from '../core/kernel.mjs';
import { push as pushLogic } from '../wechat/push.mjs';

/**
 * 微信公众号推送动作定义
 */
const oaPushAction = {
  name: 'oa-push',
  description: '将最新复盘/文章推送至微信公众号草稿箱',
  handler: async (params) => {
    console.log('📱 正在通过内核执行公众号推送流程...');
    try {
      const draftId = await pushLogic(params);
      console.log(`✅ 推送成功！草稿 MediaID: ${draftId}`);
      return { success: true, draftId };
    } catch (e) {
      console.error(`❌ 公众号推送失败: ${e.message}`);
      throw e;
    }
  }
};

// 注册到内核
kernel.registerAction(oaPushAction);

export default oaPushAction;
