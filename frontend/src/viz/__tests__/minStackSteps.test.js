/**
 * minStackSteps.test.js — LC 155「最小栈」状态机单测。
 *
 * 交叉验证：状态机（辅助栈）vs 朴素重算参考解（getMin = min(main)）。
 * 逐帧钉死三条不变量：辅助栈顶 === min(主栈)、辅助栈非增、len(mins) <= len(main)。
 * 重复最小值（`<=` 判据）专例钉死。
 */
import { describe, it, expect } from 'vitest'
import { buildMinStackSteps } from '../minStackSteps.js'

const DEFAULT_OPS = [
  { op: 'push', val: -2 },
  { op: 'push', val: 0 },
  { op: 'push', val: -3 },
  { op: 'getMin' },
  { op: 'pop' },
  { op: 'top' },
  { op: 'getMin' },
]

// 参考解：不维护任何辅助结构，getMin 现场重算
const refMinStack = (ops) => {
  const main = []
  const rets = []
  for (const o of ops) {
    if (o.op === 'push') main.push(Number(o.val))
    else if (o.op === 'pop') main.pop()
    else if (o.op === 'top') rets.push(main.length ? main[main.length - 1] : null)
    else if (o.op === 'getMin') rets.push(main.length ? Math.min(...main) : null)
  }
  return rets
}

const CASES = [
  null,
  [
    { op: 'push', val: 2 },
    { op: 'push', val: 2 },
    { op: 'pop' },
    { op: 'getMin' },
  ], // 重复最小值：`<=` 判据的用武之地
  [
    { op: 'push', val: 1 },
    { op: 'getMin' },
    { op: 'pop' },
    { op: 'getMin' },
  ], // pop 到空后再 getMin
  [
    { op: 'push', val: 5 },
    { op: 'push', val: 3 },
    { op: 'push', val: 4 },
    { op: 'getMin' },
    { op: 'pop' },
    { op: 'getMin' },
  ], // 非单调：4 不压辅助栈，pop 后 min 仍是 3
  [
    { op: 'push', val: 0 },
    { op: 'push', val: 0 },
    { op: 'push', val: 0 },
    { op: 'pop' },
    { op: 'getMin' },
    { op: 'pop' },
    { op: 'pop' },
    { op: 'getMin' },
  ], // 全相等
  [{ op: 'getMin' }, { op: 'pop' }, { op: 'top' }], // 空栈三连
  [{ op: 'push', val: 7 }], // 只进不出
]

const opsOf = (ops) => ops ?? DEFAULT_OPS

describe('buildMinStackSteps — 结果正确性（参考解交叉）', () => {
  CASES.forEach((ops, ci) => {
    it(`case ${ci}`, () => {
      const steps = buildMinStackSteps(ops ? { ops } : {})
      const got = steps
        .filter((f) => f.phase === 'getMin' || f.phase === 'top')
        .map((f) => f.result)
      expect(got).toEqual(refMinStack(opsOf(ops)))
    })
  })
})

describe('buildMinStackSteps — 主例帧结构', () => {
  const steps = buildMinStackSteps({})

  it('init + 7 操作 + done = 9 帧', () => {
    expect(steps.length).toBe(9)
    expect(steps[0].phase).toBe('init')
    expect(steps[8].phase).toBe('done')
    expect(steps.filter((f) => f.phase === 'push').length).toBe(3)
    expect(steps.filter((f) => f.phase === 'getMin').length).toBe(2)
    expect(steps.filter((f) => f.phase === 'pop').length).toBe(1)
    expect(steps.filter((f) => f.phase === 'top').length).toBe(1)
  })

  it('官方示例的返回值序列：-3, 0, -2', () => {
    const rets = steps.filter((f) => f.result !== null).map((f) => f.result)
    expect(rets).toEqual([-3, 0, -2])
  })

  it('push(-2)/push(-3) 压辅助栈，push(0) 不压', () => {
    const pushes = steps.filter((f) => f.phase === 'push')
    expect(pushes.map((f) => f.minPushed)).toEqual([true, false, true])
  })

  it('pop 帧：popped=-3 且同步弹出辅助栈', () => {
    const pop = steps.find((f) => f.phase === 'pop')
    expect(pop.popped).toBe(-3)
    expect(pop.minPopped).toBe(-3)
    expect(pop.main).toEqual([-2, 0])
    expect(pop.mins).toEqual([-2])
  })
})

