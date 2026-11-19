#!/usr/bin/env node
/**
 * bench_shuge_pipeline.mjs — measured numbers for the ShuGe (書閣) article.
 *
 * Imports the real modules from a checkout of zhoujungis/knowledge_base:
 *   worker/chunker.mjs  worker/ai.mjs  worker/search.mjs
 *
 * Usage:
 *   node tools/bench_shuge_pipeline.mjs --repo <path-to-knowledge_base>
 *
 * What is measured (all on this machine, Node 24):
 *   1. smartChunk() over the repo's own 三国志 / 史记 corpora.
 *   2. buildKeywordRows() inverted-index size and the 400-term cap.
 *   3. embedLocal() (the 1024-dim fallback embedding) throughput.
 *   4. In-memory BM25 over the built keyword rows (same K1/B as search.mjs).
 *
 * The BM25 step is a local simulation of the query loop, not a D1 round trip;
 * the article labels it that way.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const repoArg = args.includes('--repo') ? args[args.indexOf('--repo') + 1] : process.env.SHUGE_REPO
if (!repoArg) {
  console.error('usage: node tools/bench_shuge_pipeline.mjs --repo <path-to-knowledge_base>')
  process.exit(1)
}
const REPO = path.resolve(repoArg)
const load = (file) => import(pathToFileURL(path.join(REPO, file)).href)

const { smartChunk } = await load('worker/chunker.mjs')
const { tokenize, embedLocal } = await load('worker/ai.mjs')
const { buildKeywordRows } = await load('worker/search.mjs')
const { estimateTokens } = await load('worker/util.mjs')

const CORPUS = [
  ['三国志.txt', 'database/三国志.txt'],
  ['史记.txt', 'database/史记.txt'],
]

const GENERIC = new Set([
  '什么', '怎么', '如何', '为何', '为什么', '哪些', '是否', '介绍', '说明',
  '采用', '采取', '使用', '运用', '进行', '用了',
  '策略', '方法', '方式', '原因', '影响', '作用', '意义', '过程', '经过', '结果', '关键', '核心', '主要',
])
const STOP_CHARS = new Set([...'的了吗呢吧啊呀之与和是为在用把被将其此该这那哪什么几何谁'])

const QUERIES = [
  '官渡之战曹操取胜的关键策略是什么',
  '曹操的后代里谁当了官',
  '刘备入蜀的过程',
  '三国鼎立的局面是怎么形成的',
  '诸葛亮北伐的原因和结果',
]

// Same decoding order as worker/parsers.mjs: strict UTF-8 first, then GB18030.
function decode(buffer) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    return new TextDecoder('gb18030').decode(buffer)
  }
}

function cleanText(raw) {
  return raw
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function ms(value) {
  return Number(value.toFixed(2))
}

// CPU time, not wall time: on Windows a background process can otherwise
// double a 40 ms measurement between two runs. The scheduler tick is ~15 ms,
// so small operations run in batches and are divided afterwards.
function cpuMs(start) {
  const delta = process.cpuUsage(start)
  return (delta.user + delta.system) / 1000
}

function cpuPerRun(reps, fn) {
  const start = process.cpuUsage()
  for (let i = 0; i < reps; i++) fn()
  return cpuMs(start) / reps
}

function queryTerms(query) {
  const raw = [...new Set(tokenize(query))]
  const multi = raw.filter((t) => t.length > 1 && !GENERIC.has(t) && ![...t].some((c) => STOP_CHARS.has(c)) && !/[么什何哪谁几]/.test(t))
  if (multi.length) return multi.slice(0, 64)
  return raw.filter((t) => t.length === 1 && !STOP_CHARS.has(t)).slice(0, 32)
}

function buildIndex(chunks) {
  const postings = new Map() // term -> array of [chunkIndex, tf]
  const lengths = new Float64Array(chunks.length)
  let termCount = 0
  chunks.forEach((chunk, index) => {
    const rows = buildKeywordRows(`c${index}`, `${chunk.title_path} ${chunk.content}`)
    lengths[index] = chunk.char_count || chunk.content.length
    for (const row of rows) {
      let list = postings.get(row.term)
      if (!list) { list = []; postings.set(row.term, list) }
      list.push([index, row.tf])
      termCount++
    }
  })
  return { postings, lengths, termCount }
}

function bm25Search(index, query) {
  const { postings, lengths } = index
  const N = lengths.length
  let total = 0
  for (let i = 0; i < N; i++) total += lengths[i]
  const avgLen = total / N || 1
  const K1 = 1.4
  const B = 0.75
  const terms = queryTerms(query)
  const df = new Map()
  for (const term of terms) df.set(term, (postings.get(term) || []).length)
  const scores = new Map()
  for (const term of terms) {
    const list = postings.get(term)
    if (!list) continue
    const n = list.length
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5))
    for (const [index, tf] of list) {
      const len = lengths[index]
      const s = (idf * (tf * (K1 + 1))) / (tf + K1 * (1 - B + (B * len) / avgLen))
      scores.set(index, (scores.get(index) || 0) + s)
    }
  }
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 360)
  return { terms, scored: scores.size, ranked: ranked.length, top: ranked[0]?.[1] || 0 }
}

console.log(`repo: ${REPO}`)
console.log(`node: ${process.version}`)
console.log('')

for (const [label, rel] of CORPUS) {
  const buffer = await readFile(path.join(REPO, rel))
  const raw = decode(buffer)
  const text = cleanText(raw)
  const before = process.memoryUsage().heapUsed
  const chunks = smartChunk(text, { chunkSize: 400, chunkOverlap: 60 })
  const elapsed = cpuPerRun(3, () => smartChunk(text, { chunkSize: 400, chunkOverlap: 60 }))
  const after = process.memoryUsage().heapUsed

  let chars = 0
  let tokens = 0
  let titleChunks = 0
  let capped = 0
  let keywordRows = 0
  for (const chunk of chunks) {
    chars += chunk.char_count
    tokens += chunk.token_count
    if (chunk.paragraph === 0) titleChunks++
    const unique = new Set(tokenize(`${chunk.title_path} ${chunk.content}`))
    if (unique.size > 400) capped++
    keywordRows += Math.min(400, unique.size)
  }

  console.log(`== ${label}`)
  console.log(`   source bytes           : ${buffer.length}`)
  console.log(`   cleaned chars          : ${text.length}`)
  console.log(`   chunks                 : ${chunks.length}`)
  console.log(`   title-only chunks      : ${titleChunks}`)
  console.log(`   avg chunk chars        : ${(chars / chunks.length).toFixed(1)}`)
  console.log(`   avg chunk tokens       : ${(tokens / chunks.length).toFixed(1)}`)
  console.log(`   max chunk chars        : ${Math.max(...chunks.map((c) => c.char_count))}`)
  console.log(`   total tokens           : ${tokens}`)
  console.log(`   chunk cpu (ms)         : ${ms(elapsed)}`)
  console.log(`   chunk throughput       : ${Math.round(text.length / (elapsed / 1000))} chars/s`)
  console.log(`   heap delta (approx MB) : ${((after - before) / 1048576).toFixed(1)}`)
  console.log(`   keyword rows           : ${keywordRows}`)
  console.log(`   chunks hitting 400 cap : ${capped} (${((capped / chunks.length) * 100).toFixed(1)}%)`)

  // Embedding throughput: run the real embedLocal over every chunk.
  const texts = chunks.map((c) => `${c.title_path}\n${c.content}`.slice(0, 4000))
  const e1 = cpuPerRun(5, () => { for (const t of texts) embedLocal(t) })
  console.log(`   embedLocal cpu (ms)    : ${ms(e1)}`)
  console.log(`   embedLocal chunks/s    : ${Math.round(chunks.length / (e1 / 1000))}`)

  // Build the inverted index exactly as buildKeywordRows does (400 cap).
  const i0 = process.cpuUsage()
  const index = buildIndex(chunks)
  const i1 = cpuMs(i0)
  console.log(`   index build cpu (ms)   : ${ms(i1)}`)
  console.log(`   index posting entries  : ${index.termCount}`)
  console.log(`   distinct terms         : ${index.postings.size}`)

  for (const query of QUERIES) {
    let result
    const q1 = cpuPerRun(1000, () => { result = bm25Search(index, query) })
    console.log(`   bm25 "${query}"`)
    console.log(`      terms=${result.terms.length} scored=${result.scored} ranked=${result.ranked} top=${result.top.toFixed(3)} cpu=${ms(q1)}ms`)
  }
  console.log('')
}
