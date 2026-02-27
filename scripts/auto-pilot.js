#!/usr/bin/env node

/**
 * 外部大脑自动运转主脚本 (Brain-Pilot V4.1 - Real-time Change Detection)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { consumeBuffer, addToLog, getCurrentTimestamp, sendToLark } from './sentinel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = '/Users/webkubor/Documents/AI_Common';
const UV_PATH = '/Users/webkubor/.local/bin/uv';
const ROUTER_PATH = path.join(PROJECT_ROOT, 'docs/router.md');
const HISTORY_PATH = path.join(PROJECT_ROOT, 'docs/BRAIN_HISTORY.md');

function getCompactTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function getBrainVersion() {
  try {
    const content = fs.readFileSync(HISTORY_PATH, 'utf-8');
    const match = content.match(/> \*\*当前智力档位\*\*: (v[\d.]+)/);
    return match ? match[1] : 'v0.0.0';
  } catch (e) { return 'v?.?.?'; }
}

function getRouterMap() {
  try {
    const content = fs.readFileSync(ROUTER_PATH, 'utf-8');
    const tableRegex = /\| \*\*([^*]+)\*\* \| `([^`]+)` \|/g;
    const map = {};
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
      map[match[2].trim()] = match[1].trim();
    }
    return map;
  } catch (e) { return {}; }
}

function getSemanticIntent(filePath, routerMap) {
  if (filePath === 'docs/router.md') return '⚠️ 入口协议';
  if (filePath === 'docs/BRAIN_HISTORY.md') return '📜 大脑演化史';
  for (const [route, intent] of Object.entries(routerMap)) {
    if (filePath.startsWith('docs/' + route) || filePath.startsWith(route)) return intent;
  }
  return '🛠 基础架构';
}

function getDiffSnippet(file) {
  try {
    if (!file.endsWith('.md')) return "";
    // 抓取本次变动新增的内容
    const diff = execSync(`git diff -U0 "${file}" | grep "^+[^+]" | sed "s/^+//g" | head -n 3`, {
      encoding: 'utf-8', cwd: PROJECT_ROOT
    });
    const snippet = diff.trim().split('\n').filter(l => l.trim()).join('; ');
    return snippet ? `\n   >> "${snippet.substring(0, 100).replace(/\n/g, ' ')}..."` : "";
  } catch (e) { return ""; }
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
  const timeLabel = getCompactTime();
  const brainVersion = getBrainVersion();
  const routerMap = getRouterMap();

  console.log(`[${getCurrentTimestamp()}] 🔄 正在扫描本地变更...`);

  // 1. 语义任务捕获 (来自 Agent 交互)
  const buffer = consumeBuffer();
  if (buffer && buffer.length > 0) {
    buffer.forEach(item => {
      summaryParts.push(`⚡️ Task: ${item.task}\n> ${item.description}`);
      addToLog({ title: `🎯 ${item.task}`, body: item.description });
    });
  }

  // 2. 物理变更捕获 (来自老爹本地修改)
  try {
    const status = execSync('git status --short', { encoding: 'utf-8', cwd: PROJECT_ROOT });
    const lines = status.trim().split('\n').filter(l => l && !l.includes('chroma_db/') && !l.includes('.last_notif.json'));
    
    if (lines.length > 0) {
      console.log(`📊 发现 ${lines.length} 个本地变动文件`);
      
      const stats = execSync('git diff --numstat', { encoding: 'utf-8', cwd: PROJECT_ROOT })
                    .trim().split('\n')
                    .reduce((acc, line) => {
                      const parts = line.split('\t');
                      if (parts.length >= 3) acc[parts[2]] = `(+${parts[0]}/-${parts[1]})`;
                      return acc;
                    }, {});

      const totalStat = execSync('git diff --shortstat', { encoding: 'utf-8', cwd: PROJECT_ROOT }).trim() || "New Files Detected";
      const intents = new Set();
      
      const fileList = lines.map(line => {
        const file = line.substring(3).trim();
        const intent = getSemanticIntent(file, routerMap);
        intents.add(intent);
        const snippet = getDiffSnippet(file);
        return `- [${intent}] ${file} ${stats[file] || ''}${snippet}`;
      }).join('\n');

      // 组装推送内容
      const intentSummary = Array.from(intents).join(' | ');
      summaryParts.push(`📝 Sync [${intentSummary}]:\n${fileList}\n📊 Total: ${totalStat}`);
      
      // --- 关键：先写日记本 ---
      addToLog({ 
        title: `📁 物理同步 (${intentSummary})`, 
        body: `${fileList}\n\n> 统计: ${totalStat}` 
      });

      // --- 关键：再执行 Git Commit ---
      const commitMsg = `auto: ${intentSummary} synchronized at ${getCurrentTimestamp()}`;
      execSync(`git add . && git commit -m "${commitMsg}"`, { cwd: PROJECT_ROOT });
      console.log(`✅ Git 自动提交完成: ${commitMsg}`);
    }
  } catch (e) {
    console.error('⚠️ 物理同步过程异常:', e.message);
  }

  // 3. 结果汇总与推送
  if (summaryParts.length > 0) {
    let modeLabel = "✅ Semantic";
    try {
      await runNativeIngestion();
    } catch (e) { modeLabel = "🚨 Physical"; }

    // 关键词【大脑】已包含在 sentinel.js 标题前缀中
    sendToLark(`Brain ${brainVersion} | ${modeLabel}`, summaryParts.join('\n\n'));
    console.log(`🚀 推送已发出！`);
  } else {
    console.log(`ℹ️ 本次扫描无变动，保持静默。`);
  }
}

autoPilot();
