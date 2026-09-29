/**
 * binarySearchSteps.test.js — LC 704「二分查找」状态机单测。
 *
 * 交叉验证：状态机（闭区间二分）vs 独立参考解（线性 indexOf —— 实现路径完全不同，
 * 升序无重复时二者答案必相等）。
 * 逐帧钉死：回放一致、mid 公式、每帧只动一个边界、区间严格收缩、
 * 不变量守恒（答案若在则恒在窗口内）、found 帧区间不动、done 交叉条件、探测次数上界。
 */
import { describe, it, expect } from 'vitest'
import { buildBinarySearchSteps } from '../binarySearchSteps.js'

const DEFAULT_NUMS = [-1, 0, 3, 5, 9, 12, 15, 20, 26, 31, 38, 44]

const CASES = [
  {}, // 默认 12 项找 31 → 9
  { target: 27 }, // miss（夹在两元素之间）
  { target: -1 }, // 命中首元素
  { target: 44 }, // 命中末元素
  { target: 100 }, // 比所有都大
  { target: -100 }, // 比所有都小
  { nums: [5], target: 5 }, // 单元素命中
  { nums: [5], target: 4 }, // 单元素未中
  { nums: [1, 2], target: 1 },
  { nums: [1, 2], target: 2 },
  { nums: [1, 2], target: 3 }, // 两项 miss
  { nums: [1, 3, 5], target: 4 },
  { nums: [0], target: 0 }, // x=0 型边界
  {
    nums: Array.from({ length: 64 }, (_, i) => i * 3 - 100),
    target: 83,
  },
  {
    nums: Array.from({ length: 64 }, (_, i) => i * 3 - 100),
    target: 84, // 不在（83 与 86 之间）
  },
]

const optsOf = (c) => (c.nums ? c : { nums: DEFAULT_NUMS, ...c })

