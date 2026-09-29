/**
 * queueViaStacksSteps.test.js — LC 232「用栈实现队列」状态机单测。
 *
 * 交叉验证：状态机（双栈）vs 数组队列参考解。
 * 逐帧钉死：元素守恒、out 内"顶最老"、操作边界帧"out 全部早于 in"、
 * 触发帧 out 必空、moved 落在 out 顶、每元素至多搬一次（均摊账本）。
 */
import { describe, it, expect } from 'vitest'
import { buildQueueViaStacksSteps } from '../queueViaStacksSteps.js'

const DEFAULT_OPS = [
  { op: 'push', val: 1 },
  { op: 'push', val: 2 },
  { op: 'push', val: 3 },
  { op: 'pop' },
  { op: 'peek' },
  { op: 'pop' },
  { op: 'push', val: 4 },
  { op: 'pop' },
  { op: 'pop' },
]

// 参考解：数组当队列
const refQueue = (ops) => {
  const q = []
  const rets = []
  for (const o of ops) {
    if (o.op === 'push') q.push(Number(o.val))
    else if (o.op === 'pop') rets.push(q.length ? q.shift() : null)
    else if (o.op === 'peek') rets.push(q.length ? q[0] : null)
  }
  return rets
}

const CASES = [
  null,
  [
    { op: 'push', val: 1 },
    { op: 'pop' },
    { op: 'push', val: 2 },
    { op: 'pop' },
    { op: 'push', val: 3 },
    { op: 'pop' },
  ], // 交替：每次搬运只搬一个
  [
    { op: 'push', val: 1 },
    { op: 'push', val: 2 },
    { op: 'peek' },
    { op: 'peek' },
    { op: 'pop' },
    { op: 'pop' },
  ], // peek 不消费
  [{ op: 'pop' }, { op: 'peek' }], // 空队列
  [
    { op: 'push', val: 1 },
    { op: 'push', val: 2 },
    { op: 'push', val: 3 },
    { op: 'push', val: 4 },
    { op: 'pop' },
    { op: 'push', val: 5 },
    { op: 'pop' },
    { op: 'pop' },
    { op: 'pop' },
    { op: 'pop' },
  ], // 中途 push（out 有存货时绝不搬运）
]

const opsOf = (ops) => ops ?? DEFAULT_OPS

describe('buildQueueViaStacksSteps — 结果正确性（参考解交叉）', () => {
  CASES.forEach((ops, ci) => {
    it(`case ${ci}`, () => {
      const steps = buildQueueViaStacksSteps(ops ? { ops } : {})
      const got = steps
        .filter((f) => f.phase === 'pop' || f.phase === 'peek')
        .map((f) => f.result)
      expect(got).toEqual(refQueue(opsOf(ops)))
    })
  })
})

describe('buildQueueViaStacksSteps — 主例帧结构', () => {
  const steps = buildQueueViaStacksSteps({})

  it('init + 9 操作展开 + done = 17 帧', () => {
    expect(steps.length).toBe(17)
    expect(steps[0].phase).toBe('init')
    expect(steps[steps.length - 1].phase).toBe('done')
    expect(steps.filter((f) => f.phase === 'push').length).toBe(4)
    expect(steps.filter((f) => f.phase === 'transfer').length).toBe(6) // 2 触发 + 4 搬运
    expect(steps.filter((f) => f.phase === 'pop').length).toBe(4)
    expect(steps.filter((f) => f.phase === 'peek').length).toBe(1)
  })

  it('第一次 pop 触发 3 元素搬运（3,2,1 依次翻），第二次 pop 不搬', () => {
    const transfers = steps.filter((f) => f.phase === 'transfer')
    expect(transfers[0].moved).toBeNull() // 触发帧
    expect(transfers.slice(1, 4).map((f) => f.moved)).toEqual([3, 2, 1])
    // 第二个 pop（op 5）无搬运帧：opIdx 5 只出现一次（结果帧）
    expect(steps.filter((f) => f.opIdx === 5).length).toBe(1)
  })

  it('出队序列 = 入队序列 1,2,3,4（FIFO）', () => {
    const done = steps[steps.length - 1]
    expect(done.queueOut).toEqual([1, 2, 3, 4])
  })

  it('均摊账本：4 个元素共搬运 4 次（每个恰好一次）', () => {
    const done = steps[steps.length - 1]
    expect(done.transfers).toBe(4)
  })
})

