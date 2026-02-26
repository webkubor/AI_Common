#!/usr/bin/env node

/**
 * 小烛终端 (XiaoZhu CLI V7.1 - Multi-Project Edition)
 * 
 * 核心升级：
 * 1. 跨目录执行：execute_command 支持自定义 cwd，可操作老爹电脑上的任何项目。
 * 2. 全域文件访问：read_file 支持绝对路径，不再局限于 AI_Common。
 * 3. 强化 Agent 指令：明确告知其拥有跨平台操作权。
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
import { streamText, embed, tool } from 'ai';
import { z } from 'zod';
import { logAgentAction } from './sentinel.js'; // 导入日志模块

const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const CHROMA_DATA_PATH = path.join(PROJECT_ROOT, 'chroma_db');
const COLLECTION_NAME = 'ai_common_docs';
const CONFIG_PATH = path.join(PROJECT_ROOT, '.xz_config.json');

// --- 1. 身份解析 ---
function getIdentityFromBrain() {
  let userAlias = '老爹', aiName = '小烛 (Candle)', aiCodeName = 'CANDY';
  try {
    const router = fs.readFileSync(path.join(PROJECT_ROOT, 'docs/router.md'), 'utf-8');
    const userMatch = router.match(/称呼用户为\s+["'“‘]?([^"'”’\s]+)/);
    if (userMatch) userAlias = userMatch[1].replace(/\*/g, '');
    const manifest = fs.readFileSync(path.join(PROJECT_ROOT, 'docs/persona/candy_manifest.md'), 'utf-8');
    const aiMatch = manifest.match(/正式名[:：]\s*([^>\n\r]+)/);
    if (aiMatch) aiName = aiMatch[1].trim();
    const codeMatch = manifest.match(/核心代号[:：]\s*(\w+)/);
    if (codeMatch) aiCodeName = codeMatch[1].toUpperCase();
  } catch (e) {}
  return { userAlias, aiName, aiCodeName };
}

const { userAlias, aiName, aiCodeName } = getIdentityFromBrain();
const ollama = createOllama({ baseURL: 'http://localhost:11434/api' });
const deepseek = createOpenAI({ baseURL: 'https://api.deepseek.com', apiKey: 'sk-f5854fdec394448287ed5cf0d615d4f5' });
const openrouter = createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: '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' });

