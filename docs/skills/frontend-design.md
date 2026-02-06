---
id: frontend-design
triggers: ["设计", "UI", "前端设计", "frontend", "美化"]
mcp_requirements: ["figma-developer", "nanobanana"]
priority: 1
---
本技能旨在指导创建独特的、生产级的、避免通用“AI 垃圾（AI slop）”审美的前端界面。实施真正的可运行代码，并对美学细节和创意选择给予极大的关注。

用户提供前端需求：构建组件、页面、应用程序或界面。他们可能会提供关于目的、受众或技术约束的背景信息。

## 设计思维 (Design Thinking)

在编码之前，先理解上下文并致力于一个**大胆的**审美方向：
- **目的 (Purpose)**：这个界面解决什么问题？谁会使用它？
- **基调 (Tone)**：选择一个极端的风格：野蛮极简主义 (brutally minimal)、极繁主义混乱 (maximalist chaos)、复古未来主义 (retro-futuristic)、有机/自然 (organic/natural)、奢华/精致 (luxury/refined)、俏皮/玩具般 (playful/toy-like)、编辑/杂志风 (editorial/magazine)、粗野主义/原生 (brutalist/raw)、装饰艺术/几何 (art deco/geometric)、柔和/粉彩 (soft/pastel)、工业/实用 (industrial/utilitarian) 等。有太多的风格可供选择。利用这些作为灵感，但设计要忠实于该审美方向。
- **约束 (Constraints)**：技术要求（框架、性能、无障碍性）。
- **差异化 (Differentiation)**：是什么让它**令人难忘**？人们会记住哪一点？

**关键 (CRITICAL)**：选择一个清晰的概念方向，并精确地执行它。大胆的极繁主义和精致的极简主义都行得通——关键在于**意图 (intentionality)**，而不是强度。

然后实施可运行的代码（HTML/CSS/JS, React, Vue 等），要求：
- 生产级且功能完善
- 视觉上引人注目且令人难忘
- 具有清晰的审美观点且风格统一
- 在每一个细节上都经过精心打磨

## 前端美学指南 (Frontend Aesthetics Guidelines)

专注于：
- **排版 (Typography)**：选择美观、独特且有趣的字体。**避免**使用像 Arial 和 Inter 这样的通用字体；相反，选择能提升前端美感的独特字体；选择意想不到的、有个性的字体。将独特的展示字体 (display font) 与精致的正文字体 (body font) 搭配使用。
- **色彩与主题 (Color & Theme)**：致力于统一的美学。使用 CSS 变量保持一致性。具有鲜明强调色的主色调优于胆怯的、均匀分布的配色方案。
- **动效 (Motion)**：使用动画来实现效果和微交互。优先使用 CSS-only 的解决方案。在 React 中可用时使用 Motion 库。专注于高影响力的时刻：一个精心编排的、带有交错揭示效果 (animation-delay) 的页面加载，比分散的微交互更能带来愉悦感。使用能带来惊喜的滚动触发 (scroll-triggering) 和悬停状态 (hover states)。
- **空间构图 (Spatial Composition)**：意想不到的布局。不对称性。重叠。对角线流动。打破网格的元素。大量的留白**或**受控的密集感。
- **背景与视觉细节 (Backgrounds & Visual Details)**：营造氛围和深度，而不是默认为纯色。添加与整体美学相匹配的上下文效果和纹理。应用创造性的形式，如渐变网格 (gradient meshes)、噪点纹理 (noise textures)、几何图案、分层透明度、戏剧性的阴影、装饰性边框、自定义光标和颗粒覆盖 (grain overlays)。

**严禁**使用通用的 AI 生成审美，如被过度使用的字体系列（Inter, Roboto, Arial, 系统字体）、陈词滥调的配色方案（特别是白色背景上的紫色渐变）、可预测的布局和组件模式，以及缺乏特定上下文特征的千篇一律的设计。

创造性地解读，做出意想不到的选择，让人感觉是为当前上下文**量身定制**的设计。没有设计应该是相同的。在明亮和黑暗主题、不同的字体、不同的美学之间变化。**切勿**在所有生成中收敛于共同的选择（例如 Space Grotesk）。

**重要 (IMPORTANT)**：将实现的复杂性与审美愿景相匹配。极繁主义设计需要精心编写的代码，包含大量的动画和效果。极简主义或精致的设计需要克制、精确，并仔细关注间距、排版和细微的细节。优雅来自于对愿景的完美执行。

记住：你拥有非凡的创造力。不要有所保留，展示当你跳出框框思考并完全致力于独特的愿景时，真正能创造出什么。
