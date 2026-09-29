import { describe, expect, it } from 'vitest'

import { buildRotatedMinSteps } from '../rotatedMinSteps.js'

/** 线性参考：最小值下标。 */
function refMin(nums) {
  let m = 0
  for (let i = 1; i < nums.length; i += 1) if (nums[i] < nums[m]) m = i
  return m
}

const CASES = [
  [4, 5, 6, 7, 0, 1, 2],
  [3, 4, 5, 1, 2],
  [11, 13, 15, 17],
  [2, 1],
  [1],
  [1, 2, 3, 4, 5],
  [5, 1, 2, 3, 4],
  [3, 1, 2],
  [2, 3, 4, 5, 1],
]

function final(nums) {
  return buildRotatedMinSteps({ nums }).at(-1)
}

describe('答案与线性参考解交叉验证', () => {
  it.each(CASES.map((c, i) => [JSON.stringify(c), i]))('case %d: %s', (_, i) => {
    const nums = CASES[i]
    expect(final(nums).minIdx).toBe(refMin(nums))
  })

  it('官方例：[4,5,6,7,0,1,2] → 0（下标 4）；[3,4,5,1,2] → 1（下标 3）', () => {
    expect(final([4, 5, 6, 7, 0, 1, 2]).nums[final([4, 5, 6, 7, 0, 1, 2]).minIdx]).toBe(0)
    expect(final([3, 4, 5, 1, 2]).nums[final([3, 4, 5, 1, 2]).minIdx]).toBe(1)
  })

  it('未旋转数组：最小值就是 nums[0]（每轮 mid < right，一路往左缩）', () => {
    const last = final([11, 13, 15, 17])
    expect(last.minIdx).toBe(0)
  })
})

describe('帧内自洽：收缩方向与比较结果一致', () => {
  it('cmp >（mid 在第一段）→ live = [mid+1, r]；cmp < → live = [l, mid]（mid 不能丢）', () => {
    for (const nums of CASES) {
      for (const s of buildRotatedMinSteps({ nums })) {
        if (s.cmp === '>') {
          expect(s.live).toEqual([s.mid + 1, s.r])
        } else if (s.cmp === '<') {
          expect(s.live).toEqual([s.l, s.mid])
        }
      }
    }
  })

  it('跨帧链：下一帧的 l/r === 上一帧的 live（状态连续不跳步）', () => {
    for (const nums of CASES) {
      const steps = buildRotatedMinSteps({ nums })
      for (let x = 1; x < steps.length; x += 1) {
        const prev = steps[x - 1]
        const cur = steps[x]
        if (cur.l === null || !prev.live) continue
        expect([cur.l, cur.r]).toEqual(prev.live)
      }
    }
  })

  it('最小值永远在存活区间内（未 done 时）', () => {
    for (const nums of CASES) {
      const realMin = refMin(nums)
      for (const s of buildRotatedMinSteps({ nums })) {
        const live = s.live ?? (s.l !== null ? [s.l, s.r] : null)
        if (!live || s.done) continue
        expect(realMin).toBeGreaterThanOrEqual(live[0])
        expect(realMin).toBeLessThanOrEqual(live[1])
      }
    }
  })
})

describe('边界与保护', () => {
  it('不修改调用方传进来的数组', () => {
    const src = [4, 5, 6, 7, 0, 1, 2]
    buildRotatedMinSteps({ nums: src })
    expect(src).toEqual([4, 5, 6, 7, 0, 1, 2])
  })

  it('空输入：单帧 done', () => {
    const steps = buildRotatedMinSteps({ nums: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
  })

  it('主例 5 帧（init + 3 probe + done），done 帧带全渲染字段', () => {
    const steps = buildRotatedMinSteps({ nums: [4, 5, 6, 7, 0, 1, 2] })
    expect(steps).toHaveLength(5)
    const done = steps.at(-1)
    expect(done.live).toEqual([4, 4])
    expect(done.minIdx).toBe(4)
    expect(done.nums).toEqual([4, 5, 6, 7, 0, 1, 2])
  })
})
