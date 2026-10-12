/**
 * lruCacheSteps.test.js — LC 146「LRU 缓存」状态机单测。
 *
 * 交叉验证：状态机（双向链表 + 哈希表）vs 独立参考解（「最后使用时间戳」法，
 * 完全不依赖链表结构）。
 * 逐帧钉死：长度 ≤ capacity、map 与链表键集合一致、命中/更新后主角在队首、
 * evict 帧双删干净、随机操作序列结果一致。
 */
import { describe, it, expect } from 'vitest'
import { buildLruCacheSteps } from '../lruCacheSteps.js'

/** 参考解：时间戳法（每次操作给 key 盖一个递增时钟；淘汰时取时钟最小的）。 */
const refLRU = (capacity, ops) => {
  const store = new Map()
  const stamp = new Map()
  let clock = 0
  const results = []
  for (const op of ops) {
    if (op[0] === 'get') {
      const key = op[1]
      if (store.has(key)) {
        stamp.set(key, ++clock)
        results.push(store.get(key))
      } else {
        results.push(-1)
      }
    } else {
      const key = op[1]
      const value = op[2]
      if (store.has(key)) {
        store.set(key, value)
        stamp.set(key, ++clock)
      } else {
        if (store.size >= capacity) {
          let victim = null
          for (const k of store.keys()) {
            if (victim === null || stamp.get(k) < stamp.get(victim)) victim = k
          }
          store.delete(victim)
          stamp.delete(victim)
        }
        store.set(key, value)
        stamp.set(key, ++clock)
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
    ['get', 1],
    ['put', 3, 3],
    ['get', 2],
    ['put', 4, 4],
    ['get', 1],
    ['get', 3],
    ['get', 4],
  ],
}

const CASES = [
  { ...DEFAULTS, want: [1, -1, -1, 3, 4] },
  {
    capacity: 1,
    ops: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['get', 2]],
    want: [-1, 2],
  },
  {
    capacity: 2,
    ops: [['put', 1, 1], ['put', 1, 10], ['get', 1]],
    want: [10],
  },
  {
    capacity: 2,
    ops: [['get', 1], ['get', 2], ['put', 5, 5], ['get', 5]],
    want: [-1, -1, 5],
  },
  {
    capacity: 3,
    ops: [
      ['put', 1, 1], ['put', 2, 2], ['put', 3, 3], ['get', 1],
      ['put', 4, 4], ['get', 2], ['get', 3], ['get', 4],
    ],
    want: [1, -1, 3, 4],
  },
  {
    capacity: 1,
    ops: [['put', 1, 1], ['put', 1, 2], ['get', 1]],
    want: [2],
  },
]

describe('lruCacheSteps（LC 146）', () => {
  it.each(CASES)('get 返回值与参考解一致：%#', (c) => {
    const steps = buildLruCacheSteps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.results).toEqual(c.want)
    expect(done.results).toEqual(refLRU(c.capacity, c.ops))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildLruCacheSteps(c)

    let prevOrder = []
    for (const f of steps) {
      // 1. 容量与唯一性
      expect(f.order.length).toBeLessThanOrEqual(c.capacity)
      const keys = f.order.map((n) => n.key)
      expect(new Set(keys).size).toBe(keys.length)
      // 2. 哈希表与链表同步
      expect(f.mapEntries.map((e) => e.key).sort()).toEqual([...keys].sort())
      // 3. 指针一致性：map 里的 id 必须对应链表里的节点
      for (const entry of f.mapEntries) {
        const node = f.order.find((n) => n.key === entry.key)
        expect(node.id).toBe(entry.id)
      }
      // 4. 帧语义
      if (f.phase === 'get-hit' || f.phase === 'put-update') {
        expect(f.order[0].id).toBe(f.cur)
      }
      if (f.phase === 'get-miss') {
        expect(f.order).toEqual(prevOrder)
        expect(f.result).toBe(-1)
      }
      if (f.phase === 'evict') {
        expect(f.order.length).toBe(c.capacity - 1)
        expect(f.order.some((n) => n.key === f.evicted.key)).toBe(false)
        expect(f.mapEntries.some((e) => e.key === f.evicted.key)).toBe(false)
      }
      if (f.phase === 'put-insert') {
        expect(f.order.length).toBeLessThanOrEqual(c.capacity)
        expect(f.order[0].key).toBe(f.mapEntries.find((e) => e.id === f.cur).key)
      }
      prevOrder = f.order
    }
  })

  it('默认题面：13 帧，结果是题面标准输出 [1, -1, -1, 3, 4]', () => {
    const steps = buildLruCacheSteps()
    expect(steps).toHaveLength(13)
    expect(steps.map((f) => f.phase)).toEqual([
      'init',
      'put-insert',
      'put-insert',
      'get-hit',
      'evict',
      'put-insert',
      'get-miss',
      'evict',
      'put-insert',
      'get-miss',
      'get-hit',
      'get-hit',
      'done',
    ])
    expect(steps.at(-1).results).toEqual([1, -1, -1, 3, 4])
  })

  it('淘汰的是队尾（最久未使用）', () => {
    const steps = buildLruCacheSteps()
    const evicts = steps.filter((f) => f.phase === 'evict')
    // 第一次淘汰 (2,2)：get(1) 之后 2 是队尾
    expect(evicts[0].evicted).toEqual({ id: 2, key: 2, value: 2 })
    // 第二次淘汰 (1,1)：put(3,3) 之后链表 3→1，队尾是 1
    expect(evicts[1].evicted).toEqual({ id: 1, key: 1, value: 1 })
  })

  it('put 已存在的 key：改值且移到队首（算使用）', () => {
    const steps = buildLruCacheSteps({
      capacity: 2,
      ops: [['put', 1, 1], ['put', 2, 2], ['put', 1, 9], ['put', 3, 3], ['get', 2]],
    })
    // put(1,9) 之后 1 在队首 → 淘汰时 2 被淘汰
    const done = steps.at(-1)
    expect(done.results).toEqual([-1])
    const evicts = steps.filter((f) => f.phase === 'evict')
    expect(evicts[0].evicted.key).toBe(2)
  })

  it('非法输入回退默认', () => {
    expect(buildLruCacheSteps({ capacity: 0, ops: null })[0].capacity).toBe(2)
    expect(buildLruCacheSteps({ capacity: 'x' })[0].capacity).toBe(2)
  })

  it('随机交叉：400 组随机操作 vs 时间戳参考解', () => {
    let rng = 1460
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
      const steps = buildLruCacheSteps({ capacity, ops })
      expect(steps.at(-1).results).toEqual(refLRU(capacity, ops))
    }
  })
})
