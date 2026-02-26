#!/usr/bin/env node

/**
 * 记忆哨兵模块 (Sentinel V2.5 - Agent Logger)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const BUFFER_PATH = path.join(__dirname, '../.context_buffer.json');
const SECRETS_DIR = path.join(__dirname, '../docs/secrets');
const NOTIF_LOCK_PATH = path.join(__dirname, '../.last_notif.json');
const OPS_LOG_DIR = path.join(DOCS_DIR, 'operation-logs');

export function getCurrentTimestamp() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

export function getLogPath() {
  const today = new Date().toISOString().split('T')[0];
  return path.join(DOCS_DIR, 'memory', 'journal', `${today}.md`);
}

// 核心增强：专门记录 Agent 的物理操作
export function logAgentAction(action) {
  if (!fs.existsSync(OPS_LOG_DIR)) fs.mkdirSync(OPS_LOG_DIR, { recursive: true });
  
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(OPS_LOG_DIR, `candy-${today}.md`);
  
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `# 小烛行动日志 - ${today}\n\n> 记录 Candy 在老爹电脑上的所有物理操作轨迹。\n\n---\n`);
  }

  const entry = `
### ⚡️ 物理操作 - ${getCurrentTimestamp()}
- **任务目标**: ${action.task || '未命名任务'}
- **决策逻辑**: ${action.rationale}
- **执行命令**: \`${action.command}\`
- **工作目录**: \`${action.cwd}\`
- **执行结果**: ${action.success ? '✅ 成功' : '❌ 失败'}
${action.output ? '\n<details>\n<summary>查看输出详情</summary>\n\n```text\n' + action.output.substring(0, 1000) + '\n```\n</details>' : ''}

---
`;
  fs.appendFileSync(logFile, entry);
}

// ... 保持原有的 ensureJournalExists, addToLog, sendToLark 等函数 ...

export function ensureJournalExists() {
  const logPath = getLogPath();
  if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, `# ${new Date().toISOString().split('T')[0]}: 操作日志\n\n`);
  }
}

export function addToLog(content, options = { notify: false }) {
  ensureJournalExists();
  const logPath = getLogPath();
  const entry = `\n## 🔄 ${content.title || '系统记录'} - ${getCurrentTimestamp()}\n\n${content.body}\n\n---\n`;
  fs.appendFileSync(logPath, entry);
  if (options.notify) sendToLark(content.title, content.body);
}

export async function sendToLark(title, body) {
  try {
    const envPath = path.join(SECRETS_DIR, 'lark.env');
    if (!fs.existsSync(envPath)) return;
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const webhookUrl = envContent.match(/LARK_WEBHOOK_URL=(.+)/)?.[1];
    if (!webhookUrl) return;

    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 10 || currentHour >= 20) return;

    let lastNotif = { timestamp: 0, body: "" };
    if (fs.existsSync(NOTIF_LOCK_PATH)) {
      try { lastNotif = JSON.parse(fs.readFileSync(NOTIF_LOCK_PATH, 'utf-8')); } catch (e) {}
    }
    if (body.trim() === lastNotif.body.trim()) return;
    if (Date.now() - lastNotif.timestamp < 5 * 60 * 1000) return;

    const payload = {
      msg_type: "post",
      content: {
        post: { zh_cn: { title: `🧠 大脑同步: ${title}`, content: [[{ tag: "text", text: body.substring(0, 1000) }]] } }
      }
    };

    const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (response.ok) fs.writeFileSync(NOTIF_LOCK_PATH, JSON.stringify({ timestamp: Date.now(), body: body.trim() }));
  } catch (e) { console.error('Lark 推送失败:', e.message); }
}

export function pushSemanticContext(data) {
  let buffer = [];
  if (fs.existsSync(BUFFER_PATH)) {
    try { buffer = JSON.parse(fs.readFileSync(BUFFER_PATH, 'utf-8')); } catch (e) { buffer = []; }
  }
  buffer.push({ timestamp: getCurrentTimestamp(), ...data });
  fs.writeFileSync(BUFFER_PATH, JSON.stringify(buffer, null, 2));
}

export function consumeBuffer() {
  if (!fs.existsSync(BUFFER_PATH)) return null;
  const buffer = JSON.parse(fs.readFileSync(BUFFER_PATH, 'utf-8'));
  fs.unlinkSync(BUFFER_PATH);
  return buffer;
}

export default { pushSemanticContext, consumeBuffer, addToLog, getCurrentTimestamp, sendToLark, logAgentAction };
