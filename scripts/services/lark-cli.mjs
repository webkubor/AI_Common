#!/usr/bin/env node

import { sendToLark } from './lark-service.mjs';

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return '';
  return process.argv[idx + 1] || '';
}

async function main() {
  const title = getArg('--title') || '🧠 大脑手动通知';
  const body = getArg('--body') || '';

  const result = await sendToLark(title, body);
  const payload = result || { ok: false, status: 'error', reason: 'unknown' };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(payload.ok ? 0 : 1);
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({ ok: false, status: 'error', reason: error.message })}\n`);
  process.exit(1);
});
