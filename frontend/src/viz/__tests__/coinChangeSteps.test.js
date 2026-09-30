/**
 * coinChangeSteps.test.js — LC 322「零钱兑换」状态机单测。
 *
 * 交叉验证：状态机（自底向上、外面对金额）vs 两个独立参考解 ——
 * ① BFS（把金额当图上的点，每条硬币边权 1，最短路 = 最少枚数，路径完全不同）；
 * ② 递归记忆化（自顶向下）。
 * 逐帧钉死：回放一致、只在 a 处变化、转移方程、fromCoin 是首个严格更小者、
 * 回溯链 dp[a] === dp[a-c]+1、组合求和 === amount、长度 === 答案。
 */
import { describe, it, expect } from 'vitest'
import { buildCoinChangeSteps, COIN_CHANGE_INF as INF } from '../coinChangeSteps.js'

const DEFAULT_COINS = [1, 2, 5]
const DEFAULT_AMOUNT = 11

// 独立参考解 ①：BFS 最短路
const refBfs = (coins, amount) => {
  if (amount === 0) return 0
  const dist = new Array(amount + 1).fill(-1)
  dist[0] = 0
  const queue = [0]
  for (let head = 0; head < queue.length; head += 1) {
    const cur = queue[head]
    for (const c of coins) {
      const next = cur + c
      if (next <= amount && dist[next] === -1) {
        dist[next] = dist[cur] + 1
        queue.push(next)
      }
    }
  }
  return dist[amount]
}

// 独立参考解 ②：自顶向下递归记忆化
const refRec = (coins, amount) => {
  const memo = new Map()
  const go = (x) => {
    if (x === 0) return 0
    if (x < 0) return INF
    if (memo.has(x)) return memo.get(x)
    let best = INF
    for (const c of coins) best = Math.min(best, go(x - c) + 1)
    memo.set(x, best)
    return best
  }
  const r = go(amount)
  return r === INF ? -1 : r
}

const CASES = [
  {}, // 默认 [1,2,5] / 11 → 3
  { coins: [2], amount: 3 }, // 无解 → -1
  { coins: [2], amount: 0 }, // 金额 0 → 0
  { coins: [1], amount: 0 }, // 金额 0 → 0
  { coins: [3, 7], amount: 5 }, // 无解 → -1
  { coins: [2, 5], amount: 6 }, // 2+2+2 → 3
  { coins: [1, 2, 5], amount: 1 }, // → 1
  { coins: [7], amount: 7 }, // 单枚命中 → 1
  { coins: [7], amount: 14 }, // 复用两枚 → 2
  { coins: [2, 4], amount: 8 }, // 4+4 → 2
  { coins: [1, 3, 4], amount: 6 }, // 3+3 → 2（贪心 4+1+1 是 3，必须 DP）
  { coins: [5, 10], amount: 3 }, // 硬币比金额大 → -1
]

const optsOf = (c) => (c.coins ? c : { coins: DEFAULT_COINS, amount: DEFAULT_AMOUNT })

