import { spawnSync } from 'node:child_process'

const email = process.env.ADMIN_EMAIL?.trim()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || 'Kality Administrator'

if (!email || !password) {
  console.error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD in your current terminal before running this command.',
  )
  process.exit(1)
}

if (password.length < 12) {
  console.error('ADMIN_PASSWORD must contain at least 12 characters.')
  process.exit(1)
}

const payload = JSON.stringify({ email, name, password })
const seedIdentity = JSON.stringify({
  subject: 'admin-seed',
  issuer: 'https://seed.local',
  tokenIdentifier: 'https://seed.local|admin-seed',
})
const executable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const result = spawnSync(
  executable,
  ['exec', 'convex', 'run', 'seed:admin', payload, '--identity', seedIdentity],
  { stdio: 'inherit' },
)

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
