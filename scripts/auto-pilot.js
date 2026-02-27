#!/usr/bin/env node

/**
 * 外部大脑自动运转主脚本 (Brain-Pilot V4.0 - Explicit Journaling)
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
const ROUTER_PATH = path.join(PROJECT_ROOT, 'docs/router.md');
const HISTORY_PATH = path.join(PROJECT_ROOT, 'docs/BRAIN_HISTORY.md');

function getCompactTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function detectNewRetrospectives() {
  try {
    const result = execSync('find docs/retrospectives -name "*.md" -mmin -10', {
      encoding: 'utf-8', cwd: PROJECT_ROOT
    });
    return result.trim().split('\n').filter(f => f && !f.includes('index.md'));
  } catch (e) { return []; }
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
  const journalEntries = [];
  const timeLabel = getCompactTime();
  const brainVersion = getBrainVersion();
  const routerMap = getRouterMap();

  // 1. Tasks
  const buffer = consumeBuffer();
  if (buffer && buffer.length > 0) {
    buffer.forEach(item => {
      summaryParts.push(`⚡️ Task: ${item.task}\n> ${item.description}`);
      journalEntries.push(`### ⚡️ ${item.task}\n${item.description}`);
    });
  }

  // 2. Git & Physical Changes
  try {
    // 忽略状态文件
    const status = execSync('git status --short', { encoding: 'utf-8', cwd: PROJECT_ROOT });
    const lines = status.trim().split('\n').filter(l => l && !l.includes('chroma_db/') && !l.includes('.last_notif.json'));
    
    if (lines.length > 0) {
      const stats = execSync('git diff --numstat', { encoding: 'utf-8', cwd: PROJECT_ROOT })
                    .trim().split('\n')
                    .reduce((acc, line) => {
                      const parts = line.split('\t');
                      if (parts.length >= 3) acc[parts[2]] = `(+${parts[0]}/-${parts[1]})`;
                      return acc;
                    }, {});

      const totalStat = execSync('git diff --shortstat', { encoding: 'utf-8', cwd: PROJECT_ROOT }).trim();
      const intents = new Set();
      
      const fileList = lines.map(line => {
        const file = line.substring(3).trim();
        const intent = getSemanticIntent(file, routerMap);
        intents.add(intent);
        const snippet = getDiffSnippet(file);
        return `- [${intent}] ${file} ${stats[file] || ''}${snippet}`;
      }).join('\n');

      summaryParts.push(`📝 Sync [${Array.from(intents).join(' | ')}]:\n${fileList}\n📊 Total: ${totalStat || 'New'}`);
      
      // 核心：将物理变更记录到日记本，但保持极简
      journalEntries.push(`### 📝 变更同步 (${Array.from(intents).join(' | ')})\n${fileList}\n> ${totalStat || '全量新增'}`);
      
      autoCommitAndLog();
    }
  } catch (e) { console.error('Git 操作异常:', e.message); }

  // 3. Retro
  const newRetros = detectNewRetrospectives();
  if (newRetros.length > 0) {
    const list = newRetros.map(f => `- ${path.basename(f)}`).join('\n');
    summaryParts.push(`📚 Retro:\n${list}`);
    journalEntries.push(`### 📚 深度复盘入库\n${list}`);
  }

  // 4. Final Processing & Lark
  if (summaryParts.length > 0) {
    // 写入日记本
    journalEntries.forEach(entry => addToLog({ title: '大脑同步记录', body: entry }));

    let modeLabel = "✅ Semantic";
    try {
      await runNativeIngestion();
    } catch (e) { modeLabel = "🚨 Physical"; }

    sendToLark(`[${timeLabel}] Brain ${brainVersion} | ${modeLabel}`, summaryParts.join('\n\n'));
  } else {
    console.log(`[${getCurrentTimestamp()}] ℹ️ Silent...`);
  }
}

autoPilot();
