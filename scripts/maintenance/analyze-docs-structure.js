#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const rootDir = path.join(__dirname, '..');

function getAllMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md') && !item.name.endsWith('.mjs')) {
      files.push(fullPath);
    }
  }

  return files;
}

function scanDirectory(file) {
  const relativePath = file.replace(DOCS_DIR + path.sep, '');
  const parts = relativePath.split(path.sep);

  const category = parts[0] || 'root';

  let type = 'unknown';
  if (category === 'memory' && parts.includes('journal')) {
    type = 'log';
  } else if (category === 'retrospectives') {
    type = 'archive';
  } else if (category === 'secrets') {
    type = 'security';
  } else if (category === 'persona' && (parts.includes('refs') || parts.includes('.png') || parts.includes('.jpeg'))) {
    type = 'asset';
  } else if (parts.includes('temp') || parts.includes('draft') || parts.includes('backup')) {
    type = 'temp';
  } else if (parts.includes('examples') || parts.includes('demo')) {
    type = 'example';
  } else if (category === 'snippets') {
    type = 'snippet';
  } else if (category === 'public') {
    type = 'asset';
  } else if (category === 'creative') {
    type = 'asset';
  } else if (category === 'checklists') {
    type = 'resource';
  } else {
    type = 'content';
  }

  return { category, type, relativePath };
}

function analyzeStructure() {
  console.log('🔍 CortexOS 外部大脑结构自检\n');

  const allMdFiles = getAllMarkdownFiles(DOCS_DIR);
  const directoryStructure = {};

  for (const file of allMdFiles) {
    const relativePath = file.replace(DOCS_DIR + path.sep, '');
    const { category, type, relativePath: normalizedPath } = scanDirectory(file);

    if (!directoryStructure[category]) {
      directoryStructure[category] = { type, files: [], count: 0 };
    }

    directoryStructure[category].files.push(normalizedPath);
    directoryStructure[category].count++;
  }

  console.log('📊 总体统计:\n');
  console.log(`  - Markdown 文件: ${allMdFiles.length} 个`);

  const categorizedCount = Object.values(directoryStructure).reduce((acc, curr) => acc + curr.count, 0);
  console.log(`  - 目录分类: ${Object.keys(directoryStructure).length} 个\n`);

  console.log('📂 目录分析:\n');

  for (const [category, info] of Object.entries(directoryStructure)) {
    console.log(`  📁 ${category}/ (${info.count} 个文件)`);
    console.log(`     → 类型: ${info.type}`);

    if (info.files.length <= 5) {
      console.log(`     → 文件列表:`);
      info.files.forEach(f => {
        console.log(`         • ${f}`);
      });
    } else {
      console.log(`     → 前 3 个文件:`);
      info.files.slice(0, 3).forEach(f => {
        console.log(`         • ${f}`);
      });
      console.log(`         … 共 ${info.files.length} 个`);
    }

    console.log('');
  }

  console.log('🚨 建议处理:\n');

  console.log('1. 日志文件应归档:');
  const logFiles = Object.values(directoryStructure)
    .filter(item => item.type === 'log')
    .flatMap(item => item.files);

  logFiles.forEach(file => {
    console.log(`   → ${file} → archive/logs/`);
  });
  console.log('');

  console.log('2. 安全/密钥文件应排除:');
  const securityFiles = Object.values(directoryStructure)
    .filter(item => item.type === 'security')
    .flatMap(item => item.files);

  securityFiles.forEach(file => {
    console.log(`   → ${file} (已排除，但确认 srcExclude 配置)`);
  });
  console.log('');

  console.log('3. 临时文件应归档:');
  const tempFiles = Object.values(directoryStructure)
    .filter(item => item.type === 'temp')
    .flatMap(item => item.files);

  tempFiles.forEach(file => {
    console.log(`   → ${file} → archive/temp/`);
  });
  console.log('');

  console.log('4. 图片/资源移动建议:');
  const assetDirectories = ['persona_refs', 'creative', 'public/images'];

  for (const dir of assetDirectories) {
    const files = directoryStructure[dir]?.files || [];
    if (files.length > 0) {
      console.log(`   → ${dir}/ (${files.length} 个文件)`);

      if (dir === 'persona_refs') {
        console.log(`     → 建议移到: public/images/persona/`);
      }
    }
  }
  console.log('');

  console.log('5. 复盘文档应重组:');
  const archiveFiles = Object.values(directoryStructure)
    .filter(item => item.type === 'archive')
    .flatMap(item => item.files);

  archiveFiles.slice(0, 10).forEach(file => {
    console.log(`   → ${file}`);
  });
  if (archiveFiles.length > 10) {
    console.log(`   … 共 ${archiveFiles.length} 个复盘文件`);
  }
  console.log('');

  console.log('✅ 索引状态检查:\n');

  const indexFiles = ['router.md', 'index.md', 'about.md', 'tech_stack.md', 'snippets/index.md'];
  let allIndexed = true;

  for (const file of indexFiles) {
    const filePath = path.join(DOCS_DIR, file);
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? '✅' : '❌'} ${file} ${exists ? '' : '(缺失)'}`);

    if (!exists) {
      allIndexed = false;
    }
  }
  console.log('');

  if (allIndexed) {
    console.log('🎉 索引文件完整');
  } else {
    console.log('⚠️  部分索引文件缺失，需要补充');
  }
}

analyzeStructure();