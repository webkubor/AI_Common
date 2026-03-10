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

const agentColumns = {
  member_id: 'TEXT NOT NULL UNIQUE',
  node_id: 'TEXT',
  agent_name: 'TEXT NOT NULL',
  alias: 'TEXT',
  role: 'TEXT',
  workspace: 'TEXT',
  task: 'TEXT',
  type: 'TEXT',
  is_captain: 'INTEGER NOT NULL DEFAULT 0',
  status: 'TEXT',
  heartbeat_at: 'TEXT',
  created_at: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'
}

function getTableColumns(db, tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all()
}

function ensureTableColumns(db, tableName, expectedColumns) {
  const existingColumns = new Set(getTableColumns(db, tableName).map(column => column.name))
  for (const [columnName, columnDef] of Object.entries(expectedColumns)) {
    if (existingColumns.has(columnName)) continue
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`)
  }
}

export function ensureAiTeamDb() {
  fs.mkdirSync(dbDir, { recursive: true })

  const schema = fs.readFileSync(schemaFile, 'utf8')
  const db = new Database(dbFile)
  db.exec(schema)
  ensureTableColumns(db, 'agents', agentColumns)

  return db
}

export function getAiTeamDbMeta() {
  return { dbDir, dbFile, schemaFile }
}
