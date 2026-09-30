/**
 * lisDpSteps.test.js — LC 300「最长递增子序列」O(n^2) dp 状态机单测。
 *
 * 交叉验证：状态机 vs 暴力枚举所有子序列 vs 反向朴素 dp（写法不同）。
 * 逐帧不变量：dp 已定型部分与独立参考解一致、dp[i] 扫描中单调不减、
 * answer = max(dp[0..settled-1])、parent 链合法且长度 = answer。
 */
import { describe, it, expect } from 'vitest'
import { buildLisDpSteps } from '../lisDpSteps.js'
import { buildLisBinarySteps } from '../lisBinarySteps.js'

// ---- 参考解 1：暴力枚举所有子序列 ----
const brute = (nums) => {
  const n = nums.length
  let best = 0
  for (let mask = 0; mask < 1 << n; mask += 1) {
    let len = 0
    let prev = -Infinity
    let ok = true
    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) {
        if (nums[i] <= prev) {
          ok = false
          break
        }
        prev = nums[i]
        len += 1
      }
    }
    if (ok && len > best) best = len
  }
  return best
}

// ---- 参考解 2：反向朴素 dp（写法故意和状态机不同） ----
const naive = (nums) => {
  const n = nums.length
  if (n === 0) return 0
  const f = nums.map(() => 1)
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (nums[j] > nums[i]) f[i] = Math.max(f[i], f[j] + 1)
    }
  }
  return Math.max(...f)
}

// 从 endIdx 沿 parent 回溯出一条链（下标从浅到深）
const chain = (step, endIdx) => {
  const out = []
  let cur = endIdx
  let guard = 0
  while (cur >= 0 && guard < 128) {
    out.push(cur)
    cur = step.parent[cur]
    guard += 1
  }
  return out.reverse()
}

const CASES = [
  [10, 9, 2, 5, 3, 7, 101, 18],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [7, 7, 7, 7],
  [2, 2],
  [1, 2, 3, 0],
  [3, 1, 2],
  [0],
  [-1, -2, -3, -4],
  [1, 3, 6, 7, 9, 4, 10, 5, 6],
  [4, 10, 4, 3, 8, 9],
  [1, 1, 1, 2, 2, 3],
  [0, 1, 0, 3, 2, 3],
  [7, 7, 7, 7, 7, 7, 7],
  [-3, -3, -2, 0, -1],
]

describe('buildLisDpSteps — 结果正确性（两参考解交叉）', () => {
  for (const nums of CASES) {
    it(`${JSON.stringify(nums)}`, () => {
      const steps = buildLisDpSteps({ nums })
      const done = steps[steps.length - 1]
      expect(done.answer).toBe(brute(nums))
      expect(done.answer).toBe(naive(nums))
      // 与另一套记账（tails 二分）也必须一致
      const other = buildLisBinarySteps({ nums })
      expect(other[other.length - 1].answer).toBe(done.answer)
    })
  }
})

describe('buildLisDpSteps — 主例帧结构', () => {
  const steps = buildLisDpSteps({})
  const scans = steps.filter((s) => s.phase === 'scan')
  const settles = steps.filter((s) => s.phase === 'settle')

  it('init + 28 scan + 8 settle + done = 38 帧', () => {
    expect(steps.length).toBe(38)
    expect(scans.length).toBe(28) // 0+1+2+...+7
    expect(settles.length).toBe(8)
    expect(steps[0].phase).toBe('init')
    expect(steps[37].phase).toBe('done')
  })

  it('官方例 dp = [1,1,1,2,2,3,4,4]，答案 4', () => {
    expect(steps[37].dp).toEqual([1, 1, 1, 2, 2, 3, 4, 4])
    expect(steps[37].answer).toBe(4)
  })

  it('⚠️ 官方样例恰好让 dp[n-1] === 答案 —— 所以它测不出「返回 dp[n-1]」这个 bug', () => {
    expect(steps[37].dp[steps[37].dp.length - 1]).toBe(4)
    expect(steps[37].answer).toBe(4)
  })

  it('反例 [1,2,3,0]：答案 3，但 dp[n-1] = 1 —— 这才暴露得出', () => {
    const s = buildLisDpSteps({ nums: [1, 2, 3, 0] })
    const d = s[s.length - 1]
    expect(d.answer).toBe(3)
    expect(d.dp).toEqual([1, 2, 3, 1])
    expect(d.dp[d.dp.length - 1]).toBe(1)
    expect(d.bestEnd).toBe(2)
  })

  it('i = 6（值 101）那轮刷新到 4，之后 i = 7 打平不刷新', () => {
    const s6 = settles[6]
    expect(s6.best).toBe(4)
    expect(s6.bestEnd).toBe(6)
    const s7 = settles[7]
    expect(s7.best).toBe(4)
    expect(s7.answer).toBe(4)
    expect(s7.bestEnd).toBe(6) // 严格大于才刷新，4 不 > 4
  })

  it('i = 3（值 5）是教科书帧：最优前驱是 j = 2（值 2）', () => {
    const f = scans.find((x) => x.i === 3 && x.j === 2)
    expect(f.ok).toBe(true)
    expect(f.better).toBe(true)
    expect(f.best).toBe(2)
    expect(f.bestJ).toBe(2)
    expect(f.cands).toEqual([2])
  })

  it('i = 1（值 9）接不上 10：cands 为空、dp 保持 1', () => {
    const f = scans.find((x) => x.i === 1 && x.j === 0)
    expect(f.ok).toBe(false)
    expect(f.better).toBe(false)
    expect(f.cands).toEqual([])
    expect(settles[1].dp[1]).toBe(1)
  })

  it('done 帧带全字段', () => {
    const d = steps[37]
    expect(d.n).toBe(8)
    expect(d.settled).toBe(8)
    expect(d.answer).toBe(4)
    expect(d.bestEnd).toBe(6)
    expect(d.done).toBe(true)
  })
})

