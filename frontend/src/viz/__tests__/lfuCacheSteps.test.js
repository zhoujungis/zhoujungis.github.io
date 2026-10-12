/**
 * lfuCacheSteps.test.js — LC 460「LFU 缓存」状态机单测（含与 LRU 的对照）。
 *
 * 交叉验证：状态机 vs 独立参考解（逐操作扫描实现）；另有一组「同一串操作，
 * LRU 和 LFU 淘汰不同 key」的对照断言。
 * 逐帧钉死：size ≤ capacity、freq ≥ 1、命中帧 freq +1、evict 必取最小 freq
 * （并列取展示序最前 = 最久未使用）。
 */
import { describe, it, expect } from 'vitest'
import { buildLfuCacheSteps } from '../lfuCacheSteps.js'
import { buildLruCacheSteps } from '../lruCacheSteps.js'

/** 参考解：扫描式实现（独立重写，语义与 LC 460 一致）。 */
const refLFU = (capacity, ops) => {
  const store = new Map()
  let clock = 0
  const results = []
  for (const op of ops) {
    if (op[0] === 'get') {
      const key = op[1]
      if (store.has(key)) {
        const item = store.get(key)
        item.freq += 1
        item.stamp = ++clock
        results.push(item.value)
      } else {
        results.push(-1)
      }
    } else {
      const key = op[1]
      const value = op[2]
      if (store.has(key)) {
        const item = store.get(key)
        item.value = value
        item.freq += 1
        item.stamp = ++clock
      } else {
        if (store.size >= capacity) {
          let victimKey = null
          let victim = null
          for (const [k, item] of store) {
            if (
              victim === null ||
              item.freq < victim.freq ||
              (item.freq === victim.freq && item.stamp < victim.stamp)
            ) {
              victim = item
              victimKey = k
            }
          }
          store.delete(victimKey)
        }
        store.set(key, { value, freq: 1, stamp: ++clock })
      }
    }
  }
  return results
}

const DEFAULTS = {
  capacity: 2,
  ops: [
    ['put', 1, 1],
    ['put', 2, 2],
    ['get', 2],
    ['get', 2],
    ['get', 1],
    ['put', 3, 3],
    ['get', 1],
    ['get', 2],
    ['get', 3],
  ],
}

const CASES = [
  { ...DEFAULTS, want: [2, 2, 1, -1, 2, 3] },
  {
    capacity: 1,
    ops: [['put', 1, 1], ['put', 2, 2], ['get', 2], ['get', 1]],
    want: [2, -1],
  },
  {
    capacity: 2,
    // 并列 tie-break：1、2 都是 freq 1 → 淘汰最久未使用的 1
    ops: [['put', 1, 1], ['put', 2, 2], ['put', 3, 3], ['get', 1], ['get', 2], ['get', 3]],
    want: [-1, 2, 3],
  },
  {
    capacity: 3,
    ops: [
      ['put', 1, 1], ['put', 2, 2], ['put', 3, 3], ['get', 1], ['get', 1],
      ['put', 4, 4], ['get', 2], ['get', 4],
    ],
    want: [1, 1, -1, 4],
  },
]

describe('lfuCacheSteps（LC 460）', () => {
  it.each(CASES)('get 返回值与参考解一致：%#', (c) => {
    const steps = buildLfuCacheSteps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.results).toEqual(c.want)
    expect(done.results).toEqual(refLFU(c.capacity, c.ops))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildLfuCacheSteps(c)
    let prev = null
    for (const f of steps) {
      expect(f.nodes.length).toBeLessThanOrEqual(c.capacity)
      const keys = f.nodes.map((n) => n.key)
      expect(new Set(keys).size).toBe(keys.length)
      for (const n of f.nodes) expect(n.freq).toBeGreaterThanOrEqual(1)

      if (f.phase === 'get-hit' || f.phase === 'put-update') {
        const before = prev.nodes.find((n) => n.id === f.cur)
        const after = f.nodes.find((n) => n.id === f.cur)
        expect(after.freq).toBe(before.freq + 1)
      }
      if (f.phase === 'evict') {
        // 受害者 = 上一帧里 freq 最小、且并列时展示序最前（最久未使用）的那个
        const minFreq = Math.min(...prev.nodes.map((n) => n.freq))
        const firstMin = prev.nodes.find((n) => n.freq === minFreq)
        expect(f.evicted.key).toBe(firstMin.key)
        expect(f.nodes.some((n) => n.key === f.evicted.key)).toBe(false)
      }
      prev = f
    }
  })

  it('默认用例：同一串操作，LRU 淘汰 2、LFU 淘汰 1（对照的记忆锚点）', () => {
    const lfuSteps = buildLfuCacheSteps()
    const lruSteps = buildLruCacheSteps({ capacity: 2, ops: DEFAULTS.ops })
    const lfuEvict = lfuSteps.find((f) => f.phase === 'evict')
    const lruEvict = lruSteps.find((f) => f.phase === 'evict')
    expect(lfuEvict.evicted.key).toBe(1)
    expect(lruEvict.evicted.key).toBe(2)
  })

  it('tie-break：freq 并列时淘汰最久未使用的', () => {
    const steps = buildLfuCacheSteps({
      capacity: 2,
      ops: [['put', 1, 1], ['put', 2, 2], ['put', 3, 3]],
    })
    const evict = steps.find((f) => f.phase === 'evict')
    expect(evict.evicted.key).toBe(1)
    expect(evict.evicted.freq).toBe(1)
  })

  it('get 会提升频率并改变淘汰优先级', () => {
    const steps = buildLfuCacheSteps({
      capacity: 2,
      ops: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 1], ['get', 2]],
    })
    // get(1) 之后 1 的 freq = 2，淘汰时优先淘汰 freq = 1 的 2
    const evict = steps.find((f) => f.phase === 'evict')
    expect(evict.evicted.key).toBe(2)
    expect(steps.at(-1).results).toEqual([1, 1, -1])
  })

  it('非法输入回退默认', () => {
    expect(buildLfuCacheSteps({ capacity: 0 })[0].capacity).toBe(2)
    expect(buildLfuCacheSteps({ ops: 'x' })[0].nodes).toEqual([])
  })

  it('随机交叉：400 组随机操作 vs 扫描式参考解', () => {
    let rng = 4600
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const capacity = 1 + rand(4)
      const opCount = rand(24)
      const ops = []
      for (let i = 0; i < opCount; i += 1) {
        if (rand(2) === 0) ops.push(['get', rand(8)])
        else ops.push(['put', rand(8), rand(100)])
      }
      const steps = buildLfuCacheSteps({ capacity, ops })
      expect(steps.at(-1).results).toEqual(refLFU(capacity, ops))
    }
  })
})
