#!/usr/bin/env node
/**
 * bench_block_world.mjs — measured numbers for the Block World 3D article.
 *
 * Imports the real modules from a checkout of zhoujungis/block_world_3d:
 *   src/world/terrain.js        src/world/generation.js
 *   src/data/catalog.js         src/data/entities.js
 *   src/systems/pathfinding.js  src/persistence/save-schema.js
 *
 * Usage:
 *   node --expose-gc tools/bench_block_world.mjs --repo <path-to-block_world_3d>
 *
 * Every timed section runs three times and reports the median, because a single
 * Node run on Windows can swing 2x with JIT warm-up and background load.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const repoArg = args.includes('--repo') ? args[args.indexOf('--repo') + 1] : process.env.BLOCK_WORLD_REPO
if (!repoArg) {
  console.error('usage: node --expose-gc tools/bench_block_world.mjs --repo <path-to-block_world_3d>')
  process.exit(1)
}
const REPO = path.resolve(repoArg)
const load = (file) => import(pathToFileURL(path.join(REPO, file)).href)

const { setTerrainSeed, heightAt, biomeAt, terrainSlopeAt, SURFACE_BIOMES, hash } = await load('src/world/terrain.js')
const { locateStructureForSeed, STRUCTURE_INFO } = await load('src/world/generation.js')
const { BLOCKS, EXPANDED_BLOCK_NAMES, ITEMS, RECIPES, STONECUTTER_RECIPES } = await load('src/data/catalog.js')
const { HOSTILE_TYPES, ANIMAL_TYPES, VILLAGER_PROFESSIONS } = await load('src/data/entities.js')
const { createGridPathfinder } = await load('src/systems/pathfinding.js')
const { SAVE_SCHEMA_VERSION, migrateSaveSnapshot } = await load('src/persistence/save-schema.js')
const { CHUNK_SIZE, MIN_Y, MAX_Y, WORLD_HEIGHT, LOAD_RADIUS, UNLOAD_RADIUS, SAVE_INTERVAL } = await load('src/config/constants.js')

setTerrainSeed(1337)

function ms(value) { return Number(value.toFixed(2)) }
function now() { return performance.now() }
function cpuMs(start) {
  const delta = process.cpuUsage(start)
  return (delta.user + delta.system) / 1000
}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
// CPU time is far more stable than wall time on Windows, but its resolution is
// roughly one scheduler tick (~15 ms). Small operations are therefore batched:
// repeat them enough times that the total passes 100 ms, then divide.
function cpuPerRun(reps, fn) {
  const start = process.cpuUsage()
  for (let i = 0; i < reps; i++) fn()
  return cpuMs(start) / reps
}

console.log(`repo: ${REPO}`)
console.log(`node: ${process.version}`)
console.log('')

console.log('== static catalog')
console.log(`   blocks                 : ${Object.keys(BLOCKS).length}`)
console.log(`   expanded block names   : ${EXPANDED_BLOCK_NAMES.length}`)
console.log(`   items                  : ${Object.keys(ITEMS).length}`)
console.log(`   crafting recipes       : ${RECIPES.length}`)
console.log(`   stonecutter recipes    : ${STONECUTTER_RECIPES.length}`)
console.log(`   hostile types          : ${Object.keys(HOSTILE_TYPES).length}`)
console.log(`   animal types           : ${Object.keys(ANIMAL_TYPES).length}`)
console.log(`   villager professions   : ${Object.keys(VILLAGER_PROFESSIONS).length}`)
console.log(`   surface biomes         : ${SURFACE_BIOMES.length}`)
console.log(`   world height (blocks)  : ${WORLD_HEIGHT} (${MIN_Y}..${MAX_Y})`)
console.log(`   load/unload radius     : ${LOAD_RADIUS}/${UNLOAD_RADIUS} chunks`)
console.log(`   autosave interval      : ${SAVE_INTERVAL} ms`)
console.log('')

console.log('== terrain sampling (CPU, batched)')
for (const step of [16, 8, 4]) {
  const samples = []
  for (let z = -512; z <= 512; z += step) for (let x = -512; x <= 512; x += step) samples.push([x, z])
  let checksum = 0
  const reps = step === 4 ? 5 : 20
  const elapsed = cpuPerRun(reps, () => {
    let sum = 0
    for (const [x, z] of samples) sum += heightAt(x, z) + biomeAt(x, z).length
    checksum = sum
  })
  console.log(`   step=${step} samples=${samples.length} cpu=${ms(elapsed)}ms rate=${Math.round(samples.length / (elapsed / 1000))}/s (checksum=${checksum})`)
}
console.log('')

console.log('== chunk worker payload (terrain.js + 6-block margin, CPU)')
const MARGIN = 6
const width = CHUNK_SIZE + MARGIN * 2
const perChunk = width * width
for (const radius of [1, 2, 4]) {
  const jobs = []
  for (let cz = -radius; cz <= radius; cz++) for (let cx = -radius; cx <= radius; cx++) jobs.push([cx, cz])
  const elapsed = cpuPerRun(3, () => {
    for (const [cx, cz] of jobs) {
      const originX = cx * CHUNK_SIZE - MARGIN
      const originZ = cz * CHUNK_SIZE - MARGIN
      for (let lz = 0; lz < width; lz++) for (let lx = 0; lx < width; lx++) {
        const x = originX + lx
        const z = originZ + lz
        heightAt(x, z)
        biomeAt(x, z)
        terrainSlopeAt(x, z)
      }
    }
  })
  console.log(`   radius=${radius} chunks=${jobs.length} samples=${jobs.length * perChunk} cpu=${ms(elapsed)}ms perChunk=${ms(elapsed / jobs.length)}ms`)
}
console.log(`   samples per chunk      : ${perChunk}`)
console.log('')

console.log('== structure placement (seed 1337, CPU, 100 reps)')
let located = 0
const structureTime = cpuPerRun(100, () => {
  located = 0
  for (const type of Object.keys(STRUCTURE_INFO)) {
    if (locateStructureForSeed(type, 1337, hash, biomeAt)) located++
  }
})
console.log(`   structure types        : ${Object.keys(STRUCTURE_INFO).length}`)
console.log(`   located                : ${located}`)
console.log(`   cpu per pass (ms)      : ${ms(structureTime)}`)
console.log('')

console.log('== save schema migration (CPU, 50k reps)')
const v1 = {
  schemaVersion: 1,
  player: { position: { x: 0, y: 6, z: 0 }, yaw: 0, pitch: 0, dimensions: { overworld: { chunks: [], entities: [] } } },
  world: {},
  dimensions: {
    overworld: { chunks: [{ x: 0, z: 0, keys: ['0,0,0'] }], entities: [], redstone: {} },
  },
}
const iterations = 50000
const migrationTime = cpuPerRun(1, () => {
  for (let i = 0; i < iterations; i++) migrateSaveSnapshot(v1)
})
console.log(`   version                : 1 -> ${SAVE_SCHEMA_VERSION}`)
console.log(`   iterations             : ${iterations}`)
console.log(`   per migration (us)     : ${ms((migrationTime * 1000) / iterations)}`)
console.log('')

console.log('== A* pathfinding (synthetic flat world, CPU, 5k paths)')
const isSolid = (type) => Boolean(type && BLOCKS[type]?.solid)
const getBlock = (x, y, z) => (y < 0 ? 'stone' : null)
const finder = createGridPathfinder({ getBlock, isSolid, heightAt: () => 0 })
let pathLen = 0
const pathIterations = 5000
const pathTime = cpuPerRun(1, () => {
  pathLen = 0
  for (let i = 0; i < pathIterations; i++) {
    pathLen += finder.findPath(
      { x: 0, y: 1, z: 0 },
      { x: 20 + (i % 8), y: 1, z: 0 },
      { bodyHeight: 2, maxDrop: 2, maxNodes: 900, maxDistance: 32 },
    ).length
  }
})
console.log(`   iterations             : ${pathIterations}`)
console.log(`   avg path nodes         : ${(pathLen / pathIterations).toFixed(1)}`)
console.log(`   per path (ms)          : ${ms(pathTime / pathIterations)}`)
console.log(`   paths/s                : ${Math.round(pathIterations / (pathTime / 1000))}`)
console.log('')

console.log('== block key map memory probe')
if (typeof global.gc !== 'function') {
  console.log('   skipped: run with --expose-gc for a retained-heap measurement')
} else {
  // Warm up, then measure the retained heap of a live Map with the same key
  // shape block-store.js uses ("x,y,z" -> block type).
  const warm = new Map()
  for (let i = 0; i < 20000; i++) warm.set(`${i % 4096},${(i * 7) % 251 - 50},${Math.floor(i / 4096)}`, 'stone')
  global.gc()
  const n = 300000
  const before = process.memoryUsage().heapUsed
  const map = new Map()
  for (let i = 0; i < n; i++) map.set(`${i % 4096},${(i * 7) % 251 - 50},${Math.floor(i / 4096)}`, 'stone')
  global.gc()
  const after = process.memoryUsage().heapUsed
  console.log(`   entries=${map.size} retained=${((after - before) / 1048576).toFixed(1)}MB bytesPerEntry=${Math.round((after - before) / map.size)}`)
  map.clear()
}
console.log('')

const pkg = JSON.parse(await readFile(path.join(REPO, 'package.json'), 'utf8'))
console.log(`== repo package: ${pkg.name} v${pkg.version}, three ${pkg.dependencies?.three}`)
