import { describe, expect, it } from 'vitest'

import { buildSpiralSteps, MODE_DIRS } from '../spiralSteps.js'

/**
 * 独立参考解：方向向量 + visited 撞墙变向（与四边界收缩法完全不同的实现路线）。
 * 返回「填入次序 -> 格子线性下标」的顺序数组。
 */
function refOrder(rows, cols, mode) {
  const dirs = MODE_DIRS[mode]
  const delta = { right: [0, 1], down: [1, 0], left: [0, -1], up: [-1, 0] }
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const order = []
  let r = 0
  let c = 0
  let d = 0
  for (let k = 0; k < rows * cols; k += 1) {
    order.push(r * cols + c)
    seen[r][c] = true
    let nr = r + delta[dirs[d]][0]
    let nc = c + delta[dirs[d]][1]
    if (!(nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc])) {
      d = (d + 1) % 4
      nr = r + delta[dirs[d]][0]
      nc = c + delta[dirs[d]][1]
    }
    r = nr
    c = nc
  }
  return order
}

/** 从终局 grid 反推填入次序：按数值 1..MN 找格子。 */
function orderOf(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const out = []
  for (let v = 1; v <= rows * cols; v += 1) {
    let found = false
    for (let r = 0; r < rows && !found; r += 1) {
      for (let c = 0; c < cols && !found; c += 1) {
        if (grid[r][c] === v) {
          out.push(r * cols + c)
          found = true
        }
      }
    }
  }
  return out
}

const final = (rows, cols, mode) => {
  const s = buildSpiralSteps({ rows, cols, mode })
  return s[s.length - 1].grid
}

describe('螺旋填数 · 与独立参考解一致', () => {
  it('两种 mode 在 1..6 x 1..6 全部 72 组上与撞墙变向法逐格一致', () => {
    for (const mode of ['rdlu', 'drul']) {
      for (let rows = 1; rows <= 6; rows += 1) {
        for (let cols = 1; cols <= 6; cols += 1) {
          const got = orderOf(final(rows, cols, mode))
          const want = refOrder(rows, cols, mode)
          expect(got, `${mode} ${rows}x${cols}`).toEqual(want)
        }
      }
    }
  })

  it('不重不漏：1..MN 各出现恰好一次（非方阵的经典 bug 专测）', () => {
    for (const mode of ['rdlu', 'drul']) {
      for (const [rows, cols] of [
        [1, 1], [1, 5], [5, 1], [2, 3], [3, 2], [2, 5], [5, 2], [4, 7], [7, 4],
      ]) {
        const flat = final(rows, cols, mode)
          .flat()
          .slice()
          .sort((a, b) => a - b)
        expect(flat, `${mode} ${rows}x${cols}`).toEqual(
          Array.from({ length: rows * cols }, (_, i) => i + 1),
        )
      }
    }
  })
})

describe('螺旋填数 · 主例与口径', () => {
  it('3x3 rdlu（右、下、左、上）就是九宫格标准答案', () => {
    expect(final(3, 3, 'rdlu')).toEqual([
      [1, 2, 3],
      [8, 9, 4],
      [7, 6, 5],
    ])
  })

  it('3x3 drul（下、右、上、左）是真逆时针，且恰好是 rdlu 的转置', () => {
    const drul = final(3, 3, 'drul')
    expect(drul).toEqual([
      [1, 8, 7],
      [2, 9, 6],
      [3, 4, 5],
    ])
    const rdlu = final(3, 3, 'rdlu')
    const transposed = rdlu[0].map((_, c) => rdlu.map((row) => row[c]))
    expect(transposed).toEqual(drul)
  })

  it('转置关系只在方阵成立（2x3 就是反例）', () => {
    expect(final(2, 3, 'rdlu')).toEqual([
      [1, 2, 3],
      [6, 5, 4],
    ])
    expect(final(2, 3, 'drul')).toEqual([
      [1, 6, 5],
      [2, 3, 4],
    ])
  })

  it('默认 3x3 + rdlu，帧数 = MN + 2', () => {
    const s = buildSpiralSteps({})
    expect(s.length).toBe(11)
    expect(s[0].phase).toBe('init')
    expect(s[10].phase).toBe('done')
    expect(s[10].answer).toEqual(final(3, 3, 'rdlu'))
  })

  it('单行 / 单列不重复打印（守卫的回归用例）', () => {
    expect(final(1, 4, 'rdlu')).toEqual([[1, 2, 3, 4]])
    expect(final(4, 1, 'rdlu')).toEqual([[1], [2], [3], [4]])
    expect(final(1, 4, 'drul')).toEqual([[1, 2, 3, 4]])
    expect(final(4, 1, 'drul')).toEqual([[1], [2], [3], [4]])
    expect(final(2, 3, 'rdlu')[1]).toEqual([6, 5, 4])
  })
})

describe('螺旋填数 · 帧结构与不变量', () => {
  it('每帧 filled 单调、cur 格的值等于当帧 value', () => {
    for (const mode of ['rdlu', 'drul']) {
      const s = buildSpiralSteps({ rows: 4, cols: 5, mode })
      let prev = 0
      for (const f of s) {
        expect(f.filled).toBeGreaterThanOrEqual(prev)
        prev = f.filled
        if (f.phase === 'fill') {
          expect(f.grid[f.cur.r][f.cur.c]).toBe(f.value)
          expect(f.filled).toBe(f.value - 1)
          expect(f.dir).toBeTruthy()
        }
        if (f.phase !== 'done') expect(f.answer).toBeNull()
        expect(f.desc.length).toBeGreaterThan(0)
      }
      expect(s[s.length - 1].filled).toBe(20)
    }
  })

  it('同一圈的帧共用同一份 bounds（虚线框不跳）', () => {
    const s = buildSpiralSteps({ rows: 3, cols: 3, mode: 'rdlu' })
    // 第一圈 8 帧（1..8）bounds 应恒为 {0,2,0,2}
    const firstRing = s.filter((f) => f.phase === 'fill' && f.value <= 8)
    expect(firstRing).toHaveLength(8)
    for (const f of firstRing) expect(f.bounds).toEqual({ top: 0, bottom: 2, left: 0, right: 2 })
    // 第 9 帧是第二圈，bounds 收缩为 {1,1,1,1}
    expect(s.find((f) => f.value === 9).bounds).toEqual({ top: 1, bottom: 1, left: 1, right: 1 })
  })

  it('done 帧保留真实语义字段（answer 是完整 grid）', () => {
    const s = buildSpiralSteps({ rows: 2, cols: 3 })
    const last = s[s.length - 1]
    expect(last.done).toBe(true)
    expect(last.filled).toBe(6)
    expect(last.answer.flat().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('输入校验：非正整数或超范围回落默认 3x3', () => {
    expect(buildSpiralSteps({ rows: 0 })[0].rows).toBe(3)
    expect(buildSpiralSteps({ rows: 2.5 })[0].rows).toBe(3)
    expect(buildSpiralSteps({ cols: 99 })[0].cols).toBe(3)
    expect(buildSpiralSteps({})[0].rows).toBe(3)
    expect(buildSpiralSteps({})[0].cols).toBe(3)
  })

  it('mode 只能是 rdlu / drul，其他值回落 rdlu', () => {
    expect(buildSpiralSteps({ mode: 'drul' })[0].mode).toBe('drul')
    expect(buildSpiralSteps({ mode: 'ccw' })[0].mode).toBe('rdlu')
    expect(buildSpiralSteps({})[0].mode).toBe('rdlu')
  })
})
