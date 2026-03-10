#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ensureFleetPaths } from "./fleet-paths.mjs";
import { fleetMetaKey, loadFleetMeta } from "./fleet-meta.mjs";
import { syncFleetDashboard } from "./sync-fleet-dashboard.mjs";
import { syncAiTeamState } from "../lib/ai-team-state.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "../../");
const { fleetFile } = ensureFleetPaths(projectRoot);

const CLEANUP_THRESHOLD_HOURS = 2;

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run") || argv.includes("-n")
  };
}

function parseDate(dateStr) {
  return new Date(dateStr.replace(/-/g, "/"));
}

function stripMarkdown(value) {
  return String(value ?? "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
}

function normalizeAgent(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Unknown";
  const lower = raw.toLowerCase();
  if (lower.includes("gemini")) return "Gemini";
  if (lower.includes("codex")) return "Codex";
  if (lower.includes("claude")) return "Claude";
  if (lower.includes("lobster")) return "Lobster";
  if (lower.includes("opencode")) return "OpenCode";
  return raw;
}

function inferRoleFromTask(task) {
  const text = String(task || "").toLowerCase();
  if (!text) return "未分配";
  if (/(前端|frontend|react|vue|页面|样式|css|ui|ux|h5|web)/i.test(text)) return "前端";
  if (/(后端|backend|api|服务|接口|数据库|db|sql|redis|中间件|server)/i.test(text)) return "后端";
  return "未分配";
}

function parseRow(line) {
  const cells = line.split("|").slice(1, -1).map(p => p.trim());
  if (cells.length < 6) return null;
  const hasRole = cells.length >= 7;
  return {
    cells,
    hasRole,
    nodeId: stripMarkdown(cells[0] || ""),
    agent: hasRole ? normalizeAgent(cells[1]) : normalizeAgent(cells[1]),
    workspace: stripMarkdown(hasRole ? cells[3] : cells[2]),
    task: stripMarkdown(hasRole ? cells[4] : cells[3]),
    startTimeStr: hasRole ? cells[5] : cells[4],
    status: hasRole ? cells[6] : cells[5]
  };
}

function buildRow(cells) {
  return `| ${cells.join(" | ")} |`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(fleetFile)) {
    console.error(`File not found: ${fleetFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(fleetFile, "utf8");
  const allLines = content.split(/\r?\n/);
  const headerIndex = allLines.findIndex((line) => line.includes("| 节点 ID (模型/别名) |"));
  
  if (headerIndex === -1) {
    console.error("Table header not found.");
    process.exit(1);
  }

  const now = new Date();
  const fleetMeta = loadFleetMeta();
  const tableHeader = allLines.slice(0, headerIndex + 2);
  const tableRows = [];
  const footerLines = [];
  let inTable = true;
  let cleanedCount = 0;

  // 1. 提取并清理行
  for (let i = headerIndex + 2; i < allLines.length; i++) {
    const line = allLines[i];
    
    if (inTable && line.trim().startsWith("|")) {
      const parsed = parseRow(line);
      if (!parsed || parsed.cells[0].includes("示例节点")) {
        tableRows.push(line);
        continue;
      }
      const nodeId = parsed.nodeId;
      const startTimeStr = parsed.startTimeStr;
      const status = parsed.status;
      const heartbeatEntry = fleetMeta.entries[fleetMetaKey(parsed.agent, parsed.workspace)] || null;
      const heartbeatStr = heartbeatEntry?.lastHeartbeatAt || startTimeStr;
      
      if (!startTimeStr.includes("-")) {
        tableRows.push(line);
        continue;
      }

      const heartbeatAt = parseDate(heartbeatStr);
      const diffHours = (now - heartbeatAt) / (1000 * 60 * 60);

      const isOffline = status.includes("已离线");
      const isExpired = diffHours > CLEANUP_THRESHOLD_HOURS;
      if (isOffline || isExpired) {
        console.log(`🗑️ 清理: ${nodeId} (${isOffline ? '已离线' : '已逾期'})`);
        cleanedCount++;
        continue;
      }

      tableRows.push(line);
    } else {
      if (line.trim().length > 0 && !line.trim().startsWith("|") && inTable) {
        inTable = false;
      }
      if (!inTable) {
        footerLines.push(line);
      }
    }
  }

  // 2. 检查队长状态并触发顺位继承
  let hasActiveCaptain = tableRows.some(row => row.includes("队长锁"));
  
  if (!hasActiveCaptain) {
    console.log("⚠️ 检测到指挥官空缺，正在寻找继承者...");
    
    // 找到所有有效的活跃行索引
    const candidateIndices = [];
    tableRows.forEach((row, index) => {
      if (row.includes("|") && !row.includes("示例节点") && !row.includes("已离线")) {
        candidateIndices.push(index);
      }
    });

    if (candidateIndices.length > 0) {
      // 继任不再看“领命时间”，而是优先选择最近仍在心跳的活跃节点。
      let bestIndex = candidateIndices[0];
      let latestHeartbeat = new Date(0);

      candidateIndices.forEach(idx => {
        const parsed = parseRow(tableRows[idx]);
        if (!parsed) return;
        const heartbeatEntry = fleetMeta.entries[fleetMetaKey(parsed.agent, parsed.workspace)] || null;
        const heartbeatStr = heartbeatEntry?.lastHeartbeatAt || parsed.startTimeStr;
        const time = parseDate(heartbeatStr);
        if (time > latestHeartbeat) {
          latestHeartbeat = time;
          bestIndex = idx;
        }
      });

      // 执行继任：修改该行的状态列
      const parsed = parseRow(tableRows[bestIndex]);
      const nodeId = parsed ? parsed.nodeId : "未知节点";
      if (parsed) {
        if (parsed.hasRole) parsed.cells[6] = "[ 队长锁 ] 活跃";
        else parsed.cells[5] = "[ 队长锁 ] 活跃";
        tableRows[bestIndex] = buildRow(parsed.cells);
      }
      
      console.log(`👑 顺位继承成功: ${nodeId} 已自动接任指挥官。`);
    } else {
      console.log("📭 阵列已清空，无可继任节点。");
    }
  }

  const finalContent = [...tableHeader, ...tableRows, ...footerLines].join("\n");
  if (!args.dryRun) {
    fs.writeFileSync(fleetFile, finalContent, "utf8");
    syncAiTeamState({
      action: "cleanup",
      operator: "system",
      reason: "fleet:cleanup",
      payload: {
        cleanedCount
      }
    });
    syncFleetDashboard();
  }
  console.log(`✨ 阵列维护完成${args.dryRun ? "（dry-run）" : ""}。`);
}

main();
