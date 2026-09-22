/**
 * mergeKDCSeps.js — 「合并 K 个升序链表」**分治两两合并**解法的状态机。
 *
 * 纯函数，不碰 DOM。和 mergeKListsSteps.js 是同一个问题的两种解法，
 * 故意分成两个模块：堆解法关心"每一步取谁"，分治关心"一共几轮"。
 *
 * 一个 step 长这样：
 *   {
 *     phase:       'init' | 'merge' | 'done',
 *     desc:        string,
 *     levels:      [{ lists: Array<Array<value>>, from: Array<[number,number]> | null }],
 *                  // 第 0 层是输入；第 r 层的每个元素由第 r-1 层的 from[k] 两个下标合并而来
 *     activeLevel: number,   // 本步"刚出现"的层（渲染层据此做入场动画）
 *     rounds:      number,   // 已经完成的轮数
 *     done:        boolean,
 *   }
 *
 * 分治的全部内容只有一句话：
 * **每一轮把上一轮剩下的链表两两配对合并，链表条数每次减半，所以只要 ⌈log₂K⌉ 轮。**
 *
 * 复杂度账：每一轮里，所有层的节点加起来恰好被摸一次 —— 每轮 O(N)，
 * 一共 ⌈log₂K⌉ 轮，所以 O(N log K)。和堆解法同阶，但没有堆操作，
 * 常数更小（一次比较就是一次比较，不用 sift）。
 */

/** 合并两条有序数组（值层面，不涉及节点对象）。 */
function mergeSorted(a, b) {
  const out = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.push(a[i])
      i += 1
    } else {
      out.push(b[j])
      j += 1
    }
  }
  while (i < a.length) out.push(a[i++])
  while (j < b.length) out.push(b[j++])
  return out
}

const fmt = (list) => (list.length ? list.join('、') : '∅')

export function buildMergeKDCSeps(lists) {
  const L = (Array.isArray(lists) ? lists : []).map((l) =>
    Array.isArray(l) ? l.slice() : [],
  )
  const K = L.length
  const steps = []
  const totalNodes = L.reduce((sum, l) => sum + l.length, 0)

  const snapshot = (levels) =>
    levels.map((lv) => ({
      lists: lv.lists.map((l) => l.slice()),
      from: lv.from ? lv.from.map((p) => [p[0], p[1]]) : null,
    }))

  if (K === 0) {
    steps.push({
      phase: 'init',
      desc: '`lists` 是个空数组，一条链表都没有，直接返回 ∅。',
      levels: [],
      activeLevel: -1,
      rounds: 0,
      done: true,
    })
    return steps
  }

  const levels = [{ lists: L.map((l) => l.slice()), from: null }]

  if (K === 1) {
    steps.push({
      phase: 'init',
      desc: `只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，` +
        `直接返回它自己（${fmt(L[0])}）。`,
      levels: snapshot(levels),
      activeLevel: 0,
      rounds: 0,
      done: true,
    })
    return steps
  }

  steps.push({
    phase: 'init',
    desc: `分治的起手：${K} 条链表一字排开，一共 ${totalNodes} 个节点。接下来每一轮` +
      `**两两配对合并**，链表条数每次减半 —— ${K} → ${Math.ceil(K / 2)} → … → 1，` +
      `一共 ⌈log₂${K}⌉ = ${Math.ceil(Math.log2(K))} 轮。`,
    levels: snapshot(levels),
    activeLevel: 0,
    rounds: 0,
    done: false,
  })

  let current = L
  let rounds = 0

  while (current.length > 1) {
    const next = []
    const from = []
    for (let i = 0; i < current.length; i += 2) {
      if (i + 1 < current.length) {
        next.push(mergeSorted(current[i], current[i + 1]))
        from.push([i, i + 1])
      } else {
        // 奇数条时最后一条轮空，原样进入下一轮（不是"丢弃"）
        next.push(current[i].slice())
        from.push([i, -1])
      }
    }
    rounds += 1
    levels.push({ lists: next, from })

    const before = current.length
    const after = next.length
    // 真正被摸到的节点：只有参与合并的那两条链表里的节点（轮空的不算）
    const touched = from.reduce(
      (sum, [i, j]) => sum + (j >= 0 ? current[i].length + current[j].length : 0),
      0,
    )
    const pairs = from.filter((p) => p[1] >= 0).length
    const bye = from.find((p) => p[1] < 0)

    steps.push({
      phase: 'merge',
      desc: `第 ${rounds} 轮：把 ${before} 条两两配对，做 ${pairs} 次「合并两个有序链表」，` +
        `得到 ${after} 条。本轮被摸到的节点一共 ${touched} 个，不超过 N —— 每轮都是 O(N) 的工作量。` +
        (bye
          ? `注意第 ${bye[0] + 1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`
          : `链表条数 ${before} → ${after}。`),
      levels: snapshot(levels),
      activeLevel: levels.length - 1,
      rounds,
      done: false,
    })

    current = next
  }

  steps.push({
    phase: 'done',
    desc: `一共 ${rounds} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。` +
      `结果链表是 ${fmt(current[0])}。分治的隐藏优势：它不需要堆，` +
      `每一轮都是纯粹的指针比较，常数更小。`,
    levels: snapshot(levels),
    activeLevel: levels.length - 1,
    rounds,
    done: true,
  })

  return steps
}

export default buildMergeKDCSeps
