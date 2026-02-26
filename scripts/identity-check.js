#!/usr/bin/env node

/**
 * 身份自检脚本
 * 
 * 功能：
 * 1. 确定当前 Agent 身份
 * 2. 检查继承能力是否完整
 * 3. 确认 MCP 配置
 * 4. 生成自检报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, '../docs');

function getCurrentTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function checkIdentity() {
  console.log('🤖 身份自检开始...\n');
  console.log('='.repeat(60));

  const agents = ['gemini', 'codex', 'claude', 'opencode'];
  const identities = {};

  for (const agent of agents) {
    const manifestPath = path.join(DOCS_DIR, 'agents', agent, 'manifest.md');
    
    if (fs.existsSync(manifestPath)) {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      
      // 提取身份信息
      const nameMatch = content.match(/当前身份[：:]\s*(.+)/);
      const coreMatch = content.match(/核心代号[：:]\s*(.+)/);
      
      identities[agent] = {
        exists: true,
        name: nameMatch ? nameMatch[1].trim() : '未知',
        code: coreMatch ? coreMatch[1].trim() : '未知'
      };

      console.log(`✅ ${agent.toUpperCase()} Agent:`);
      console.log(`   身份: ${identities[agent].name}`);
      console.log(`   代号: ${identities[agent].code}`);
    } else {
      identities[agent] = { exists: false };
      console.log(`❌ ${agent.toUpperCase()} Agent: manifest.md 不存在`);
    }
  }

  console.log('\n' + '='.repeat(60));
  return identities;
}

function checkCapabilities() {
  console.log('\n🧩 能力继承检查...\n');
  console.log('='.repeat(60));

  const commonManifestPath = path.join(DOCS_DIR, 'skills', 'core', 'common_manifest.md');
  
  if (!fs.existsSync(commonManifestPath)) {
    console.log('❌ 公共技能清单不存在：skills/core/common_manifest.md');
    return { exists: false };
  }

  console.log('✅ 公共技能清单存在');
  
  const content = fs.readFileSync(commonManifestPath, 'utf-8');
  
  // 检查技能目录
  const skillDirs = ['core', 'writers', 'ops', 'engineering', 'visual', 'knowledge'];
  const skillStatus = {};

  for (const dir of skillDirs) {
    const dirPath = path.join(DOCS_DIR, 'skills', dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      skillStatus[dir] = {
        exists: true,
        count: files.length
      };
      console.log(`✅ skills/${dir}/ - ${files.length} 个技能`);
    } else {
      skillStatus[dir] = { exists: false };
      console.log(`❌ skills/${dir}/ - 目录不存在`);
    }
  }

  console.log('\n' + '='.repeat(60));
  return skillStatus;
}

function checkMCP() {
  console.log('\n🔌 MCP 配置检查...\n');
  console.log('='.repeat(60));

  const agents = ['gemini', 'codex', 'claude'];
  const mcpStatus = {};

  for (const agent of agents) {
    const mcpPath = path.join(DOCS_DIR, 'agents', agent, 'mcp.md');
    
    if (fs.existsSync(mcpPath)) {
      mcpStatus[agent] = { exists: true };
      console.log(`✅ ${agent.toUpperCase()} MCP 配置存在`);
    } else {
      mcpStatus[agent] = { exists: false };
      console.log(`❌ ${agent.toUpperCase()} MCP 配置不存在`);
    }
  }

  console.log('\n' + '='.repeat(60));
  return mcpStatus;
}

function generateReport(identities, capabilities, mcp) {
  console.log('\n📊 自检报告生成...\n');
  
  const report = {
    timestamp: getCurrentTimestamp(),
    identities,
    capabilities,
    mcp,
    summary: {
      totalAgents: Object.keys(identities).length,
      validAgents: Object.values(identities).filter(i => i.exists).length,
      totalSkillDirs: Object.keys(capabilities).length,
      validSkillDirs: Object.values(capabilities).filter(s => s.exists).length,
      totalMCP: Object.keys(mcp).length,
      validMCP: Object.values(mcp).filter(m => m.exists).length
    }
  };

  console.log('📈 总体统计:');
  console.log(`  • Agent 配置: ${report.summary.validAgents}/${report.summary.totalAgents} 个有效`);
  console.log(`  • 技能目录: ${report.summary.validSkillDirs}/${report.summary.totalSkillDirs} 个有效`);
  console.log(`  • MCP 配置: ${report.summary.validMCP}/${report.summary.totalMCP} 个有效`);

  if (report.summary.validAgents === report.summary.totalAgents &&
      report.summary.validSkillDirs === report.summary.totalSkillDirs &&
      report.summary.validMCP === report.summary.totalMCP) {
    console.log('\n✅ 身份自检通过！所有配置完整。');
  } else {
    console.log('\n⚠️ 发现缺失配置，请检查上述输出。');
  }

  return report;
}

function runIdentityCheck() {
  console.log('🧠 AI Common 身份自检系统');
  console.log('='.repeat(60));
  console.log(`执行时间：${getCurrentTimestamp()}\n`);

  // 1. 检查身份
  const identities = checkIdentity();

  // 2. 检查能力继承
  const capabilities = checkCapabilities();

  // 3. 检查 MCP
  const mcp = checkMCP();

  // 4. 生成报告
  const report = generateReport(identities, capabilities, mcp);

  console.log('\n' + '='.repeat(60));
  console.log('✨ 身份自检完成');
}

// 如果作为命令行运行
if (import.meta.url === `file://${process.argv[1]}`) {
  runIdentityCheck();
}

// 导出供其他脚本调用
export { runIdentityCheck, checkIdentity, checkCapabilities, checkMCP };
