/**
 * lisBinarySteps.test.js — LC 300「最长递增子序列」O(n log n) tails 二分单测。
 *
 * 交叉验证：状态机 vs 暴力枚举 vs 朴素 dp vs dp 状态机（四向）。
 * 逐帧不变量：tails 严格递增、answer = tails.length 且单调不减、
 * bisect 帧的 lo/mid/hi 合法且 goRight 与比较结果一致、
 * place 帧的 pos 恰好是「第一个 >= x 的下标」（用上一帧的 tails 复算）。
 */
import { describe, it, expect } from 'vitest'
import { buildLisBinarySteps } from '../lisBinarySteps.js'
import { buildLisDpSteps } from '../lisDpSteps.js'

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

const naive = (nums) => {
  const n = nums.length
  if (n === 0) return 0
  const f = nums.map(() => 1)
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (nums[j] < nums[i]) f[i] = Math.max(f[i], f[j] + 1)
    }
  }
  return Math.max(...f)
}

/** 独立实现 lower_bound：第一个 >= x 的下标（没有就返回长度）。 */
const lowerBound = (arr, x) => {
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] < x) lo = mid + 1
    else hi = mid
  }
  return lo
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

describe('buildLisBinarySteps — 结果正确性（三参考解交叉）', () => {
  for (const nums of CASES) {
    it(`${JSON.stringify(nums)}`, () => {
      const steps = buildLisBinarySteps({ nums })
      const done = steps[steps.length - 1]
      expect(done.answer).toBe(brute(nums))
      expect(done.answer).toBe(naive(nums))
      const other = buildLisDpSteps({ nums })
      expect(other[other.length - 1].answer).toBe(done.answer)
    })
  }
})

describe('buildLisBinarySteps — 主例帧结构', () => {
  const steps = buildLisBinarySteps({})
  const bisects = steps.filter((s) => s.phase === 'bisect')
  const places = steps.filter((s) => s.phase === 'place')

  it('init + 10 bisect + 8 place + done = 20 帧', () => {
    expect(steps.length).toBe(20)
    expect(bisects.length).toBe(10)
    expect(places.length).toBe(8)
    expect(steps[0].phase).toBe('init')
    expect(steps[19].phase).toBe('done')
  })

  it('tails 最终为 [2,3,7,18]，答案 4', () => {
    expect(steps[19].tails).toEqual([2, 3, 7, 18])
    expect(steps[19].answer).toBe(4)
  })

  it('8 个元素里 4 次追加、4 次替换', () => {
    expect(places.filter((p) => p.kind === 'append').length).toBe(4)
    expect(places.filter((p) => p.kind === 'replace').length).toBe(4)
    expect(places.map((p) => p.kind)).toEqual([
      'append',
      'replace',
      'replace',
      'append',
      'replace',
      'append',
      'append',
      'replace',
    ])
  })

  it('⚠️ tails 不是那条最长递增子序列：最后被替换掉的是 101', () => {
    const last = places[places.length - 1]
    expect(last.kind).toBe('replace')
    expect(last.prevVal).toBe(101)
    expect(last.pos).toBe(3)
    expect(last.tails).toEqual([2, 3, 7, 18])
  })

  it('i = 4（值 3）是唯一一轮两步二分', () => {
    const round = steps.filter((s) => s.i === 4)
    expect(round.filter((s) => s.phase === 'bisect').length).toBe(2)
    const p = round.find((s) => s.phase === 'place')
    expect(p.kind).toBe('replace')
    expect(p.prevVal).toBe(5)
    expect(p.tails).toEqual([2, 3])
  })

  it('i = 0 没有 bisect 帧（空 tails 直接追加）', () => {
    expect(steps.filter((s) => s.i === 0).map((s) => s.phase)).toEqual(['place'])
  })
})