describe('buildQueueViaStacksSteps — 逐帧不变量（所有用例）', () => {
  CASES.forEach((ops, ci) => {
    it(`case ${ci}`, () => {
      const steps = buildQueueViaStacksSteps(ops ? { ops } : {})
      // 到达时刻表：每个元素首次出现在 in 栈的帧序 = push 序
      const arrival = new Map()
      let seq = 0
      for (const f of steps) {
        for (const v of f.inn) if (!arrival.has(v)) arrival.set(v, seq++)
        for (const v of f.out) if (!arrival.has(v)) arrival.set(v, seq++)
      }

      for (const f of steps) {
        // ① 元素守恒：inn + out + queueOut = 截至本帧已 push 数
        const upto = f.phase === 'init' ? 0 : f.opIdx === null ? f.ops.length : f.opIdx + 1
        const pushedSoFar = f.ops.slice(0, upto).filter((o) => o.op === 'push').length
        expect(f.inn.length + f.out.length + f.queueOut.length).toBe(pushedSoFar)

        // ② out 栈内：从顶到底到达时刻递增（顶 = out 中最老的）
        for (let t = 1; t < f.out.length; t += 1) {
          expect(arrival.get(f.out[t])).toBeLessThan(arrival.get(f.out[t - 1]))
        }

        // ③ 操作边界帧：out 全部早于 in（transfer 帧除外，搬运途中允许交叉）
        if (f.phase !== 'transfer' && f.out.length > 0 && f.inn.length > 0) {
          const outMax = Math.max(...f.out.map((v) => arrival.get(v)))
          const inMin = Math.min(...f.inn.map((v) => arrival.get(v)))
          expect(outMax).toBeLessThan(inMin)
        }

        // ④ 触发帧：搬运前 out 必为空
        if (f.phase === 'transfer' && f.moved === null) {
          expect(f.out.length).toBe(0)
          expect(f.inn.length).toBeGreaterThan(0)
        }
        // ⑤ 搬运帧：moved 落在 out 顶，且 in 里已没有它
        if (f.phase === 'transfer' && f.moved !== null) {
          expect(f.out[f.out.length - 1]).toBe(f.moved)
          expect(f.inn).not.toContain(f.moved)
        }
        // ⑥ pop/peek 结果帧：result = 上一帧的 out 顶
        if ((f.phase === 'pop' || f.phase === 'peek') && f.result !== null) {
          const idx = steps.indexOf(f)
          const prev = steps[idx - 1]
          expect(prev.out[prev.out.length - 1]).toBe(f.result)
          if (f.phase === 'pop') expect(f.queueOut).toContain(f.result)
          else expect(f.queueOut).not.toContain(f.result)
        }
      }

      // ⑦ 均摊账本：搬运次数 <= push 次数（每元素至多搬一次）
      const done = steps[steps.length - 1]
      const nPush = done.ops.filter((o) => o.op === 'push').length
      expect(done.transfers).toBeLessThanOrEqual(nPush)

      // ⑧ 每个元素至多被搬一次
      const movedList = steps.filter((f) => f.moved !== null).map((f) => f.moved)
      expect(new Set(movedList).size).toBe(movedList.length)
    })
  })
})

describe('buildQueueViaStacksSteps — 边界与输入卫生', () => {
  it('空队列 pop/peek：返回 null，不产生搬运帧', () => {
    const steps = buildQueueViaStacksSteps({ ops: [{ op: 'pop' }, { op: 'peek' }] })
    expect(steps.filter((f) => f.phase === 'transfer').length).toBe(0)
    const got = steps.filter((f) => f.phase === 'pop' || f.phase === 'peek').map((f) => f.result)
    expect(got).toEqual([null, null])
  })

  it('交替用例：每次搬运只搬 1 个（3 次搬运 3 个元素）', () => {
    const steps = buildQueueViaStacksSteps({
      ops: [
        { op: 'push', val: 1 },
        { op: 'pop' },
        { op: 'push', val: 2 },
        { op: 'pop' },
        { op: 'push', val: 3 },
        { op: 'pop' },
      ],
    })
    const moved = steps.filter((f) => f.moved !== null).map((f) => f.moved)
    expect(moved).toEqual([1, 2, 3])
    expect(steps[steps.length - 1].transfers).toBe(3)
  })

  it('out 有存货时 push 不搬运（case 4 的 push(5) 帧后无 transfer）', () => {
    const steps = buildQueueViaStacksSteps({
      ops: [
        { op: 'push', val: 1 },
        { op: 'push', val: 2 },
        { op: 'push', val: 3 },
        { op: 'push', val: 4 },
        { op: 'pop' },
        { op: 'push', val: 5 },
        { op: 'pop' },
      ],
    })
    // push(5) 是 opIdx 5；它后面紧跟的帧是 opIdx 6 的触发帧，不是 5 的
    const afterPush5 = steps.filter((f) => f.opIdx === 5)
    expect(afterPush5.length).toBe(1)
    expect(afterPush5[0].phase).toBe('push')
  })

  it('done 帧 desc 含均摊结论', () => {
    const steps = buildQueueViaStacksSteps({})
    expect(steps[steps.length - 1].desc).toContain('均摊')
  })

  it('不修改传入的 ops', () => {
    const ops = [
      { op: 'push', val: 1 },
      { op: 'pop' },
    ]
    const frozen = JSON.stringify(ops)
    const steps = buildQueueViaStacksSteps({ ops })
    for (const f of steps) expect(JSON.stringify(f.ops)).toBe(frozen)
    expect(JSON.stringify(ops)).toBe(frozen)
  })
})
