#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "../../");
const fleetFile = path.join(projectRoot, "docs/memory/fleet_status.md");

const CLEANUP_THRESHOLD_HOURS = 2;

function parseDate(dateStr) {
  return new Date(dateStr.replace(/-/g, "/"));
}

function main() {
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
  const newLines = allLines.slice(0, headerIndex + 2);
  const footerLines = [];
  let inTable = true;
  let cleanedCount = 0;

  for (let i = headerIndex + 2; i < allLines.length; i++) {
    const line = allLines[i];
    
    if (inTable && line.trim().startsWith("|")) {
      const parts = line.split("|").slice(1, -1).map(p => p.trim());
      if (parts.length < 6 || parts[0].includes("示例节点")) {
        newLines.push(line);
        continue;
      }

      const nodeId = parts[0].replace(/\*\*/g, "");
      const startTimeStr = parts[4];
      const status = parts[5];
      
      // 兼容非日期格式
      if (!startTimeStr.includes("-")) {
        newLines.push(line);
        continue;
      }

      const startTime = parseDate(startTimeStr);
      const diffHours = (now - startTime) / (1000 * 60 * 60);

      const isOffline = status.includes("已离线");
      const isExpired = diffHours > CLEANUP_THRESHOLD_HOURS;
      const isCaptain = status.includes("队长锁") || nodeId.includes("Prime");

      if ((isOffline || isExpired) && !isCaptain) {
        console.log(`🗑️ 清理: ${nodeId} (${isOffline ? '已离线' : '已逾期'})`);
        cleanedCount++;
        continue;
      }

      newLines.push(line);
    } else {
      if (line.trim().length > 0 && !line.trim().startsWith("|") && inTable) {
        inTable = false;
      }
      if (!inTable) {
        footerLines.push(line);
      }
    }
  }

  const finalContent = [...newLines, ...footerLines].join("\n");
  fs.writeFileSync(fleetFile, finalContent, "utf8");
  console.log(`✨ 清理完成，共移除了 ${cleanedCount} 个节点。`);
}

main();