describe('buildLisBinarySteps — 逐帧不变量（所有用例）', () => {
  for (const nums of CASES) {
    it(`${JSON.stringify(nums)}：tails 严格递增 / pos = lower_bound / answer 口径`, () => {
      const steps = buildLisBinarySteps({ nums })
      let prevAnswer = 0
      let prevTails = []
      for (const fr of steps) {
        // tails 严格递增
        for (let t = 1; t < fr.tails.length; t += 1) {
          expect(fr.tails[t]).toBeGreaterThan(fr.tails[t - 1])
        }
        // answer 就是 tails 的长度，且单调不减
        expect(fr.answer).toBe(fr.tails.length)
        expect(fr.answer).toBeGreaterThanOrEqual(prevAnswer)
        prevAnswer = fr.answer

        if (fr.phase === 'bisect') {
          expect(fr.lo).toBeGreaterThanOrEqual(0)
          expect(fr.lo).toBeLessThan(fr.hi)
          expect(fr.hi).toBeLessThanOrEqual(fr.tails.length)
          expect(fr.mid).toBeGreaterThanOrEqual(fr.lo)
          expect(fr.mid).toBeLessThan(fr.hi)
          // mid 与 lo/hi 的关系
          const m = (fr.lo + fr.hi) >> 1
          expect(fr.mid).toBe(m)
          expect(fr.goRight).toBe(fr.tails[fr.mid] < fr.x)
          // 这一帧的 tails 与上一帧一致（bisect 不改数据）
          expect(fr.tails).toEqual(prevTails)
        } else if (fr.phase === 'place') {
          const pos = lowerBound(prevTails, fr.x)
          expect(fr.pos).toBe(pos)
          if (pos < prevTails.length) {
            expect(fr.kind).toBe('replace')
            expect(fr.prevVal).toBe(prevTails[pos])
            expect(fr.prevVal).toBeGreaterThanOrEqual(fr.x) // lower_bound ⇒ >= x
            expect(fr.tails).toEqual(prevTails.map((v, k) => (k === pos ? fr.x : v)))
          } else {
            expect(fr.kind).toBe('append')
            expect(fr.prevVal).toBe(null)
            expect(fr.tails).toEqual([...prevTails, fr.x])
          }
        }
        prevTails = fr.tails
      }
      // done 帧的 tails 长度 = 答案
      const d = steps[steps.length - 1]
      expect(d.tails.length).toBe(d.answer)
      expect(d.answer).toBe(brute(nums))
    })
  }
})

describe('buildLisBinarySteps — 本题特有易错点', () => {
  it('严格递增用 lower_bound，重复值不会造成「相等也算递增」的错判', () => {
    const s = buildLisBinarySteps({ nums: [7, 7, 7, 7] })
    expect(s[s.length - 1].answer).toBe(1)
    // 第一次追加，之后三次都是替换，从不 append
    const places = s.filter((f) => f.phase === 'place')
    expect(places.map((p) => p.kind)).toEqual(['append', 'replace', 'replace', 'replace'])
    expect(s[s.length - 1].tails).toEqual([7])
  })

  it('若误用 upper_bound（>= 换成 >），[7,7,7] 会变成 3 —— 反例钉死', () => {
    // 手写错误版本：找第一个 > x 的位置
    const wrong = (nums) => {
      const tails = []
      for (const x of nums) {
        let lo = 0
        let hi = tails.length
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (tails[mid] <= x) lo = mid + 1
          else hi = mid
        }
        if (lo === tails.length) tails.push(x)
        else tails[lo] = x
      }
      return tails.length
    }
    expect(wrong([7, 7, 7])).toBe(3)
    expect(brute([7, 7, 7])).toBe(1)
    expect(buildLisBinarySteps({ nums: [7, 7, 7] })[2].answer).toBe(1)
  })

  it('严格递减：每次都在 pos = 0 替换，长度恒为 1', () => {
    const s = buildLisBinarySteps({ nums: [5, 4, 3, 2, 1] })
    for (const f of s) {
      if (f.phase === 'init') continue
      expect(f.answer).toBe(1)
    }
    const places = s.filter((f) => f.phase === 'place')
    expect(places.map((p) => p.kind)).toEqual(['append', 'replace', 'replace', 'replace', 'replace'])
    expect(places.every((p) => p.pos === 0)).toBe(true)
    expect(s[s.length - 1].tails).toEqual([1])
  })

  it('单元素：只有 place + done，答案 1', () => {
    const s = buildLisBinarySteps({ nums: [42] })
    expect(s.length).toBe(3)
    expect(s[1].phase).toBe('place')
    expect(s[s.length - 1].answer).toBe(1)
  })

  it('空数组：只有 1 帧 done，答案 0', () => {
    const s = buildLisBinarySteps({ nums: [] })
    expect(s.length).toBe(1)
    expect(s[0].phase).toBe('done')
    expect(s[0].answer).toBe(0)
  })

  it('不修改输入', () => {
    const raw = [10, 9, 2, 5, 3, 7, 101, 18]
    const steps = buildLisBinarySteps({ nums: raw })
    for (const f of steps) expect(f.nums).toEqual([10, 9, 2, 5, 3, 7, 101, 18])
    expect(raw).toEqual([10, 9, 2, 5, 3, 7, 101, 18])
  })

  it('答案只可能被 append 抬高，replace 永不改变答案', () => {
    const s = buildLisBinarySteps({})
    for (let k = 1; k < s.length; k += 1) {
      const f = s[k]
      const before = s[k - 1].answer
      if (f.phase === 'place' && f.kind === 'replace') expect(f.answer).toBe(before)
      if (f.phase === 'place' && f.kind === 'append') expect(f.answer).toBe(before + 1)
      if (f.phase === 'bisect') expect(f.answer).toBe(before)
    }
  })
})
