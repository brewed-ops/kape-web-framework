// Installs the kape-web skill into Claude Code and remembers where this framework folder lives.
// Usage (from this folder): node install.mjs
// Safe to run again after you download a newer version: it replaces the installed skill with this one.
import { cpSync, existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const home = dirname(fileURLToPath(import.meta.url))
const src = join(home, 'skill', 'kape-web')
const dest = join(homedir(), '.claude', 'skills', 'kape-web')

if (!existsSync(join(src, 'SKILL.md')) || !existsSync(join(home, 'starter', 'package.json'))) {
  console.error('Run this from the KAPE Web Framework folder (the one with skill/ and starter/ inside).')
  process.exit(1)
}

// The starter's engines field is the one source of truth for the Node version.
const need = (JSON.parse(readFileSync(join(home, 'starter', 'package.json'), 'utf8')).engines?.node ?? '').replace(/[^\d.]/g, '')
const parts = (v) => v.split('.').map(Number)
const older = (a, b) => { const [x, y] = [parts(a), parts(b)]; for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0); return false }
if (need && older(process.versions.node, need)) {
  console.error(`Node.js ${need} or newer is needed (you have ${process.versions.node}). Install the LTS version from https://nodejs.org, then run this again.`)
  process.exit(1)
}

const updating = existsSync(dest)
// Build the new copy beside the old one and swap only after it checks out, so a failed copy never leaves you with no skill.
const tmp = dest + '.new'
rmSync(tmp, { recursive: true, force: true })
cpSync(src, tmp, { recursive: true })
writeFileSync(join(tmp, 'HOME'), home + '\n')

if (!existsSync(join(tmp, 'SKILL.md')) || readFileSync(join(tmp, 'HOME'), 'utf8').trim() !== home) {
  console.error('Install check failed: the skill did not copy. Nothing else was changed.')
  process.exit(1)
}
rmSync(dest, { recursive: true, force: true })
renameSync(tmp, dest)

console.log(`${updating ? 'Updated' : 'Installed'} the kape-web skill in ${dest}`)
console.log(`Framework folder saved: ${home}`)
console.log('')
console.log('Next, inside Claude Code:')
console.log('  1. Restart Claude Code so it sees the new skill.')
console.log('  2. Type: kape web - new site')
console.log('     It checks the other tools (claude-seo, Ponytail, Stageshow) and installs what is missing.')
