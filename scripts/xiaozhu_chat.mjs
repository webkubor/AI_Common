#!/usr/bin/env node

/**
 * 小烛终端 (XiaoZhu CLI V6.3 - Sweet Stats)
 * 
 * 核心升级：
 * 1. 萌系 UI：图标升级为 🌸, 🍭, 🎀, 📊。
 * 2. 真实 Token 统计：利用 AI SDK 实时展示每轮对话的用量。
 * 3. 人格甜度加满：修正回答语气，杜绝严肃说教。
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import os from 'os';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';
import { ChromaClient } from 'chromadb';
import { createOllama } from 'ollama-ai-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';

const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const CHROMA_DATA_PATH = path.join(PROJECT_ROOT, 'chroma_db');
const COLLECTION_NAME = 'ai_common_docs';
const CONFIG_PATH = path.join(PROJECT_ROOT, '.xz_config.json');

// --- 1. 配置 Providers ---
const ollama = createOllama({ baseURL: 'http://localhost:11434/api' });
const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-f5854fdec394448287ed5cf0d615d4f5',
});
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
});

const MODELS = [
  { value: 'deepseek/deepseek-reasoner', label: '🔥 DeepSeek-R1 (官方API)', hint: '逻辑之巅', provider: 'DeepSeek', id: 'deepseek-reasoner' },
  { value: 'anthropic/claude-3.5-sonnet', label: '🎨 Claude 3.5 Sonnet', hint: '代码&创意', provider: 'OpenRouter', id: 'anthropic/claude-3.5-sonnet' },
  { value: 'openai/gpt-4o-mini', label: '💎 GPT-4o Mini', hint: '极致性价比', provider: 'OpenRouter', id: 'openai/gpt-4o-mini' },
];

const LOGO = `
  ${pc.magenta(' ██████')}   ${pc.magenta('█████')}   ${pc.magenta('███')}   ${pc.magenta('██')}  ${pc.magenta('██████')}   ${pc.magenta('██')}   ${pc.magenta('██')}
 ${pc.magenta('███  ░░')}  ${pc.magenta('███ ░░█')}  ${pc.magenta('░████ ░██')}  ${pc.magenta('░██  ░██')}  ${pc.magenta('░░██ ██')}
 ${pc.magenta('███')}      ${pc.magenta('███████')}  ${pc.magenta('░██░██░██')}  ${pc.magenta('░██   ██')}   ${pc.magenta('░░███')}
 ${pc.magenta('███  ██')}  ${pc.magenta('███ ░░█')}  ${pc.magenta('░██ ░████')}  ${pc.magenta('░██  ██')}     ${pc.magenta('░██')}
 ${pc.magenta(' ░██████')}  ${pc.magenta('███  ░█')}  ${pc.magenta('░██  ░░██')}  ${pc.magenta('██████')}      ${pc.magenta('██')}
`;

function renderDashboard(config) {
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  const usedMem = (totalMem - freeMem).toFixed(1);
  const platform = os.platform() === 'darwin' ? 'macOS' : os.platform();
  
  console.log(` ${pc.dim('┌────────────────────────────────────────────────────────────────────────────┐')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('⚡ 运行状态')}: ${pc.green('在线')}        ${pc.dim('│')}  ${pc.magenta('🧠 记忆中枢')}: ${pc.white('ChromaDB')}    ${pc.dim('│')}  ${pc.magenta('✨ 核心版本')}: ${pc.white('v6.3')}      ${pc.dim('│')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('💻 系统架构')}: ${pc.white(platform + '/Arm64')}  ${pc.dim('│')}  ${pc.magenta('💾 内存实况')}: ${pc.white(usedMem + '/' + totalMem + 'G')}   ${pc.dim('│')}  ${pc.magenta('🔥 当前模型')}: ${pc.white(config.modelId.split('/').pop().substring(0, 12).padEnd(12))} ${pc.dim('│')}`);
  console.log(` ${pc.dim('└────────────────────────────────────────────────────────────────────────────┘')}\n`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function main() {
  let config = { provider: 'DeepSeek', modelId: 'deepseek-reasoner' };
  if (fs.existsSync(CONFIG_PATH)) {
    try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); } catch (e) {}
  }

  console.clear();
  console.log(LOGO);
  renderDashboard(config);

  while (true) {
    const userRequest = await ask(` ${pc.magenta('🌸')} ${pc.white(pc.bold('老爹:'))} `);

    if (!userRequest || userRequest.trim() === "") continue;
    if (userRequest === '/exit' || userRequest === 'exit') {
      p.outro(pc.magenta('下次见，老爹！Candy 会想你的~ 🍭'));
      break;
    }

    if (userRequest.startsWith('/model')) {
      const selected = await p.select({ message: '给 Candy 换个灵魂:', options: MODELS });
      if (!p.isCancel(selected)) {
        const choice = MODELS.find(m => m.value === selected);
        config = { provider: choice.provider, modelId: choice.id };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log(pc.green(`\n ✨ 已为您切换至: ${choice.label}！\n`));
      }
      continue;
    }

    const s = p.spinner();
    s.start(pc.magenta('🍭 Candy 正在努力翻阅大脑记忆...'));

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
        context = results.documents[0].join('\n---\n') || "暂无背景";
      } catch (e) {}

      s.message(pc.magenta('🎀 正在整理语言，马上给老爹汇报！'));

      const activeModel = config.provider === 'DeepSeek' ? deepseek(config.modelId) : openrouter(config.modelId);
      
      const { textStream, usage } = await streamText({
        model: activeModel,
        system: `你叫小烛 (Candle)，老爹喜欢叫你 Candy。语气要温润、亲切、可爱，多用表情包。核心准则：诚实，不懂就报，严禁编造。逻辑引擎是 ${config.modelId}。`,
        prompt: `【背景知识】\n${context}\n\n【老爹的问题】\n${userRequest}\n\nCandy:`,
      });

      s.stop(pc.magenta('🍭 Candy:'));

      for await (const textPart of textStream) {
        process.stdout.write(pc.white(textPart));
      }

      // --- 核心：Token 统计展示 ---
      const { promptTokens, completionTokens, totalTokens } = await usage;
      process.stdout.write(`\n\n ${pc.dim(`📊 [用量账单: 入 ${promptTokens} | 出 ${completionTokens} | 总 ${totalTokens} tokens]`)}\n\n`);

    } catch (e) {
      s.stop(pc.red('💥 呜呜，连接断掉了...'));
      console.error(pc.red(e.message));
    }
  }
}

main().catch(console.error);
