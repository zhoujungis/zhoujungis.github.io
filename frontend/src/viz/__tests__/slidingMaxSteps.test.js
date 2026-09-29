/**
 * slidingMaxSteps.test.js — LC 239「滑动窗口最大值」状态机单测。
 *
 * 交叉验证：状态机（单调队列）vs 暴力 O(n·k) vs 堆惰性删除（不同结构）。
 * 逐帧不变量：队列下标递增、值严格递减、队列下标都在窗口内、
 * 队首 = 窗口最大值、ans 长度按帧类型区分口径。
 */
import { describe, it, expect } from 'vitest'
import { buildSlidingMaxSteps } from '../slidingMaxSteps.js'

const brute = (nums, k) => {
  const res = []
  if (k > nums.length || nums.length === 0) return res
  for (let l = 0; l + k <= nums.length; l += 1) {
    let m = -Infinity
    for (let j = l; j < l + k; j += 1) m = Math.max(m, nums[j])
    res.push(m)
  }
  return res
}

class MaxHeap {
  constructor() { this.a = [] }
  push(item) {
    this.a.push(item)
    let i = this.a.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.a[p][0] >= this.a[i][0]) break
      ;[this.a[p], this.a[i]] = [this.a[i], this.a[p]]
      i = p
    }
  }
  peek() { return this.a[0] }
  get size() { return this.a.length }
  pop() {
    const top = this.a[0]
    const last = this.a.pop()
    if (this.a.length > 0) {
      this.a[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let big = i
        if (l < this.a.length && this.a[l][0] > this.a[big][0]) big = l
        if (r < this.a.length && this.a[r][0] > this.a[big][0]) big = r
        if (big === i) break
        ;[this.a[big], this.a[i]] = [this.a[i], this.a[big]]
        i = big
      }
    }
    return top
  }
}

const heapRef = (nums, k) => {
  const res = []
  if (k > nums.length || nums.length === 0) return res
  const h = new MaxHeap()
  for (let i = 0; i < nums.length; i += 1) {
    h.push([nums[i], i])
    if (i >= k - 1) {
      while (h.size > 0 && h.peek()[1] < i - k + 1) h.pop()
      res.push(h.peek()[0])
    }
  }
  return res
}

