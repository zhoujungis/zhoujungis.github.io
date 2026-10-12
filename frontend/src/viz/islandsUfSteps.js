/**
 * islandsUfSteps.js — 「岛屿数量」(LC 200) 并查集视角的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 islandsUf.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 岛屿数量 = 连通块数量。并查集把每块陆地先当成独立集合，遇到**已处理过的**
 * 相邻陆地（上方、左方）就合并；合并成功一次，连通块数 -1。
 * 最终 `count` 就是岛屿数 —— 全程**没有递归、没有栈**，深度安全。
 *     每加一块陆地：count += 1
 *     与上方 / 左方若同陆且根不同：union 成功 → count -= 1
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'add' | 'union' | 'done'
 *   desc: string
 *   grid: number[][]       // 0/1（拷贝）
 *   m, n: number
 *   parent: Record<string,string>  // "r,c" -> "pr,pc"（仅含陆地格）
 *   count: number
 *   cur: [r,c] | null      // 本帧主角
 *   neighbor: [r,c] | null // union 帧：合并的邻居
 *   merged: boolean        // union 帧：是否真的合并了
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. add 帧数 === 陆地格数；每个 add 帧 count 比上一帧 +1；
 *   2. union 帧只出现在陆地格与其上方/左方陆地之间；
 *      merged === (两格当时的根不同)，且 merged 时 count 恰好 -1；
 *   3. parent 里每块陆地的指向最终都收敛到自身（无环）；
 *   4. done 的 count === 独立 flood 参考解的岛屿数，
 *      且 count === 陆地格数 − 成功合并次数。
 */

const DEFAULT_GRID = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1],
]

/** 供测试与渲染层复用的默认题面。 */
export const ISLANDS_UF_DEFAULT_GRID = DEFAULT_GRID

function normalize(options = {}) {
  const raw = Array.isArray(options.grid) ? options.grid : []
  const grid = raw
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row) => row.map((cell) => (cell === 1 || cell === '1' ? 1 : 0)))
  return { grid: grid.length > 0 && grid[0].length > 0 ? grid : DEFAULT_GRID.map((r) => [...r]) }
}

export function buildIslandsUfSteps(options = {}) {
  const { grid } = normalize(options)
  const m = grid.length
  const n = grid[0].length

  const key = (r, c) => `${r},${c}`
  const parent = new Map()

  const find = (k) => {
    let root = k
    while (parent.get(root) !== root) root = parent.get(root)
    let cur = k
    while (parent.get(cur) !== root) {
      const nxt = parent.get(cur)
      parent.set(cur, root)
      cur = nxt
    }
    return root
  }

  const steps = []
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      grid: grid.map((r) => [...r]),
      m,
      n,
      parent: Object.fromEntries(parent),
      count: 0,
      cur: null,
      neighbor: null,
      merged: false,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `换一台机器：**并查集**。每块陆地先自成一个集合（\`count += 1\`），` +
      `扫描时把它和**上方、左方**的陆地合并 —— 合并成功一次，连通块数 \`count -= 1\`。` +
      `一行行推进，扫完时 \`count\` 就是岛屿数。全程**没有递归、没有栈**，` +
      `不存在 DFS 那种"调用栈深过最长的岛"的问题。`,
    { count: 0 },
  )

  let count = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] !== 1) continue

      parent.set(key(r, c), key(r, c))
      count += 1
      snap(
        'add',
        `扫到陆地 \`(${r}, ${c})\`：先让它**自成一个集合**（父指针指向自己），\`count = ${count}\`。` +
          `接下来看它上方 \`(${r - 1}, ${c})\`、左方 \`(${r}, ${c - 1})\` 是否也是陆地。`,
        { count, cur: [r, c] },
      )

      for (const [pr, pc] of [[r - 1, c], [r, c - 1]]) {
        if (pr < 0 || pr >= m || pc < 0 || pc >= n) continue
        if (grid[pr][pc] !== 1) continue
        const a = find(key(r, c))
        const b = find(key(pr, pc))
        let merged = false
        if (a !== b) {
          parent.set(a, b)
          count -= 1
          merged = true
        }
        const dir = pr === r ? '左方' : '上方'
        snap(
          'union',
          `与${dir} \`(${pr}, ${pc})\` 合并：\`(${r}, ${c})\` 的根是 \`${a}\`、` +
            `\`(${pr}, ${pc})\` 的根是 \`${b}\` —— ` +
            (merged
              ? `**根不同**，把 \`${a}\` 挂到 \`${b}\` 下，连通块合并，\`count = ${count}\`。`
              : `**已经同根**（本就属于同一块），不重复合并。`) +
            `并查集用"根是否相同"天然去重，不需要额外的 \`visited\`。`,
          { count, cur: [r, c], neighbor: [pr, pc], merged },
        )
      }
    }
  }

  snap(
    'done',
    `扫描结束，返回 **${count}**。\`count\` 从 0 起：**每加一块陆地 +1、每次成功合并 -1**，` +
      `最后剩下的就是连通块（岛屿）数。并查集的杀手锏不是这题本身，而是**动态加陆地**：` +
      `若陆地一块块地出现（LC 305），染色法要从头重算，并查集却能**增量维护**答案。`,
    { count, done: true },
  )

  return steps
}
