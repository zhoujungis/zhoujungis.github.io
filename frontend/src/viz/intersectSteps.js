/**
 * intersectSteps.js — 「相交链表」(LeetCode 160) 推演的状态机（纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（intersectLists.js）只负责把快照画成 SVG。
 *
 * ── 两条链怎么编码 ────────────────────────────────────────────────────────
 *
 * 用「节点池 + 两条路径」来编码，而不是两串值：
 *
 *   pool[i]  = 第 i 个节点的值（**整个结构里每个节点唯一**）
 *   pathA[]  = 链表 A 从头到尾经过的节点下标
 *   pathB[]  = 链表 B 从头到尾经过的节点下标
 *
 * 这样"相交"就是一件事：**两条路径共享同一个下标构成的后缀**。相交点是
 * 那个后缀的第一个下标，共享后缀长度就是公共段长度。
 *
 * 用值来判断相交是错的 —— 值相同不代表是同一个节点。这也是文章里反复强调的
 * 一个坑，所以数据结构必须在类型层面就把它表达对。
 *
 * ── 游标模型（这里最容易写错）────────────────────────────────────────────
 *
 * 每个游标记的是 **(当前走在哪条链上, 那条链上的下标)**，不是"公共下标"。
 * 原因是 pA 走完 A 之后要去走 **B**，这时候它的下标是 B 的下标 —— 用一个
 * 公共下标根本表达不了。所以 step 里同时导出 onA / iA（pA 走在哪、走到哪）
 * 和 onB / iB，渲染层按 `(on, i)` 去查节点位置。
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'walk' | 'jump' | 'found' | 'none',
 *     desc:  string,
 *     onA, onB: 'A' | 'B',   // 两个游标当前各自走在哪条链上
 *     iA, iB: number,        // 在那条链上的下标；等于链长即表示已走到 ∅
 *     fromA, fromB: number|null, // 换头帧专用：换头前的落点（画弧线的起点）
 *     jumpsA, jumpsB: boolean,   // 这一帧里哪个游标发生了换头
 *     shared: boolean,
 *     equal:  boolean,
 *     meet:   number|null,
 *     answer: number|null,
 *     done:   boolean,
 *   }
 *
 * ── 算法对齐 ──────────────────────────────────────────────────────────────
 *
 * 动画演的是**双指针交换游标**那一版（O(n+m) 时间、O(1) 空间）：
 *
 *   pA 从 A 的头出发，走到 ∅ 就换到 B 的头；pB 对称。
 *   设 A 独有段长 a、B 独有段长 b、公共段长 c，则 pA 走 a + c + b 步、
 *   pB 走 b + c + a 步后同时落在相交点上 —— 两者路程相等，必然同时到达。
 *   若不相交（c = 0），两者在走满 a + b 步后同时到 ∅，返回 null。
 */

/**
 * 相交起始节点：两条路径共享后缀的第一个节点。
 *
 * 判据必须落在**共享后缀**上，不能只看"这个值在两条链里都出现过"。
 */
export function findAnswer(pathA, pathB) {
  const setB = new Set(pathB)
  for (const slot of pathA) {
    if (!setB.has(slot)) continue
    const iA = pathA.indexOf(slot)
    const iB = pathB.indexOf(slot)
    let n = 0
    while (
      iA + n < pathA.length &&
      iB + n < pathB.length &&
      pathA[iA + n] === pathB[iB + n]
    ) {
      n += 1
    }
    // 两条路径必须**同时**走到末尾，才算真的共享了这整段后缀
    if (iA + n === pathA.length && iB + n === pathB.length) return slot
  }
  return null
}

/** 公共段长度（按节点个数）。不相交时是 0。 */
export function sharedLengthOf(pathA, pathB) {
  const answer = findAnswer(pathA, pathB)
  if (answer === null) return 0
  return pathA.length - pathA.indexOf(answer)
}

/** 两条路径的独有段长度。a + c = A 的长度，b + c = B 的长度。 */
export function uniqueLengthsOf(pathA, pathB) {
  const c = sharedLengthOf(pathA, pathB)
  return { a: pathA.length - c, b: pathB.length - c, c }
}

/**
 * 双指针交换游标的模拟（双路径模型，和 buildIntersectSteps 内部一致）。
 * 返回 { meet, walked, jumps, jumpsA, jumpsB }；不相交时 meet 为 null。
 */
