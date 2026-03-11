#!/usr/bin/env node

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  FLEET_BRIDGE_PORT,
  FLEET_BRIDGE_RESTART_DELAY_MS
} from '../config/ai-team.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '../../')

const [mode = 'dev', ...restArgs] = process.argv.slice(2)
const vitepressArgs = [mode, 'docs', ...restArgs]
const bridgeEnv = {
  ...process.env,
  FLEET_CONTROL_PORT: String(FLEET_BRIDGE_PORT)
}
let bridge = null
let bridgeRestartTimer = null
let shuttingDown = false

function clearBridgeRestartTimer() {
  if (!bridgeRestartTimer) return
  clearTimeout(bridgeRestartTimer)
  bridgeRestartTimer = null
}

function spawnBridge() {
  clearBridgeRestartTimer()
  bridge = spawn('node', ['scripts/services/fleet-control-bridge.mjs'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: bridgeEnv
  })

  bridge.on('exit', (code, signal) => {
    if (shuttingDown) return
    console.warn(`fleet-control-bridge 已退出 (code=${code ?? 'null'}, signal=${signal ?? 'null'})，${FLEET_BRIDGE_RESTART_DELAY_MS}ms 后自动重启`)
    bridgeRestartTimer = setTimeout(() => {
      spawnBridge()
    }, FLEET_BRIDGE_RESTART_DELAY_MS)
  })

  bridge.on('error', (error) => {
    if (shuttingDown) return
    console.error('fleet-control-bridge 启动失败:', error)
  })
}

spawnBridge()

const vitepress = spawn('pnpm', ['exec', 'vitepress', ...vitepressArgs], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    CORTEXOS_LOCAL_TEAM: '1'
  }
})

function shutdown(code = 0) {
  shuttingDown = true
  clearBridgeRestartTimer()
  if (bridge && !bridge.killed) {
    bridge.kill('SIGTERM')
  }
  process.exit(code)
}

vitepress.on('exit', (code) => {
  shutdown(code ?? 0)
})

vitepress.on('error', (error) => {
  console.error(error)
  shutdown(1)
})

process.on('SIGINT', () => shutdown(130))
process.on('SIGTERM', () => shutdown(143))