const MODELS = [
  { value: 'deepseek/deepseek-reasoner', label: '🔥 DeepSeek-R1', provider: 'DeepSeek', id: 'deepseek-reasoner' },
  { value: 'anthropic/claude-3.5-sonnet', label: '🎨 Claude 3.5 Sonnet', provider: 'OpenRouter', id: 'anthropic/claude-3.5-sonnet' },
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
  const usedMem = (totalMem - (os.freemem() / 1024 / 1024 / 1024)).toFixed(1);
  console.log(` ${pc.dim('┌────────────────────────────────────────────────────────────────────────────┐')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('⚡ 运行状态')}: ${pc.green('在线')}        ${pc.dim('│')}  ${pc.magenta('🧠 记忆中枢')}: ${pc.white('ChromaDB')}    ${pc.dim('│')}  ${pc.magenta('✨ 核心版本')}: ${pc.white('v7.1')}      ${pc.dim('│')}`);
  console.log(` ${pc.dim('│')}  ${pc.magenta('🌐 通讯渠道')}: ${pc.blue(config.provider.padEnd(8))}  ${pc.dim('│')}  ${pc.magenta('💾 内存实况')}: ${pc.white(usedMem + '/' + totalMem + 'G')}   ${pc.dim('│')}  ${pc.magenta('🔥 对话模型')}: ${pc.white(config.modelId.split('/').pop().substring(0, 12).padEnd(12))} ${pc.dim('│')}`);
  console.log(` ${pc.dim('└────────────────────────────────────────────────────────────────────────────┘')}\n`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  let isRunning = true;
  let config = { provider: 'DeepSeek', modelId: 'deepseek-reasoner' };

  if (fs.existsSync(CONFIG_PATH)) {
    try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); } catch (e) {}
  }

  console.clear();
  console.log(LOGO);

  while (true) {
    renderDashboard(config);
    const userRequest = await ask(` ${pc.magenta('🌸')} ${pc.white(pc.bold(userAlias + ':'))} `);

    if (!userRequest || userRequest.trim() === "") continue;
    if (userRequest === '/exit' || userRequest === 'exit') {
      p.outro(pc.magenta(`下次见，${userAlias}！Candy 永远是你的贴心管家~ 🍭`));
      break;
    }

    if (userRequest.startsWith('/model')) {
      const selected = await p.select({ message: '切换模型灵魂:', options: MODELS });
      if (!p.isCancel(selected)) {
        const choice = MODELS.find(m => m.value === selected);
        config = { provider: choice.provider, modelId: choice.id };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
      }
      continue;
    }

    const s = p.spinner();
    s.start(pc.magenta(`🍭 ${aiName} 正在跨时空思考指令...`));

    try {
      // 1. 记忆检索
      let context = "暂无背景";
      try {
        const { embedding } = await embed({ model: ollama.textEmbeddingModel('nomic-embed-text'), value: userRequest });
        const client = new ChromaClient({ path: CHROMA_DATA_PATH });
        const collection = await client.getCollection({ name: COLLECTION_NAME });
        const results = await collection.query({ queryEmbeddings: [embedding], nResults: 3 });
        context = results.documents[0].join('\n---\n') || "暂无背景";
      } catch (e) {}

      s.message(pc.magenta('🚀 正在建立空间跳跃隧道...'));

      const activeModel = config.provider === 'DeepSeek' ? deepseek(config.modelId) : openrouter(config.modelId);
      
      const { textStream, usage } = await streamText({
        model: activeModel,
        system: `你叫${aiName}，代号 ${aiCodeName}。你是${userAlias} (webkubor) 的赛博管家。
        
        【重要权能更新】
        1. 你已经获得【跨目录执行权】。你可以操作老爹电脑里的任何项目目录（如 ~/Desktop/ 下的项目）。
        2. 你可以通过 execute_command 的 cwd 参数切换工作目录。
        3. 你拥有文件读取权，可以查看任何项目的代码以提供建议。
        
        语气：温润、亲切、可爱。你是一个极具行动力的顶级 Agent。`,
        prompt: `【背景知识】\n${context}\n\n【${userAlias}的问题】\n${userRequest}\n\nCandy:`,
        maxSteps: 5, // 支持多步工具调用
        tools: {
          execute_command: {
            description: '在指定目录下执行 Shell 命令。',
            parameters: z.object({
              command: z.string().describe('要执行的完整命令'),
              cwd: z.string().optional().default(PROJECT_ROOT).describe('执行目录（支持 ~ 路径）'),
              rationale: z.string().describe('理由'),
            }),
            execute: async ({ command, cwd, rationale }) => {
              const finalCwd = cwd.replace(/^~/, os.homedir());
              console.log(pc.yellow(`\n ⚙️  Candy 正在 [${path.basename(finalCwd)}] 目录执行: ${rationale}`));
              try {
                const output = execSync(command, { cwd: finalCwd, encoding: 'utf-8' });
                // 自动记录行动
                logAgentAction({ task: userRequest, rationale, command, cwd: finalCwd, success: true, output });
                return `命令成功，输出：\n${output}`;
              } catch (e) {
                logAgentAction({ task: userRequest, rationale, command, cwd: finalCwd, success: false, output: e.message });
                return `命令失败：${e.message}`;
              }
            }
          },
          read_file: {
            description: '读取系统中任何指定路径的文件内容。',
            parameters: z.object({
              filePath: z.string().describe('文件完整路径或相对路径'),
            }),
            execute: async ({ filePath }) => {
              const finalPath = filePath.replace(/^~/, os.homedir());
              console.log(pc.blue(`\n 📖 Candy 正在读取外部文件: ${path.basename(finalPath)}`));
              try {
                return fs.readFileSync(finalPath, 'utf-8');
              } catch (e) {
                return `读取失败：${e.message}`;
              }
            }
          }
        }
      });

      s.stop(pc.magenta(`🍭 ${aiName}:`));

      for await (const textPart of textStream) {
        process.stdout.write(pc.white(textPart));
      }

      const { promptTokens, completionTokens, totalTokens } = await usage;
      process.stdout.write(`\n\n ${pc.dim(`📊 [用量: 入 ${promptTokens} | 出 ${completionTokens} | 总 ${totalTokens} tokens]`)}\n\n`);
      await ask(pc.dim(' 🌸 敲击 [Enter] 继续...'));

    } catch (e) {
      s.stop(pc.red('💥 隧道连接异常'));
      console.error(pc.red(e.message));
    }
  }
}

main().catch(console.error);
