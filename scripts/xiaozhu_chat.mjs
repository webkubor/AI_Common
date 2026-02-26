#!/usr/bin/env node

/**
 * 小烛终端 (XiaoZhu CLI V4.5 - Smart Switcher)
 * 
 * 核心升级：
 * 1. 模型持久化：通过 .xz_config.json 记住老爹的选择。
 * 2. 指令模式增强：支持 /model 弹出精美菜单选择不同后端。
 * 3. 性价比评估：为老爹推荐最合适的“逻辑引擎”。
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { ChromaClient } from 'chromadb';
import { createOllama } from 'ollama-ai-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';

const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const CHROMA_DATA_PATH = path.join(PROJECT_ROOT, 'chroma_db');
const COLLECTION_NAME = 'ai_common_docs';
const CONFIG_PATH = path.join(PROJECT_ROOT, '.xz_config.json');

// --- 1. 初始化配置与 Providers ---

// 默认配置
let config = {
  provider: 'DeepSeek',
  modelId: 'deepseek-reasoner', // 官方 R1 别名
};

// 加载持久化配置
if (fs.existsSync(CONFIG_PATH)) {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {}
}

const ollama = createOllama({ baseURL: 'http://localhost:11434/api' });
const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-f5854fdec394448287ed5cf0d615d4f5',
});
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
});

// 获取当前模型实例
const getActiveModel = () => {
  return config.provider === 'DeepSeek' ? deepseek(config.modelId) : openrouter(config.modelId);
};

// 可选模型列表 (性价比精选)
const MODELS = [
  { value: 'deepseek/deepseek-reasoner', label: '🔥 DeepSeek-R1 (深度推理)', hint: '官方API / 逻辑巅峰', provider: 'DeepSeek', id: 'deepseek-reasoner' },
  { value: 'anthropic/claude-3.5-sonnet', label: '🎨 Claude 3.5 Sonnet', hint: 'OpenRouter / 编程&创意最强', provider: 'OpenRouter', id: 'anthropic/claude-3.5-sonnet' },
  { value: 'google/gemini-flash-1.5', label: '⚡ Gemini 1.5 Flash', hint: 'OpenRouter / 极速&超长文本', provider: 'OpenRouter', id: 'google/gemini-flash-1.5' },
  { value: 'openai/gpt-4o-mini', label: '💎 GPT-4o Mini', hint: 'OpenRouter / 极致性价比', provider: 'OpenRouter', id: 'openai/gpt-4o-mini' },
  { value: 'deepseek/deepseek-chat', label: '💼 DeepSeek-V3', hint: '官方API / 全能日常', provider: 'DeepSeek', id: 'deepseek-chat' },
];

// --- UI 渲染 ---
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
  
  console.log(` ${pc.dim('┌────────────────────────────────────────────────────────────────────────────┐')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('⚡ 运行状态')}: ${pc.green('在线')}        ${pc.dim('│')}  ${pc.magenta('🧠 记忆中枢')}: ${pc.white('ChromaDB')}    ${pc.dim('│')}  ${pc.magenta('✨ 核心版本')}: ${pc.white('v4.5')}      ${pc.dim('│')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('🌐 通讯渠道')}: ${pc.blue(config.provider)}    ${pc.dim('│')}  ${pc.magenta('💾 内存实况')}: ${pc.white(usedMem + '/' + totalMem + 'G')}   ${pc.dim('│')}  ${pc.magenta('🔥 逻辑引擎')}: ${pc.white(config.modelId.split('/').pop())} ${pc.dim('│')}`);
  console.log(` ${pc.dim('└────────────────────────────────────────────────────────────────────────────┘')}\n`);

  p.intro(`${pc.bgMagenta(pc.black(' CANDY '))}${pc.magenta(' ❯ ')}${pc.white('小烛已经准备好为您切换任何维度的算力！')}`);

  const userRequest = await p.text({
    message: pc.white('老爹，今天想尝试哪个宇宙的模型？✨'),
    placeholder: '输入消息聊天，或输入 /model 切换模型...',
    validate(value) {
      if (value.length === 0) return '老爹老爹，快跟我说说话呀~';
    },
  });

  if (p.isCancel(userRequest)) {
    p.outro(pc.magenta('下次见，老爹！👋'));
    process.exit(0);
  }

  // --- 处理快捷命令 ---
  if (userRequest.startsWith('/')) {
    const cmd = userRequest.slice(1).toLowerCase();
    
    if (cmd === 'model') {
      const selected = await p.select({
        message: '老爹，请挑选你要注入的模型灵魂:',
        options: MODELS,
      });
      
      if (!p.isCancel(selected)) {
        const choice = MODELS.find(m => m.value === selected);
        config = { provider: choice.provider, modelId: choice.id };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        p.log.success(`${pc.green('✨ 切换成功！')} 当前引擎已锁定为: ${pc.bold(choice.label)}`);
      }
      p.outro(pc.dim('—— 请再次运行 xz 开启新引擎。'));
      return;
    }

    if (cmd === 'sync') {
      const s = p.spinner();
      s.start('🏗️  正在全量同步外部大脑...');
      try {
        execSync('node scripts/auto-pilot.js', { cwd: PROJECT_ROOT });
        s.stop('✅ 大脑自愈完成。');
      } catch (e) { s.stop(pc.red('同步失败')); }
      return;
    }
  }

  // --- 正常对话逻辑 ---
  const s = p.spinner();
  s.start(pc.magenta('🔮 正在调动 RAG 神经元与云端算力...'));

  try {
    let context = "暂无背景";
    try {
      const { embedding } = await embed({
        model: ollama.textEmbeddingModel('nomic-embed-text'),
        value: userRequest,
      });
      const client = new ChromaClient({ path: CHROMA_DATA_PATH });
      const collection = await client.getCollection({ name: COLLECTION_NAME });
      const results = await collection.query({ queryEmbeddings: [embedding], nResults: 3 });
      if (results.documents[0].length > 0) {
        context = results.documents[0].join('\n---\n');
      }
    } catch (e) {}

    s.stop(pc.magenta('✨ 语义重组完成！Candy 的汇报如下：'));

    process.stdout.write(`\n ${pc.magenta('🕯️')} ${pc.bold(pc.white('Candy 的宇宙汇报:'))}\n`);
    process.stdout.write(` ${pc.dim('————————————————————————————————————————————————————————————————————————————')}\n\n `);

    const { textStream } = await streamText({
      model: getActiveModel(),
      headers: { "HTTP-Referer": "https://github.com/webkubor/AI_Common", "X-Title": "Candy Cortex" },
      prompt: `你叫小烛 (Candle)，老爹喜欢叫你 Candy。你是老爹 (webkubor) 的赛博管家。
      你的回答必须基于以下背景。语气温润、亲切、可爱。
      当前使用的逻辑引擎是：${config.modelId}。
      
背景知识：
${context}

老爹的问题：
${userRequest}

Candy 的回答：`,
    });

    for await (const textPart of textStream) {
      process.stdout.write(pc.white(textPart));
    }

    console.log(`\n\n ${pc.dim('————————————————————————————————────────────────————————————————————————————')}`);

  } catch (e) {
    s.stop(pc.red('💥 跨维度通讯异常'));
    p.note(e.message, pc.magenta('异常追溯'));
  }

  p.outro(pc.dim('—— 始于逻辑，忠于纯粹。小烛始终守护老爹。'));
}

main().catch(console.error);
