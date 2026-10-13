/**
 * spiralSteps.js — 「螺旋填数」的状态机：四边界收缩法，两种方向顺序共用。
 *
 * 口径先说清（这是本题最大的坑，见文章第一节）：
 *   mode 'rdlu' —— 右、下、左、上。从左上角出发只能这么转（顶边先走完）。
 *                  几何上它画出来是**顺时针**，但大量面经管它叫「逆时针」。
 *                  LeetCode 54/59 的螺旋顺序就是这一套。
 *   mode 'drul' —— 下、右、上、左。从左上角先往下走，几何上是**真逆时针**。
 *                  本文把它做成对照，用来对齐口径。
 *
 * 算法：四边界（top/bottom/left/right）逐圈收缩，每圈四条边。
 * 关键在第三、四条边的守卫：`top <= bottom` 和 `left <= right` ——
 * 少了它们，剩单行/单列时会重复打印（非方阵的经典 bug）。
 *
 * bounds 按「本圈」记录并显式传给每一帧：如果读实时值，同一圈里前半段和后半段
 * 会显示不同的边界，渲染层的虚线框会跳动（坑 AF 的变体）。
 *
 * 通用坑：A / V / Z。
 */

const MODE_DIRS = {
  rdlu: ['right', 'down', 'left', 'up'],
  drul: ['down', 'right', 'up', 'left'],
}

const DIR_LABEL = {
  right: '向右',
  down: '向下',
  left: '向左',
  up: '向上',
}

function asDim(value, fallback) {
  return Number.isInteger(value) && value > 0 && value <= 8 ? value : fallback
}

/**
 * 构造帧序列：init + M*N 个填数帧 + done。
 * @param {{ rows?: number, cols?: number, mode?: 'rdlu' | 'drul' }} [options]
 */
export function buildSpiralSteps(options = {}) {
  const rows = asDim(options.rows, 3)
  const cols = asDim(options.cols, 3)
  const mode = options.mode === 'drul' ? 'drul' : 'rdlu'

  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0))
  const steps = []
  const total = rows * cols

  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1
  let num = 1

  const snap = (phase, cur, dir, extra) => {
    steps.push({
      phase,
      mode,
      rows,
      cols,
      grid: grid.map((row) => row.slice()),
      cur: cur ? { ...cur } : null,
      dir,
      value: null,
      filled: num - 1,
      total,
      bounds: { top, bottom, left, right },
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  snap('init', null, null, {
    desc:
      `${rows} x ${cols} 的矩阵，从 1 开始按「${MODE_DIRS[mode]
        .map((d) => DIR_LABEL[d])
        .join('、')}」的顺序螺旋填入。` +
      `每一格填一次，共 ${total} 个数 —— 所以时间下界就是 O(${rows} x ${cols})。`,
  })

  const put = (r, c, dir, b) => {
    grid[r][c] = num
    snap('fill', { r, c }, dir, {
      value: num,
      bounds: b,
      desc:
        `第 ${num} 个数填在 (${r}, ${c})，方向${DIR_LABEL[dir]}。` +
        `本圈边界：上 ${b.top} / 下 ${b.bottom} / 左 ${b.left} / 右 ${b.right}。`,
    })
    num += 1
  }

  while (top <= bottom && left <= right) {
    // 本圈边界：整圈共用一份，渲染层的虚线框才不跳
    const b = { top, bottom, left, right }
    if (mode === 'rdlu') {
      for (let c = left; c <= right; c += 1) put(top, c, 'right', b)
      top += 1
      for (let r = top; r <= bottom; r += 1) put(r, right, 'down', b)
      right -= 1
      // 守卫：只剩一行时不能再向左扫，否则会重复
      if (top <= bottom) {
        for (let c = right; c >= left; c -= 1) put(bottom, c, 'left', b)
        bottom -= 1
      }
      // 守卫：只剩一列时不能再向上扫
      if (left <= right) {
        for (let r = bottom; r >= top; r -= 1) put(r, left, 'up', b)
        left += 1
      }
    } else {
      for (let r = top; r <= bottom; r += 1) put(r, left, 'down', b)
      left += 1
      for (let c = left; c <= right; c += 1) put(bottom, c, 'right', b)
      bottom -= 1
      if (left <= right) {
        for (let r = bottom; r >= top; r -= 1) put(r, right, 'up', b)
        right -= 1
      }
      if (top <= bottom) {
        for (let c = right; c >= left; c -= 1) put(top, c, 'left', b)
        top += 1
      }
    }
  }

  snap('done', null, null, {
    filled: total,
    answer: grid,
    done: true,
    desc:
      `填完了。一共 ${total} 格、${total} 次写入，时间 O(${rows} x ${cols})、额外空间 O(1)` +
      `（输出数组不算）—— 已经触到下限，因为输出本身就是 ${total} 个数。`,
  })

  return steps
}

export { MODE_DIRS, DIR_LABEL }