export function simulateCrossing(pathA, pathB) {
  const paths = { A: pathA, B: pathB }
  // 每个游标：{ on: 'A'|'B', i: 下标 }
  let cA = { on: 'A', i: 0 }
  let cB = { on: 'B', i: 0 }
  let walked = 0
  let jumps = 0
  let jumpsA = 0
  let jumpsB = 0

  while (jumps < 2 * (pathA.length + pathB.length) + 4) {
    const doneA = cA.i >= paths[cA.on].length
    const doneB = cB.i >= paths[cB.on].length
    if (doneA && doneB) break
    if (doneA) {
      cA = { on: cA.on === 'A' ? 'B' : 'A', i: 0 }
      jumps += 1
      jumpsA += 1
    }
    if (doneB) {
      cB = { on: cB.on === 'A' ? 'B' : 'A', i: 0 }
      jumps += 1
      jumpsB += 1
    }
    if (paths[cA.on][cA.i] === paths[cB.on][cB.i]) {
      return { meet: paths[cA.on][cA.i], walked, jumps, jumpsA, jumpsB }
    }
    cA.i += 1
    cB.i += 1
    walked += 1
  }
  return { meet: null, walked, jumps, jumpsA, jumpsB }
}

/**
 * 构造推演步骤。
 *
 * @param {{ pool?: (number|string)[], pathA?: number[], pathB?: number[] }} [options]
 * @returns {object[]}
 */
