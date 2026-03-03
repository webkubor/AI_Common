import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '../../');

const SECRETS_DIR = process.env.CORTEXOS_SECRET_HOME || path.join(os.homedir(), 'Documents', 'memory', 'secrets');
const NOTIF_LOCK_PATH = path.join(PROJECT_ROOT, '.last_notif.json');

function buildLarkParagraphs(body, options = {}) {
  const maxChars = options.maxChars ?? 1800;
  const maxLines = options.maxLines ?? 22;
  const maxLineLength = options.maxLineLength ?? 180;
  const lines = String(body ?? '').split('\n');
  const paragraphs = [];
  let usedChars = 0;

  for (const rawLine of lines) {
    let line = rawLine.replace(/\t/g, '  ').trimEnd();
    if (!line) line = ' ';

    if (line.length > maxLineLength) {
      line = `${line.slice(0, maxLineLength - 1)}…`;
    }

    if (usedChars + line.length > maxChars || paragraphs.length >= maxLines) {
      paragraphs.push([{ tag: 'text', text: '…（内容已折叠，详情见本地日志）' }]);
      break;
    }

    paragraphs.push([{ tag: 'text', text: line }]);
    usedChars += line.length;
  }

  if (paragraphs.length === 0) {
    paragraphs.push([{ tag: 'text', text: '（空通知）' }]);
  }

  return paragraphs;
}

export async function sendToLark(title, body) {
  try {
    const normalizedBody = String(body ?? '');
    const envPath = path.join(SECRETS_DIR, 'lark.env');
    if (!fs.existsSync(envPath)) {
      return { ok: false, status: 'skipped', reason: 'missing_lark_env' };
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const webhookUrl = envContent.match(/LARK_WEBHOOK_URL=(.+)/)?.[1];
    if (!webhookUrl) {
      return { ok: false, status: 'skipped', reason: 'missing_webhook' };
    }

    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 10 || currentHour >= 20) {
      return { ok: false, status: 'skipped', reason: 'out_of_working_hours' };
    }

    let lastNotif = { timestamp: 0, body: '' };
    if (fs.existsSync(NOTIF_LOCK_PATH)) {
      try {
        lastNotif = JSON.parse(fs.readFileSync(NOTIF_LOCK_PATH, 'utf-8'));
      } catch (e) {}
    }

    if (normalizedBody.trim() === String(lastNotif.body ?? '').trim()) {
      return { ok: false, status: 'skipped', reason: 'same_body_dedup' };
    }
    if (Date.now() - lastNotif.timestamp < 5 * 60 * 1000) {
      return { ok: false, status: 'skipped', reason: 'cooldown' };
    }

    const paragraphs = buildLarkParagraphs(normalizedBody, { maxChars: 1800, maxLines: 22 });
    const payload = {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: `🧠 大脑同步: ${title}`,
            content: paragraphs
          }
        }
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      fs.writeFileSync(NOTIF_LOCK_PATH, JSON.stringify({ timestamp: Date.now(), body: normalizedBody.trim() }));
      return { ok: true, status: 'sent', reason: 'ok' };
    }
    return { ok: false, status: 'error', reason: `http_${response.status}` };
  } catch (e) {
    console.error('Lark 推送失败:', e.message);
    return { ok: false, status: 'error', reason: e.message };
  }
}
