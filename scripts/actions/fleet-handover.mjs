#!/usr/bin/env node

import { makeAiTeamCaptain } from '../lib/ai-team-state.mjs'
import { syncFleetDashboard } from './sync-fleet-dashboard.mjs'

function sanitizeCell(value) {
  return String(value ?? '').replace(/\|/g, '｜').trim()
}

function parseArgs(argv) {
  const args = { toNode: '', dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token === '--to-node' && argv[i + 1]) args.toNode = sanitizeCell(argv[++i])
    else if (token === '--dry-run') args.dryRun = true
    else if (token === '--help' || token === '-h') args.help = true
  }
  return args
}

function printHelp() {
  console.log('用法:')
  console.log('  node scripts/actions/fleet-handover.mjs --to-node "<节点ID文本>" [--dry-run]')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }
  if (!args.toNode) {
    console.error('缺少目标参数：请传 --to-node。')
    process.exit(1)
  }
  if (args.dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, to: args.toNode }, null, 2))
    return
  }

  const result = makeAiTeamCaptain(args.toNode, {
    operator: 'system',
    reason: 'fleet:handover',
    payload: { to: args.toNode }
  })
  syncFleetDashboard()

  console.log(JSON.stringify({
    ok: true,
    from: result.from,
    to: result.to,
    time: new Date().toISOString(),
    dryRun: false
  }, null, 2))
}

main()