describe('buildLisDpSteps — 逐帧不变量（所有用例）', () => {
  for (const nums of CASES) {
    it(`${JSON.stringify(nums)}：dp 定型部分正确 / answer 口径 / parent 链合法`, () => {
      const steps = buildLisDpSteps({ nums })
      const n = nums.length
      for (const fr of steps) {
        if (fr.phase === 'init') continue
        // dp 每格至少 1
        for (const v of fr.dp) expect(v).toBeGreaterThanOrEqual(1)
        // parent 永远是更小的下标
        for (let k = 0; k < n; k += 1) {
          if (fr.parent[k] !== -1) {
            expect(fr.parent[k]).toBeGreaterThanOrEqual(0)
            expect(fr.parent[k]).toBeLessThan(k)
          }
        }
        // answer = max(dp[0..settled-1])
        const settledPart = fr.dp.slice(0, fr.settled)
        expect(fr.answer).toBe(settledPart.length > 0 ? Math.max(...settledPart) : 0)
        // 已定型部分的 dp 必须是「以 k 结尾」的最终值
        for (let k = 0; k < fr.settled; k += 1) {
          let want = 1
          for (let j = 0; j < k; j += 1) {
            if (nums[j] < nums[k]) want = Math.max(want, fr.dp[j] + 1)
          }
          expect(fr.dp[k]).toBe(want)
          if (fr.parent[k] >= 0) {
            expect(nums[fr.parent[k]]).toBeLessThan(nums[k])
            expect(fr.dp[fr.parent[k]] + 1).toBe(fr.dp[k])
          } else {
            // 没有前驱 ⇒ 前面确实没有更小的
            for (let j = 0; j < k; j += 1) expect(nums[j]).toBeGreaterThanOrEqual(nums[k])
            expect(fr.dp[k]).toBe(1)
          }
        }
      }
      // done 帧的最优链：长度 = 答案，且严格递增
      const d = steps[steps.length - 1]
      const path = chain(d, d.bestEnd)
      expect(path.length).toBe(d.answer)
      for (let t = 1; t < path.length; t += 1) {
        expect(nums[path[t]]).toBeGreaterThan(nums[path[t - 1]])
      }
      expect(path[path.length - 1]).toBe(d.bestEnd)
    })
  }
})

describe('buildLisDpSteps — 本题特有易错点', () => {
  it('扫描中 dp[i] 单调不减（就地生长）', () => {
    const steps = buildLisDpSteps({})
    let last = null
    for (const f of steps) {
      if (f.phase !== 'scan') continue
      if (last !== null && f.i === last.i) expect(f.dp[f.i]).toBeGreaterThanOrEqual(last.v)
      last = { i: f.i, v: f.dp[f.i] }
    }
  })

  it('严格递增：等于也不能接（[7,7,7,7] 答案是 1）', () => {
    const s = buildLisDpSteps({ nums: [7, 7, 7, 7] })
    expect(s[s.length - 1].answer).toBe(1)
    expect(s[s.length - 1].dp).toEqual([1, 1, 1, 1])
    for (const f of s) {
      if (f.phase === 'scan') expect(f.ok).toBe(false)
    }
  })

  it('严格递减：每格都单独成串，答案是 1', () => {
    const s = buildLisDpSteps({ nums: [5, 4, 3, 2, 1] })
    expect(s[s.length - 1].answer).toBe(1)
    expect(s[s.length - 1].dp).toEqual([1, 1, 1, 1, 1])
    for (const f of s) {
      if (f.phase === 'settle') expect(f.bestJ).toBe(-1)
    }
  })

  it('单元素：dp = [1]，答案是 1', () => {
    const s = buildLisDpSteps({ nums: [42] })
    expect(s.length).toBe(3)
    expect(s[s.length - 1].answer).toBe(1)
    expect(s[s.length - 1].dp).toEqual([1])
  })

  it('空数组：只有 1 帧 done，答案是 0', () => {
    const s = buildLisDpSteps({ nums: [] })
    expect(s.length).toBe(1)
    expect(s[0].phase).toBe('done')
    expect(s[0].answer).toBe(0)
  })

  it('不修改输入', () => {
    const raw = [10, 9, 2, 5, 3, 7, 101, 18]
    const steps = buildLisDpSteps({ nums: raw })
    for (const f of steps) expect(f.nums).toEqual([10, 9, 2, 5, 3, 7, 101, 18])
    expect(raw).toEqual([10, 9, 2, 5, 3, 7, 101, 18])
  })

  it('scan 帧的 cands 是「到目前为止」能接的前驱（增量口径）', () => {
    const steps = buildLisDpSteps({ nums: [3, 1, 4, 1, 5, 9, 2, 6] })
    const nums = [3, 1, 4, 1, 5, 9, 2, 6]
    for (const f of steps) {
      if (f.phase !== 'scan') continue
      const want = []
      for (let j = 0; j <= f.j; j += 1) if (nums[j] < nums[f.i]) want.push(j)
      expect(f.cands).toEqual(want)
      if (f.ok) expect(f.cands).toContain(f.j)
      else expect(f.cands).not.toContain(f.j)
    }
    // settle 帧给的是这一轮的完整候选集
    for (const f of steps) {
      if (f.phase !== 'settle') continue
      const want = []
      for (let j = 0; j < f.i; j += 1) if (nums[j] < nums[f.i]) want.push(j)
      expect(f.cands).toEqual(want)
    }
  })
})