describe('buildMinStackSteps — 逐帧不变量（所有用例）', () => {
  CASES.forEach((ops, ci) => {
    it(`case ${ci}`, () => {
      const steps = buildMinStackSteps(ops ? { ops } : {})
      for (const f of steps) {
        if (f.main.length > 0) {
          // ① 辅助栈顶恒等于全栈最小值
          expect(f.mins[f.mins.length - 1]).toBe(Math.min(...f.main))
          // ③ 辅助栈是主栈的抽样历史
          expect(f.mins.length).toBeLessThanOrEqual(f.main.length)
        } else {
          expect(f.mins.length).toBe(0)
        }
        // ② 辅助栈从底到顶非增
        for (let t = 1; t < f.mins.length; t += 1) {
          expect(f.mins[t]).toBeLessThanOrEqual(f.mins[t - 1])
        }
        // getMin/top 结果与同帧栈顶一致
        if (f.phase === 'getMin') expect(f.result).toBe(f.mins[f.mins.length - 1] ?? null)
        if (f.phase === 'top') expect(f.result).toBe(f.main[f.main.length - 1] ?? null)
      }
    })
  })
})

describe('buildMinStackSteps — 跨帧一致性', () => {
  CASES.forEach((ops, ci) => {
    it(`case ${ci}：push 帧主栈 = 上一帧 + 新值；pop 帧两栈只减不增`, () => {
      const steps = buildMinStackSteps(ops ? { ops } : {})
      for (let i = 1; i < steps.length; i += 1) {
        const prev = steps[i - 1]
        const f = steps[i]
        if (f.phase === 'push') {
          expect(f.main).toEqual([...prev.main, Number(f.ops[f.opIdx].val)])
          expect(f.mins.length - prev.mins.length).toBe(f.minPushed ? 1 : 0)
        }
        if (f.phase === 'pop' && f.popped !== null) {
          expect(f.main).toEqual(prev.main.slice(0, -1))
          expect(f.popped).toBe(prev.main[prev.main.length - 1])
          if (f.minPopped !== null) {
            expect(f.minPopped).toBe(f.popped)
            expect(f.mins).toEqual(prev.mins.slice(0, -1))
          } else {
            expect(f.mins).toEqual(prev.mins)
          }
        }
        if (f.phase === 'getMin' || f.phase === 'top') {
          expect(f.main).toEqual(prev.main)
          expect(f.mins).toEqual(prev.mins)
        }
      }
    })
  })
})

describe('buildMinStackSteps — 边界与输入卫生', () => {
  it('重复最小值专例：push 2, push 2, pop 后 getMin 仍是 2（`<=` 判据）', () => {
    const steps = buildMinStackSteps({
      ops: [
        { op: 'push', val: 2 },
        { op: 'push', val: 2 },
        { op: 'pop' },
        { op: 'getMin' },
      ],
    })
    const pushes = steps.filter((f) => f.phase === 'push')
    expect(pushes.every((f) => f.minPushed)).toBe(true) // 两个 2 都压了辅助栈
    const gm = steps.filter((f) => f.phase === 'getMin')
    expect(gm[gm.length - 1].result).toBe(2)
  })

  it('空栈操作：getMin/top 返回 null，pop 无操作', () => {
    const steps = buildMinStackSteps({ ops: [{ op: 'getMin' }, { op: 'pop' }, { op: 'top' }] })
    const gm = steps.find((f) => f.phase === 'getMin')
    expect(gm.result).toBeNull()
    const pop = steps.find((f) => f.phase === 'pop')
    expect(pop.popped).toBeNull()
    const top = steps.find((f) => f.phase === 'top')
    expect(top.result).toBeNull()
  })

  it('done 帧总结含最终最小值', () => {
    const steps = buildMinStackSteps({})
    expect(steps[steps.length - 1].desc).toContain('-2')
  })

  it('不修改传入的 ops（每帧 ops 保持原样）', () => {
    const ops = [
      { op: 'push', val: 1 },
      { op: 'push', val: 2 },
      { op: 'getMin' },
    ]
    const frozen = JSON.stringify(ops)
    const steps = buildMinStackSteps({ ops })
    for (const f of steps) expect(JSON.stringify(f.ops)).toBe(frozen)
    expect(JSON.stringify(ops)).toBe(frozen)
  })
})
