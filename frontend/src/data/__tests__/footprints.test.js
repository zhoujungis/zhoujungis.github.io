import { describe, it, expect } from 'vitest'
import {
  FOOTPRINT_CITIES,
  FOOTPRINT_REGIONS,
  FOOTPRINT_PROVINCES,
} from '../footprints'

describe('footprints data', () => {
  it('has unique city names', () => {
    const names = FOOTPRINT_CITIES.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('keeps cities and regions in sync', () => {
    // Two hand-maintained lists drive the same page: the map markers
    // (FOOTPRINT_CITIES) and the region cards (FOOTPRINT_REGIONS). Adding a
    // city to one and not the other silently renders "32 座城市" above a list
    // of 31 — this is the guard for that.
    const listed = FOOTPRINT_REGIONS.flatMap((r) => r.cities)
    const mapped = FOOTPRINT_CITIES.map((c) => c.name)
    expect([...listed].sort()).toEqual([...mapped].sort())
  })

  it('gives every city a province and in-range coordinates', () => {
    for (const city of FOOTPRINT_CITIES) {
      expect(city.province, city.name).toBeTruthy()
      // Mainland + HK/Macau bounding box — catches a swapped lng/lat pair,
      // which would silently drop the marker into the ocean.
      expect(city.lng, `${city.name} lng`).toBeGreaterThan(70)
      expect(city.lng, `${city.name} lng`).toBeLessThan(140)
      expect(city.lat, `${city.name} lat`).toBeGreaterThan(3)
      expect(city.lat, `${city.name} lat`).toBeLessThan(54)
    }
  })

  it('agrees with the region city counts shown on the cards', () => {
    for (const region of FOOTPRINT_REGIONS) {
      expect(region.cities.length, region.name).toBeGreaterThan(0)
      expect(region.emoji, region.name).toBeTruthy()
    }
    const total = FOOTPRINT_REGIONS.reduce((n, r) => n + r.cities.length, 0)
    expect(total).toBe(FOOTPRINT_CITIES.length)
  })

  it('derives distinct provinces', () => {
    expect(new Set(FOOTPRINT_PROVINCES).size).toBe(FOOTPRINT_PROVINCES.length)
    expect(FOOTPRINT_PROVINCES.length).toBeLessThan(34)
  })
})
