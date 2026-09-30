/**
 * coinChangeOrderSteps.test.js — LC 322「金额正序 vs 逆序」对照动画的状态机单测。
 *
 * 交叉验证：正序面板 vs BFS / 递归；逆序面板 vs **枚举子集**的 0-1 背包参考解；
 * 正序面板终态 vs buildCoinChangeSteps 的 dp（两种循环写法同解）。
 * 逐帧钉死：回放一致、只改 a / descA 一格、两条转移方程、
 * 逆序读值恒等于"本轮硬币开始前"的旧值、与真·逆序 in-place 循环逐轮对齐。
 */
import { describe, it, expect } from 'vitest'
import { buildCoinChangeOrderSteps } from '../coinChangeOrderSteps.js'
import { buildCoinChangeSteps } from '../coinChangeSteps.js'

const INF = Infinity
const DEFAULT_COINS = [1, 2, 5]
const DEFAULT_AMOUNT = 11

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

// 0-1 背包（每枚硬币最多一次）：枚举子集，与两条 DP 路径毫无相似之处
const ref01 = (coins, amount) => {
  let best = INF
  for (let mask = 0; mask < 1 << coins.length; mask += 1) {
    let sum = 0
    let cnt = 0
    for (let i = 0; i < coins.length; i += 1) {
      if (mask & (1 << i)) {
        sum += coins[i]
        cnt += 1
      }
    }
    if (sum === amount && cnt < best) best = cnt
  }
  return best === INF ? -1 : best
}

const CASES = [
  {},
  { coins: [2], amount: 3 },
  { coins: [2], amount: 0 },
  { coins: [3, 7], amount: 5 },
  { coins: [2, 5], amount: 6 },
  { coins: [1, 2, 5], amount: 1 },
  { coins: [1, 3, 4], amount: 6 },
  { coins: [7], amount: 14 },
  { coins: [5, 10], amount: 3 },
]

const optsOf = (c) => (c.coins ? c : { coins: DEFAULT_COINS, amount: DEFAULT_AMOUNT })

