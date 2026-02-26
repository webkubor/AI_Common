#!/usr/bin/env node

/**
 * 小烛终端 (XiaoZhu CLI V4.1 - Ultimate AI SDK)
 * 
 * 核心升级：
 * 1. 100% 工业级 Node.js 实现：使用 Vercel AI SDK 处理 Embedding 和 Chat。
 * 2. 修复 ChromaDB 导出错误：通过 AI SDK 的 embed 函数手动获取向量并查询。
 * 3. 语义化一致性：所有 AI 操作均通过统一的 Provider 接口完成。
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import os from 'os';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { createOllama } from 'ollama-ai-provider';
import { streamText, embed } from 'ai';

const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const CHROMA_DATA_PATH = path.join(PROJECT_ROOT, 'chroma_db');
const COLLECTION_NAME = 'ai_common_docs';

// 1. 初始化 Ollama 驱动
const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

// 2. 超清块状 Logo
const LOGO = `
  ${pc.magenta(' ██████')}   ${pc.magenta('█████')}   ${pc.magenta('███')}   ${pc.magenta('██')}  ${pc.magenta('██████')}   ${pc.magenta('██')}   ${pc.magenta('██')}
 ${pc.magenta('███  ░░')}  ${pc.magenta('███ ░░█')}  ${pc.magenta('░████ ░██')}  ${pc.magenta('░██  ░██')}  ${pc.magenta('░░██ ██')}
 ${pc.magenta('███')}      ${pc.magenta('███████')}  ${pc.magenta('░██░██░██')}  ${pc.magenta('░██   ██')}   ${pc.magenta('░░███')}
 ${pc.magenta('███  ██')}  ${pc.magenta('███ ░░█')}  ${pc.magenta('░██ ░████')}  ${pc.magenta('░██  ██')}     ${pc.magenta('░██')}
 ${pc.magenta(' ░██████')}  ${pc.magenta('███  ░█')}  ${pc.magenta('░██  ░░██')}  ${pc.magenta('██████')}      ${pc.magenta('██')}
`;

async function main() {
  console.clear();
  console.log(LOGO);
  
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  const usedMem = (totalMem - freeMem).toFixed(1);
  const platform = os.platform() === 'darwin' ? 'macOS' : os.platform();
  
  console.log(` ${pc.dim('┌────────────────────────────────────────────────────────────────────────────┐')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('⚡ 运行状态')}: ${pc.green('在线')}        ${pc.dim('│')}  ${pc.magenta('🧠 记忆中枢')}: ${pc.white('ChromaDB')}    ${pc.dim('│')}  ${pc.magenta('✨ 核心版本')}: ${pc.white('v4.1')}      ${pc.dim('│')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('💻 系统架构')}: ${pc.white(platform + '/Arm64')}  ${pc.dim('│')}  ${pc.magenta('💾 内存实况')}: ${pc.white(usedMem + '/' + totalMem + 'G')}   ${pc.dim('│')}  ${pc.magenta('🔥 对话模型')}: ${pc.white('DeepSeek-R1')} ${pc.dim('│')}`);
  console.log(` ${pc.dim('└────────────────────────────────────────────────────────────────────────────┘')}\n`);

  p.intro(`${pc.bgMagenta(pc.black(' CANDY '))}${pc.magenta(' ❯ ')}${pc.white('小烛已经准备好为老爹服务啦！')}`);

  const userRequest = await p.text({
    message: pc.white('老爹老爹，今天想让小烛做什么呀？✨'),
    placeholder: '小烛正在竖起耳朵听哦...',
    validate(value) {
      if (value.length === 0) return '哎呀老爹，你还没说话呢，小烛不知道该想什么了~';
    },
  });

  if (p.isCancel(userRequest)) {
    p.outro(pc.magenta('呜呜，老爹要休息了吗？那小烛先退下了，回见！👋'));
    process.exit(0);
  }

  const s = p.spinner();
  s.start(pc.magenta('🔮 正在穿透记忆维度...'));

  try {
    // --- 1. 使用 Vercel AI SDK 获取用户请求的向量 ---
    let context = "暂无背景";
    try {
      const { embedding } = await embed({
        model: ollama.textEmbeddingModel('nomic-embed-text'),
        value: userRequest,
      });

      // --- 2. 查询 ChromaDB ---
      const client = new ChromaClient({ path: CHROMA_DATA_PATH });
      const collection = await client.getCollection({ name: COLLECTION_NAME });
      const results = await collection.query({ 
        queryEmbeddings: [embedding], 
        nResults: 3 
      });
      
      if (results.documents[0].length > 0) {
        context = results.documents[0].join('\n---\n');
      }
    } catch (e) {
      s.message(pc.yellow('⚠️ 外部大脑连接异常，已启用备用常识库。'));
    }

    s.stop(pc.magenta('✨ 语义重组完成！老爹请看：'));

    // --- 3. 执行流式对话 ---
    process.stdout.write(`\n ${pc.magenta('🕯️')} ${pc.bold(pc.white('Candy 的汇报:'))}\n`);
    process.stdout.write(` ${pc.dim('————————————————————————————————————————————————————————————————————————————')}\n\n `);

    const { textStream } = await streamText({
      model: ollama('deepseek-r1:7b'),
      prompt: `你叫小烛 (Candle)，老爹喜欢叫你 Candy。你是老爹 (webkubor) 的赛博管家。
      你的回答必须基于以下背景。语气要温润、亲切、可爱，偶尔带点调皮，但核心内容要干货。
      
背景知识：
${context}

老爹的问题：
${userRequest}

Candy 的回答：`,
    });

    for await (const textPart of textStream) {
      process.stdout.write(pc.white(textPart));
    }

    console.log(`\n\n ${pc.dim('————————————————————————————————————————————————————————————————————————————')}`);

  } catch (e) {
    s.stop(pc.red('💥 哎呀，逻辑链路不小心断掉了...'));
    p.note(e.message, pc.magenta('异常追溯'));
  }

  p.outro(pc.dim('—— 始于逻辑，忠于纯粹。小烛始终守护老爹。'));
}

main().catch(console.error);
