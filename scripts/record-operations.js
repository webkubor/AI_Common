#!/usr/bin/env node

/**
 * 大脑实际操作记录器
 * 
 * 记录内容：
 * - Git 提交（commit message + 变更文件）
 * - 文件操作（新增、修改、删除）
 * - 目录结构变化
 * - 脚本执行历史
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const PROJECT_ROOT = path.join(__dirname, '..');

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function getLogPath() {
  const today = getCurrentDate();
  return path.join(DOCS_DIR, 'memory', 'journal', `${today}.md`);
}

function ensureJournalExists() {
  const logPath = getLogPath();
  const journalDir = path.dirname(logPath);

  if (!fs.existsSync(journalDir)) {
    fs.mkdirSync(journalDir, { recursive: true });
  }

  if (!fs.existsSync(logPath)) {
    const header = `# ${getCurrentDate()}: 操作日志\n\n`;
    fs.writeFileSync(logPath, header);
  }
}

function appendToLog(content) {
  ensureJournalExists();
  const logPath = getLogPath();
  fs.appendFileSync(logPath, content + '\n\n');
}

function getLastCommit() {
  try {
    const commit = execSync('git log -1 --pretty=format:"%h - %s (%cr)"', {
      encoding: 'utf-8',
      cwd: PROJECT_ROOT
    });
    return commit.trim();
  } catch (error) {
    return null;
  }
}

function getLastCommitFiles() {
  try {
    const files = execSync('git diff-tree --no-commit-id --name-status -r HEAD', {
      encoding: 'utf-8',
      cwd: PROJECT_ROOT
    });
    return files.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getCurrentChanges() {
  try {
    const changes = execSync('git status --short', {
      encoding: 'utf-8',
      cwd: PROJECT_ROOT
    });
    return changes.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function recordOperations() {
  console.log('📝 记录实际操作...\n');

  const lastCommit = getLastCommit();
  const commitFiles = getLastCommitFiles();
  const currentChanges = getCurrentChanges();

  let hasOperations = false;
  let log = `## 🔄 实际操作记录 - ${getCurrentTimestamp()}\n\n`;

  // 记录最后一次提交
  if (lastCommit) {
    log += `### 📦 最新提交\n`;
    log += `\`\`\`\n${lastCommit}\n\`\`\`\n\n`;

    if (commitFiles.length > 0) {
      log += `**变更文件** (${commitFiles.length} 个):\n`;
      commitFiles.slice(0, 10).forEach(f => {
        log += `- ${f}\n`;
      });
      if (commitFiles.length > 10) {
        log += `- ... 共 ${commitFiles.length} 个\n`;
      }
      log += '\n';
    }

    hasOperations = true;
  }

  // 记录当前未提交的变更
  if (currentChanges.length > 0) {
    log += `### 📝 当前变更 (未提交)\n`;
    currentChanges.slice(0, 10).forEach(c => {
      log += `- ${c}\n`;
    });
    if (currentChanges.length > 10) {
      log += `- ... 共 ${currentChanges.length} 个\n`;
    }
    log += '\n';

    hasOperations = true;
  }

  // 如果有操作，记录到日志
  if (hasOperations) {
    log += `**记录时间**: ${getCurrentTimestamp()}\n`;
    log += `\n---\n`;
    
    appendToLog(log);
    console.log('✅ 实际操作已记录');
    
    if (lastCommit) {
      console.log(`  • 最新提交: ${lastCommit.substring(0, 60)}...`);
    }
    if (currentChanges.length > 0) {
      console.log(`  • 当前变更: ${currentChanges.length} 个文件`);
    }
  } else {
    console.log('ℹ️ 无新操作，跳过记录');
  }

  return hasOperations;
}

// 如果作为命令行运行
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('📋 大脑实际操作记录器');
  console.log('='.repeat(60));
  recordOperations();
  console.log('\n='.repeat(60));
}

// 导出供其他脚本调用
export { recordOperations };
