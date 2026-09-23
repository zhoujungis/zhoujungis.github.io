import { spawnSync } from 'node:child_process'
const r = spawnSync(
  'C:/Users/admin/.workbuddy/binaries/node/versions/22.22.2-3/node.exe',
  ['node_modules/vitest/vitest.mjs', 'run'],
  { cwd: 'D:/zhoujungis.github.io/frontend', encoding: 'utf8' },
)
// 把汇总行写到文件，避免管道/编码问题
const keep = (r.stdout || '')
  .split(/\r?\n/)
  .filter((l) => l.includes('Test Files') || l.includes('Tests') || l.includes('Duration'))
  .join('\n')
console.log('[SUMMARY]')
console.log(keep)
console.log('[EXIT]', r.status)
