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

export function ensureAiTeamDb() {
  fs.mkdirSync(dbDir, { recursive: true })

  const schema = fs.readFileSync(schemaFile, 'utf8')
  const db = new Database(dbFile)
  db.exec(schema)

  return db
}

export function getAiTeamDbMeta() {
  return { dbDir, dbFile, schemaFile }
}
