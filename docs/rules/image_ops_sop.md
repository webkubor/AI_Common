# 图像生成决策矩阵与 SOP (Visual Ops SOP)

## 1. 场景路由
根据任务意图自动选择工具链，禁止工具混用。

### A. IP 角色与电影分镜 (IP & Cinematic)
- **工具**: `edit_image` (nanobanana)
- **前置条件**: 必须指定并加载 `docs/ucd/persona_refs/` 下的对应角色参考图。
- **执行规范**: **强制遵循** [Persona System SOP](../ucd/persona_system.md) (包含 POV、RAW 质感、锁相协议)。
- **归档**: `~/Documents/AI_Common/docs/ucd/persona_refs/history/`

### B. 纯技术/工程化封面 (Technical Covers)
- **工具**: `generate_image` (nanobanana)
- **规范**: `docs/ucd/juejin_tech_covers.md`
- **红线**: 必须包含 `zero humans, zero faces`。采用 3D Isometric 风格。
- **归档**: `~/Documents/juejin/assets/`

## 2. 完工定义 (DoD)
1. 图像已生成并符合对应场景规范。
2. 图像已通过 `image-hosting-master` 上传并获取 HTTPS 链接。
3. 图像已重命名并存入指定的本地归档目录。
4. Markdown 源码中已正确引用该链接。

---
*Last Updated: 2026-02-24 (By Candle)*