describe('coinChangeSteps（LC 322）', () => {
  it.each(CASES)('最终结果与 BFS / 递归两个参考解一致：%j', (c) => {
    const steps = buildCoinChangeSteps(optsOf(c))
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    const { coins, amount } = steps[0]
    expect(done.result).toBe(refBfs(coins, amount))
    expect(done.result).toBe(refRec(coins, amount))
  })

  it.each(CASES)('帧骨架与逐帧不变量：%j', (c) => {
    const steps = buildCoinChangeSteps(optsOf(c))
    const { amount } = steps[0]
    expect(steps[0].phase).toBe('init')
    expect(steps.filter((f) => f.phase === 'fill')).toHaveLength(amount)
    steps
      .filter((f) => f.phase === 'fill')
      .forEach((f, i) => expect(f.a).toBe(i + 1))

    for (const f of steps) {
      expect(f.dp[0]).toBe(0)
      for (let x = 1; x <= amount; x += 1) {
        expect(f.dp[x] === INF || (Number.isInteger(f.dp[x]) && f.dp[x] >= 1)).toBe(true)
      }
    }

    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      for (let x = 0; x <= amount; x += 1) expect(f.prevDp[x]).toBe(p.dp[x]) // 回放一致

      if (f.phase === 'fill') {
        for (let x = 0; x <= amount; x += 1) {
          if (x !== f.a) expect(f.dp[x]).toBe(f.prevDp[x]) // 只改 a 一格
        }
        let want = INF
        let win = null
        for (const coin of f.coins) {
          const idx = f.a - coin
          if (idx < 0) continue
          const v = f.prevDp[idx] + 1
          if (v < want) {
            want = v
            win = coin
          }
        }
        expect(f.best).toBe(want)
        expect(f.dp[f.a]).toBe(want)
        expect(f.fromCoin).toBe(win)
        if (f.fromCoin !== null) {
          expect(f.sourceIdx).toBe(f.a - f.fromCoin)
          expect(f.dp[f.a]).toBe(f.prevDp[f.sourceIdx] + 1)
        }
        for (const t of f.trials) {
          if (t.idx < 0) {
            expect(t.reachable).toBe(false)
            expect(t.value).toBe(INF)
          } else {
            expect(t.value).toBe(f.prevDp[t.idx] + 1)
            expect(t.reachable).toBe(f.prevDp[t.idx] !== INF)
          }
        }
        const wt = f.trials.find((t) => t.coin === f.fromCoin)
        if (wt) {
          expect(wt.ok).toBe(true)
          expect(wt.value).toBe(f.best)
        }
      }

      if (f.phase === 'trace') {
        expect(f.dp[f.a]).toBe(f.dp[f.sourceIdx] + 1) // 前驱链自洽
        expect(f.prevDp[f.a]).toBe(f.dp[f.a]) // 回溯不改 dp
        expect(f.traceCoin).toBe(f.a - f.sourceIdx)
        expect(f.picked.at(-1)).toBe(f.traceCoin)
        expect(p.phase === 'fill' || p.a > f.a).toBe(true) // 首帧接在 fill 后，其余严格递减
      }
    }

    const done = steps.at(-1)
    if (done.result === -1) {
      expect(done.combination).toEqual([])
    } else {
      expect(done.combination).toHaveLength(done.result) // 枚数 = 答案
      expect(done.combination.reduce((s, v) => s + v, 0)).toBe(amount) // 组合求和
      expect(done.combination.every((v) => steps[0].coins.includes(v))).toBe(true)
      expect([...done.picked].reverse()).toEqual(done.combination)
    }
  })

  it('默认题面：16 帧，dp 轨迹与组合钉死 → 3（5+5+1）', () => {
    const steps = buildCoinChangeSteps()
    expect(steps).toHaveLength(16)
    expect(steps.map((f) => f.phase)).toEqual([
      'init',
      ...Array(11).fill('fill'),
      ...Array(3).fill('trace'),
      'done',
    ])
    const fills = steps.filter((f) => f.phase === 'fill')
    expect(fills.map((f) => f.best)).toEqual([1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3])
    expect(steps.at(-1).dp).toEqual([0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3])
    expect(steps.at(-1).result).toBe(3)
    expect(steps.at(-1).combination).toEqual([5, 5, 1])
    // 回溯链 11 → 10 → 5 → 0（chosen 依次 1、5、5）
    expect(steps.filter((f) => f.phase === 'trace').map((f) => [f.a, f.traceCoin])).toEqual([
      [11, 1],
      [10, 5],
      [5, 5],
    ])
    expect(fills.map((f) => f.fromCoin)).toEqual([1, 2, 1, 2, 5, 1, 2, 1, 2, 5, 1])
  })

  it('金额 0：直接 0，只有 init + done 两帧', () => {
    const steps = buildCoinChangeSteps({ coins: [2, 5], amount: 0 })
    expect(steps).toHaveLength(2)
    expect(steps[0].dp).toEqual([0])
    expect(steps.at(-1).result).toBe(0)
  })

  it('无解：dp 全程 ∞，result -1，没有回溯帧', () => {
    const steps = buildCoinChangeSteps({ coins: [2], amount: 3 })
    expect(steps.filter((f) => f.phase === 'trace')).toHaveLength(0)
    expect(steps.at(-1).result).toBe(-1)
    expect(steps.at(-1).dp).toEqual([0, INF, 1, INF])
    expect(steps.at(-1).desc).toContain('-1')
  })

  it('硬币比金额大：所有 trial 都超界，dp 全是 ∞', () => {
    const steps = buildCoinChangeSteps({ coins: [5, 10], amount: 3 })
    const last = steps.filter((f) => f.phase === 'fill').at(-1)
    expect(last.trials.every((t) => t.idx < 0 && t.reachable === false)).toBe(true)
    expect(last.best).toBe(INF)
    expect(steps.at(-1).result).toBe(-1)
  })

  it('贪心的反例：coins=[1,3,4] amount=6 必须 3+3 而不是 4+1+1', () => {
    const steps = buildCoinChangeSteps({ coins: [1, 3, 4], amount: 6 })
    expect(steps.at(-1).result).toBe(2)
    expect(steps.at(-1).combination).toEqual([3, 3])
  })

  it('done 帧 desc 点名组合、回溯链与复杂度关键词', () => {
    const done = buildCoinChangeSteps().at(-1)
    expect(done.desc).toContain('5 + 5 + 1 = 11')
    expect(done.desc).toContain('11 → 10 → 5 → 0')
    expect(done.desc).toContain('完全背包')
  })

  it('随机交叉：500 组 vs BFS + 递归 + 组合自洽', () => {
    let rng = 20260930
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 500; t += 1) {
      const coins = Array.from({ length: 1 + rand(4) }, () => 1 + rand(11))
      const amount = rand(20)
      const steps = buildCoinChangeSteps({ coins, amount })
      const done = steps.at(-1)
      expect(done.result).toBe(refBfs(coins, amount))
      expect(done.result).toBe(refRec(coins, amount))
      if (done.result !== -1) {
        expect(done.combination.reduce((s, v) => s + v, 0)).toBe(amount)
        expect(done.combination).toHaveLength(done.result)
      }
      for (const f of steps) {
        if (f.phase !== 'fill') continue
        let want = INF
        for (const coin of f.coins) {
          const idx = f.a - coin
          if (idx >= 0) want = Math.min(want, f.prevDp[idx] + 1)
        }
        expect(f.dp[f.a]).toBe(want)
      }
    }
  })

  it('非法输入回退默认：空/非法面额、负数金额、null', () => {
    expect(buildCoinChangeSteps({ coins: [], amount: -3 })[0].coins).toEqual(DEFAULT_COINS)
    expect(buildCoinChangeSteps({ coins: [], amount: -3 })[0].amount).toBe(DEFAULT_AMOUNT)
    expect(buildCoinChangeSteps({ coins: [0, -2, 3.5], amount: null })[0].coins).toEqual(DEFAULT_COINS)
    expect(buildCoinChangeSteps({ coins: null, amount: 1.5 })[0].amount).toBe(DEFAULT_AMOUNT)
  })

  it('所有帧共享同一份 coins，且是拷贝', () => {
    const input = [1, 2, 5]
    const steps = buildCoinChangeSteps({ coins: input, amount: 11 })
    input.push(99)
    for (const f of steps) expect(f.coins).toEqual([1, 2, 5])
  })

  it('init 帧 desc 讲清 ∞ 初始化与正序的意义', () => {
    const init = buildCoinChangeSteps()[0]
    expect(init.desc).toContain('dp[0] = 0')
    expect(init.desc).toContain('∞')
    expect(init.desc).toContain('正序')
  })
})
