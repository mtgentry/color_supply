// Runs before `npm run dev` (the "predev" script) so the dev server always gets
// the port in .env (PORT). If that port is busy, Nuxt would quietly start on
// another one, where every API call fails CORS (the backend only allows the
// usual ports). So:
//   - a leftover Nuxt dev server holding the port is stopped;
//   - anything else holding it stops the start, with a message, rather than
//     Nuxt drifting to a different port.
// Without PORT in .env or the environment this does nothing.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const fromEnvFile = () => {
  if (!existsSync('.env')) return null
  const line = readFileSync('.env', 'utf8').split('\n').find(l => /^\s*PORT\s*=/.test(l))
  return line ? line.split('=')[1].trim().replace(/^["']|["']$/g, '') : null
}

const port = process.env.PORT || fromEnvFile()
if (!port) process.exit(0)

const run = (cmd) => {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return '' }
}

const pids = [...new Set(run(`lsof -nP -t -iTCP:${port} -sTCP:LISTEN`).split('\n').filter(Boolean))]
if (!pids.length) process.exit(0)

for (const pid of pids) {
  const command = run(`ps -o command= -p ${pid}`)
  if (!/nuxt|nuxi/.test(command)) {
    console.error(`\nPort ${port} (PORT in .env) is in use by another program:\n  ${pid} ${command}\nStop it, or change PORT, then run npm run dev again.\n`)
    process.exit(1)
  }
}

// The old `nuxt dev` (its `npm run dev` exits along with it)
for (const pid of pids) {
  console.log(`Stopping the old dev server on port ${port} (pid ${pid})`)
  try { process.kill(Number(pid), 'SIGTERM') } catch {}
}

// Wait (up to 5s) for the port to free up
const until = Date.now() + 5000
while (Date.now() < until && run(`lsof -nP -t -iTCP:${port} -sTCP:LISTEN`)) execSync('sleep 0.2')
if (run(`lsof -nP -t -iTCP:${port} -sTCP:LISTEN`)) {
  console.error(`\nPort ${port} is still busy. Stop the old dev server, then run npm run dev again.\n`)
  process.exit(1)
}
