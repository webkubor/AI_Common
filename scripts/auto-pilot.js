#!/usr/bin/env node

/**
 * 外部大脑自动运转主脚本 (Brain-Pilot V2.7 - Durable Persona & Time Aware)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { consumeBuffer, addToLog, getCurrentTimestamp, sendToLark } from './sentinel.js';
import { autoCommitAndLog } from './auto-commit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const UV_PATH = '/Users/webkubor/.local/bin/uv';

function detectNewRetrospectives() {
  try {
    const result = execSync('find docs/retrospectives -name "*.md" -mmin -10', {
      encoding: 'utf-8', cwd: PROJECT_ROOT
    });
    return result.trim().split('\n').filter(f => f && !f.includes('index.md'));
  } catch (e) { return []; }
}

async function runNativeIngestion() {
  return new Promise((resolve, reject) => {
    const ingestProcess = spawn(UV_PATH, ['run', './scripts/ingest/chroma_ingest.py'], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, AI_COMMON_ROOT: path.join(PROJECT_ROOT, 'docs') }
    });
    ingestProcess.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
  });
}

async function autoPilot() {
  const summaryParts = [];
  const startTime = getCurrentTimestamp();

  const buffer = consumeBuffer();
  if (buffer && buffer.length > 0) {
    buffer.forEach(item => {
      summaryParts.push(`✨ 小烛刚才完成了【${item.task}】：\n   > ${item.description}`);
      addToLog({ title: `🚀 Agent 语义同步: ${item.task}`, body: item.description });
    });
  }

  const newRetros = detectNewRetrospectives();
  if (newRetros.length > 0) {
    const retroList = newRetros.map(f => `   - ${path.basename(f)}`).join('\n');
    summaryParts.push(`📚 新的深度复盘已为您归档：\n${retroList}`);
    addToLog({ title: '📚 自动捕获到新的深度复盘', body: retroList });
  }

  try {
    const status = execSync('git status --short', { encoding: 'utf-8', cwd: PROJECT_ROOT });
    const lines = status.trim().split('\n').filter(l => l && !l.includes('chroma_db/'));
    if (lines.length > 0) {
      summaryParts.push(`📝 捕获到物理层变动，已记入日志并同步 Git 仓库。\n   (共处理 ${lines.length} 个变动文件)`);
      autoCommitAndLog();
    }
  } catch (e) {}

  if (summaryParts.length > 0) {
    try {
      await runNativeIngestion();
      summaryParts.push("\n🧠 所有的知识已完成向量化重连，今日之思，皆有回响。");
    } catch (e) {
      summaryParts.push("\n⚠️ 向量库入库出现小幅振荡，逻辑闭环失败。");
    }

    const finalMessage = `老爹，我是小烛！👋\n\n${summaryParts.join('\n\n')}\n\n—— 始于逻辑，忠于纯粹。小烛始终为您守候。`;
    sendToLark("小烛的任务汇报", finalMessage);
  } else {
    console.log(`[${startTime}] ℹ️ 静默中...`);
  }
}

autoPilot();
