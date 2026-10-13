import { describe, expect, it } from 'vitest'

import { buildKthLargeSteps } from '../kthLargeSteps.js'

const MAIN = [23, 7, 45, 12, 45, 8, 33, 12, 19, 5, 45, 27, 12, 9, 33, 16, 41, 3]

/** 独立参考解 1：排序法。 */
function refSort(nums, k, dedupe) {
  const arr = dedupe ? [...new Set(nums)] : nums.slice()
  if (arr.length < k) return null
  return arr.sort((a, b) => b - a)[k - 1]
}

/** 独立参考解 2：最小堆（每次 sort 模拟，不依赖被测实现）。 */
function refHeap(nums, k, dedupe) {
  const h = []
  const seen = new Set()
  for (const v of nums) {
    if (dedupe && seen.has(v)) continue
    if (h.length < k) h.push(v)
    else if (v > h[0]) h[0] = v
    else continue
    h.sort((a, b) => a - b)
    seen.add(v)
  }
  return h.length === k ? h[0] : null
}

const last = (nums, k, dedupe) => {
  const s = buildKthLargeSteps({ nums, k, dedupe })
  return s[s.length - 1]
}

describe('第 K 大 · 主例与口径', () => {
  it('同一组数据：不去重 16，去重 8 —— 口径决定答案', () => {
    expect(last(MAIN, 10, false).answer).toBe(16)
    expect(last(MAIN, 10, true).answer).toBe(8)
  })

  it('两种口径都对上两个独立参考解', () => {
    for (const dedupe of [false, true]) {
      expect(last(MAIN, 10, dedupe).answer).toBe(refSort(MAIN, 10, dedupe))
      expect(last(MAIN, 10, dedupe).answer).toBe(refHeap(MAIN, 10, dedupe))
    }
  })

  it('主例 18 个元素 20 帧；去重口径丢掉 6 个、不去重丢掉 2 个', () => {
    const a = buildKthLargeSteps({ nums: MAIN, k: 10 })
    const b = buildKthLargeSteps({ nums: MAIN, k: 10, dedupe: true })
    expect(a.length).toBe(20)
    expect(b.length).toBe(20)
    expect(a[a.length - 1].rejectedCount).toBe(2)
    expect(b[b.length - 1].rejectedCount).toBe(6)
    expect(a[a.length - 1].distinct).toBe(13)
  })

  it('不去重口径：堆内容恰好是最大的 k 个值', () => {
    const f = last(MAIN, 10, false)
    expect(f.heap.slice().sort((a, b) => b - a)).toEqual(
      MAIN.slice().sort((a, b) => b - a).slice(0, 10),
    )
  })
})

describe('第 K 大 · 随机交叉验证', () => {
  it('500 组随机数组 x 两种口径 x 两个参考解全部一致', () => {
    const randNums = () => {
      const len = 1 + Math.floor(Math.random() * 20)
      const out = []
      for (let i = 0; i < len; i += 1) {
        out.push(
          Math.random() < 0.45 && out.length
            ? out[Math.floor(Math.random() * out.length)]
            : Math.floor(Math.random() * 30),
        )
      }
      return out
    }
    for (let t = 0; t < 500; t += 1) {
      const nums = randNums()
      const k = 1 + Math.floor(Math.random() * Math.min(12, nums.length))
      for (const dedupe of [false, true]) {
        const got = last(nums, k, dedupe).answer
        expect(got, `${JSON.stringify(nums)} k=${k} dedupe=${dedupe}`).toBe(refSort(nums, k, dedupe))
        expect(got, `${JSON.stringify(nums)} k=${k} dedupe=${dedupe}`).toBe(refHeap(nums, k, dedupe))
      }
    }
  })
})

describe('第 K 大 · 边界与无解', () => {
  it('distinct 值不够 k 个时无解（去重口径），answer 必须是 null', () => {
    const nums = [5, 5, 5, 5, 5]
    const f = last(nums, 3, true)
    expect(f.answer).toBeNull()
    expect(f.solvable).toBe(false)
    expect(f.distinct).toBe(1)
  })

  it('不去重口径下 distinct 少但总数够，仍然有解', () => {
    const nums = [5, 5, 5, 5, 5]
    expect(last(nums, 3, false).answer).toBe(5)
    expect(last(nums, 3, false).solvable).toBe(true)
  })

  it('k = 1 就是最大值；k = n 就是最小值', () => {
    const nums = [4, 9, 2, 7]
    expect(last(nums, 1, false).answer).toBe(9)
    expect(last(nums, 4, false).answer).toBe(2)
  })

  it('单元素数组 k = 1', () => {
    expect(last([7], 1, false).answer).toBe(7)
  })

  it('k > n 时回落到 min(10, n)，不会算出不存在的第 K 大', () => {
    const s = buildKthLargeSteps({ nums: [3, 1, 2], k: 10 })
    expect(s[0].k).toBe(3)
    expect(s[s.length - 1].answer).toBe(1)
  })

  it('输入含非有限值回落默认主例', () => {
    expect(buildKthLargeSteps({ nums: [1, 2, NaN] })[0].nums).toEqual(MAIN)
    expect(buildKthLargeSteps({ nums: [] })[0].nums).toEqual(MAIN)
    expect(buildKthLargeSteps({})[0].nums).toEqual(MAIN)
  })
})

describe('第 K 大 · 帧结构与不变量', () => {
  it('堆大小从不超过 k；堆没满时 answer 恒为 null', () => {
    for (const dedupe of [false, true]) {
      const s = buildKthLargeSteps({ nums: MAIN, k: 10, dedupe })
      for (const f of s) {
        expect(f.heap.length).toBeLessThanOrEqual(10)
        if (f.heap.length < 10) expect(f.answer).toBeNull()
        if (f.phase !== 'done') expect(f.done).toBe(false)
        expect(f.desc.length).toBeGreaterThan(0)
      }
    }
  })

  it('最小堆性质：每帧堆顶都是堆内最小值', () => {
    for (const dedupe of [false, true]) {
      const s = buildKthLargeSteps({ nums: MAIN, k: 10, dedupe })
      for (const f of s) {
        if (f.heap.length === 0) continue
        expect(f.heap[0]).toBe(Math.min(...f.heap))
      }
    }
  })

  it('siftPath 是合法的父子链（siftUp 子->父、siftDown 父->子）', () => {
    const s = buildKthLargeSteps({ nums: MAIN, k: 10 })
    for (const f of s) {
      const p = f.siftPath
      if (!p || p.length === 0) continue
      expect(p[0]).toBeGreaterThanOrEqual(0)
      expect(p[p.length - 1]).toBeLessThan(f.heap.length)
      for (let i = 1; i < p.length; i += 1) {
        const a = p[i - 1]
        const b = p[i]
        expect((b - 1) >> 1 === a || (a - 1) >> 1 === b).toBe(true)
      }
    }
  })

  it('去重口径下堆内值两两不同', () => {
    const s = buildKthLargeSteps({ nums: MAIN, k: 10, dedupe: true })
    for (const f of s) {
      expect(new Set(f.heap).size).toBe(f.heap.length)
    }
  })

  it('action 语义正确：大于堆顶才 accept，小于等于才 reject', () => {
    const s = buildKthLargeSteps({ nums: MAIN, k: 10 })
    for (const f of s) {
      if (f.phase !== 'accept' && f.phase !== 'reject') continue
      const prev = s[f === s[0] ? 0 : s.indexOf(f) - 1]
      if (f.phase === 'accept') expect(f.val).toBeGreaterThan(prev.heap[0])
      else expect(f.val).toBeLessThanOrEqual(prev.heap[0])
    }
  })
})
