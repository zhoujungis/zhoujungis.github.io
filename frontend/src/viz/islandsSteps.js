/**
 * islandsSteps.js — 「岛屿数量」(LC 200) 染色法（DFS）的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 islands.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 数岛屿 = 数网格里的连通块（只看上下左右相邻的陆地）。骨架：
 *     扫描全网格，遇到「未被访问的陆地」就 count += 1，
 *     并用一次 flood fill 把与它连通的整座岛全部标记为已访问。
 *
 * 本状态机用**显式栈**模拟 DFS：seed 帧把新岛的起点计数并入栈，
 * pop 帧从栈顶弹出一块、把它四周「未访问的陆地」标记并压栈。
 * 显式栈的关键意义：它可视化出「递归版会占用的调用栈深度」——
 * 递归 DFS 的深度 = 最长连通路径，蛇形长岛会爆栈（见正文第二节）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'seed' | 'pop' | 'done'
 *   desc: string
 *   grid: number[][]        // 0/1（拷贝）
 *   m, n: number
 *   visited: boolean[][]    // 本帧动作**之后**的访问快照
 *   count: number           // 目前数到的岛屿数
 *   cur: [r,c] | null       // 本帧主角（seed 的起点 / pop 的栈顶）
 *   frontier: [r,c][]       // 栈内容（底 → 顶）
 *   pushed: [r,c][]         // 本帧新压栈（并标记）的格子
 *   depth: number           // frontier.length（= 当前调用栈深度）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：只有 seed/pop 帧改变 visited / count / frontier；
 *   2. seed 帧恰有 count 个（每座岛一次），且 seed 时 count 递增 1；
 *   3. seed 时 frontier 只含该 seed 格；pop 后 frontier 少了 cur、多了 pushed；
 *   4. visited 只对陆地置真；任一格子在整段过程里最多被「标记」一次（pushed 互不相交）；
 *   5. 结束时 count === 独立递归 flood 参考解的解，且所有陆地都被访问。
 */

const DEFAULT_GRID = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1],
]

/** 邻居顺序：上、右、下、左（入栈顺序；LIFO 弹栈时后入先出）。 */
const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

/** 供测试与渲染层复用的默认题面。 */
export const ISLANDS_DEFAULT_GRID = DEFAULT_GRID

/** 把外部入参收敛成合法的 0/1 网格。 */
function normalize(options = {}) {
  const raw = Array.isArray(options.grid) ? options.grid : []
  const grid = raw
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row) => row.map((cell) => (cell === 1 || cell === '1' ? 1 : 0)))
  return { grid: grid.length > 0 && grid[0].length > 0 ? grid : DEFAULT_GRID.map((r) => [...r]) }
}

export function buildIslandsSteps(options = {}) {
  const { grid } = normalize(options)
  const m = grid.length
  const n = grid[0].length

  const visited = Array.from({ length: m }, () => new Array(n).fill(false))
  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      grid: grid.map((r) => [...r]),
      m,
      n,
      visited: visited.map((r) => [...r]),
      count: 0,
      cur: null,
      frontier: [],
      pushed: [],
      depth: 0,
      done: phase === 'done',
      ...extra,
    })
  }

  const fmt = (p) => `(${p[0]}, ${p[1]})`

  snap(
    'init',
    `网格 ${m}×${n}，` +
      `\`'1'\` 是陆地、\`'0'\` 是水；只有**上下左右**相邻算连通，斜着不算。` +
      `数岛屿 = 数**连通块**：扫描全网格，遇到一块**未被访问的陆地**就 \`count += 1\`，` +
      `再用一次染色把与它相连的整座岛全部标记。这里用**显式栈**做 DFS：` +
      `seed 帧把新岛起点入栈并计数，pop 帧弹出一块、把它四周未访问的陆地标记后压栈。`,
    { count: 0 },
  )

  let count = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] !== 1 || visited[r][c]) continue

      // ── seed：发现一座新岛 ──
      count += 1
      visited[r][c] = true
      const stack = [[r, c]]
      snap(
        'seed',
        `扫描到 \`(${r}, ${c})\`：是陆地且**未被访问** → 这是一座新岛，\`count = ${count}\`。` +
          `把起点压栈，开始染色（栈深度 = 1，正对应递归版的第一层调用）。`,
        { count, cur: [r, c], frontier: stack.map((p) => [...p]), pushed: [[r, c]], depth: stack.length },
      )

      // ── pop：弹出栈顶，扩展邻居 ──
      while (stack.length > 0) {
        const [x, y] = stack.pop()
        const pushed = []
        for (const [dx, dy] of DIRS) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue
          if (grid[nx][ny] !== 1 || visited[nx][ny]) continue
          visited[nx][ny] = true
          stack.push([nx, ny])
          pushed.push([nx, ny])
        }
        snap(
          'pop',
          `弹出栈顶 \`(${x}, ${y})\`，检查它上下左右四邻：` +
            (pushed.length > 0
              ? `其中 ${pushed.map(fmt).join('、')} 是未访问的陆地 → **标记并入栈**（染进同一座岛）。`
              : `都没能压入新格子（水 / 已访问 / 出界）—— 这一步就走到头了。`) +
            `当前栈：${stack.length ? stack.map(fmt).join(' ') : '空'}，栈深度 \`${stack.length}\`。`,
          { count, cur: [x, y], frontier: stack.map((p) => [...p]), pushed, depth: stack.length },
        )
      }
    }
  }

  snap(
    'done',
    `扫描结束，返回 **${count}**。每座岛在**第一次**碰到它时被计数一次（seed），` +
      `之后同一座岛的所有陆地都在染色中被标记、再扫到就跳过 —— 这就是"每座岛只 +1 一次"的保证。` +
      `注意整个过程用**显式栈**：把它换成递归调用，栈深度最坏可达连通块大小（\`O(m·n)\`），` +
      `蛇形长岛会 \`RecursionError\` / \`StackOverflowError\` —— 这正是要防的爆栈。`,
    { count, done: true },
  )

  return steps
}
