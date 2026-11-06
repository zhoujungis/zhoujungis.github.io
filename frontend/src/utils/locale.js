/**
 * locale.js — first-visit language routing.
 *
 * 用系统时区判断访问者在哪，而不是查 IP：
 *   1. VPN 只改出口 IP，改不了操作系统时区 —— 时区更接近「实际位置」；
 *   2. 不需要第三方 IP 库，没有 CORS、配额与隐私问题，页面首屏也不多一次请求；
 *   3. 也不用 /cdn-cgi/trace：本站是 GitHub Pages 直连（DNS-only），没有
 *      Cloudflare 边缘节点可言。
 *
 * 规则：
 *   - 只在「首次访问、没有记住过选择」时执行，且只做 zh → en；
 *     已经在读英文的人不会被弹回中文（手动导航优先）。
 *   - 爬虫一律不跳转：Googlebot 多从海外出口抓取，跳转会让中文页在索引里消失。
 *   - 用户点过 EN / 中文 之后写入 site-lang，之后永远尊重这个选择。
 */

const STORAGE_KEY = 'site-lang'

// 中文地区的时区：大陆 + 港澳台。命中即视为中文受众。
const ZH_TIMEZONES = new Set([
  'Asia/Shanghai',
  'Asia/Chongqing',
  'Asia/Harbin',
  'Asia/Urumqi',
  'Asia/Hong_Kong',
  'Asia/Macau',
  'Asia/Taipei',
])

// 抓取器不参与跳转（否则 Googlebot 从美国 IP 访问首页会被送去 /en）。
const BOT_RE =
  /bot|crawler|spider|slurp|mediapartners|googlebot|bingbot|baiduspider|yandex|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|pinterest|slackbot|whatsapp|telegrambot|preview/i

export function rememberLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // 隐私模式禁用 localStorage 时忽略：本次会话仍按默认逻辑走。
  }
}

function storedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** 'zh' | 'en' —— 系统时区优先，浏览器语言兜底。 */
export function preferredLang() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (tz) return ZH_TIMEZONES.has(tz) ? 'zh' : 'en'
  } catch {
    // Intl 不可用时走下面的语言判断
  }
  const nav = String(navigator.language || '').toLowerCase()
  return nav.startsWith('zh') ? 'zh' : 'en'
}

export function isEnglishPath(pathname = window.location.pathname) {
  return pathname === '/en' || pathname.startsWith('/en/')
}

/** 首次访问若是海外时区，跳到英文版。返回是否发生了跳转。 */
export function autoSwitchLang() {
  if (typeof window === 'undefined') return false
  if (BOT_RE.test(navigator.userAgent || '')) return false
  if (storedLang()) return false
  if (window.location.pathname.startsWith('/admin')) return false
  if (isEnglishPath()) return false
  if (preferredLang() !== 'en') return false

  window.location.replace('/en/')
  return true
}
