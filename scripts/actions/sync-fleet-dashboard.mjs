#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadFleetMeta, fleetMetaKey } from "./fleet-meta.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "../../");
const sourceFile = path.join(projectRoot, "docs/memory/fleet_status.md");
const outputFile = path.join(projectRoot, "docs/public/data/ai_team_status.json");
const STALE_HOURS = Number(process.env.FLEET_STALE_HOURS || "4");

function stripMarkdown(value) {
  return String(value ?? "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
}

function normalizeAgent(value) {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();
  if (lower.includes("gemini")) return "Gemini";
  if (lower.includes("codex")) return "Codex";
  if (lower.includes("claude")) return "Claude";
  if (lower.includes("opencode")) return "OpenCode";
  return raw || "Unknown";
}

/**
 * 核心逻辑：从任务工作区的 TODO.md 提取客观进度
 */
function getProgressFromTodo(workspacePath) {
  try {
    const todoPath = path.join(workspacePath, "TODO.md");
    if (!fs.existsSync(todoPath)) return null;

    const content = fs.readFileSync(todoPath, "utf8");
    const lines = content.split("\n");
    
    let total = 0;
    let completed = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      // 匹配 - [ ] 或 - [x]
      if (trimmed.startsWith("- [ ]")) {
        total++;
      } else if (trimmed.match(/^- \[[xX]\]/)) {
        total++;
        completed++;
      }
    }

    if (total === 0) return null;
    return Math.round((completed / total) * 100);
  } catch (err) {
    return null;
  }
}

function statusToProgress(status) {
  const s = String(status ?? "");
  if (s.includes("等待分配")) return 5;
  if (s.includes("执行中")) return 55;
  if (s.includes("队长锁")) return 60;
  if (s.includes("已离线")) return 100;
  return 20;
}

function statusType(status) {
  const s = String(status ?? "");
  if (s.includes("已离线")) return "offline";
  if (s.includes("执行中") || s.includes("队长锁")) return "active";
  if (s.includes("等待分配")) return "queued";
  return "unknown";
}

function parseLocalTime(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return null;
  const normalized = raw.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function parseTableRow(line) {
  const parts = line.split("|").slice(1, -1).map((s) => s.trim());
  if (parts.length < 6) return null;
  const node = stripMarkdown(parts[0]);
  if (!node || node.includes("节点 ID") || node.includes("---") || node.includes("示例节点")) return null;

  return {
    member: node,
    agent: normalizeAgent(parts[1]),
    workspace: stripMarkdown(parts[2]),
    task: stripMarkdown(parts[3]),
    since: stripMarkdown(parts[4]),
    status: stripMarkdown(parts[5]),
  };
}

function main() {
  if (!fs.existsSync(sourceFile)) {
    console.error(`source not found: ${sourceFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(sourceFile, "utf8");
  const lines = content.split("\n");
  const headerIndex = lines.findIndex((line) => line.includes("| 节点 ID (模型/别名) |"));
  if (headerIndex === -1) {
    console.error("table header not found in fleet_status.md");
    process.exit(1);
  }

  const rows = [];
  const fleetMeta = loadFleetMeta();
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().startsWith("|")) break;
    const row = parseTableRow(line);
    if (!row) continue;

    // 尝试从 TODO.md 获取客观进度，获取不到则走兜底
    const todoProgress = getProgressFromTodo(row.workspace);
    const finalProgress = todoProgress !== null ? todoProgress : statusToProgress(row.status);

    const baseType = statusType(row.status);
    const meta = fleetMeta.entries[fleetMetaKey(row.agent, row.workspace)] || null;
    const heartbeatRaw = meta?.lastHeartbeatAt || row.since;
    const heartbeatDate = parseLocalTime(heartbeatRaw);
    const isStale =
      heartbeatDate &&
      (baseType === "active" || baseType === "queued") &&
      (Date.now() - heartbeatDate.getTime()) / (1000 * 60 * 60) > STALE_HOURS;

    const finalType = isStale ? "offline" : baseType;
    const finalStatus = isStale ? "[ 僵尸 ] 离线（超时未更新）" : row.status;

    rows.push({
      ...row,
      status: finalStatus,
      type: finalType,
      progress: finalProgress,
      isCaptain: row.member.includes("Prime") || row.status.includes("队长锁"),
      hasTodo: todoProgress !== null,
      isStale: Boolean(isStale),
      firstLoginAt: meta?.firstLoginAt || row.since,
      lastHeartbeatAt: heartbeatRaw,
      lastTask: meta?.lastTask || row.task,
      lastStatus: meta?.lastStatus || row.status,
      lastCompletedTask: meta?.lastCompletedTask || null,
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    version: "v5.3.0 (Objective Progress + Zombie Detection + Heartbeat Meta)",
    source: "docs/memory/fleet_status.md",
    total: rows.length,
    active: rows.filter((r) => r.type === "active").length,
    offline: rows.filter((r) => r.type === "offline").length,
    queued: rows.filter((r) => r.type === "queued").length,
    stale: rows.filter((r) => r.isStale).length,
    members: rows,
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `synced: ${outputFile} (Objective Progress + Zombie Detection, threshold=${STALE_HOURS}h)`
  );
}

main();