describe('coinChangeOrderSteps（LC 322 正序 vs 逆序）', () => {
  it.each(CASES)('正序 === BFS/递归，逆序 === 0-1 枚举：%j', (c) => {
    const steps = buildCoinChangeOrderSteps(optsOf(c))
    const done = steps.at(-1)
    const { coins, amount } = steps[0]
    expect(done.phase).toBe('done')
    expect(done.result).toBe(refBfs(coins, amount))
    expect(done.result).toBe(refRec(coins, amount))
    expect(done.descResult).toBe(ref01(coins, amount))
  })

  it.each(CASES)('帧骨架与逐帧不变量：%j', (c) => {
    const steps = buildCoinChangeOrderSteps(optsOf(c))
    const { coins, amount } = steps[0]
    expect(steps[0].phase).toBe('init')
    expect(steps.filter((f) => f.phase === 'update')).toHaveLength(coins.length * amount)

    let baseDesc = new Array(amount + 1).fill(INF)
    baseDesc[0] = 0
    let cursorIdx = -1
    let expectStep = 0
    let descSim = []

    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      for (let x = 0; x <= amount; x += 1) {
        expect(f.prevDpAsc[x]).toBe(p.dpAsc[x])
        expect(f.prevDpDesc[x]).toBe(p.dpDesc[x])
      }
      expect(f.dpAsc[0]).toBe(0)
      expect(f.dpDesc[0]).toBe(0)
      if (f.phase !== 'update') continue

      if (f.coinIndex !== cursorIdx) {
        baseDesc = [...p.dpDesc]
        cursorIdx = f.coinIndex
        expectStep = 0
      }
      expectStep += 1
      expect(f.step).toBe(expectStep)
      expect(f.a).toBe(expectStep) // 正序面板：本轮第几步就处理金额几
      expect(f.descA).toBe(amount + 1 - expectStep) // 逆序面板：从右往左

      const idx = f.a - f.coin
      const idxD = f.descA - f.coin
      if (idx < 0) {
        expect([f.ascRead, f.ascValue, f.ascUpdated]).toEqual([null, null, false])
      } else {
        expect(f.ascRead).toBe(f.prevDpAsc[idx]) // 正序：本轮已刷过的新值
        expect(f.ascValue).toBe(f.ascRead + 1)
        expect(f.dpAsc[f.a]).toBe(Math.min(f.prevDpAsc[f.a], f.ascValue))
        expect(f.ascUpdated).toBe(f.ascValue < f.prevDpAsc[f.a])
      }
      if (idxD < 0) {
        expect([f.descRead, f.descValue, f.descUpdated]).toEqual([null, null, false])
      } else {
        expect(f.descRead).toBe(baseDesc[idxD]) // 逆序：本轮硬币开始前的旧值
        expect(f.descValue).toBe(f.descRead + 1)
        expect(f.dpDesc[f.descA]).toBe(Math.min(f.prevDpDesc[f.descA], f.descValue))
        expect(f.descUpdated).toBe(f.descValue < f.prevDpDesc[f.descA])
      }
      for (let x = 0; x <= amount; x += 1) {
        if (x !== f.a) expect(f.dpAsc[x]).toBe(f.prevDpAsc[x])
        if (x !== f.descA) expect(f.dpDesc[x]).toBe(f.prevDpDesc[x])
      }

      // 与"真·逆序 in-place 循环"逐轮对齐
      if (f.step === 1) descSim = [...baseDesc]
      const aDesc = amount + 1 - f.step
      if (aDesc - f.coin >= 0) {
        descSim[aDesc] = Math.min(descSim[aDesc], descSim[aDesc - f.coin] + 1)
      }
      if (f.step === amount) {
        for (let x = 0; x <= amount; x += 1) expect(f.dpDesc[x]).toBe(descSim[x])
      }
    }
  })

  it('默认题面：35 帧，正序 3 / 逆序 -1，两块面板终态钉死', () => {
    const steps = buildCoinChangeOrderSteps()
    expect(steps).toHaveLength(35)
    const done = steps.at(-1)
    expect(done.dpAsc).toEqual([0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3])
    expect(done.dpDesc).toEqual([0, 1, 1, 2, INF, 1, 2, 2, 3, INF, INF, INF])
    expect(done.result).toBe(3)
    expect(done.descResult).toBe(-1)
    const ups = steps.filter((f) => f.phase === 'update')
    expect(ups.slice(0, 11).map((f) => f.a)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(ups.slice(0, 11).map((f) => f.descA)).toEqual([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('正序面板终态与 buildCoinChangeSteps 的 dp 逐格相等（两种循环同解）', () => {
    for (const c of CASES) {
      const o = optsOf(c)
      const a = buildCoinChangeSteps(o)
      const b = buildCoinChangeOrderSteps(o)
      expect(b.at(-1).dpAsc).toEqual(a.at(-1).dp)
      expect(b.at(-1).result).toBe(a.at(-1).result)
    }
  })

  it('无解样例：正序与逆序都 -1', () => {
    const done = buildCoinChangeOrderSteps({ coins: [2], amount: 3 }).at(-1)
    expect(done.result).toBe(-1)
    expect(done.descResult).toBe(-1)
  })

  it('金额 0：只有 init + done 两帧，两边都是 0', () => {
    const steps = buildCoinChangeOrderSteps({ coins: [2, 5], amount: 0 })
    expect(steps).toHaveLength(2)
    expect(steps.at(-1).result).toBe(0)
    expect(steps.at(-1).descResult).toBe(0)
  })

  it('逆序面板的读值确实"更旧"：金币 [1,2,5] 首轮第 11 步就能看出来', () => {
    const steps = buildCoinChangeOrderSteps()
    const ups = steps.filter((f) => f.phase === 'update')
    // 硬币 1 的第一轮：正序第 11 步读 dp[10]（本轮已刷成本轮值），逆序第 11 步读 dp[0]
    expect(ups[10].coin).toBe(1)
    expect(ups[10].a).toBe(11)
    expect(ups[10].ascRead).toBe(10) // dp[10] 已被本轮硬币 1 刷成 10
    expect(ups[10].descA).toBe(1)
    // 硬币 5 的第一轮最后一步：逆序处理金额 1，装不下
    const last = ups[32]
    expect(last.coin).toBe(5)
    expect(last.a).toBe(11)
    expect(last.descA).toBe(1)
    expect(last.descRead).toBeNull()
  })

  it('done 帧 desc 点名两块面板的答案与背包术语', () => {
    const done = buildCoinChangeOrderSteps().at(-1)
    expect(done.desc).toContain('正序')
    expect(done.desc).toContain('逆序')
    expect(done.desc).toContain('完全背包')
    expect(done.desc).toContain('0-1 背包')
    expect(done.desc).toContain('3')
    expect(done.desc).toContain('-1')
  })

  it('随机交叉：300 组 vs BFS + 0-1 枚举 + 跨模块同解', () => {
    let rng = 31415926
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 300; t += 1) {
      const coins = Array.from({ length: 1 + rand(4) }, () => 1 + rand(10))
      const amount = rand(16)
      const steps = buildCoinChangeOrderSteps({ coins, amount })
      const done = steps.at(-1)
      expect(done.result).toBe(refBfs(coins, amount))
      expect(done.descResult).toBe(ref01(coins, amount))
      expect(done.dpAsc).toEqual(buildCoinChangeSteps({ coins, amount }).at(-1).dp)
    }
  })

  it('非法输入回退默认，coins 是拷贝', () => {
    expect(buildCoinChangeOrderSteps({ coins: [], amount: -1 })[0].coins).toEqual(DEFAULT_COINS)
    expect(buildCoinChangeOrderSteps({ coins: [0, -1, 2.5], amount: null })[0].amount).toBe(DEFAULT_AMOUNT)
    const input = [1, 2, 5]
    const steps = buildCoinChangeOrderSteps({ coins: input, amount: 11 })
    input.push(99)
    for (const f of steps) expect(f.coins).toEqual([1, 2, 5])
  })
})
