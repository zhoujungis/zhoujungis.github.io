/**
 * footprints.js — the travel data behind /footprints.
 *
 * Lives outside the component because the build-time pre-renderer
 * (scripts/prerender.mjs) needs the same list to write a crawlable
 * <noscript> snapshot of the page. A .vue file can't be imported from a Node
 * script, a plain module can.
 */

/**
 * Visited cities. `labelPos` is a per-marker label offset used to keep labels
 * from overlapping in the dense clusters (Pearl River Delta, Chaoshan);
 * omitted entries fall back to 'right'.
 */
export const FOOTPRINT_CITIES = [
  // 京津冀
  { name: '北京', lng: 116.4074, lat: 39.9042, province: '北京市' },
  { name: '天津', lng: 117.1902, lat: 39.1252, province: '天津市' },
  // 长三角
  { name: '南京', lng: 118.7969, lat: 32.0603, province: '江苏省' },
  { name: '苏州', lng: 120.5954, lat: 31.2990, province: '江苏省' },
  { name: '合肥', lng: 117.2273, lat: 31.8206, province: '安徽省' },
  { name: '安庆', lng: 117.0510, lat: 30.5319, province: '安徽省' },
  // 珠三角 (dense — custom label positions spread around markers)
  { name: '广州', lng: 113.2644, lat: 23.1291, province: '广东省', labelPos: 'top' },
  { name: '深圳', lng: 114.0579, lat: 22.5431, province: '广东省', labelPos: 'right' },
  { name: '香港', lng: 114.1657, lat: 22.2793, province: '香港特别行政区', labelPos: 'bottom' },
  { name: '澳门', lng: 113.5491, lat: 22.1987, province: '澳门特别行政区', labelPos: 'left' },
  { name: '中山', lng: 113.3824, lat: 22.5159, province: '广东省', labelPos: 'left' },
  { name: '珠海', lng: 113.5767, lat: 22.2707, province: '广东省', labelPos: 'bottom' },
  // 潮汕 (close pair — split up/down)
  { name: '潮州', lng: 116.6224, lat: 23.6581, province: '广东省', labelPos: 'top' },
  { name: '汕头', lng: 116.6821, lat: 23.3535, province: '广东省', labelPos: 'bottom' },
  // 中部
  { name: '武汉', lng: 114.3054, lat: 30.5931, province: '湖北省' },
  { name: '长沙', lng: 112.9388, lat: 28.2278, province: '湖南省' },
  { name: '衡阳', lng: 112.5727, lat: 26.8932, province: '湖南省' },
  { name: '南昌', lng: 115.8581, lat: 28.6820, province: '江西省' },
  { name: '赣州', lng: 114.9350, lat: 25.8318, province: '江西省' },
  // 西南
  { name: '重庆', lng: 106.5516, lat: 29.5630, province: '重庆市' },
  { name: '内江', lng: 105.0584, lat: 29.5801, province: '四川省', labelPos: 'top' },
  { name: '泸州', lng: 105.4423, lat: 28.8718, province: '四川省', labelPos: 'bottom' },
  { name: '昆明', lng: 102.8329, lat: 24.8801, province: '云南省' },
  { name: '丽江', lng: 100.2299, lat: 26.8550, province: '云南省' },
  { name: '大理', lng: 100.2299, lat: 25.6065, province: '云南省' },
  { name: '保山', lng: 99.1770, lat: 25.1120, province: '云南省' },
  // 西北（河西走廊 + 河湟）
  { name: '银川', lng: 106.2309, lat: 38.4872, province: '宁夏回族自治区' },
  { name: '兰州', lng: 103.8343, lat: 36.0611, province: '甘肃省', labelPos: 'bottom' },
  { name: '武威', lng: 102.6380, lat: 37.9283, province: '甘肃省', labelPos: 'left' },
  { name: '张掖', lng: 100.4498, lat: 38.9257, province: '甘肃省' },
  // 西宁与海北几乎重合，靠 labelPos 上下错开
  { name: '西宁', lng: 101.7782, lat: 36.6171, province: '青海省', labelPos: 'bottom' },
  { name: '海北', lng: 100.9010, lat: 36.9545, province: '青海省', labelPos: 'top' },
]

/** Region grouping shown under the map. */
export const FOOTPRINT_REGIONS = [
  { name: '京津冀', emoji: '🏛️', cities: ['北京', '天津'] },
  { name: '长三角', emoji: '🌉', cities: ['南京', '苏州', '合肥', '安庆'] },
  { name: '珠三角', emoji: '🌊', cities: ['广州', '深圳', '香港', '澳门', '中山', '珠海'] },
  { name: '潮汕', emoji: '🍵', cities: ['潮州', '汕头'] },
  { name: '中部', emoji: '⛰️', cities: ['武汉', '长沙', '衡阳', '南昌', '赣州'] },
  { name: '西南', emoji: '🏔️', cities: ['重庆', '内江', '泸州', '昆明', '丽江', '大理', '保山'] },
  { name: '西北', emoji: '🏜️', cities: ['银川', '兰州', '武威', '张掖', '西宁', '海北'] },
]

/** Distinct provinces — the denominator for the "探索进度" stat is 34 (省级行政区). */
export const FOOTPRINT_PROVINCES = [...new Set(FOOTPRINT_CITIES.map((c) => c.province))]
