// Proves the installer works on a fresh computer and on an update. Run: node --test install.test.mjs
// It installs into a throwaway home folder, never your real one.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const fakeHome = mkdtempSync(join(tmpdir(), 'kape-web-install-'))
const skills = join(fakeHome, '.claude', 'skills')
const dest = join(skills, 'kape-web')
const install = () => execFileSync(process.execPath, [join(here, 'install.mjs')], { encoding: 'utf8', env: { ...process.env, USERPROFILE: fakeHome, HOME: fakeHome } })

test.after(() => rmSync(fakeHome, { recursive: true, force: true }))

test('fresh install copies the skill and records the framework folder', () => {
  assert.match(install(), /Installed the kape-web skill/)
  assert.ok(existsSync(join(dest, 'SKILL.md')))
  assert.equal(readFileSync(join(dest, 'HOME'), 'utf8').trim(), here)
})

test('update replaces the old copy and leaves no temporary folders', () => {
  writeFileSync(join(dest, 'stale.txt'), 'from an older version')
  assert.match(install(), /Updated the kape-web skill/)
  assert.ok(existsSync(join(dest, 'SKILL.md')))
  assert.ok(!existsSync(join(dest, 'stale.txt')))
  assert.deepEqual(readdirSync(skills), ['kape-web'])
})
