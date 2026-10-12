/**
 * rotOrangeDistSteps.js — 「腐烂的橘子」(LC 994) 的第二个视角：时间戳 / 距离场。
 *
 * 纯函数，不碰 DOM。渲染层是 rotOrangeDist.js。
 *
 * ── 与 rotOrangeSteps.js 的关系 ───────────────────────────────────────────
 * 同一台多源 BFS，换一种记账：不给「分钟」单独开计数器去数层，而是把
 * **每个格子腐烂的时刻**直接写进 `stamp[r][c]`（源 = 0）。跑完后：
 *   - 没有 fresh 剩余 → 答案 = 全场最大时间戳（= 到最近源的最大距离）；
 *   - 还有 fresh 没盖上章 → 它们被空格隔开，返回 -1。
 * 这层视角的卖点：腐烂时间 = **到最近源的距离** —— 多源 BFS 不变量。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'stamp' | 'done'
 *   desc: string
 *   grid: number[][]           // 0 空 / 1 新鲜 / 2 腐烂（拷贝）
 *   m, n: number
 *   stamp: (number|null)[][]   // 腐烂时刻；null = 还没盖上
 *   fresh: number              // 剩余新鲜橘子数
 *   minute: number             // 本帧盖章的时间戳（init = 0）
 *   stamped: [r,c][]           // 本帧新盖章的格子
 *   sources: [r,c][]           // 初始腐烂橘子（stamp = 0）
 *   maxStamp: number           // 目前全场最大时间戳
 *   answer: number | null      // done 帧：最大时间戳 或 -1
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 每个格子最多盖一次章：stamped 全局互不相交；
 *   2. 源格 stamp = 0；非源格的 stamp === 它第一次被访问的分钟；
 *   3. stamp 值 === 独立参考解（逐源单源 BFS 取 min）给出的「到最近源距离」；
 *   4. maxStamp 随帧单调不减，done 时 === 全部 stamp 的最大值；
 *   5. fresh 减少量 === 本帧 stamped 数。
 */

const DEFAULT_GRID = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
]

/** 邻居顺序：上、右、下、左。 */
const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

/** 供测试与渲染层复用的默认题面。 */
export const ROT_ORANGE_DIST_DEFAULT_GRID = DEFAULT_GRID

function normalize(options = {}) {
  const raw = Array.isArray(options.grid) ? options.grid : []
  const grid = raw
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row) =>
      row.map((cell) => (cell === 2 || cell === '2' ? 2 : cell === 1 || cell === '1' ? 1 : 0)),
    )
  return { grid: grid.length > 0 && grid[0].length > 0 ? grid : DEFAULT_GRID.map((r) => [...r]) }
}

export function buildRotOrangeDistSteps(options = {}) {
  const { grid } = normalize(options)
  const m = grid.length
  const n = grid[0].length

  const g = grid.map((row) => [...row])
  const stamp = Array.from({ length: m }, () => new Array(n).fill(null))
  const sources = []
  let queue = []
  let fresh = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (g[r][c] === 2) {
        sources.push([r, c])
        stamp[r][c] = 0
        queue.push([r, c])
      } else if (g[r][c] === 1) {
        fresh += 1
      }
    }
  }

  const steps = []
  let minute = 0
  let maxStamp = 0
  const fmt = (p) => `(${p[0]}, ${p[1]})`

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      grid: g.map((row) => [...row]),
      m,
      n,
      stamp: stamp.map((row) => [...row]),
      fresh,
      minute,
      stamped: [],
      sources: sources.map((p) => [...p]),
      maxStamp,
      answer: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    sources.length > 0
      ? `换一种记账：不数「第几分钟」，而是直接给每个格子盖**腐烂时刻**的章 —— ` +
        `源格子 \`${sources.map(fmt).join('、')}\` 的时刻是 **0**，` +
        `其余格子等着被 BFS 第一次访问时盖章。` +
        `这个章的值就是**到最近源的距离**：全场最大时间戳就是答案（fresh 清零时）。`
      : `网格里没有腐烂橘子：没有源也就没有任何格子能被盖章。` +
        (fresh === 0 ? '（也没有新鲜橘子，答案是 0。）' : `还有 ${fresh} 个新鲜橘子永远烂不掉。`),
  )

  while (queue.length > 0 && fresh > 0) {
    minute += 1
    const next = []
    const stamped = []
    for (const [r, c] of queue) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue
        if (g[nr][nc] !== 1) continue
        g[nr][nc] = 2
        stamp[nr][nc] = minute
        fresh -= 1
        stamped.push([nr, nc])
        next.push([nr, nc])
      }
    }
    if (stamped.length === 0) break
    maxStamp = minute
    queue = next
    snap(
      'stamp',
      `第 ${minute} 分钟：给 \`${stamped.map(fmt).join('、')}\` 盖上 **${minute}** —— ` +
        `它们离最近的源正好 ${minute} 步。**第一次访问即定章、之后不再改**，` +
        `这正是 BFS「先到的一定最近」的性质。`,
      { stamped: stamped.map((p) => [...p]) },
    )
  }

  const answer = fresh === 0 ? maxStamp : -1
  if (answer === -1) {
    snap(
      'done',
      `BFS 结束，还有 ${fresh} 个新鲜橘子始终没被盖章（被空格隔开）：**返回 -1**。` +
        `若换成先算「所有源的距离场」，这道题还藏着一条判据：` +
        `**答案 = fresh 清零时的最大时间戳**；若最大时间戳还算不出来就有剩余，直接 -1。`,
      { answer },
    )
  } else {
    snap(
      'done',
      `全场盖章完毕：**答案 = 最大时间戳 = ${answer}**。` +
        `注意最后一分钟不需要「再空转一轮」—— fresh 清零时的时间戳就是答案；` +
        `源本身的 0 不参与取 max（答案是「最后一块被感染的格子」的时刻）。`,
      { answer },
    )
  }

  return steps
}
