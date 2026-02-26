#!/usr/bin/env node

/**
 * 外部大脑自动运转主脚本 (Brain-Pilot V2.5 - High Signal Summary)
 * 
 * 优化点：
 * 1. 聚合通知：一次运行只发一条 Lark 摘要。
 * 2. 真实变更检测：排除数据库自增导致的噪音。
 * 3. 只有当确实有意义（新文件、新语义、物理变更）时才发送通知。
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
  const summaryEvents = [];
  const startTime = getCurrentTimestamp();

  // 1. 语义缓冲区处理
  const buffer = consumeBuffer();
  if (buffer && buffer.length > 0) {
    buffer.forEach(item => {
      const msg = `🚀 Agent 语义: ${item.task}\n   - ${item.description}`;
      summaryEvents.push(msg);
      addToLog({ title: `🚀 Agent 语义同步: ${item.task}`, body: item.description });
    });
  }

  // 2. 新复盘文档处理
  const newRetros = detectNewRetrospectives();
  if (newRetros.length > 0) {
    const retroList = newRetros.map(f => `- ${path.basename(f)}`).join('\n');
    summaryEvents.push(`📚 捕获新复盘:\n${retroList}`);
    addToLog({ title: '📚 自动捕获到新的深度复盘', body: retroList });
  }

  // 3. 真实物理变动检测 (排除 chroma_db 噪音)
  let physicalChanges = "";
  try {
    const status = execSync('git status --short', { encoding: 'utf-8', cwd: PROJECT_ROOT });
    const lines = status.trim().split('\n').filter(l => l && !l.includes('chroma_db/'));
    if (lines.length > 0) {
      physicalChanges = lines.join('\n');
      summaryEvents.push(`📝 物理文件变更 (${lines.length}个):\n${physicalChanges}`);
      autoCommitAndLog();
    }
  } catch (e) {}

  // 4. 执行向量入库 (如果有变动)
  if (summaryEvents.length > 0) {
    try {
      await runNativeIngestion();
      summaryEvents.push("✅ 向量入库同步成功");
    } catch (e) {
      summaryEvents.push("❌ 向量入库异常");
    }

    // 5. 发送唯一的聚合简报
    const finalBody = summaryEvents.join('\n\n');
    sendToLark("大脑任务简报", finalBody);
    console.log('✨ 已向老爹推送任务简报');
  } else {
    console.log(`[${startTime}] ℹ️ 保持静默：未检测到有意义的变更`);
  }
}

autoPilot();
