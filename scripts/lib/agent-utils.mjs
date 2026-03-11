export function sanitizeCell(value) {
  return String(value ?? '').replace(/\|/g, '｜').trim()
}

export function normalizeAgent(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return 'Unknown'
  const lower = raw.toLowerCase()
  if (lower.includes('gemini')) return 'Gemini'
  if (lower.includes('codex')) return 'Codex'
  if (lower.includes('claude')) return 'Claude'
  if (lower.includes('lobster')) return 'Lobster'
  if (lower.includes('opencode')) return 'OpenCode'
  return raw
}

export function normalizeRole(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return '未分配'
  const lower = raw.toLowerCase()
  if (/(前端|frontend|front-end|fe)/i.test(lower)) return '前端'
  if (/(后端|backend|back-end|be)/i.test(lower)) return '后端'
  return raw
}

export function inferRoleFromTask(task) {
  const text = String(task || '').toLowerCase()
  if (!text) return '未分配'
  if (/(前端|frontend|react|vue|页面|样式|css|ui|ux|h5|web)/i.test(text)) return '前端'
  if (/(后端|backend|api|服务|接口|数据库|db|sql|redis|中间件|server)/i.test(text)) return '后端'
  return '未分配'
}
