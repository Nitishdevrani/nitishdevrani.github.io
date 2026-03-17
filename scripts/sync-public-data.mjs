import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const sourceDataDir = path.join(rootDir, 'data')
const targetDataDir = path.join(rootDir, 'public', 'data')

if (!existsSync(sourceDataDir)) {
  console.error(`[sync-public-data] Source folder not found: ${sourceDataDir}`)
  process.exit(1)
}

if (!existsSync(path.join(rootDir, 'public'))) {
  mkdirSync(path.join(rootDir, 'public'), { recursive: true })
}

rmSync(targetDataDir, { force: true, recursive: true })
cpSync(sourceDataDir, targetDataDir, { recursive: true })

console.log('[sync-public-data] Copied data -> public/data')
