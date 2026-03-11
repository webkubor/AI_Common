#!/usr/bin/env node

import { getAiTeamState } from '../lib/ai-team-state.mjs'

function usage() {
  console.log('用法:')
  console.log('  node scripts/actions/fleet-status.mjs [--json]')
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    usage()
    return
  }

  const payload = getAiTeamState()
  if (args.includes('--json')) {
    console.log(JSON.stringify({ ok: true, ...payload }, null, 2))
    return
  }

  console.log('🧭 AI Team 状态总览')
  console.log(`总活跃节点: ${payload.total}`)
  console.log(`当前队长: ${payload.captain || '未检测到队长节点'}`)
  console.log('节点列表:')
  payload.agents.forEach((agent, index) => {
    const captainMark = agent.isCaptain ? ' [队长]' : ''
    console.log(`${index + 1}. ${agent.memberId}${captainMark}`)
    console.log(`   ${agent.agentName} | ${agent.role} | ${agent.workspace}`)
    console.log(`   任务: ${agent.task} | 状态: ${agent.status} | 心跳: ${agent.heartbeatAt}`)
  })
}

main()