export function buildIntersectSteps(options = {}) {
  const pool = Array.isArray(options.pool) && options.pool.length
    ? options.pool
    : [1, 2, 3, 4, 5, 6, 7]
  // 演示用的默认结构（和文章正文里的例子逐字一致）：
  //   A = 1 → 2 → 3 → 4 → 5     独有段 1→2→3，公共段 4→5
  //   B = 6 → 7 → 4 → 5         独有段 6→7，然后并到同一个 4 上
  //   pool 下标: 0=1  1=2  2=3  3=4  4=5  5=6  6=7
  //   a = 3、b = 2、c = 2 → 两条游标各走 a + b + c = 7 步后在 4 上相遇。
  // 注意：这里判的是 `Array.isArray` 而不是 `.length` —— 显式传进来的
  // **空路径**（空链表）是合法输入，必须原样保留，不能被默认值顶掉。
  const pathA = Array.isArray(options.pathA)
    ? options.pathA
    : [0, 1, 2, 3, 4]
  const pathB = Array.isArray(options.pathB)
    ? options.pathB
    : [5, 6, 3, 4]

  const paths = { A: pathA, B: pathB }
  const lenA = pathA.length
  const lenB = pathB.length
  const label = (slot) =>
    slot === null || slot === undefined ? '∅' : String(pool[slot])

  const answer = findAnswer(pathA, pathB)
  const { a, b, c } = uniqueLengthsOf(pathA, pathB)

  const steps = []
  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      onA: 'A',
      onB: 'B',
      iA: 0,
      iB: 0,
      fromA: null,
      fromB: null,
      jumpsA: false,
      jumpsB: false,
      shared: answer !== null,
      equal: false,
      meet: null,
      answer,
      done: false,
      ...extra,
    })

  // ── 0. 空链表 ────────────────────────────────────────────────────────────
  if (lenA === 0 || lenB === 0) {
    snap(
      'none',
      '有一条链表是空的 —— 空链表不可能有相交节点，直接返回 `null`。',
      { shared: false, answer: null, done: true },
    )
    return steps
  }

  snap(
    'init',
    `两条链表 ` +
      `A = ${pathA.map(label).join(' → ')}、B = ${pathB.map(label).join(' → ')}。` +
      (answer === null
        ? '它们**没有共享任何节点**（下面两个 4 只是值相同，不是同一个节点）。'
        : `从 ${label(answer)} 开始它们**共享同一批节点**，后缀完全重合 —— ` +
          '这就是"相交"在这个结构里的确切含义。') +
      ' 目标是找出那个**起始**节点，而且不许开哈希表。',
    { onA: 'A', onB: 'B', iA: 0, iB: 0 },
  )

  // ── 1. 双指针同步前进，走完一条就换到对方头上 ────────────────────────────
  let cA = { on: 'A', i: 0 }
  let cB = { on: 'B', i: 0 }
  let walked = 0
  let jumps = 0
  let guard = 0
  const LIMIT = 2 * (lenA + lenB) + 4

  /** 把当前两个游标的位置导出成 step 字段。 */
  const cursors = () => ({ onA: cA.on, iA: cA.i, onB: cB.on, iB: cB.i })

  while (walked <= lenA + lenB && guard < LIMIT) {
    guard += 1
    const doneA = cA.i >= paths[cA.on].length
    const doneB = cB.i >= paths[cB.on].length
    if (doneA && doneB) break

    if (doneA || doneB) {
      // 换头帧：换之前把落点记下来（fromA / fromB），渲染层据此画弧的起点。
      const fromA = cA.i >= paths[cA.on].length
        ? paths[cA.on][paths[cA.on].length - 1]
        : paths[cA.on][cA.i]
      const fromB = cB.i >= paths[cB.on].length
        ? paths[cB.on][paths[cB.on].length - 1]
        : paths[cB.on][cB.i]

      const who = []
      if (doneA) who.push('pA')
      if (doneB) who.push('pB')
      const fromLabel = who
        .map((w) => (w === 'pA' ? label(fromA) : label(fromB)))
        .join(' 和 ')

      if (doneA) {
        cA = { on: cA.on === 'A' ? 'B' : 'A', i: 0 }
        jumps += 1
      }
      if (doneB) {
        cB = { on: cB.on === 'B' ? 'A' : 'B', i: 0 }
        jumps += 1
      }

      const toLabelA = label(paths[cA.on][cA.i])
      const toLabelB = label(paths[cB.on][cB.i])
      snap(
        'jump',
        `**${who.join(' 和 ')} 走到了 ∅，搬到了对方链表的头上。** ` +
          `它从 ${fromLabel} 的 \`next\` 直接跳到另一条链的第一个节点，` +
          `于是 pA 在 ${toLabelA}、pB 在 ${toLabelB}。` +
          '这一步是整套解法的关键：**pA 走完 A 就去走 B，pB 走完 B 就去走 A**，' +
          '两条"游标自己走过的路"就此等长。',
        {
          ...cursors(),
          fromA,
          fromB,
          jumpsA: doneA,
          jumpsB: doneB,
          equal: paths[cA.on][cA.i] === paths[cB.on][cB.i],
        },
      )
      continue
    }

    if (paths[cA.on][cA.i] === paths[cB.on][cB.i]) break

    const fromA = label(paths[cA.on][cA.i])
    const fromB = label(paths[cB.on][cB.i])
    cA.i += 1
    cB.i += 1
    walked += 1
    const atA = cA.i >= paths[cA.on].length ? '∅' : label(paths[cA.on][cA.i])
    const atB = cB.i >= paths[cB.on].length ? '∅' : label(paths[cB.on][cB.i])
    snap(
      'walk',
      `第 ${walked} 步：pA 在 ${fromA}、pB 在 ${fromB}，**不是同一个节点**，` +
        `一起前移一格 —— pA 到 ${atA}、pB 到 ${atB}。` +
        '注意判断相交比的是**节点本身**，不是值：值相等不算数。',
      {
        ...cursors(),
        equal: paths[cA.on][cA.i] === paths[cB.on][cB.i],
      },
    )
  }

  // ── 2. 收尾 ──────────────────────────────────────────────────────────────
  const doneA = cA.i >= paths[cA.on].length
  const doneB = cB.i >= paths[cB.on].length
  if (!doneA && !doneB && paths[cA.on][cA.i] === paths[cB.on][cB.i]) {
    const meet = paths[cA.on][cA.i]
    snap(
      'found',
      `**两个游标同时落在节点 ${label(meet)} 上 —— 这就是相交的起始节点。** ` +
        `pA 走了 A 的独有段 ${a} 步 + 公共段 ${c} 步 + B 的独有段 ${b} 步，` +
        `pB 走了 B 的独有段 ${b} 步 + 公共段 ${c} 步 + A 的独有段 ${a} 步 ——` +
        `两条路都是 \`a + b + c = ${a + b + c}\`，**路程相等，所以必然同时到达**。`,
      {
        ...cursors(),
        equal: true,
        meet,
        done: true,
      },
    )
    return steps
  }

  snap(
    'none',
    '两个游标**同时走到了 ∅** —— 两条链表根本没有共享节点。' +
      `各自都老老实实走完了"自己那条链 + 对方那条链"（各 ${a + b} 步），` +
      '恰好手拉手一起掉出去。返回 `null`。',
    { ...cursors(), done: true },
  )
  return steps
}

export default buildIntersectSteps
