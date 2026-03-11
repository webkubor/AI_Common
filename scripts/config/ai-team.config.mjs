function readNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const FLEET_BRIDGE_HOST = process.env.FLEET_CONTROL_HOST || '127.0.0.1'
export const FLEET_BRIDGE_PORT = readNumber(process.env.FLEET_CONTROL_PORT, 18790)
export const FLEET_STATE_POLL_INTERVAL_MS = readNumber(process.env.AI_TEAM_STATE_POLL_INTERVAL_MS, 2000)
export const FLEET_SSE_PING_INTERVAL_MS = readNumber(process.env.AI_TEAM_SSE_PING_INTERVAL_MS, 15000)
export const FLEET_BRIDGE_RESTART_DELAY_MS = readNumber(process.env.AI_TEAM_BRIDGE_RESTART_DELAY_MS, 1200)
export const HEARTBEAT_TIMEOUT_HOURS = readNumber(process.env.AI_TEAM_HEARTBEAT_TIMEOUT_HOURS, 2)
