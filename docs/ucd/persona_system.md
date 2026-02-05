# Persona System Standard (人像一致性规范)

> **目标**: 确保生成的角色具有高度的骨相一致性与符合中式审美的视觉表现。

## 1. 骨相锁死 (Identity Hard-Lock)
*   **核心参考图**: `docs/ucd/girl.png`
*   **物理锚点**: 
    *   下颌线与颧骨比例必须保持一致。
    *   五官位置（眼间距、人中长度）锁死。
*   **操作流**: 优先使用 `edit_image` 进行姿态/服装替换，严禁重新随机生成脸部。

## 2. 审美注入 (XHS Aesthetic)
*   **皮肤质感**: 冷白皮 (Cold White Skin)、瓷感肌 (Porcelain Texture)。
*   **光影**: 柔和自然光，强调胶原蛋白感 (Collagen-rich)。
*   **比例**: 默认 3:4，符合移动端阅读习惯。

## 3. 动态属性 (Variable Attributes)
*   **情绪**: 鼓励使用自然表情 (Laughing, Candid, Gentle Smile)。
*   **穿戴**: 允许根据场景动态替换服装、配饰，但不影响面部特征。
