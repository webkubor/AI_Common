#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../../docs');
const rootDir = path.join(__dirname, '..');

function createArchiveDirectories() {
  const archiveDirs = [
    'archive/assets',
    'archive/temp',
    'archive/others'
  ];

  console.log('📁 创建归档目录结构...\n');

  for (const dir of archiveDirs) {
    const fullPath = path.join(DOCS_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ 创建: ${dir}`);
    } else {
      console.log(`  ✓ 存在: ${dir}`);
    }
  }
  console.log('');
}

function moveLogFiles() {
  console.log('📤 检查历史日志迁移状态...\n');
  console.log('  ℹ️ 运行日志现统一写入 .memory/logs/，docs/memory/journal 已退役');
  console.log('');
}

function movePersonaImages() {
  console.log('🖼️ 移动 Persona 图片资源...\n');

  const personaRefsDir = path.join(DOCS_DIR, 'ucd', 'persona_refs');
  const targetDir = path.join(DOCS_DIR, 'public', 'images', 'persona');

  if (!fs.existsSync(personaRefsDir)) {
    console.log('  ⚠️ persona_refs 目录不存在');
    console.log('');
    return;
  }

  const files = fs.readdirSync(personaRefsDir);
  let movedCount = 0;

  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      const source = path.join(personaRefsDir, file);
      const target = path.join(targetDir, file);

      if (!fs.existsSync(target)) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.renameSync(source, target);
        console.log(`  ✅ ${file} → public/images/persona/`);
        movedCount++;
      }
    }
  }

  if (movedCount === 0) {
    console.log('  ℹ️ 无需移动图片');
  }
  console.log('');
}

function cleanDotfiles() {
  console.log('🧹 清理临时文件...\n');

  const dotfiles = ['.DS_Store'];

  for (const file of dotfiles) {
    const targetDir = DOCS_DIR;
    const targetFile = path.join(targetDir, file);

    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
      console.log(`  ✅ 删除: ${file}`);
    }
  }

  if (dotfiles.every(file => !fs.existsSync(path.join(DOCS_DIR, file)))) {
    console.log('  ℹ️ 无需清理临时文件');
  }
  console.log('');
}

function createArchiveIndex() {
  console.log('📄 创建归档索引...\n');

  const archiveDirs = [
    'assets',
    'temp',
    'others'
  ];

  for (const type of archiveDirs) {
    const dirPath = path.join(DOCS_DIR, 'archive', type);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length > 0) {
        console.log(`  📁 archive/${type}/ (${files.length} 个文件)`);

      }
    }
  }
  console.log('');
}

function runCleanup() {
  console.log('🚀 CortexOS 文档清理与优化\n');
  console.log('='.repeat(50));

  createArchiveDirectories();
  moveLogFiles();
  movePersonaImages();
  cleanDotfiles();
  createArchiveIndex();

  console.log('='.repeat(50));
  console.log('✅ 清理完成！\n');

  console.log('📝 后续建议:');
  console.log('  1. 运行: git add docs/archive docs/public/images/persona');
  console.log('  2. 运行: git commit -m "docs: 整理外部大脑结构 - 清理旧路径与资源"');
  console.log('  3. 检查: .memory/ 下是否存在历史冗余目录，按需归档');
  console.log('  4. 可选: 删除旧的 index.md 与 retrospective_archive.md\n');
  console.log('✨ 外部大脑现在更加清晰有序！');
  console.log('');
}

runCleanup();
