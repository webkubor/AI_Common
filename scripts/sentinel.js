#!/usr/bin/env node

/**
 * 记忆哨兵模块 (Sentinel V2.2 - Smart Notification)
 * 
 * 优化点：
 * 1. 增加 silent 模式，支持只记录日志不发推送。
 * 2. 增强 Lark 推送的消息卡片格式。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const BUFFER_PATH = path.join(__dirname, '../.context_buffer.json');
const SECRETS_DIR = path.join(__dirname, '../docs/secrets');

export function getCurrentTimestamp() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

export function getLogPath() {
  const today = new Date().toISOString().split('T')[0];
  return path.join(DOCS_DIR, 'memory', 'journal', `${today}.md`);
}

export function ensureJournalExists() {
  const logPath = getLogPath();
  const journalDir = path.dirname(logPath);
  if (!fs.existsSync(journalDir)) fs.mkdirSync(journalDir, { recursive: true });

  if (!fs.existsSync(logPath)) {
    const templatePath = path.join(journalDir, 'new-task-template.md');
    let content = `# ${new Date().toISOString().split('T')[0]}: 操作日志\n\n`;
    if (fs.existsSync(templatePath)) {
      content = fs.readFileSync(templatePath, 'utf-8');
    }
    fs.writeFileSync(logPath, content);
  }
}

// 默认不发送，除非显式指定 notify: true
export function addToLog(content, options = { notify: false }) {
  ensureJournalExists();
  const logPath = getLogPath();
  const entry = `\n## 🔄 ${content.title || '系统记录'} - ${getCurrentTimestamp()}\n\n${content.body}\n\n---\n`;
  fs.appendFileSync(logPath, entry);
  
  if (options.notify) {
    sendToLark(content.title, content.body);
  }
}

export async function sendToLark(title, body) {
  try {
    const envPath = path.join(SECRETS_DIR, 'lark.env');
    if (!fs.existsSync(envPath)) return;
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const webhookUrl = envContent.match(/LARK_WEBHOOK_URL=(.+)/)?.[1];
    if (!webhookUrl) return;

    const payload = {
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: `🧠 大脑同步: ${title}`,
            content: [
              [{ tag: "text", text: body.substring(0, 800) }]
            ]
          }
        }
      }
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Lark 推送失败:', e.message);
  }
}

export function pushSemanticContext(data) {
  let buffer = [];
  if (fs.existsSync(BUFFER_PATH)) {
    try {
      buffer = JSON.parse(fs.readFileSync(BUFFER_PATH, 'utf-8'));
    } catch (e) { buffer = []; }
  }
  buffer.push({
    timestamp: getCurrentTimestamp(),
    ...data
  });
  fs.writeFileSync(BUFFER_PATH, JSON.stringify(buffer, null, 2));
}

export function consumeBuffer() {
  if (!fs.existsSync(BUFFER_PATH)) return null;
  const buffer = JSON.parse(fs.readFileSync(BUFFER_PATH, 'utf-8'));
  fs.unlinkSync(BUFFER_PATH);
  return buffer;
}

export default {
  pushSemanticContext,
  consumeBuffer,
  addToLog,
  getCurrentTimestamp,
  sendToLark
};
