#!/usr/bin/env node

import { syncProjectRegistry } from './project-registry.mjs'
import { syncFleetDashboard } from './sync-fleet-dashboard.mjs'
import { claimAiTeamMember } from '../lib/ai-team-state.mjs'
import { inferRoleFromTask, normalizeAgent, normalizeRole, sanitizeCell } from '../lib/agent-utils.mjs'

function parseArgs(argv) {
  const args = {
    workspace: process.cwd(),
    task: '待分配任务',
    agent: '',
    alias: '',
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
  const rawAgent = sanitizeCell(args.agent)
  args.agent = rawAgent ? normalizeAgent(rawAgent) : ''
  args.alias = sanitizeCell(args.alias || rawAgent)
  args.role = normalizeRole(sanitizeCell(args.role || inferRoleFromTask(args.task)))
  return args
}

function printHelp() {
  console.log('用法:')
  console.log('  node scripts/actions/fleet-claim.mjs --workspace <path> --task <任务描述> --agent <Gemini|Codex|Claude> [--alias 名称] [--role 前端|后端]')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }

  if (!args.agent) {
    throw new Error('fleet:claim 必须显式传入 --agent')
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
    activeTaskId: result.agents?.find(item => item.memberId === result.nodeId)?.task?.split('｜')[0] || '',
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
