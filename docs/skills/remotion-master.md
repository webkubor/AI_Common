# Remotion Master (视频自动化专家)

## 🎯 核心目标
实现 Remotion 视频从“代码生成”到“文件交付”的全自动化流程。

## 🛠 触发指令
- "生成视频"
- "自动化渲染"
- "Build and open video"

## 🚀 自动化工作流 (Standard Operating Procedure)

### Phase 1: 准备 (Prepare)
1.  检查当前项目是否为 Remotion 项目（查找 `remotion.config.ts`）。
2.  确认输出目录 `out/` 存在，不存在则创建。

### Phase 2: 生成与注册 (Scaffold)
1.  根据用户需求在 `videos/` 下创建新视频子目录。
2.  生成标准的 `src/Root.tsx`, `data/config.json`。
3.  **关键动作**: 自动在 `videos/index.ts` 中注册该 Composition。

### Phase 3: 渲染 (Render)
执行高效率渲染命令：
```bash
npx remotion render videos/index.ts {composition_id} out/{composition_id}.mp4 --gl=angle
```

### Phase 4: 交付 (Deliver)
渲染成功后，必须立即执行：
```bash
open out/
```

## 💡 开发者说明
- 本技能强调“即写即得”，Agent 在完成代码后不应询问用户是否渲染，而应作为连续动作执行。