describe('binarySearchSteps（LC 704）', () => {
  it.each(CASES)('最终结果与线性参考解一致：%j', (c) => {
    const opt = optsOf(c)
    const steps = buildBinarySearchSteps(opt)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.result).toBe(steps[0].nums.indexOf(steps[0].target))
  })

  it.each(CASES)('逐帧不变量：%j', (c) => {
    const opt = optsOf(c)
    const steps = buildBinarySearchSteps(opt)
    const { nums, target } = steps[0]
    const ref = nums.indexOf(target)
    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      // 回放一致：本帧动作前的区间 === 上一帧动作后的区间
      expect(f.prevLeft).toBe(p.left)
      expect(f.prevRight).toBe(p.right)
      if (f.phase === 'probe') {
        expect(f.mid).toBe(f.prevLeft + ((f.prevRight - f.prevLeft) >> 1))
        expect(f.mid).toBeGreaterThanOrEqual(f.prevLeft)
        expect(f.mid).toBeLessThanOrEqual(f.prevRight)
        expect(f.value).toBe(nums[f.mid])
        const wantCmp = f.value < target ? -1 : f.value > target ? 1 : 0
        expect(f.cmp).toBe(wantCmp)
        if (f.action === 'found') {
          expect(f.cmp).toBe(0)
          expect(f.result).toBe(f.mid)
          expect(f.left).toBe(f.prevLeft) // 命中：区间不动
          expect(f.right).toBe(f.prevRight)
        } else if (f.action === 'go_right') {
          expect(f.cmp).toBe(-1)
          expect(f.left).toBe(f.mid + 1) // 只动左边界，且跳过 mid
          expect(f.right).toBe(f.prevRight)
          expect(f.eliminated).toBe(f.mid - f.prevLeft + 1)
        } else if (f.action === 'go_left') {
          expect(f.cmp).toBe(1)
          expect(f.right).toBe(f.mid - 1) // 只动右边界，且跳过 mid
          expect(f.left).toBe(f.prevLeft)
          expect(f.eliminated).toBe(f.prevRight - f.mid + 1)
        } else {
          throw new Error(`非法 action: ${f.action}`)
        }
        // 不变量守恒：答案若在，绝不被误排除
        if (ref >= 0 && f.action !== 'found') {
          expect(f.left).toBeLessThanOrEqual(ref)
          expect(f.right).toBeGreaterThanOrEqual(ref)
        }
        // 区间严格收缩
        if (f.action !== 'found') {
          expect(f.right - f.left).toBeLessThan(f.prevRight - f.prevLeft)
        }
      } else {
        expect(f.phase).toBe('done')
        expect(f.found).toBe(ref >= 0)
        if (!f.found) {
          expect(f.left).toBe(f.right + 1) // 闭区间为空的精确条件
          expect(f.result).toBe(-1)
        }
      }
    }
  })

  it.each(CASES)('探测次数不超 log₂(n)+1：%j', (c) => {
    const steps = buildBinarySearchSteps(optsOf(c))
    const n = steps[0].nums.length
    const probes = steps.filter((f) => f.phase === 'probe').length
    expect(probes).toBeLessThanOrEqual(Math.floor(Math.log2(n)) + 1)
  })

  it('默认表达式：6 帧（init + 4 探 + done），答案下标 9', () => {
    const steps = buildBinarySearchSteps()
    expect(steps).toHaveLength(6)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).result).toBe(9)
    expect(steps.map((f) => f.phase)).toEqual([
      'init', 'probe', 'probe', 'probe', 'probe', 'done',
    ])
    expect(steps.map((f) => f.action)).toEqual([
      null, 'go_right', 'go_right', 'go_left', 'found', null,
    ])
    expect(steps[1].mid).toBe(5)
    expect(steps[2].mid).toBe(8)
    expect(steps[3].mid).toBe(10)
    expect(steps[4].mid).toBe(9)
  })

  it('found 帧之后立刻 done，不再探测', () => {
    const steps = buildBinarySearchSteps({ nums: [7], target: 7 })
    expect(steps).toHaveLength(3) // init + probe(found) + done
    expect(steps[1].action).toBe('found')
    expect(steps[2].result).toBe(0)
  })

  it('miss 全程无 found 帧，窗口最终为空', () => {
    const steps = buildBinarySearchSteps({ nums: [1, 3, 5, 7], target: 4 })
    expect(steps.some((f) => f.action === 'found')).toBe(false)
    const last = steps.at(-2) // 最后一次收缩后
    expect(last.left).toBeGreaterThan(last.right)
    expect(steps.at(-1).result).toBe(-1)
  })

  it('mid 用 left + ((right - left) >> 1)：大下标不漂移', () => {
    // 1e9 量级的"下标"在 JS 里安全，但公式必须写成防溢出形态 —— 用帧字段验证取整方向
    const nums = Array.from({ length: 101 }, (_, i) => i * 2) // 偶数 0..200
    const steps = buildBinarySearchSteps({ nums, target: 199 }) // miss，逼满收缩
    for (const f of steps.filter((s) => s.phase === 'probe')) {
      expect(f.mid).toBe(Math.floor((f.prevLeft + f.prevRight) / 2))
    }
    expect(steps.at(-1).result).toBe(-1)
  })

  it('非法输入回退默认：空数组 / 非有限 target', () => {
    const empty = buildBinarySearchSteps({ nums: [], target: 31 })
    expect(empty[0].nums).toEqual(DEFAULT_NUMS)
    const badT = buildBinarySearchSteps({ nums: [1, 2], target: NaN })
    expect(badT[0].target).toBe(31)
  })

  it('所有帧共享同一份 nums / target，且 nums 是拷贝', () => {
    const input = [1, 2, 3]
    const steps = buildBinarySearchSteps({ nums: input, target: 2 })
    input.push(99)
    for (const f of steps) {
      expect(f.nums).toEqual([1, 2, 3])
      expect(f.target).toBe(2)
    }
  })

  it('desc 非空且含关键数值', () => {
    const steps = buildBinarySearchSteps()
    const hit = steps.find((f) => f.action === 'found')
    expect(hit.desc).toContain('31')
    expect(hit.desc).toContain('9')
    const go = steps.find((f) => f.action === 'go_right')
    expect(go.desc).toContain('12')
  })
})
