/**
 * greatestSumDiv3Steps.test.js — LC 1262「可被三整除的最大和」贪心状态机单测。
 *
 * 交叉验证：状态机（余数分组 + 削最小）vs 独立参考解「枚举全部子集」。
 * 逐帧钉死：sum 帧数量与 runningSum、桶的一次划分、候选公式、
 * candidate 帧数量与 active 次序、done 结果。
 */
import { describe, it, expect } from 'vitest'
import { buildGreatestSumDiv3Steps } from '../greatestSumDiv3Steps.js'

// 独立参考解：枚举全部子集，取"和能被 3 整除"的最大值（含空集 0）
const refBrute = (nums) => {
  let best = 0
  for (let mask = 0; mask < 1 << nums.length; mask += 1) {
    let s = 0
    for (let i = 0; i < nums.length; i += 1) if (mask & (1 << i)) s += nums[i]
    if (((s % 3) + 3) % 3 === 0 && s > best) best = s
  }
  return best
}

const DEFAULT_NUMS = [3, 6, 5, 1, 8]

const CASES = [
  { nums: DEFAULT_NUMS }, // → 18
  { nums: [4] }, // → 0
  { nums: [1, 2, 3, 4, 4] }, // → 12
  { nums: [1] }, // → 0
  { nums: [2] }, // → 0
  { nums: [3] }, // → 3
  { nums: [5, 5, 5] }, // → 15
  { nums: [1, 1, 1] }, // → 3
  { nums: [2, 2, 2] }, // → 6
  { nums: [2, 3] }, // → 3
  { nums: [1, 2] }, // → 3
  { nums: [4, 4] }, // m2 为空、m1 有两个 → 削两个 4 → 0
  { nums: [0, 0, 0] }, // → 0
  { nums: [7, 8, 9] }, // → 24
  { nums: [10, 11, 12] }, // → 33
  { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, // → 45
]

describe('greatestSumDiv3Steps（LC 1262 贪心）', () => {
  it.each(CASES)('结果与暴力枚举一致：%j', (c) => {
    const steps = buildGreatestSumDiv3Steps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.result).toBe(refBrute(steps[0].nums))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildGreatestSumDiv3Steps(c)
    const first = steps[0]
    const { nums, n, total, r } = first

    expect(first.phase).toBe('init')
    // sum 帧恰有 n 个，idx 依次 0..n-1，最后一帧 runningSum === total
    const sums = steps.filter((f) => f.phase === 'sum')
    expect(sums).toHaveLength(n)
    sums.forEach((f, k) => expect(f.idx).toBe(k))
    expect(sums.at(-1).runningSum).toBe(total)
    // bucket 帧恰一个
    expect(steps.filter((f) => f.phase === 'bucket')).toHaveLength(1)

    // 桶：升序、下标并集是一次划分、值来自 nums
    const buckets = [first.m0, first.m1, first.m2]
    const idxs = [first.m0i, first.m1i, first.m2i]
    ;[0, 1, 2].forEach((b) => {
      expect(buckets[b]).toEqual([...buckets[b]].sort((x, y) => x - y))
      buckets[b].forEach((v) => expect(((v % 3) + 3) % 3).toBe(b))
    })
    const allIdx = [...idxs[0], ...idxs[1], ...idxs[2]].sort((a, b) => a - b)
    expect(allIdx).toEqual(Array.from({ length: n }, (_, i) => i))
    allIdx.forEach((i) => expect(nums[i]).toBe(first.nums[i]))

    // 候选公式
    const oneBucket = r === 1 ? buckets[1] : r === 2 ? buckets[2] : []
    const twoBucket = r === 1 ? buckets[2] : r === 2 ? buckets[1] : []
    const wantOne = r !== 0 && oneBucket.length >= 1 ? oneBucket[0] : null
    const wantTwo = r !== 0 && twoBucket.length >= 2 ? twoBucket[0] + twoBucket[1] : null
    for (const f of steps) {
      expect(f.candOne).toBe(wantOne)
      expect(f.candTwo).toBe(wantTwo)
    }

    // candidate 帧：r != 0 时恰 2 帧，active 依次 one、two
    const cands = steps.filter((f) => f.phase === 'candidate')
    if (r === 0) {
      expect(cands).toHaveLength(0)
    } else {
      expect(cands.map((f) => f.active)).toEqual(['one', 'two'])
    }

    // 从 bucket 起，除 active 外字段冻结
    const frozen = ['total', 'r', 'chosen', 'drop', 'result', 'candOne', 'candTwo']
    const tail = steps.filter((f) => f.phase === 'bucket' || f.phase === 'candidate' || f.phase === 'done')
    for (const f of tail) for (const key of frozen) expect(f[key]).toEqual(first[key])

    // done 结果
    const done = steps.at(-1)
    if (r === 0) expect(done.result).toBe(total)
    else if (done.drop === null) expect(done.result).toBe(0)
    else expect(done.result).toBe(total - done.drop)
  })

  it('默认题面：[3,6,5,1,8] → 18，r=2 削一个 m2', () => {
    const steps = buildGreatestSumDiv3Steps()
    expect(steps.map((f) => f.phase)).toEqual([
      'init',
      'sum', 'sum', 'sum', 'sum', 'sum',
      'bucket',
      'candidate', 'candidate',
      'done',
    ])
    const first = steps[0]
    expect(first.total).toBe(23)
    expect(first.r).toBe(2)
    expect(first.m0).toEqual([3, 6])
    expect(first.m1).toEqual([1])
    expect(first.m2).toEqual([5, 8])
    expect(first.candOne).toBe(5)
    expect(first.candTwo).toBeNull()
    expect(first.chosen).toBe('one')
    expect(first.drop).toBe(5)
    expect(steps.at(-1).result).toBe(18)
    expect(steps.at(-1).desc).toContain('23 − 5 = 18')
  })

  it('r = 0 短路：不产候选帧，答案就是总和', () => {
    const steps = buildGreatestSumDiv3Steps({ nums: [3, 6, 9] })
    expect(steps.filter((f) => f.phase === 'candidate')).toHaveLength(0)
    const done = steps.at(-1)
    expect(done.r).toBe(0)
    expect(done.drop).toBe(0)
    expect(done.result).toBe(18)
    expect(done.desc).toContain('18')
  })

  it('无解：[4] → 0（削一个 4 反而归零），desc 点明空集', () => {
    const steps = buildGreatestSumDiv3Steps({ nums: [4] })
    expect(steps.at(-1).result).toBe(0)
  })

  it('两个余 1 修正 r=2：[4,4] → 0', () => {
    const first = buildGreatestSumDiv3Steps({ nums: [4, 4] })[0]
    expect(first.r).toBe(2)
    expect(first.m1).toEqual([4, 4])
    expect(first.m2).toEqual([])
    expect(first.candOne).toBeNull()
    expect(first.candTwo).toBe(8)
    expect(first.chosen).toBe('two')
    expect(first.drop).toBe(8)
    expect(buildGreatestSumDiv3Steps({ nums: [4, 4] }).at(-1).result).toBe(0)
  })

  it('非法输入回退默认：空数组 / 非整数', () => {
    expect(buildGreatestSumDiv3Steps({ nums: [] })[0].nums).toEqual(DEFAULT_NUMS)
    expect(buildGreatestSumDiv3Steps({ nums: [1.5, NaN, 2] })[0].nums).toEqual([2])
    expect(buildGreatestSumDiv3Steps({ nums: null })[0].nums).toEqual(DEFAULT_NUMS)
  })

  it('随机交叉：400 组（非负）vs 暴力枚举', () => {
    let rng = 20261012
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const nums = Array.from({ length: 1 + rand(9) }, () => rand(15))
      const steps = buildGreatestSumDiv3Steps({ nums })
      expect(steps.at(-1).result).toBe(refBrute(nums))
    }
  })
})