const CASES = [
  [[1, 3, -1, -3, 5, 3, 6, 7], 3],
  [[1], 1],
  [[1, -1], 1],
  [[7, 2, 4], 2],
  [[1, 2, 3, 4, 5], 3],
  [[5, 4, 3, 2, 1], 3],
  [[1, 3, 3, 3, 1], 3],
  [[4, 4, 4, 4], 2],
  [[-7, -8, -7, -8, -7], 2],
  [[9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 4],
  [[1, 3, 1, 2, 0, 5], 3],
  [[2, 1, 2, 1, 2, 1], 2],
  [[1, -1, 1, -1, 1], 5],
  [[10, 1, 1, 1, 10], 3],
]

describe('buildSlidingMaxSteps — 结果正确性（两参考解交叉）', () => {
  for (const [nums, k] of CASES) {
    it(`${JSON.stringify(nums)} k=${k}`, () => {
      const steps = buildSlidingMaxSteps({ nums, k })
      const done = steps[steps.length - 1]
      expect(done.ans).toEqual(brute(nums, k))
      expect(done.ans).toEqual(heapRef(nums, k))
    })
  }
})

describe('buildSlidingMaxSteps — 主例帧结构', () => {
  const steps = buildSlidingMaxSteps({})
  const slides = steps.filter((s) => s.phase === 'slide')
  const records = steps.filter((s) => s.phase === 'record')

  it('init + 8 slide + 6 record + done = 16 帧', () => {
    expect(steps.length).toBe(16)
    expect(slides.length).toBe(8)
    expect(records.length).toBe(6)
    expect(steps[15].phase).toBe('done')
  })

  it('主例答案 [3,3,5,5,6,7]', () => {
    expect(steps[15].ans).toEqual([3, 3, 5, 5, 6, 7])
  })

  it('i=4 是教科书帧：队首出窗 + 两个被支配同时发生', () => {
    const f = slides[4]
    expect(f.i).toBe(4)
    expect(f.expired).toEqual([1]) // 3 出窗
    expect(f.dropped).toEqual([3, 2]) // -3、-1 被 5 支配
    expect(f.dq).toEqual([4])
  })

  it('i=1 演示被支配（1 被 3 支配，永久淘汰）', () => {
    const f = slides[1]
    expect(f.dropped).toEqual([0])
    expect(f.dq).toEqual([1])
  })

  it('record 帧的 maxVal 与暴力逐窗一致', () => {
    const bf = brute([1, 3, -1, -3, 5, 3, 6, 7], 3)
    records.forEach((f, t) => {
      expect(f.maxVal).toBe(bf[t])
      expect(f.ans[f.ans.length - 1]).toBe(bf[t])
    })
  })

  it('done 帧带全字段', () => {
    const d = steps[15]
    expect(d.ans).toEqual([3, 3, 5, 5, 6, 7])
    expect(d.n).toBe(8)
    expect(d.k).toBe(3)
  })
})

describe('buildSlidingMaxSteps — 逐帧不变量（所有用例）', () => {
  for (const [nums, k] of CASES) {
    it(`${JSON.stringify(nums)} k=${k}：队列下标递增 / 值严格递减 / 都在窗内 / 队首=窗口最大`, () => {
      const steps = buildSlidingMaxSteps({ nums, k })
      for (const fr of steps) {
        if (fr.phase !== 'slide' && fr.phase !== 'record') continue
        // 队列下标递增
        for (let t = 1; t < fr.dq.length; t += 1) {
          expect(fr.dq[t]).toBeGreaterThan(fr.dq[t - 1])
        }
        // 值严格递减
        for (let t = 1; t < fr.dq.length; t += 1) {
          expect(fr.nums[fr.dq[t]]).toBeLessThan(fr.nums[fr.dq[t - 1]])
        }
        // 下标都在窗口内
        for (const idx2 of fr.dq) {
          expect(idx2).toBeGreaterThanOrEqual(fr.l)
          expect(idx2).toBeLessThanOrEqual(fr.i)
        }
        // 队首 = 窗口最大
        if (fr.dq.length > 0) {
          let m = -Infinity
          for (let j = fr.l; j <= fr.i; j += 1) m = Math.max(m, fr.nums[j])
          expect(fr.nums[fr.dq[0]]).toBe(m)
        }
        // ans 长度口径：slide 帧尚未记录本窗，record 帧已记入
        const want = Math.max(0, fr.i - fr.k + (fr.phase === 'record' ? 2 : 1))
        expect(fr.ans.length).toBe(want)
      }
    })
  }
})

describe('buildSlidingMaxSteps — 本题特有易错点', () => {
  it('k = 1：每个元素自己就是答案，队列每帧只剩 1 个', () => {
    const steps = buildSlidingMaxSteps({ nums: [4, 1, 7], k: 1 })
    expect(steps[steps.length - 1].ans).toEqual([4, 1, 7])
    for (const f of steps) {
      if (f.phase === 'slide') expect(f.dq.length).toBe(1)
    }
  })

  it('k = n：只有 1 个答案 = 全局最大', () => {
    const steps = buildSlidingMaxSteps({ nums: [2, 9, 4], k: 3 })
    expect(steps[steps.length - 1].ans).toEqual([9])
    expect(steps[steps.length - 1].ans.length).toBe(1)
  })

  it('单调递增：每帧队尾全被支配，队列只剩队首一个', () => {
    const steps = buildSlidingMaxSteps({ nums: [1, 2, 3, 4, 5], k: 3 })
    const slides = steps.filter((s) => s.phase === 'slide')
    // 从 i=1 起每个 slide 帧都清空队列
    for (let t = 1; t < slides.length; t += 1) {
      expect(slides[t].dq.length).toBe(1)
    }
    expect(steps[steps.length - 1].ans).toEqual([3, 4, 5])
  })

  it('单调递减：从不出队，队列长到 k', () => {
    const steps = buildSlidingMaxSteps({ nums: [5, 4, 3, 2, 1], k: 3 })
    const slides = steps.filter((s) => s.phase === 'slide')
    for (const f of slides) {
      if (f.i < 3) expect(f.dropped).toEqual([]) // 没有元素被支配
    }
    expect(slides[2].dq.length).toBe(3) // 队列长到 k
    expect(steps[steps.length - 1].ans).toEqual([5, 4, 3])
  })

  it('重复值：相等也被支配（<=），队列严格递减保证队首唯一', () => {
    const steps = buildSlidingMaxSteps({ nums: [4, 4, 4, 4], k: 2 })
    const done = steps[steps.length - 1]
    expect(done.ans).toEqual([4, 4, 4])
    for (const fr of steps) {
      if (fr.phase !== 'slide' && fr.phase !== 'record') continue
      for (let t = 1; t < fr.dq.length; t += 1) {
        expect(fr.nums[fr.dq[t]]).toBeLessThan(fr.nums[fr.dq[t - 1]])
      }
    }
  })

  it('k > n 或空数组：只有 1 帧 done，不进主流程', () => {
    const a = buildSlidingMaxSteps({ nums: [1, 2], k: 5 })
    expect(a.length).toBe(1)
    expect(a[0].phase).toBe('done')
    expect(a[0].ans).toEqual([])
    const b = buildSlidingMaxSteps({ nums: [], k: 3 })
    expect(b.length).toBe(1)
    expect(b[0].ans).toEqual([])
  })

  it('不修改输入（nums 字段全程保持）', () => {
    const steps = buildSlidingMaxSteps({ nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 })
    for (const f of steps) {
      expect(f.nums).toEqual([1, 3, -1, -3, 5, 3, 6, 7])
    }
  })
})
