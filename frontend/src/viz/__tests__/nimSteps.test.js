import { describe, expect, it } from 'vitest'

import { buildNimSteps } from '../nimSteps.js'

/**
 * 独立参考解：穷举博弈树（正常博弈约定 —— 取到最后一颗者胜，无法动作者负）。
 * 用它反证 Bouton 定理：先手必胜 当且仅当 全场异或非 0。
 */
const memo = new Map()
function nimWin(piles) {
  const key = piles.join(',')
  if (memo.has(key)) return memo.get(key)
  if (piles.every((p) => p === 0)) {
    memo.set(key, false)
    return false
  }
  let win = false
  for (let i = 0; i < piles.length && !win; i += 1) {
    for (let take = 1; take <= piles[i]; take += 1) {
      const next = piles.slice()
      next[i] -= take
      if (!nimWin(next)) {
        win = true
        break
      }
    }
  }
  memo.set(key, win)
  return win
}

const xorOf = (arr) => arr.reduce((a, b) => a ^ b, 0)
const answer = (piles) => {
  const s = buildNimSteps({ piles })
  return s[s.length - 1].answer
}

describe('Nim · Bouton 定理对穷举博弈树', () => {
  it('异或判定与穷举博弈树在所有小规模局面上一致', () => {
    const cases = []
    for (let a = 0; a <= 4; a += 1) {
      for (let b = 0; b <= 4; b += 1) {
        for (let c = 0; c <= 4; c += 1) cases.push([a, b, c])
      }
    }
    for (const c of [[5, 5], [7], [1, 1], [2, 2, 2], [1, 2, 3, 4], [6, 6, 6]]) cases.push(c)
    for (const piles of cases) {
      const want = nimWin(piles)
      expect(xorOf(piles) !== 0, JSON.stringify(piles)).toBe(want)
      expect(answer(piles), JSON.stringify(piles)).toBe(want)
    }
  })

  it('主例 [3,4,5]：异或 2，制胜一手把第 1 堆改成 1', () => {
    const s = buildNimSteps({})
    const last = s[s.length - 1]
    expect(xorOf([3, 4, 5])).toBe(2)
    expect(last.answer).toBe(true)
    expect(last.move).toEqual({ idx: 0, bit: 1, newVal: 1 })
    expect(last.result).toEqual([1, 4, 5])
    expect(xorOf(last.result)).toBe(0)
  })

  it('必败局 [1,2,3]：异或 0，直接判先手必败', () => {
    const s = buildNimSteps({ piles: [1, 2, 3] })
    const last = s[s.length - 1]
    expect(last.answer).toBe(false)
    expect(last.x).toBe(0)
    expect(last.move).toBeNull()
    expect(s[s.length - 2].phase).toBe('xor')
  })

  it('单堆 / 空局 / 相等两堆', () => {
    expect(answer([5])).toBe(true) // 一次全拿
    expect(answer([0])).toBe(false)
    expect(answer([3, 3])).toBe(false) // 镜像
    expect(answer([1, 1, 1])).toBe(true) // 取一堆 -> [1,1] 是必败态留给对手
    expect(answer([2, 2])).toBe(false)
  })
})

describe('Nim · 帧结构与不变量', () => {
  it('帧数 = init + n 个 xor + done（必胜局还多 pick/take 两帧）', () => {
    const win = buildNimSteps({ piles: [3, 4, 5] })
    expect(win.length).toBe(1 + 3 + 2 + 1)
    const lose = buildNimSteps({ piles: [1, 2, 3] })
    expect(lose.length).toBe(1 + 3 + 1)
  })

  it('xor 帧的 run 是逐步累加的真实值', () => {
    const s = buildNimSteps({ piles: [3, 4, 5] })
    const runs = s.filter((f) => f.phase === 'xor').map((f) => f.run)
    expect(runs).toEqual([3, 7, 2])
    expect(s[3].x).toBe(2)
  })

  it('制胜一手一定合法：新值非负、严格变小、改完全场异或为 0', () => {
    for (const piles of [[3, 4, 5], [5, 5, 5], [1, 2, 4], [7], [9, 6, 3, 12]]) {
      const s = buildNimSteps({ piles })
      const last = s[s.length - 1]
      if (xorOf(piles) === 0) {
        expect(last.move).toBeNull()
        continue
      }
      const { idx, newVal } = last.move
      expect(newVal).toBeGreaterThanOrEqual(0)
      expect(newVal).toBeLessThan(piles[idx])
      expect(last.result[idx]).toBe(newVal)
      expect(xorOf(last.result)).toBe(0)
      // 其余堆不动
      for (let k = 0; k < piles.length; k += 1) {
        if (k !== idx) expect(last.result[k]).toBe(piles[k])
      }
    }
  })

  it('move 选的堆确实在 x 的最高置位上为 1', () => {
    const s = buildNimSteps({ piles: [3, 4, 5] })
    const { idx, bit, newVal } = s[s.length - 1].move
    expect((3 >> bit) & 1).toBe(1)
    expect(newVal).toBe(3 ^ 2)
  })

  it('输入校验：非正整数回落默认 [3,4,5]', () => {
    expect(buildNimSteps({ piles: [1.5, 2] })[0].piles).toEqual([3, 4, 5])
    expect(buildNimSteps({ piles: [-1, 2] })[0].piles).toEqual([3, 4, 5])
    expect(buildNimSteps({ piles: [] })[0].piles).toEqual([3, 4, 5])
    expect(buildNimSteps({})[0].piles).toEqual([3, 4, 5])
  })
})
