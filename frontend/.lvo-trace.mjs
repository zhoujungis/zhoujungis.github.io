import { buildLevelOrderSteps, buildTree } from './src/viz/levelOrderSteps.js'

for (const mode of ['plain', 'zigzag']) {
  const steps = buildLevelOrderSteps({ mode })
  console.log('===== mode =', mode, 'frames =', steps.length, '=====')
  for (let i = 0; i < steps.length; i += 1) {
    const s = steps[i]
    console.log(
      [
        String(i).padStart(2),
        s.phase.padEnd(8),
        `q=[${s.queue.join(',')}]`.padEnd(14),
        `L${s.levelIndex}`.padEnd(4),
        `size=${s.levelSize}`.padEnd(8),
        `k=${s.consumed}`.padEnd(6),
        `cur=${s.current === null ? '-' : s.current}`.padEnd(7),
        `enq=[${s.enqueued.join(',')}]`.padEnd(10),
        `lv=[${s.levelValues.join(',')}]`.padEnd(12),
        `res=${JSON.stringify(s.results)}`.padEnd(24),
        `rv=${JSON.stringify(s.rightView)}`,
      ].join(' | '),
    )
  }
}

console.log('\n===== rightView 校验 =====')
console.log('plain :', JSON.stringify(buildLevelOrderSteps({ mode: 'plain' }).at(-1).rightView))
console.log('zigzag:', JSON.stringify(buildLevelOrderSteps({ mode: 'zigzag' }).at(-1).rightView))
console.log('\n===== levelsOf =====')
const { nodes } = buildTree([3, 9, 20, null, null, 15, 7])
console.log(JSON.stringify(nodes))
