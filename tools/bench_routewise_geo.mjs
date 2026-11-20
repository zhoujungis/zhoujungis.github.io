#!/usr/bin/env node
/**
 * Routewise geo-validator bench.
 *
 * The four geographic checks in `trip-planning/functions/api/plan.ts` are the
 * last line of defence before a model draft reaches the client. They are pure
 * functions of (lat, lng), so they can be lifted out of the Pages Function and
 * measured without D1 or the model.
 *
 * This file is a byte-faithful port of:
 *   distanceKm, routeDistance, minimumSpanningTreeDistance, geographicIssues
 * from functions/api/plan.ts with the same constants. Nothing is simplified.
 *
 * Usage: node tools/bench_routewise_geo.mjs
 */

const MAX_SAME_AREA_LEG_KM = 15
const MAX_SAME_AREA_SPAN_KM = 22
const MAX_MEAL_DETOUR_KM = 6
const MAX_ROUTE_TO_MINIMUM_TREE_RATIO = 2.2

function distanceKm(left, right) {
  if (left.latitude === undefined || left.longitude === undefined || right.latitude === undefined || right.longitude === undefined) return null
  const radians = Math.PI / 180
  const latitudeDelta = (right.latitude - left.latitude) * radians
  const longitudeDelta = (right.longitude - left.longitude) * radians
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(left.latitude * radians) * Math.cos(right.latitude * radians) * Math.sin(longitudeDelta / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const describeDistance = (left, right, km) => `${left.title} to ${right.title} is ${Math.round(km)} km`

function routeDistance(items) {
  let total = 0
  for (let index = 1; index < items.length; index += 1) {
    const kilometers = distanceKm(items[index - 1], items[index])
    if (kilometers === null) return null
    total += kilometers
  }
  return total
}

function minimumSpanningTreeDistance(items) {
  if (items.length < 2) return 0
  const reached = new Set([0])
  let total = 0
  while (reached.size < items.length) {
    let best = null
    for (const left of reached) {
      for (let right = 0; right < items.length; right += 1) {
        if (reached.has(right)) continue
        const kilometers = distanceKm(items[left], items[right])
        if (kilometers !== null && (!best || kilometers < best.kilometers)) best = { index: right, kilometers }
      }
    }
    if (!best) return null
    reached.add(best.index)
    total += best.kilometers
  }
  return total
}

function geographicIssues(plan) {
  const issues = []
  for (const day of plan.days) {
    for (const item of day.items) {
      if (item.latitude === undefined || item.longitude === undefined) {
        issues.push(`Day ${day.day}: ${item.title} is missing a usable coordinate`)
      }
    }

    const areas = [[]]
    for (const item of day.items) {
      if (item.type === 'train') {
        if (areas[areas.length - 1].length) areas.push([])
        continue
      }
      areas[areas.length - 1].push(item)
    }

    for (const area of areas.filter((items) => items.length > 1)) {
      for (let index = 1; index < area.length; index += 1) {
        const kilometers = distanceKm(area[index - 1], area[index])
        if (kilometers !== null && kilometers > MAX_SAME_AREA_LEG_KM) {
          issues.push(`Day ${day.day}: adjacent stops are too far apart (${describeDistance(area[index - 1], area[index], kilometers)})`)
        }
      }

      for (let left = 0; left < area.length; left += 1) {
        for (let right = left + 1; right < area.length; right += 1) {
          const kilometers = distanceKm(area[left], area[right])
          if (kilometers !== null && kilometers > MAX_SAME_AREA_SPAN_KM) {
            issues.push(`Day ${day.day}: one area spans too far (${describeDistance(area[left], area[right], kilometers)})`)
          }
        }
      }

      const traveled = routeDistance(area)
      const minimumTree = minimumSpanningTreeDistance(area)
      if (traveled !== null && minimumTree !== null && traveled > 25 && traveled > minimumTree * MAX_ROUTE_TO_MINIMUM_TREE_RATIO) {
        issues.push(`Day ${day.day}: stop order backtracks excessively (${Math.round(traveled)} km route for a roughly ${Math.round(minimumTree)} km area)`)
      }

      for (let index = 0; index < area.length; index += 1) {
        if (area[index].type !== 'food') continue
        const previous = area[index - 1]
        const next = area[index + 1]
        const nearest = [previous, next]
          .filter(Boolean)
          .map((item) => distanceKm(area[index], item))
          .filter((kilometers) => kilometers !== null)
          .sort((left, right) => left - right)[0]
        if (nearest !== undefined && nearest > MAX_MEAL_DETOUR_KM) {
          issues.push(`Day ${day.day}: meal ${area[index].title} is ${Math.round(nearest)} km from its nearest activity`)
        }
      }
    }
  }
  return issues.slice(0, 8)
}

// ---------------------------------------------------------------- fixtures

const TOKYO = { latitude: 35.6812, longitude: 139.7671 }
const UENO = { latitude: 35.7141, longitude: 139.7774 }
const ASAKUSA = { latitude: 35.7148, longitude: 139.7967 }
const GINZA = { latitude: 35.6717, longitude: 139.7650 }
const SHINJUKU = { latitude: 35.6896, longitude: 139.7006 }

function item(title, coords, type = 'sight') {
  return { title, type, latitude: coords.latitude, longitude: coords.longitude }
}

const compactDay = {
  title: 'compact Asakusa/Ueno cluster',
  days: [{ day: 1, items: [
    item('Ueno Park', UENO),
    item('Tokyo National Museum', { latitude: 35.7188, longitude: 139.7760 }),
    item('Senso-ji', ASAKUSA),
    item('Nakamise lunch', { latitude: 35.7128, longitude: 139.7960 }, 'food'),
    item('Sumida River walk', { latitude: 35.7107, longitude: 139.8020 }),
  ] }],
}

const zigzagDay = {
  title: 'east-west ping-pong',
  days: [{ day: 1, items: [
    item('Ueno Park', UENO),
    item('Shinjuku Gyoen', SHINJUKU),
    item('Tokyo National Museum', { latitude: 35.7188, longitude: 139.7760 }),
    item('Meiji Jingu', { latitude: 35.6764, longitude: 139.6993 }),
  ] }],
}

const mealDetourFarDay = {
  title: 'meal far from its activity',
  days: [{ day: 1, items: [
    item('Ueno Park', UENO),
    item('Remote lunch', { latitude: 35.6586, longitude: 139.7454 }, 'food'),
    item('Tokyo National Museum', { latitude: 35.7188, longitude: 139.7760 }),
  ] }],
}

const longPingPongDay = {
  title: 'long east-west ping-pong',
  days: [{ day: 1, items: [
    item('Ueno Park', UENO),
    item('Meiji Jingu', { latitude: 35.6764, longitude: 139.6993 }),
    item('Tokyo National Museum', { latitude: 35.7188, longitude: 139.7760 }),
    item('Shibuya Crossing', { latitude: 35.6595, longitude: 139.7005 }),
  ] }],
}

const trainSplitDay = {
  title: 'Tokyo → Kyoto transfer',
  days: [{ day: 1, items: [
    item('Tokyo Station', TOKYO),
    item('Kyoto Station', { latitude: 34.9858, longitude: 135.7588 }, 'train'),
    item('Kiyomizu-dera', { latitude: 34.9949, longitude: 135.7850 }),
    item('Gion lunch', { latitude: 35.0037, longitude: 135.7788 }, 'food'),
  ] }],
}

const mealDetourDay = {
  title: 'meal far from its activity',
  days: [{ day: 1, items: [
    item('Ueno Park', UENO),
    item('Remote lunch', { latitude: 35.6586, longitude: 139.7454 }, 'food'),
    item('Tokyo National Museum', { latitude: 35.7188, longitude: 139.7760 }),
  ] }],
}

const missingCoordsDay = {
  title: 'missing coordinates',
  days: [{ day: 1, items: [
    { title: 'Ueno Park', type: 'sight' },
    item('Senso-ji', ASAKUSA),
  ] }],
}

// ---------------------------------------------------------------- bench

function timeIt(fn, iterations = 10000) {
  fn()
  const samples = []
  for (let round = 0; round < 5; round += 1) {
    const start = process.hrtime.bigint()
    for (let index = 0; index < iterations; index += 1) fn()
    const end = process.hrtime.bigint()
    samples.push(Number(end - start) / 1e6 / iterations)
  }
  samples.sort((a, b) => a - b)
  return {
    mean: samples.reduce((sum, value) => sum + value, 0) / samples.length,
    min: samples[0],
    max: samples[samples.length - 1],
  }
}

console.log('Routewise geo validator bench')
console.log(`constants: leg=${MAX_SAME_AREA_LEG_KM}km span=${MAX_SAME_AREA_SPAN_KM}km meal=${MAX_MEAL_DETOUR_KM}km ratio=${MAX_ROUTE_TO_MINIMUM_TREE_RATIO}`)
console.log('')

const fixtures = [
  ['compact (valid)', compactDay],
  ['east-west ping-pong', zigzagDay],
  ['long ping-pong (fires)', longPingPongDay],
  ['train split (valid)', trainSplitDay],
  ['meal detour', mealDetourFarDay],
  ['missing coords', missingCoordsDay],
]

console.log('geometry (5-item days)')
console.log('')
for (const [label, plan] of fixtures) {
  const day = plan.days[0]
  const cityItems = day.items.filter((it) => it.type !== 'train' && it.latitude !== undefined)
  const route = routeDistance(cityItems)
  const mst = minimumSpanningTreeDistance(cityItems)
  const issues = geographicIssues(plan)
  console.log(`  ${label}`)
  console.log(`    route      ${route === null ? 'n/a' : route.toFixed(1) + ' km'}`)
  console.log(`    mst        ${mst === null ? 'n/a' : mst.toFixed(1) + ' km'}`)
  console.log(`    ratio      ${route !== null && mst ? (route / mst).toFixed(2) : 'n/a'}`)
  console.log(`    issues     ${issues.length}${issues.length ? ': ' + issues[0] : ''}`)
  console.log('')
}

const iterations = 10000
const timings = []
for (const [label, plan] of fixtures) {
  const timing = timeIt(() => geographicIssues(plan), iterations)
  timings.push({ label, ...timing })
}
console.log(`validator cost  (${iterations} iterations x ${timings.length} fixtures)`)
for (const row of timings) {
  console.log(`  ${row.label.padEnd(24)} mean ${row.mean.toFixed(3)} ms  min ${row.min.toFixed(3)}  max ${row.max.toFixed(3)}`)
}

// Worst case: a 16-day plan, 6 items per day, all in one cluster.
const bigPlan = {
  days: Array.from({ length: 16 }, (_, dayIndex) => ({
    day: dayIndex + 1,
    items: Array.from({ length: 6 }, (_, itemIndex) => item(
      `stop ${itemIndex}`,
      { latitude: 35.68 + itemIndex * 0.004, longitude: 139.76 + itemIndex * 0.003 },
      itemIndex === 2 ? 'food' : 'sight',
    )),
  })),
}
const bigTiming = timeIt(() => geographicIssues(bigPlan), 2000)
console.log('')
console.log(`worst case: 16 days x 6 items, one cluster`)
console.log(`  mean ${bigTiming.mean.toFixed(3)} ms  min ${bigTiming.min.toFixed(3)}  max ${bigTiming.max.toFixed(3)}`)
console.log(`  pair checks: 16 days x C(6,2)=15 pairs = ${16 * 15} span checks`)
