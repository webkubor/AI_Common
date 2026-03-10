#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '../../')
const dbDir = path.join(projectRoot, '.memory/sqlite')
const dbFile = path.join(dbDir, 'ai-team.db')
const schemaFile = path.join(projectRoot, 'scripts/sql/ai-team-schema.sql')

fs.mkdirSync(dbDir, { recursive: true })

const schema = fs.readFileSync(schemaFile, 'utf8')
const db = new Database(dbFile)

db.exec(schema)

const tables = db.prepare(`
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
    AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all()

console.log(JSON.stringify({
  ok: true,
  dbFile,
  tables: tables.map((table) => table.name)
}, null, 2))

db.close()
