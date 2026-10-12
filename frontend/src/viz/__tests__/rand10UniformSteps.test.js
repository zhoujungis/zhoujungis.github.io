/**
 * rand10UniformSteps.test.js — LC 470「均匀性证明」状态机单测。
 *
 * 结构验证：49 格里每个输出的前像数恰好 4、拒绝 9 格、切分无重叠无遗漏。
 * 逐帧钉死：reveal k 后第 k 组计数 = perOutput；仅接受区被点亮。
 * 变体：5 → 7 时 21 = 3 × 7；边界：2 → 2 时无拒绝。
 */
import { describe, it, expect } from 'vitest'
import { buildRand10Board, buildRand10UniformSteps } from '../rand10UniformSteps.js'

describe('rand10UniformSteps（LC 470 均匀性证明）', () => {
  it('默认（7 → 10）：init + 10×reveal + done = 12 帧', () => {
    const steps = buildRand10UniformSteps()
    expect(steps).toHaveLength(12)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.filter((f) => f.phase === 'reveal')).toHaveLength(10)
  })

  it('49 格切分：每个输出恰好 4 个前像，拒绝 9 格，无重叠无遗漏', () => {
    const { board, acceptLimit, perOutput } = buildRand10Board(7, 10)
    const preimage = new Array(10).fill(0)
    let rejects = 0
    for (const row of board) {
      for (const cell of row) {
        if (cell.accepted) {
          expect(cell.output).toBeGreaterThanOrEqual(1)
          expect(cell.output).toBeLessThanOrEqual(10)
          expect(((cell.value - 1) % 10) + 1).toBe(cell.output)
          preimage[cell.output - 1] += 1
        } else {
          expect(cell.value).toBeGreaterThan(acceptLimit)
          expect(cell.output).toBeNull()
          rejects += 1
        }
      }
    }
    expect(preimage).toEqual(new Array(10).fill(perOutput))
    expect(preimage.reduce((a, b) => a + b, 0)).toBe(acceptLimit)
    expect(rejects).toBe(49 - acceptLimit)
  })

  it('reveal 帧：只点亮对应输出组的格子，计数逐组到位', () => {
    const steps = buildRand10UniformSteps()
    const reveals = steps.filter((f) => f.phase === 'reveal')
    reveals.forEach((f, i) => {
      const k = i + 1
      expect(f.revealed).toBe(k)
      // 前 k 组各 perOutput，后面的组还是 0
      f.counts.forEach((count, idx) => {
        if (idx < k) expect(count).toBe(f.perOutput)
        else expect(count).toBe(0)
      })
    })
    const done = steps.at(-1)
    expect(done.counts).toEqual(new Array(10).fill(4))
    expect(done.counts.reduce((a, b) => a + b, 0)).toBe(done.acceptLimit)
  })

  it('变体（5 → 7）：init + 7 + done = 9 帧，21 = 3 × 7', () => {
    const steps = buildRand10UniformSteps({ from: 5, to: 7 })
    expect(steps).toHaveLength(9)
    const done = steps.at(-1)
    expect(done.acceptLimit).toBe(21)
    expect(done.perOutput).toBe(3)
    expect(done.counts).toEqual(new Array(7).fill(3))
    // 拒绝 4 格（22..25）
    const { board } = buildRand10Board(5, 7)
    const rejects = board.flat().filter((c) => !c.accepted).length
    expect(rejects).toBe(4)
  })

  it('边界（2 → 2）：全部接受、无拒绝、每组 2 个前像', () => {
    const steps = buildRand10UniformSteps({ from: 2, to: 2 })
    const done = steps.at(-1)
    expect(done.acceptLimit).toBe(4)
    expect(done.perOutput).toBe(2)
    expect(done.counts).toEqual([2, 2])
    expect(steps).toHaveLength(4) // init + 2 + done
  })

  it('非法输入回退默认', () => {
    const steps = buildRand10UniformSteps({ from: 0, to: 1000 })
    expect(steps[0].from).toBe(7)
    expect(steps[0].to).toBe(10)
  })
})
