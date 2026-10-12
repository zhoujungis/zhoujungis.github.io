/**
 * rotOrangeSteps.js — 「腐烂的橘子」(LC 994) 多源 BFS 分层扩散的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 rotOrange.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 腐烂从**所有**腐烂橘子同时开始向外扩散，每分钟扩一圈 —— 这正是多源 BFS：
 * 初始时把全部腐烂格子一起入队，按「分钟」分层推进，直到没有新鲜橘子。
 * 返回分钟数；若 BFS 结束后仍有新鲜橘子（被空格隔开），返回 -1。
 *
 * 帧设计（默认网格 3×3，答案 4）：
 *   init  —— 全部腐烂橘子入队，minute = 0、fresh = 6
 *   layer —— 第 m+1 分钟开始：弹出本层（队列全体）待处理
 *   rot   —— 本层扩散完毕：新腐烂的格子入队，minute = m+1、fresh 减少
 *   done  —— fresh == 0 → 返回 minute；队列枯竭但 fresh > 0 → -1
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'layer' | 'rot' | 'done'
 *   desc: string
 *   grid: number[][]        // 0 空 / 1 新鲜 / 2 腐烂（拷贝）
 *   m, n: number
 *   minute: number          // 已流逝的分钟数（layer 帧 = 本轮开始前）
 *   fresh: number           // 剩余新鲜橘子数
 *   queue: [r,c][]          // 当前队列（待扩散的格子；rot 帧后 = 下一层）
 *   layer: [r,c][]          // layer 帧：本分钟将处理的整层
 *   processed: [r,c][]      // rot 帧：刚处理完的层
 *   newlyRotted: [r,c][]    // rot 帧：本分钟新腐烂的格子
 *   sources: [r,c][]        // 初始腐烂橘子（固定，渲染层标「源」）
 *   answer: number | null   // done 帧：分钟数或 -1
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. layer / rot 帧成对出现，minute 只在 rot 帧 +1；
 *   2. fresh 只在 rot 帧减少，且减少量 === 本帧 newlyRotted 数；
 *   3. 每个格子最多腐烂一次：全部 newlyRotted 互不相交、且不含初始腐烂；
 *   4. rot 帧后的 queue === 本帧 newlyRotted；
 *   5. done 的 answer === 独立「逐分钟全局模拟」参考解；
 *   6. 全部初始腐烂格子都在 sources 且只在首帧队列里。
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
export const ROT_ORANGE_DEFAULT_GRID = DEFAULT_GRID

/** 把外部入参收敛成合法的 0/1/2 网格。 */
function normalize(options = {}) {
  const raw = Array.isArray(options.grid) ? options.grid : []
  const grid = raw
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row) =>
      row.map((cell) => (cell === 2 || cell === '2' ? 2 : cell === 1 || cell === '1' ? 1 : 0)),
    )
  return { grid: grid.length > 0 && grid[0].length > 0 ? grid : DEFAULT_GRID.map((r) => [...r]) }
}

export function buildRotOrangeSteps(options = {}) {
  const { grid } = normalize(options)
  const m = grid.length
  const n = grid[0].length

  const g = grid.map((row) => [...row])
  const sources = []
  const queue = []
  let fresh = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (g[r][c] === 2) {
        sources.push([r, c])
        queue.push([r, c])
      } else if (g[r][c] === 1) {
        fresh += 1
      }
    }
  }

  const steps = []
  let minute = 0
  const fmt = (p) => `(${p[0]}, ${p[1]})`

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      grid: g.map((row) => [...row]),
      m,
      n,
      minute,
      fresh,
      queue: queue.map((p) => [...p]),
      layer: [],
      processed: [],
      newlyRotted: [],
      sources: sources.map((p) => [...p]),
      answer: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `**多源 BFS**：初始就把**所有**腐烂橘子 \`${sources.map(fmt).join('、')}\` 一起入队 —— ` +
      `它们都是第 0 分钟的「源」，往外扩散的每一圈都同时出发。` +
      `现在 minute = 0，还有 ${fresh} 个新鲜橘子。` +
      `（只把其中一个源入队是本题第一大坑：分钟数会算大甚至算错。）`,
  )

  while (queue.length > 0 && fresh > 0) {
    const layer = queue.splice(0, queue.length)

    snap(
      'layer',
      `第 ${minute + 1} 分钟开始：本层要处理的是队列里这 ${layer.length} 个格子 ` +
        `\`${layer.map(fmt).join('、')}\` —— 它们是上一分钟刚腐烂的那批。` +
        `**先整层弹出、再统一扩散**，这样同一分钟内的格子不会互相「插队」影响。`,
      { layer: layer.map((p) => [...p]), queue: layer.map((p) => [...p]) },
    )

    const newly = []
    for (const [r, c] of layer) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue
        if (g[nr][nc] !== 1) continue
        g[nr][nc] = 2
        fresh -= 1
        newly.push([nr, nc])
        queue.push([nr, nc])
      }
    }
    minute += 1

    snap(
      'rot',
      `扩散完毕：本层 ${layer.length} 个格子把四周的${newly.length > 0 ? ` \`${newly.map(fmt).join('、')}\` ` : '新鲜橘子都'}变成腐烂` +
        (newly.length > 0
          ? `（**入队即标记**，同一格不会被两个邻居重复腐烂）；`
          : `（没有新腐烂的格子）—— 队列只剩这一批，下一分钟就没得扩散了；`) +
        `minute = ${minute}，fresh = ${fresh}。`,
      {
        layer: layer.map((p) => [...p]),
        processed: layer.map((p) => [...p]),
        newlyRotted: newly.map((p) => [...p]),
      },
    )
  }

  if (fresh === 0) {
    snap(
      'done',
      `所有新鲜橘子都被腐烂光了：**返回 ${minute}**。` +
        `要点：分钟数在「整层扩散完」之后才 +1（不是每弹一个格子都加），` +
        `而且最后一轮扩散若把 fresh 清零就直接结束 —— 答案就是当前 minute。`,
      { answer: minute },
    )
  } else {
    snap(
      'done',
      `队列枯竭但还有 ${fresh} 个新鲜橘子：它们被空格（\`0\`）隔开，永远烂不到 —— ` +
        `**返回 -1**。要点：-1 的判据是「BFS 结束后 fresh 仍大于 0」，不是「队列空了」本身。`,
      { answer: -1 },
    )
  }

  return steps
}
