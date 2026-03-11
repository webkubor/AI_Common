#!/usr/bin/env node

import { syncProjectRegistry } from './project-registry.mjs'
import { syncFleetDashboard } from './sync-fleet-dashboard.mjs'
import { claimAiTeamMember } from '../lib/ai-team-state.mjs'

function sanitizeCell(value) {
  return String(value ?? '').replace(/\|/g, '｜').trim()
}

function normalizeAgent(value) {
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

function inferRoleFromTask(task) {
  const text = String(task || '').toLowerCase()
  if (!text) return '未分配'
  if (/(前端|frontend|react|vue|页面|样式|css|ui|ux|h5|web)/i.test(text)) return '前端'
  if (/(后端|backend|api|服务|接口|数据库|db|sql|redis|中间件|server)/i.test(text)) return '后端'
  return '未分配'
}

function normalizeRole(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return '未分配'
  const lower = raw.toLowerCase()
  if (/(前端|frontend|front-end|fe)/i.test(lower)) return '前端'
  if (/(后端|backend|back-end|be)/i.test(lower)) return '后端'
  return raw
}

function parseArgs(argv) {
  const args = {
    workspace: process.cwd(),
    task: '待分配任务',
    agent: 'Gemini',
    alias: 'Candy',
    role: '',
    status: '[ 执行中 ] 活跃',
    dryRun: false
  }

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token === '--workspace' && argv[i + 1]) args.workspace = argv[++i]
    else if (token === '--task' && argv[i + 1]) args.task = argv[++i]
    else if (token === '--agent' && argv[i + 1]) args.agent = argv[++i]
    else if (token === '--alias' && argv[i + 1]) args.alias = argv[++i]
    else if (token === '--role' && argv[i + 1]) args.role = argv[++i]
    else if (token === '--status' && argv[i + 1]) args.status = argv[++i]
    else if (token === '--dry-run') args.dryRun = true
    else if (token === '--help' || token === '-h') args.help = true
  }

  args.task = sanitizeCell(args.task)
  args.status = sanitizeCell(args.status)
  args.agent = normalizeAgent(sanitizeCell(args.agent))
  args.alias = sanitizeCell(args.alias)
  args.role = normalizeRole(sanitizeCell(args.role || inferRoleFromTask(args.task)))
  return args
}

function printHelp() {
  console.log('用法:')
  console.log('  node scripts/actions/fleet-claim.mjs --workspace <path> --task <任务描述> [--agent Gemini] [--alias Candy] [--role 前端|后端]')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }

  if (args.dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, workspace: args.workspace, task: args.task }, null, 2))
    return
  }

  const result = claimAiTeamMember(args)
  let projectRegistry = null
  try {
    projectRegistry = syncProjectRegistry({
      workspace: args.workspace,
      agent: args.agent,
      role: args.role,
      task: args.task,
      nodeId: result.nodeId,
      dryRun: false
    })
  } catch (error) {
    result.warnings.push(`项目索引同步失败: ${sanitizeCell(error?.message || error)}`)
  }

  try {
    syncFleetDashboard()
  } catch (error) {
    result.warnings.push(`看板数据同步失败: ${sanitizeCell(error?.message || error)}`)
  }

  console.log(JSON.stringify({
    ok: true,
    machineNumber: result.machineNumber,
    nodeId: result.nodeId,
    agent: args.agent,
    role: args.role,
    workspace: args.workspace,
    task: args.task,
    warnings: result.warnings,
    projectRegistry: projectRegistry ? {
      name: projectRegistry.project.name,
      rootPath: projectRegistry.project.rootPath,
      lastWorkspace: projectRegistry.project.lastWorkspace,
      commandCenterFile: projectRegistry.commandCenterFile
    } : null,
    dryRun: false
  }, null, 2))
}

main()
