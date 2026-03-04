#!/usr/bin/env node

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '../../')

const skillsReposFile = path.join(projectRoot, 'docs/skills/github_repos.md')
const outMarkdownFile = path.join(projectRoot, 'docs/skills/management.md')
const outJsonFile = path.join(projectRoot, 'docs/public/data/skills_inventory.json')

function nowLocal () {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

function canonicalSkillName (name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/^gemini-skill-/, '')
    .replace(/-skills?$/, '')
}

function parseNativeSkillsFromRepos (markdownPath) {
  if (!fs.existsSync(markdownPath)) return []
  const text = fs.readFileSync(markdownPath, 'utf8')
  const lines = text.split('\n')
  const results = []
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue
    const cols = line.split('|').slice(1, -1).map(s => s.trim())
    if (cols.length < 3) continue
    const [name, repo, usage] = cols
    if (!name || !repo || name === 'Skill' || name.startsWith(':---')) continue
    if (!repo.includes('github.com/webkubor/')) continue
    results.push({
      name,
      canonical: canonicalSkillName(name),
      repo,
      usage
    })
  }
  return results
}

function listSkillEntriesInDir (dirPath, sourceLabel) {
  if (!fs.existsSync(dirPath)) return []
  let entries = []
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true })
  } catch {
    return []
  }
  const output = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dirPath, entry.name)
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue

    let resolvedPath = fullPath
    try {
      resolvedPath = fs.realpathSync(fullPath)
    } catch {}

    const skillFileByName = path.join(resolvedPath, 'SKILL.md')
    const skillFileByCase = path.join(resolvedPath, 'skill.md')
    const hasSkillFile = fs.existsSync(skillFileByName) || fs.existsSync(skillFileByCase)
    output.push({
      name: entry.name,
      canonical: canonicalSkillName(entry.name),
      source: sourceLabel,
      path: fullPath,
      resolvedPath,
      hasSkillFile
    })
  }
  return output
}

function mergeInstalledSkills (raw) {
  const map = new Map()
  for (const item of raw) {
    const key = item.canonical || item.name.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        name: item.name,
        canonical: key,
        sources: new Set([item.source]),
        paths: new Set([item.path]),
        resolvedPaths: new Set([item.resolvedPath]),
        hasSkillFile: item.hasSkillFile
      })
      continue
    }
    const prev = map.get(key)
    prev.sources.add(item.source)
    prev.paths.add(item.path)
    prev.resolvedPaths.add(item.resolvedPath)
    prev.hasSkillFile = prev.hasSkillFile || item.hasSkillFile
  }
  return [...map.values()]
    .map(item => ({
      name: item.name,
      canonical: item.canonical,
      sources: [...item.sources].sort(),
      paths: [...item.paths].sort(),
      resolvedPaths: [...item.resolvedPaths].sort(),
      hasSkillFile: item.hasSkillFile
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function buildMarkdown ({ generatedAt, nativeSkills, installedSkills, scanDirs }) {
  const installedSet = new Set(installedSkills.map(s => s.canonical))
  const nativeRows = nativeSkills.map(item => {
    const installed = installedSet.has(item.canonical) ? '是' : '否'
    const installCmd = `gemini skills install ${item.repo}`
    return `| ${item.name} | ${item.repo} | ${installed} | \`${installCmd}\` |`
  }).join('\n')

  const installedRows = installedSkills.map(item => {
    const sourceText = item.sources.join(', ')
    const pathText = item.paths.join('<br>')
    return `| ${item.name} | ${sourceText} | ${item.hasSkillFile ? '是' : '否'} | ${pathText} |`
  }).join('\n')

  const scanRows = scanDirs.map(d => `- ${d.label}: \`${d.path}\``).join('\n')

  return `---
description: Skills 管理页（初始化建议安装 + 本机已安装扫描）
---
# Skills 管理台

> 本页由脚本自动生成：\`node scripts/tools/sync-skills-management.mjs\`  
> 最近生成时间：${generatedAt}

## 1. 初始化建议安装（拆分原生 Skills）

| Skill | 仓库 | 已安装 | 安装命令 |
| :--- | :--- | :---: | :--- |
${nativeRows || '| (空) | - | - | - |'}

## 2. 本机已安装 Skills（自动扫描）

| 名称 | 来源 | 包含 SKILL.md | 路径 |
| :--- | :--- | :---: | :--- |
${installedRows || '| (未发现) | - | - | - |'}

## 3. 扫描路径

${scanRows}

## 4. 维护约定

- 你拆分出去的原生 skills 以 \`docs/skills/github_repos.md\` 为 SSOT。
- 用户本机安装态以本页扫描结果为准。
- 如新增私有 skill，请放在 \`/Users/webkubor/Desktop/skills\`，并同步更新 \`/Users/webkubor/Documents/memory/skills/index.md\`。
`
}

function main () {
  const home = os.homedir()
  const scanDirs = [
    { label: '~/.agents/skills', path: path.join(home, '.agents/skills') },
    { label: '~/.agent/skills', path: path.join(home, '.agent/skills') },
    { label: '~/.codex/skills', path: path.join(home, '.codex/skills') }
  ]

  const nativeSkills = parseNativeSkillsFromRepos(skillsReposFile)
  const installedRaw = scanDirs.flatMap(d => listSkillEntriesInDir(d.path, d.label))
  const installedSkills = mergeInstalledSkills(installedRaw)

  const payload = {
    generatedAt: new Date().toISOString(),
    generatedAtLocal: nowLocal(),
    nativeSkills,
    installedSkills,
    scanDirs
  }

  fs.mkdirSync(path.dirname(outJsonFile), { recursive: true })
  fs.writeFileSync(outJsonFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  const markdown = buildMarkdown({
    generatedAt: payload.generatedAtLocal,
    nativeSkills,
    installedSkills,
    scanDirs
  })
  fs.writeFileSync(outMarkdownFile, markdown, 'utf8')

  console.log(`✅ skills 管理台已更新:`)
  console.log(`- ${outMarkdownFile}`)
  console.log(`- ${outJsonFile}`)
  console.log(`- native: ${nativeSkills.length}, installed: ${installedSkills.length}`)
}

main()
