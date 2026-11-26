# DevBox: making 42 browser tools one maintainable product instead of 42 pages

> Who this is for: frontend engineers who have shipped a few "little tool pages" and then discovered that either every page grew its own layout, or nobody dared add a tenth feature three months later; anyone building a multi-route Vue 3 + Vite site who does not want the home page bundle to keep growing; and anyone who has underestimated the "online toolbox" category — the hard part of a 42-tool collection was never the 42 algorithms.
> TL;DR: DevBox is a browser-side developer toolbox built with Vue 3 + TypeScript + Vite: 42 tools, 8 categories, 34 processors, 31 unit-test files, everything computed locally, no account, no backend database. The problem it actually solves is not "how do I format JSON." It is four engineering boundaries. **Adding a tool must mean filling in one table row, not editing five files** — routes, the search index, category pages, favorites, recents, and the sitemap all derive from a single `ToolDefinition`. **Data flow belongs in the type system** — `processing: 'local' | 'external' | 'mixed'` is not a badge, it is the only switch that decides whether the page warns you that your input leaves the browser. **Every input needs a ceiling** — the regex tester must reject nested quantifiers, source analysis must cap at one million characters, CIDR must reject a prefix of 33. **Local by default** — only three tools make external requests, and each must name its destination on the page. What follows is the real implementation of the registry, the lazy-loading contract, the ReDoS guard, the RFC 6238 vector tests, the AES payload layout, the heuristic scorer, the CodeMirror reconfiguration, and the CSP — plus an honest list of what "HTTP Ping is not ICMP", "AI detection cannot prove authorship", and "CSP had to open `connect-src`" actually cost.
> Reading time: about 42 minutes | Level: advanced | You will get: a registry + lazy-loading + privacy-tier skeleton you can copy directly, a processor contract that keeps untrusted input away from the UI, and a way to write "this cannot be proven" into your tests.

**Contents**

- This is not "a pile of online tools"
- One ToolDefinition defines the skeleton of the whole product
- Routes, search, and the sitemap all derive from the same registry
- One directory per tool, and only two files are required
- The processor contract: pure functions, result objects, no exceptions thrown at the UI
- Privacy belongs in the type: local / external / mixed
- Lazy loading: the home page must not ship CodeMirror
- ReDoS: the regex tool is the only page a user can break
- TOTP: use RFC 6238's official vectors as the test
- AES-GCM: pack salt, iv, and ciphertext into one payload
- JWT: decoding is not verification
- Base64: three checks, in order
- CIDR: bitwise math, prefix boundaries, and /31
- DNS over HTTPS: what a browser can and cannot do
- HTTP Ping: a browser cannot send ICMP, so stop pretending
- AI code detection: an honest heuristic scorer
- Writing tests for "this cannot be proven"
- CodeMirror 6: three Compartments and one race
- Theme flash: decide before the bundle runs
- Search: focus, aria, and a Tab trap
- localStorage breaks, so validate every read
- CSP: `connect-src https:` is the one compromise
- SSG and PWA: two cache systems must not fight
- Known limits: an honest list
- If I rewrote it, these five things would change first
- Wrap-up: a toolbox's complexity lives in tool number 43

---

## This is not "a pile of online tools"

Search for "JSON formatter" and you will get dozens of results. Their first versions all look the same: a `<textarea>`, a button, and one line of `JSON.stringify(JSON.parse(x), null, 2)`. Half an hour of work, and it does work.

The trouble starts with tool number two.

You add Base64, so you copy the HTML and change the title and the logic. You add JWT, so you copy a second time. By tool number ten you own ten pages that do not know about each other: ten color schemes, ten button positions, ten separate implementations of (or omissions of) error messaging, ten copy buttons that exist on exactly one page. There is no search box, because search needs a list of "all the tools" and that list has never existed. There is no dark mode, because adding one class would mean editing ten files. Mobile is worse — one page's two-column layout squeezes the output box into a single line at 375px.

That is the trap DevBox exists to avoid: **a toolbox's complexity is not in the tools, it is in tool number 43.** You can brute-force the first three. By tool twenty, every new feature is paying off old debt.

So the project's first decision was not "which framework do I format JSON in." It was "where is the boundary of the concept 'tool'." The answer landed on one interface:

```ts
export interface ToolDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  category: string
  icon: string
  keywords: string[]
  path: string
  component: () => Promise<Component>
  featured?: boolean
  processing?: 'local' | 'external' | 'mixed'
}
```

Ten lines. Everything after this follows from it: something is a tool because it has a row in the registry, and that row is simultaneously its route, its search index entry, its SEO metadata, its favorites key, and its privacy statement. There is no second source of truth.

Here is the conclusion up front, and each point gets its own section below:

- **The registry is the router.** The `routes` array is not hand-written; it is produced by `tools.map()`. Adding a tool never edits the route file.
- **Lazy loading is enforced by the type.** `component` is typed `() => Promise<Component>`, so a static import does not compile. The home page cannot accidentally bundle 42 tools.
- **Privacy is an enum, not prose.** `processing` has exactly three values, and `ToolLayout` reads only that to decide between a green light and an amber one. Forget to set it and you have forgotten the warning.
- **Input ceilings are the processor's job.** The UI does not validate length; `testRegex()` does. That way tests cover hostile input directly.
- **Pure functions are testable.** 31 of the 34 processors ship a `.test.ts`, because a processor touches no DOM, no Vue, and no `this`.

Starting with the registry.

## One ToolDefinition defines the skeleton of the whole product

Open `src/data/tools.ts` and the first entry looks like this:

```ini
{
  id: 'json-formatter',
  name: 'JSON Formatter',
  nameZh: 'JSON 格式化',
  description: '格式化、压缩和校验 JSON 数据',
  category: 'developer',
  icon: 'Braces',
  keywords: ['json', 'format', 'beautify', 'pretty', '格式化', '压缩', '校验'],
  path: '/tools/json-formatter',
  component: () => import('@/tools/json-formatter/JsonFormatter.vue'),
  featured: true
}
```

Those 42 entries total 16,595 bytes and form the heaviest file in the project: the router, the search, the home page, category pages, the favorites page, and the sitemap generator all read it. That looks like coupling. It is a deliberate single point.

**Why these fields.** One at a time:

- `id` is the stable key used by favorites and recents in localStorage. It must never change — the user favorited `jwt-decoder`. You can rename the slug; renaming the `id` loses the favorite.
- `path` is the URL, kept separate from `id` because the two mean different things: `id` is a persistence key, `path` is a changeable public address.
- `name` and `nameZh` coexist instead of going through i18n. That is a trade-off: all 42 tool names are proper nouns ("JSON Formatter" / "JSON 格式化"), so routing them through locale files would force search to merge two language indexes. Two plain fields let one `includes` match either language.
- `keywords` is search ammunition. Someone searching "美化" ("beautify") should find the JSON formatter, but those characters do not appear in `nameZh`. So the keywords carry `beautify`, `pretty`, `压缩`, `校验`.
- `icon` is a string, not a component. That lets the registry be imported in Node — the sitemap script needs it — without dragging the Vue runtime in.
- `featured` drives the home page's "popular tools". 16 entries are marked, and the home page shows the first 6.
- `processing` defaults to `undefined`, which is treated as `local`. That default direction is deliberate: **forgetting to annotate means "one warning too few", not "one fake warning too many."** The flip side is that the risk of annotating in the wrong direction belongs to the developer, which is why only four places set it explicitly (three `external` and one `mixed`).

At the end the registry exports three lookups and one search:

```ts
export function getToolById(id: string) {
  return tools.find(t => t.id === id)
}
export function getToolByPath(path: string) {
  return tools.find(t => t.path === path)
}
export function getToolsByCategory(cat: string) {
  return tools.filter(t => t.category === cat)
}
export function searchTools(query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return tools
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.nameZh.includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  )
}
```

`getToolByPath` is the one worth a second look. It is not "look at the route param again"; it lets `ToolLayout` reconstruct which tool it is rendering from the current URL. `ToolLayout` is a layout component, so it receives no route props — only `useRoute()`. Turning `path` back into `id` is how the layout renders the breadcrumb, the favorite button, and the privacy badge without knowing who called it.

**The sorting problem in search.** `searchTools` does not sort; it returns registry order. That is a known rough edge: typing `json` matches json-formatter, json-viewer, json-diff, then csv-json (whose keywords include json). For local filtering that is good enough, but at 200 tools you would need weights — exact name match, then name prefix, then keywords, then description. This is listed under "known limits."

## Routes, search, and the sitemap all derive from the same registry

This is the cheapest win in the architecture. `src/router/index.ts` is 817 bytes:

```ts
export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/Home.vue'), meta: { title: 'DevBox · 程序员工具箱' } },
  { path: '/favorites', component: () => import('@/views/Favorites.vue'), meta: { title: '我的收藏 - DevBox' } },
  { path: '/category/:id', component: () => import('@/views/Category.vue'), meta: { title: '分类 - DevBox' } },
  { path: '/cheatsheet', component: () => import('@/views/Cheatsheet.vue'), meta: { title: '速查表 - DevBox' } },
  ...tools.map(t => ({
    path: t.path,
    component: t.component,
    meta: { title: `${t.nameZh} - ${t.name} | DevBox`, toolId: t.id }
  })),
  { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
]
```

`meta.toolId` exists for `App.vue`: it reads `route.meta.toolId`, pulls the whole record out of the registry, and hands `description` and `keywords` to `@unhead/vue`'s `useHead()`. Every tool page therefore gets its `<title>`, `description`, `keywords`, and Open Graph tags generated automatically. No page writes its own SEO.

Compare that to a world without a registry: adding one tool means editing six places — a new page, a route, the search list, the category page, the sitemap, and the SEO. The registry compresses six into one, at the cost of `tools.ts` growing forever. That trade is worth it in any project with more than ten tools.

**The sitemap derives too.** `scripts/generate-sitemap.mjs` imports the registry directly:

```ts
import { tools } from '../src/data/tools.ts'
import { categories } from '../src/data/categories.ts'

const SITE_URL = process.env.SITE_URL
if (!SITE_URL) {
  console.error('Please set SITE_URL, e.g.: SITE_URL=https://your-domain.com npm run sitemap')
  process.exit(1)
}

const paths = [
  '/',
  '/favorites',
  '/cheatsheet',
  ...categories.map(c => `/category/${c.id}`),
  ...tools.map(t => t.path)
]
```

Two details matter. First, it imports a `.ts` file directly — Node's type stripping reads the TypeScript source without compiling first. That is the second reason `icon` must be a string rather than a component: a `lucide-vue-next` icon component would explode if imported in Node. Second, a missing `SITE_URL` triggers `process.exit(1)` instead of falling back to a placeholder domain. A project that writes `localhost:5173` into a sitemap and submits it to a search engine is worse off than one with no sitemap.

There is a third derivation in `vite.config.ts`. SSG (`vite-ssg`) needs to know every static route, and `/category/:id` is dynamic:

```ts
const ssgOptions = {
  includedRoutes(_paths, routes) {
    return routes.flatMap(r => {
      if (r.path === '/category/:id') return categories.map(c => `/category/${c.id}`)
      if (r.path.includes(':pathMatch')) return []
      return r.path
    })
  }
}
```

Two things happen at once: the dynamic category route expands into eight real paths, and the `:pathMatch(.*)*` catch-all is excluded — otherwise SSG would try to emit a static file for "any path."

Three derivations, one data source. That is the actual value of a registry: not fewer lines, but **the impossibility of inconsistency**. Delete a tool and the sitemap loses an entry, the router loses a route, search loses a result, and the category counter decrements — in four places, simultaneously, with zero manual work.

## One directory per tool, and only two files are required

`src/tools/` holds 42 directories, one per tool:

```
src/tools/json-formatter/
├── JsonFormatter.vue      # UI: layout, input/output, buttons
├── processor.ts           # pure logic: format, validate, locate errors
└── processor.test.ts      # unit tests: normal, empty, invalid, boundary
```

Three conventions, each with a reason.

**Convention one: logic lives in `processor.ts`.** For the JSON formatter, the UI is 3,362 bytes and the logic is 1,304. Why split? Because logic runs in Vitest, and running a Vue component in Vitest needs `happy-dom`, mounting, and `await nextTick()`; running a pure function needs `expect(formatJson(x)).toEqual(y)`. The 31 processor test files run in tens of milliseconds, and that feedback speed is what makes you willing to write the test before the change.

**Convention two: processors return result objects and never throw at the UI.** Look at `formatJson`:

```ts
export interface JsonFormatResult {
  formatted: string
  minified: string
  valid: boolean
  error?: string
  line?: number
  column?: number
}

export function formatJson(input: string, indent: number = 2): JsonFormatResult {
  if (!input.trim()) return { formatted: '', minified: '', valid: true }
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, indent)
    const minified = JSON.stringify(parsed)
    return { formatted, minified, valid: true }
  } catch (e: any) {
    const msg = e?.message || 'Unknown error'
    let line: number | undefined
    let col: number | undefined
    const posMatch = msg.match(/position (\d+)/)
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10)
      const before = input.slice(0, pos)
      line = before.split('\n').length
      col = before.split('\n').pop()!.length + 1
    }
    return { formatted: '', minified: '', valid: false, error: msg, line, column: col }
  }
}
```

Three design points.

First, **empty input is valid**, returning `valid: true` with empty output. A user who just opened the page has an empty box; showing a red error then is harassment. Empty input is not an error, it is "not started yet."

Second, **line and column are reverse-engineered from `position`**. V8's JSON errors look like `Unexpected token } in JSON at position 15` — a character offset, which no human reads as a line number. `input.slice(0, pos)`, count the newlines, take the length of the last segment plus one. That translates machine output into human-usable location.

Third, **`catch` catches everything, including a `string`**. `catch (e: any)` plus `e?.message || 'Unknown error'` exists because `JSON.parse` can in theory throw a non-Error (not in practice), and `e.message` on `undefined` throws again. A second throw inside the error handler shows the user a blank page.

## The processor contract: pure functions, result objects, no exceptions thrown at the UI

From those conventions you can extract a full contract. It is not written down anywhere, but all 34 files obey it:

| Rule | Anti-pattern | Why |
| --- | --- | --- |
| No DOM access | `document.createElement` | Otherwise the test needs a DOM and cannot run in Node |
| No Vue access | `useToast()`, `ref()` | Otherwise the logic is welded to the framework |
| No global state | `localStorage`, `window.location` | Otherwise tests pollute each other |
| Validate input ceilings | `new RegExp(input)` directly | Otherwise a user can break the page |
| Return result objects | `throw new Error(...)` | Otherwise every call site needs try/catch |
| No presentation | Building Chinese sentences in the processor | Copy belongs to the UI; the processor reports codes |

That last rule is worth expanding. The `error` a processor returns is **technical** (`e.message`), and the UI decides how to present it. `JsonFormatter.vue` takes `line`/`column` and renders "line 12, column 8" plus a hint: "check the nearby brackets, quotes, or commas." The same `Unexpected token` should print verbatim in a terminal and be translated into plain language in a browser. Those are two responsibilities.

Interestingly, `ai-code-detector` violates "no presentation": its `signals` contain Chinese strings directly (`'解释性注释偏多'`, `'模板化注释'`). Why is it allowed? Because the tool's output *is* explanatory text — "which signals fired" is the product, not decoration. Having the processor emit the sentence is more honest than inventing signal codes and mapping them in the UI, which would only make both sides harder to read.

**Tests follow the contract.** Here is the entirety of `regex/processor.test.ts`:

```ts
describe('regex', () => {
  it('matches global', () => {
    const r = testRegex('a', 'g', 'aaa')
    expect(r.matches.length).toBe(3)
  })
  it('invalid', () => {
    const r = testRegex('[', 'g', 'test')
    expect(r.isValid).toBe(false)
  })
  it('limits input sizes', () => {
    expect(testRegex('a'.repeat(MAX_PATTERN_LENGTH + 1), 'g', 'x').isValid).toBe(false)
    expect(testRegex('a', 'g', 'x'.repeat(MAX_TEXT_LENGTH + 1)).isValid).toBe(false)
  })
  it('rejects common nested-quantifier backtracking patterns', () => {
    expect(testRegex('(a+)+$', '', 'a'.repeat(100)).isValid).toBe(false)
  })
})
```

`MAX_PATTERN_LENGTH` and `MAX_TEXT_LENGTH` are exported from the processor and referenced by the tests rather than hardcoded as 1000 and 200000. When a limit changes, the tests change with it, and you cannot end up with "tests pass but production still uses the old value."

## Privacy belongs in the type: local / external / mixed

Most "online toolbox" sites put their privacy statement in prose on an About page, unrelated to what the code actually does. DevBox took the other path: make data flow part of the type.

```
processing?: 'local' | 'external' | 'mixed'
```

Only four entries set it:

```
{ id: 'dns',          processing: 'external' }   // → Cloudflare DNS over HTTPS
{ id: 'ip-lookup',    processing: 'external' }   // → ipwho.is
{ id: 'ping',         processing: 'external' }   // → the target address itself
{ id: 'ai-code-detector', processing: 'mixed' }  // local analysis; external on web/GitHub import
```

42 minus 4 leaves 38 with `undefined`, which `ToolLayout` collapses to `local` in one line:

```ts
const processingMode = computed(() => tool.value?.processing || 'local')
const usesExternalService = computed(() => processingMode.value === 'external')
const hasOptionalExternalService = computed(() => processingMode.value === 'mixed')
```

Then the badge:

```html
<p class="text-xs ..." :class="usesExternalService || hasOptionalExternalService
     ? 'bg-amber-50 ... text-amber-700' : 'bg-green-50 ... text-green-700'">
  <span class="w-2 h-2 rounded-full" :class="usesExternalService || hasOptionalExternalService
        ? 'bg-amber-500' : 'bg-green-500 animate-pulse'"></span>
  {{ usesExternalService ? '包含外部请求 · 请注意隐私'
   : hasOptionalExternalService ? '默认本地 · 可选外部请求'
   : '本地处理 · 隐私优先' }}
</p>
```

Three states, three sentences. This is not decoration: when someone is looking at a real JWT or a customer's JSON export, they need to know whether this page sends it anywhere.

**The explanatory paragraph at the bottom comes from the same data**, instead of each tool writing its own:

```html
<h3 class="font-semibold">关于 {{ tool.nameZh }}</h3>
<p>{{ tool.description }}。{{ usesExternalService
     ? '此工具会向第三方服务发送查询请求，请勿输入敏感信息，并以服务返回结果为准。'
     : hasOptionalExternalService
     ? '代码分析在浏览器本地完成；使用网页或 GitHub 导入时会访问对应外部服务，请勿输入敏感信息。'
     : '所有处理均在浏览器本地完成，不会上传到服务器，适合处理敏感数据。' }}</p>
```

All 42 tools share those three sentences, which means **one wrong sentence is wrong on 38 pages at once**. But that risk points the right way: better to get it wrong in one place that can be fixed than to have 42 drifting statements nobody can audit.

**The real constraint here shows up in code review.** Anyone who adds a `fetch()` to a tool without also setting `processing: 'external'` leaves the page showing "local · privacy first" in green. That is the biggest hole in the design — a type can express intent, but not "does this function body make a network call." If the tool count reaches 100, the correct fix is a CI lint: `fetch(` or `XMLHttpRequest` inside `src/tools/*/` while the registry entry is not `external`/`mixed` should fail the build. That check does not exist yet, and it is item one on my list.

## Lazy loading: the home page must not ship CodeMirror

CodeMirror 6 is not lightweight. `basicSetup` alone pulls in `@codemirror/view`, `@codemirror/state`, `@codemirror/commands`, `@codemirror/language`, `@codemirror/autocomplete`, `@codemirror/lint`, `@codemirror/search`. The eight language packs (json, javascript, html, css, markdown, sql, yaml, xml) are not small either. Shipping all of that on the home page would multiply first-paint JS several times over.

The registry forbids this at the type level:

```ts
component: () => Promise<Component>
```

Writing `component: JsonFormatter` (a static import) is a type error, because a component's type is `Component`, not `() => Promise<Component>`. Only `component: () => import(...)` compiles. That is not a sentence in a style guide saying "please lazy load"; it is the compiler.

So the home page loads only the registry (a pure-data 16KB file) and the home component. Click into the JSON formatter and CodeMirror plus the json pack arrive.

`vite.config.ts` adds a second layer with manual chunks:

```ini
build: {
  target: 'esnext',
  rollupOptions: isSsrBuild ? {} : {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        codemirror: [
          '@codemirror/view',
          '@codemirror/state',
          '@codemirror/commands',
          '@codemirror/language'
        ]
      }
    }
  }
}
```

The `isSsrBuild` check is mandatory. During the SSG pass, Rollup's manualChunks interferes with `vite-ssg`'s output, so the SSR pass gets an empty object.

**Language packs are lazy-loaded a second time.** This is the easy detail to miss: even if the component's chunk is loaded on demand, a top-level `import { json } from '@codemirror/lang-json'` inside `JsonFormatter.vue` would still bundle that pack into the chunk. So `CodeEditor.vue` imports them dynamically:

```ts
async function langExt(): Promise<Extension> {
  switch (props.language) {
    case 'json': return (await import('@codemirror/lang-json')).json()
    case 'javascript': return (await import('@codemirror/lang-javascript')).javascript()
    case 'html': return (await import('@codemirror/lang-html')).html()
    case 'css': return (await import('@codemirror/lang-css')).css()
    case 'markdown': return (await import('@codemirror/lang-markdown')).markdown()
    case 'sql': return (await import('@codemirror/lang-sql')).sql()
    case 'yaml': return (await import('@codemirror/lang-yaml')).yaml()
    case 'xml': return (await import('@codemirror/lang-xml')).xml()
    default: return []
  }
}
```

Result: the JWT decoder (plain text boxes, no highlighting needed) loads zero language packs; the JSON page loads only json; the SQL formatter loads only sql. Eight packs become eight independent chunks fetched on demand.

That design has a cost, which the next section covers — it introduces a race.

## ReDoS: the regex tool is the only page a user can break

The regex tester is the most dangerous page in a site like this. It compiles and runs a user-supplied pattern, and regex backtracking is **exponential**.

```
/(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')
```

That line freezes the main thread at around 30 `a`s. At 40, the browser asks whether the page should be stopped. That is ReDoS — Regular expression Denial of Service. On a local toolbox the attacker needs no server: they open the page, lock their own tab, and leave you a one-star review.

The first gate in `regex/processor.ts` is a length ceiling:

```ts
export const MAX_PATTERN_LENGTH = 1000
export const MAX_TEXT_LENGTH = 200_000

if (!pattern) return { isValid: false, error: '请输入正则表达式', matches: [] }
if (pattern.length > MAX_PATTERN_LENGTH) {
  return { isValid: false, error: `正则表达式不能超过 ${MAX_PATTERN_LENGTH} 个字符`, matches: [] }
}
if (text.length > MAX_TEXT_LENGTH) {
  return { isValid: false, error: `测试文本不能超过 ${MAX_TEXT_LENGTH} 个字符`, matches: [] }
}
```

1000-character patterns, 200,000-character subjects. That stops "let me test my regex against a 10MB log" but not the 30-`a` example above, because `(a+)+$` is seven characters.

The real gate is a second, static check for nested quantifiers:

```ts
const NESTED_QUANTIFIER_PATTERN = /\([^)]*(?:[+*]|\{\d+,[^}]*\})[^)]*\)(?:[+*]|\{\d+,[^}]*\})/

if (NESTED_QUANTIFIER_PATTERN.test(pattern)) {
  return { isValid: false, error: '检测到可能造成大量回溯的嵌套量词，请简化表达式', matches: [] }
}
```

Read it piece by piece: `\(` finds an opening paren, `[^)]*` eats anything inside, `(?:[+*]|\{\d+,[^}]*\})` requires **at least one quantifier inside the group** (`+`, `*`, or an unbounded `{n,}`), `[^)]*` eats the rest, `\)` finds the closing paren, and a quantifier follows. In other words: "a group that contains a quantifier, itself quantified." `(a+)+`, `(\w*)*`, `(x{1,})+` all match.

This is a **heuristic, not a complete detector.** It misses at least three cases: nesting two levels deep (`((a+)+)+` matches the first layer, so it is caught, but `(a|aa)+` alternation backtracking is not), patterns that slip past via character classes or non-capturing groups (`(?:a+)+` is caught, but `(a|b)*c` may or may not be dangerous and can produce false positives), and backtracking from `\1` back-references. It chose the conservative point between "catch the common class" and "do not break legitimate patterns."

**Why not a Worker.** The obvious alternative is to run the regex inside a Web Worker and terminate on timeout. That is better, and it costs: a message per keystroke, serializing input and output, managing the Worker lifecycle, and paying copy overhead outside `Transferable`. For a small tool, a static check plus a length ceiling covers 95% of the damage, while a Worker would make live highlighting feel laggy. That trade-off is written into the README's "known limits."

One test detail worth noting. `testRegex` has an easy-to-get-wrong loop in global mode:

```ts
if (flags.includes('g')) {
  let m: RegExpExecArray | null
  const re2 = new RegExp(pattern, flags)
  while ((m = re2.exec(text)) !== null) {
    matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
    if (m[0].length === 0) re2.lastIndex++
    if (matches.length > 1000) break
  }
}
```

Two guards. `if (m[0].length === 0) re2.lastIndex++` handles zero-width matches: `/x*/g` on an empty string matches empty forever, and without advancing `lastIndex` it is an infinite loop. `if (matches.length > 1000) break` is the second gate — even a fast regex like `/a/g` over 200,000 characters produces 200,000 matches, and rendering 200,000 highlight spans freezes the page just as effectively. Capped at 1000, which is plenty and keeps the DOM from exploding.

## TOTP: use RFC 6238's official vectors as the test

The TOTP generator is the tool I most wanted to verify while building this. If the algorithm has a bug, the user gets **the wrong code** and then suspects their account was compromised. That bug costs two orders of magnitude more than "JSON indentation is off."

So it is not verified by "I clicked twice and it looked right." It is verified against the official test vectors in RFC 6238's appendix.

Start with the implementation. A TOTP secret is Base32, so step one is decoding:

```ts
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s=-]/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch)
    if (idx === -1) throw new Error(`无效的 Base32 字符: ${ch}`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Uint8Array.from(out)
}
```

Trace it. Base32 is 5 bits per character, so each character shifts `value` left by 5, ORs in the index, and adds 5 to `bits`. Once 8 bits accumulate, take the top eight (`value >>> (bits - 8)`), mask off the overflow, and subtract 8 from `bits`. Note that `value << 5` is a 32-bit signed operation in JS, but because consumed high bits are dropped immediately, `value` never holds more than 8+5=13 meaningful bits, so it never overflows 32 bits. This is an easy place to write a bug — accumulate into a `Number` and `parseInt` later, and a long secret loses precision.

Then the core:

```ts
export async function totpAt(
  secretB32: string,
  timestampMs: number,
  opts: { digits?: number; period?: number; algo?: TotpAlgo } = {}
): Promise<string> {
  const { digits = 6, period = 30, algo = 'SHA-1' } = opts
  const keyBytes = base32Decode(secretB32)
  const counter = Math.floor(timestampMs / 1000 / period)
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setUint32(4, counter)
  const key = await crypto.subtle.importKey('raw', keyBytes as BufferSource, { name: 'HMAC', hash: algo }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf))
  const offset = sig[sig.length - 1] & 0x0f
  const code = ((sig[offset] & 0x7f) << 24) | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]
  return (code % 10 ** digits).toString().padStart(digits, '0')
}
```

Four key points:

**The time-step counter is a big-endian 8-byte value.** After `new DataView(buf)`, `setUint32(4, counter)` writes only the low four bytes, leaving the high four at zero. The spec requires an 8-byte counter, and the 32-bit part does not overflow for 136 years — writing the low half and letting the high half default to zero is exactly the correct big-endian 64-bit representation.

**Dynamic truncation.** `sig[sig.length - 1] & 0x0f` takes the low four bits of the last byte as an offset (0–15), then reads four bytes from there. That is the RFC 4226 mechanism, deliberately making the truncation point depend on the signature itself.

**The sign bit must be masked.** `(sig[offset] & 0x7f)` cannot be dropped. HMAC output is random, so the top bit is set half the time; without masking, `<< 24` yields a negative 32-bit number, `% 10 ** digits` on a negative is negative, and `toString()` emits a minus sign — the code grows a `-`.

**`crypto.subtle` is asynchronous.** So `totpAt` returns `Promise<string>` and the UI awaits on every tick. This is not an optimization opportunity — `crypto.subtle` only offers async APIs, and a synchronous HMAC-SHA1 means writing SHA-1 yourself: two thousand lines, and more likely to be wrong.

Now, how do you prove it is right? Use the RFC 6238 vectors. The test secret in that table is the ASCII string `12345678901234567890`, whose Base32 form is `GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ`, and `GEZDGNBV` decodes to `[0x31, 0x32, 0x33, 0x34, 0x35]` — the string `"12345"`. The test walks that whole chain:

```ts
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'

it('base32 decode', () => {
  expect(Array.from(base32Decode('GEZDGNBV'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
  expect(Array.from(base32Decode('gezd gnbv-'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
})
it('RFC 6238 SHA-1 vectors (8 digits)', async () => {
  expect(await totpAt(RFC_SECRET, 59 * 1000, { digits: 8 })).toBe('94287082')
  expect(await totpAt(RFC_SECRET, 1111111109 * 1000, { digits: 8 })).toBe('07081804')
  expect(await totpAt(RFC_SECRET, 1234567890 * 1000, { digits: 8 })).toBe('89005924')
})
it('6 digits default', async () => {
  const code = await totpAt(RFC_SECRET, 59 * 1000)
  expect(code).toMatch(/^\d{6}$/)
  expect(code).toBe('287082')
})
```

The second `base32Decode` assertion is my small addition: `'gezd gnbv-'` is the official secret in lowercase, with spaces, and with a trailing dash. When users copy a secret out of Google Authenticator, they often get `gezd gnbv gy3t qojq` — groups of four separated by spaces, sometimes with a trailing `-` (some services use it as padding). `replace(/[\s=-]/g, '')` must eat those, or the user sees "invalid Base32 character: " where the character is a space, and has no idea what happened.

The relationship between `94287082` and `287082` matters too: the last six digits of the 8-digit vector *are* the 6-digit result. That is forced by the spec — `code % 10 ** 6` takes the last six. Asserting both at once incidentally verifies that the modulo step is not reversed.

**The remaining-seconds calculation has a trap too:**

```ts
export function remainingSeconds(timestampMs: number, period = 30): number {
  return period - Math.floor(timestampMs / 1000) % period
}
```

It looks like it should return 1 through 30. The test asserts `remainingSeconds(59 * 1000, 30)` is 1 (59 seconds is 29 seconds into the second 30-second window, so 1 second remains) and `remainingSeconds(60 * 1000, 30)` is 30 (just entered the next window, 30 seconds to go). Both are correct, but if the timestamp lands exactly on a 30-second boundary the formula gives 30, not 0 — which is right, because "30 seconds left" matches user intuition better than "0 seconds left" (a ring progress indicator should be full).

## AES-GCM: pack salt, iv, and ciphertext into one payload

The AES tool's job is narrowly defined: give it some text and a password, get ciphertext you can paste into a chat app and send to yourself. It needs no key management and no user accounts, only correctness.

Correctness requires a fresh salt and iv every time, and the decryptor must know them. So the output cannot be bare ciphertext; it must be a self-contained payload:

```ts
export async function encryptText(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext)
  ))
  const payload = new Uint8Array(salt.length + iv.length + ct.length)
  payload.set(salt, 0)
  payload.set(iv, salt.length)
  payload.set(ct, salt.length + iv.length)
  return toBase64(payload)
}
```

The layout is `salt(16) || iv(12) || ciphertext(...)`, Base64-encoded as a whole. It concatenates bytes instead of wrapping in JSON because JSON inflates by more than 30% and forces a second encoding of binary data in a string; concatenating gives Base64 at about 1.37× the original size, so a short message stays short enough to paste.

**Why a 12-byte iv.** The standard nonce length for AES-GCM is 96 bits. A 16-byte nonce works too (GCM derives through GHASH internally), but that is a compatibility path for existing systems, not the recommended usage. 12 bytes is the only length needing no extra processing.

**Why a 16-byte salt and 150,000 iterations.** The key is not the password; it is `PBKDF2(password, salt, 150000, SHA-256) → AES-256-GCM`:

```ts
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 150000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}
```

150,000 iterations is a modern-browser compromise: slow enough that an offline brute-force attempt costs about 100ms each, fast enough that the user waits under half a second after clicking "encrypt." The salt makes the same password derive different keys on different runs — otherwise identical plaintext and password produce identical ciphertext, and an attacker sees at a glance that "these two messages are the same."

Two parameters deserve explanation. `importKey(..., false, ['deriveKey'])` — the third argument `false` means the key is **non-extractable**, so even with XSS, `exportKey()` cannot recover the raw bytes. Same for `deriveKey(..., false, ['encrypt','decrypt'])`. That is a defense Web Crypto gives you for free.

The decrypt side:

```ts
export async function decryptText(payloadB64: string, password: string): Promise<string> {
  const payload = fromBase64(payloadB64.trim())
  if (payload.length < 29) throw new Error('payload too short')
  const salt = payload.slice(0, 16)
  const iv = payload.slice(16, 28)
  const ct = payload.slice(28)
  const key = await deriveKey(password, salt)
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, ct as BufferSource)
  return new TextDecoder().decode(pt)
}
```

**There is a boundary I wrote myself that deserves honest flagging**: `if (payload.length < 29)` is too lenient. AES-GCM ciphertext carries a 16-byte authentication tag, so the true minimum for a valid payload is `16 + 12 + 16 = 44`, not 29. Twenty-nine only rejects "obvious garbage" and lets through "short but not garbage." It creates no security problem — `crypto.subtle.decrypt` throws on any malformed input, and the UI turns that into "decryption failed, check the password or ciphertext" — but it is a number computed wrong. The correct check is `< 44`.

The wrong-password path is worth noting too. AES-GCM is authenticated encryption (AEAD): a wrong password, a single flipped byte in the payload, or a truncated iv all raise the same `OperationError`. That is by design — GCM will not tell you "the password is wrong" versus "the data was tampered with," because distinguishing the two is itself a leak. So the UI can only show a vague message, which is exactly what it should show.

## JWT: decoding is not verification

There is one mistake 99% of JWT decoders make: display the JSON from the Base64URL segments and let users believe "this token is valid."

No. **Decoding only proves it is valid Base64URL-encoded JSON. It proves nothing about the signature.**

`jwt-decoder/processor.ts` decodes plainly:

```ts
function b64urlDecode(str: string): string {
  const pad = str.length % 4
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + (pad ? '='.repeat(4 - pad) : '')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}
```

Three details. First, Base64URL substitutes `-` and `_` for `+` and `/`, and `atob` needs the originals. Second, Base64URL usually drops the `=` padding while `atob` requires the length to be a multiple of four, so it is restored by `str.length % 4`. Third, `fatal: true` on the `TextDecoder` matters — the default replaces invalid UTF-8 with `�` silently, so binary garbage "decodes" into a string of replacement characters and then `JSON.parse` reports a bewildering error. `fatal: true` throws immediately, and the message gets closer to the real cause.

Then `decodeJwt` translates `iat` and `exp` into readable times:

```ts
const issuedAt = typeof payload.iat === 'number' && Number.isFinite(payload.iat)
  ? new Date(payload.iat * 1000).toLocaleString() : undefined
const expiration = typeof payload.exp === 'number' && Number.isFinite(payload.exp)
  ? new Date(payload.exp * 1000).toLocaleString() : undefined
```

Neither check can be dropped. The JWT payload is user-controlled JSON: `exp` might be the string `"1234567890"` (many hand-rolled tokens do this), or `null`, or `1e400` (which parses to `Infinity`). `new Date(Infinity * 1000)` is `Invalid Date`, whose `toLocaleString()` returns the literal `"Invalid Date"` — which appears on the page and looks like a crash.

**The interesting part is verification**, because it solves both "can this be verified" and "how do you compare safely":

```ts
const HS_ALGOS: Record<string, 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
  HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512'
}

export async function verifyJwtHs(token: string, secret: string): Promise<{ verified: boolean; error?: string }> {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return { verified: false, error: 'JWT 格式错误' }
  let header: any
  try { header = JSON.parse(b64urlDecode(parts[0])) } catch (e: any) { return { verified: false, error: e.message } }
  const algo = HS_ALGOS[header?.alg]
  if (!algo) return { verified: false, error: `不支持的算法: ${header?.alg}（此处仅支持 HS256/HS384/HS512 对称密钥验证）` }
  if (!secret) return { verified: false, error: '请输入密钥' }
  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: algo }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${parts[0]}.${parts[1]}`))
    const computed = b64urlEncode(new Uint8Array(sig))
    if (computed.length !== parts[2].length) return { verified: false }
    let diff = 0
    for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ parts[2].charCodeAt(i)
    return diff === 0 ? { verified: true } : { verified: false }
  } catch (e: any) {
    return { verified: false, error: e.message }
  }
}
```

**An allowlist, not a blocklist.** `HS_ALGOS[header.alg]` accepts exactly three keys. That blocks the well-known `alg: "none"` attack (attacker sets alg to none and leaves the signature empty, and some libraries skip verification) as well as alg confusion (rewrite RS256 as HS256 and use the public key as the HMAC secret). Looking up a table means any unlisted `alg` fails immediately, `none` included.

**The signature input is `header.payload`, not the whole token.** The order of `${parts[0]}.${parts[1]}` matters: the JWT signature covers the "header dot payload" bytes without the third segment. Getting the concatenation wrong (say, appending a trailing dot) produces a result that never matches.

**Comparison uses XOR accumulation, not `===`.** That is the classic timing-attack defense:

```ts
let diff = 0
for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ parts[2].charCodeAt(i)
return diff === 0
```

`===` returns at the first difference, so comparison time leaks "the first N characters matched." In theory an attacker who can measure microsecond differences can recover the signature one character at a time. `diff |=` guarantees the loop runs to completion **no matter where or how many characters differ**, so the time is constant.

Checking lengths first with `if (computed.length !== parts[2].length) return { verified: false }` is a supporting guard: different lengths always fail, the early return is correct, and it avoids out-of-bounds access.

Mounting a real timing attack from a browser is extremely hard (network jitter dwarfs microsecond deltas), but this is a page where people go to **learn how JWT verification works.** Showing the correct pattern is more valuable than showing one that "works but has a theoretical flaw" — readers will copy it.

## Base64: three checks, in order

Base64 looks like the simplest tool: `btoa` / `atob`, one line each. But `atob` has two traps.

Trap one: it only accepts Latin-1. `btoa('中文')` throws `InvalidCharacterError`, because `btoa`'s input must be a string whose characters are each 0–255.

Trap two: it is very permissive. `atob` ignores illegal characters, accepts wrong padding, and in some implementations parses "plausible-looking" garbage.

So encoding goes through `TextEncoder` first:

```ts
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}
```

`TextEncoder` turns the string into UTF-8 bytes (a CJK character is 3 bytes, an emoji 4), each byte goes into a Latin-1 string, and `btoa` takes it. That is the standard browser path from Unicode to Base64.

Decoding is much stricter, with three checks:

```ts
export function decodeBase64(input: string): { text: string; error?: string } {
  const s = input.trim().replace(/\s+/g, '')
  try {
    if (!s || s.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Base64 格式错误')
    const bin = atob(s)
    const bytes = Uint8Array.from(bin, char => char.charCodeAt(0))
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch (e: any) { return { text: '', error: 'Base64 格式错误: ' + e.message } }
}
```

Check one: `s.length % 4 === 1`. Base64 uses four characters to represent three bytes, so the length modulo four can only be 0, 2, or 3 (1 is impossible — one leftover character carries fewer than 6 bits). This catches "a few characters did not get copied."

Check two: `/^[A-Za-z0-9+/]*={0,2}$/`. Only the standard alphabet plus at most two trailing pad characters. That rejects newlines, spaces, URL-safe `-`/`_` (a different encoding needing conversion first), and `=` in the middle.

Check three: `new TextDecoder('utf-8', { fatal: true })`. **This is the one most easily omitted.** Perfectly valid Base64 can decode to invalid UTF-8 bytes — `atob('//8=')` yields two `0xFF` bytes, which is not a string. Without `fatal: true` you get `"\uFFFD\uFFFD"`, and the user copies that away believing their data was corrupted. With it, the message is "invalid Base64," and the user knows the input is wrong.

**Why strip all `\s+`.** Base64 copied from email, a terminal, or a log often carries soft line breaks (one `\n` every 76 characters, the MIME rule). `replace(/\s+/g, '')` makes paste-and-go work, a pure experience improvement with no correctness cost.

`isValidBase64` is the same logic in "judge without returning data" form, for live validity hints in the UI. It duplicates `decodeBase64`, deliberately: extracting a shared helper would add indirection to both sides for eight lines of logic that will never change. A concrete instance of "three duplicated lines beat a premature abstraction."

## CIDR: bitwise math, prefix boundaries, and /31

The CIDR calculator looks like pure arithmetic, but it has three real traps.

The implementation:

```ts
function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0
}
function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

export function calcCidr(input: string): CidrResult {
  const m = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/)
  if (!m) return { valid: false, error: '格式应为 192.168.1.0/24' }
  const ip = m[1], prefix = parseInt(m[2], 10)
  if (prefix < 0 || prefix > 32) return { valid: false, error: '前缀长度 0-32' }
  const octs = ip.split('.').map(Number)
  if (octs.some(o => o < 0 || o > 255 || isNaN(o))) return { valid: false, error: 'IP 非法' }
  const ipInt = ipToInt(ip)
  const maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
  const networkInt = ipInt & maskInt
  const broadcastInt = networkInt | (~maskInt >>> 0)
  const total = Math.pow(2, 32 - prefix)
  const usable = prefix >= 31 ? total : total - 2
  return {
    valid: true,
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    first: total > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
    last: total > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
    total, usable, mask: intToIp(maskInt), cidr: `${intToIp(networkInt)}/${prefix}`
  }
}
```

**Trap one: `>>> 0` cannot be dropped.** JS bitwise operations are 32-bit **signed**. `192.168.1.1` as an integer is `0xC0A80101`, whose top bit is set, so in JS it is the **negative** number `-1062731519`. Without `>>> 0`, `& maskInt` and `| ~maskInt` produce results with the sign bit, and although `>>>` inside `intToIp` can rescue the final output, intermediate arithmetic like `networkInt + 1` goes wrong on negatives. This single line is the most common bug source in calculators of this kind.

**Trap two: `prefix === 0` is special.** `0xFFFFFFFF << 32` in JS is not "all zeros" but `<< 0` — the shift amount is taken modulo 32. So a `/0` mask becomes all ones and a `/0` network address becomes `255.255.255.255`. It needs an explicit special case.

**Trap three: `/31` and `/32` have no network or broadcast address.** Textbooks say "subtract two for usable addresses," and that rule holds for `/24` and looser. `/31` is a point-to-point link (RFC 3021) where both addresses are usable, and `/32` is a single-host route with one usable address. Hence:

```ts
const usable = prefix >= 31 ? total : total - 2
```

and the "first/last usable address" values change accordingly:

```
first: total > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
last: total > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
```

A calculator that skips these two cases tells you "usable addresses: -1" or "0" for `10.0.0.0/31`. When you are configuring a point-to-point VPN link, that makes you question your sanity.

**The tests cover exactly one case.** `cidr/processor.test.ts` is 294 bytes and its entire content is:

```ts
describe('cidr', () => {
  it('calc /24', () => {
    const r = calcCidr('192.168.1.0/24')
    expect(r.valid).toBe(true)
    expect(r.network).toBe('192.168.1.0')
    expect(r.broadcast).toBe('192.168.1.255')
  })
})
```

It verifies the most ordinary path, and none of the three traps above: `/0`, `/31`, `/32`, `0.0.0.0/0`, `255.255.255.255/32` are all untested. This is the thinnest test coverage in the project; those three special cases were found by reading the code, not by a failing test. It is called out again under "known limits."

## DNS over HTTPS: what a browser can and cannot do

The only feasible way to query DNS from a browser is DNS over HTTPS: wrap the query in an HTTPS request to a resolver that speaks DoH. Cloudflare's endpoint accepts JSON:

```ts
export async function queryDns(
  domainInput: string,
  recordType: DnsRecordType,
  signal?: AbortSignal
): Promise<DnsResult> {
  const domain = normalizeDomain(domainInput)
  if (!isValidDomain(domain)) return { valid: false, error: '请输入有效的域名，例如 example.com', answers: [] }
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${TYPE_CODES[recordType]}`
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/dns-json' },
      signal,
      cache: 'no-store'
    })
    if (!response.ok) return { valid: false, error: `DNS 服务返回 HTTP ${response.status}`, answers: [] }
    const data = await response.json() as { Status?: number; Answer?: DnsAnswer[]; Authority?: DnsAnswer[] }
    return {
      valid: true,
      status: data.Status,
      answers: data.Answer || data.Authority || [],
      canonicalName: data.Answer?.find(a => a.type === TYPE_CODES.CNAME)?.data,
      queriedAt: Date.now()
    }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'DNS 查询失败', answers: [] }
  }
}
```

Four details:

`accept: 'application/dns-json'` is the switch that makes this endpoint return JSON instead of a binary DNS message. Without it you get an `application/dns-message` stream and have to parse the DNS protocol yourself — a different article.

Passing `signal` through is mandatory. A DNS query can hang for a long time; if the user navigates away or edits the input, the old request should be cancelled by `AbortController`. The UI aborts the previous request before each new one, keeping only the latest.

`data.Answer || data.Authority` handles NXDOMAIN and "No Answer." Many domains return an empty `Answer` for `MX`, with the real information in an `Authority` SOA record ("this domain exists but has no MX"). Reading only `Answer` shows "no results" and makes the user think the query failed.

`cache: 'no-store'` exists because "I just changed my DNS record, let me check if it propagated" is the high-frequency scenario. Browser caching for five minutes makes the tool look broken.

**Domain validation is the most interesting part here:**

```ts
export function normalizeDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].replace(/\.$/, '')
}

export function isValidDomain(input: string): boolean {
  const domain = normalizeDomain(input)
  return domain.length > 0 && domain.length <= 253 &&
    !domain.includes('..') &&
    domain.split('.').every(label =>
      label.length > 0 && label.length <= 63 &&
      /^[a-z0-9-]+$/i.test(label) &&
      !label.startsWith('-') && !label.endsWith('-'))
}
```

`normalizeDomain` lets the user paste a full URL (`https://example.com/path?x=1`) and strips the scheme, path, query string, and trailing dot. The trailing dot (`example.com.`) is the DNS "fully qualified" form — technically legal, but it should not be sent to DoH.

`isValidDomain`'s four rules come from the DNS spec: 253 characters total, 63 per label, labels limited to letters, digits, and hyphens, no leading or trailing hyphen. **The real purpose of this validation is to keep arbitrary junk out of `encodeURIComponent`** — although `encodeURIComponent` already prevents injection, a 5,000-character "domain" is still a waste.

**One thing that must be stated honestly**: this tool's `processing` is `external`, because the domain goes to Cloudflare. The page footer says explicitly "this tool sends queries to a third-party service; do not enter sensitive information." You should not use this tool to look up an internal company domain — that query is recorded in Cloudflare's logs. That warning is a technical fact, not a legal disclaimer.

## HTTP Ping: a browser cannot send ICMP, so stop pretending

The feature is labeled "Ping latency test" in the UI, but the code sends an HTTP `HEAD`:

```ts
export async function pingHttp(
  input: string,
  count = 4,
  timeoutMs = 8000,
  onSample?: (sample: PingSample) => void
): Promise<{ url?: string; samples: PingSample[]; error?: string }> {
  const url = normalizeHttpUrl(input)
  if (!url) return { samples: [], error: '请输入有效的 HTTP 或 HTTPS 地址' }
  const samples: PingSample[] = []
  for (let i = 0; i < count; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const started = performance.now()
    try {
      const response = await fetch(url, {
        method: 'HEAD', mode: 'no-cors', cache: 'no-store',
        credentials: 'omit', signal: controller.signal
      })
      const sample = {
        ok: true,
        ms: Math.round(performance.now() - started),
        status: response.type === 'opaque' ? undefined : response.status
      }
      samples.push(sample)
      onSample?.(sample)
    } catch (error) {
      const sample = {
        ok: false,
        ms: Math.round(performance.now() - started),
        error: error instanceof Error && error.name === 'AbortError' ? '请求超时' : '请求失败'
      }
      samples.push(sample)
      onSample?.(sample)
    } finally {
      clearTimeout(timer)
    }
  }
  return { url, samples }
}
```

**Why HEAD rather than GET.** HEAD requests headers only, with no body. Measuring latency does not need content, and firing a GET at a 100MB video file is brute force.

**Why `mode: 'no-cors'`.** Cross-origin requests are blocked by CORS by default. `no-cors` lets the request go out but makes the response "opaque" — you cannot read the status code or body, only that it succeeded. Latency measurement needs timestamps, not status codes, so the trade is acceptable.

**Why handle `response.type === 'opaque'`.** That is the cost of the point above: an opaque response's `status` is always `0`. Without the check, the page shows "status 0," which looks alarming. With it, the page shows "success" without a specific status, which is honest.

**Why `credentials: 'omit'`.** No cookies. There is no reason a latency probe should carry the user's login session, especially when it may be pointing at an arbitrary third-party address the user typed.

**Why `setTimeout` + `AbortController` instead of `AbortSignal.timeout()`.** `AbortSignal.timeout(ms)` is cleaner, but the error it throws has `name === 'TimeoutError'`, whereas `controller.abort()` throws `AbortError`. Both are distinguishable, but the former has incomplete support in older Safari. A manual timer is more compatible; the price is that `finally` must `clearTimeout` — skip it and you leak memory plus a timer that may fire after the page unloads.

**The genuinely honest design decision here is that `icmp` is a separate tool page whose content is mostly an explanation of why it cannot be done.** Its description reads "understand the browser limitations of ICMP Ping, and get local command examples." The page offers Windows/macOS command-line examples so the user can run it locally. There are two ways to fake this: label HTTP latency as "ICMP latency" (the data is wrong), or omit the feature entirely (the user never learns why). DevBox chose a third way: provide the tool, state clearly what it is, and explain why it cannot be the other thing.

## AI code detection: an honest heuristic scorer

This is the tool most likely to become a con in the whole project. "Detect whether code was written by AI" sounds like a problem machine learning can solve; in reality, every detector claiming accuracy is exaggerating.

So the approach is: do not pretend to be accurate, and **lay out the evidence for inspection**.

The scorer starts at a baseline and adds or subtracts per signal:

```ts
let score = 18
const signals: DetectionSignal[] = []

if (commentRatio >= 0.35 && punctuationComments >= 2) {
  score += 18
  signals.push({ label: '解释性注释偏多', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%，且多为完整句子`, impact: 'positive' })
} else if (commentRatio >= 0.2) {
  score += 7
  signals.push({ label: '包含较多注释', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%`, impact: 'positive' })
}
```

Why AND for the two conditions. `commentRatio >= 0.35` is "comments exceed 30% of lines"; `punctuationComments >= 2` is "at least two comment lines end in a period, exclamation mark, or question mark." Either condition alone produces false positives: an SDK example file may be comment-heavy but only contains short phrases like `// init`, and a snippet may have only two comments that are both full sentences. Both together gets close to the "explanatory AI comment" feature — models tend to write complete sentences ("Initialize an empty map for grouped values.") while humans write phrases ("init map").

Then template comments and answer-style text:

```ts
const GENERIC_COMMENT_PATTERN = /\b(?:todo|fixme|generated|auto-generated|implementation|initialize|returns?|parameters?|根据|实现|初始化|返回|参数)\b/i
const AI_BOILERPLATE_PATTERN = /\b(?:here(?:'|’)s|note that|please note|as an ai|certainly|in conclusion|overall)\b|下面是|以下代码|希望这能帮助/i

const genericComments = lines.filter(line => COMMENT_PATTERN.test(line) && GENERIC_COMMENT_PATTERN.test(line)).length
if (genericComments >= 2) {
  score += Math.min(16, genericComments * 4)
  signals.push({ label: '模板化注释', detail: `发现 ${genericComments} 行常见说明式注释`, impact: 'positive' })
}

const boilerplateMatches = code.match(AI_BOILERPLATE_PATTERN) || []
if (boilerplateMatches.length) {
  score += Math.min(15, boilerplateMatches.length * 5)
  signals.push({ label: '回答式文本混入代码', detail: '发现类似解释、总结或对话式措辞', impact: 'positive' })
}
```

The most valuable parts of `AI_BOILERPLATE_PATTERN` are `as an ai`, `certainly`, `here's`, `note that`: phrases a model uses when *answering* rather than writing code. Code containing `// Here's the implementation:` is almost certainly pasted — regardless of whether the source was AI, it shows the comment was not written for a maintainer.

**The `Math.min` ceilings matter.** Without them, code with 20 TODOs would add 80 points and blow past the top. With them, no single signal contributes more than 18, and the total stays explainable — you can point at the score and say "18 points from comment ratio, 12 from line-length regularity," rather than "no idea, the model said so."

Then behavioral features:

```ts
const lineLengthVariance = lengths.length > 1
  ? lengths.reduce((sum, length) => sum + Math.abs(length - averageLineLength), 0) / lengths.length
  : 0

if (lengths.length >= 8 && lineLengthVariance <= 8) {
  score += 12
  signals.push({ label: '行长度规律性较高', detail: '非空代码行长度变化较小，呈现较强格式规律', impact: 'positive' })
}
```

This is a simplified mean absolute deviation rather than a standard deviation. The reason: standard deviation is destroyed by one very long line (a 300-character URL), while mean absolute deviation is more robust to outliers. The threshold of 8 means "each line deviates on average less than 8 characters from the mean" — human code is rarely that tidy, because people write one long expression and then a bare `}`.

Repeated-line detection catches the smell of batch generation:

```ts
const repeatedLines = new Set<string>()
const lineCounts = new Map<string, number>()
nonBlank.forEach(line => {
  const normalized = line.trim().replace(/\s+/g, ' ')
  lineCounts.set(normalized, (lineCounts.get(normalized) || 0) + 1)
})
lineCounts.forEach((count, line) => {
  if (count >= 3 && line.length > 12) repeatedLines.add(line)
})
if (repeatedLines.size >= 2) {
  score += 8
  signals.push({ label: '重复模板片段', detail: `发现 ${repeatedLines.size} 组重复行，可能来自批量生成或复制模板`, impact: 'positive' })
}
```

`normalized` collapses internal whitespace to one space, so two lines with different indentation but identical content count as duplicates. `count >= 3` requires the same line three times — twice is far too common (two places genuinely needing the same initialization). `line.length > 12` excludes `}`, `);`, and `return;`, which necessarily repeat.

**The negative signals are where this scorer earns its honesty:**

```
if (todoCount > 0) {
  score -= 8
  signals.push({ label: '保留 TODO/FIXME', detail: `发现 ${todoCount} 个待办标记，更接近持续迭代中的代码`, impact: 'negative' })
}

if (commentRatio === 0 && functionCount > 0) {
  score -= 5
  signals.push({ label: '没有注释', detail: '样本中未发现注释；这不是人工编写的证明', impact: 'negative' })
}
```

`TODO` subtracts because model output tends toward a "finished" state — it will not leave `// TODO: handle the edge case` behind, because it answered a question that was already asked. Humans leave TODOs when writing real code. It is a weak signal, but the direction is right.

The phrase in the second detail — "this is not proof of human authorship" — is deliberate. It stops users from treating "no comments = human" as a conclusion.

Finally, grading and a neutral fallback signal:

```ts
score = Math.max(0, Math.min(100, Math.round(score)))
const level: AiDetectionResult['level'] = score >= 65 ? 'high' : score >= 38 ? 'medium' : 'low'
const label = level === 'high' ? 'AI 风格倾向较高' : level === 'medium' ? '存在部分 AI 风格特征' : 'AI 风格倾向较低'
signals.push({ label: '仅供参考', detail: '风格特征会受到格式化工具、团队规范和个人习惯影响', impact: 'neutral' })
```

Note the wording: **"AI style tendency," not "AI generated."** That is the line between an honest tool and a dishonest one. A tendency is a description; generation is an assertion. The former follows from code style; the latter does not.

The model-marker block is the place most similar tools turn into rumor:

```ts
const modelMarkers = [
  { name: 'ChatGPT / OpenAI', pattern: /chatgpt|openai|gpt-[234o]/i },
  { name: 'GitHub Copilot', pattern: /github\s+copilot|copilot/i },
  { name: 'Claude / Anthropic', pattern: /claude|anthropic/i },
  { name: 'Gemini / Google AI', pattern: /google\s+gemini|gemini/i },
  { name: 'Cursor', pattern: /cursor\s+(?:ai|editor)|generated\s+by\s+cursor/i },
  { name: 'Codeium / Windsurf', pattern: /codeium|windsurf/i }
]
const modelMarker = modelMarkers.find(marker => marker.pattern.test(code))
const modelHint = modelMarker
  ? `发现"${modelMarker.name}"相关文字，仅代表源码中有来源标记，不能证明由该工具生成`
  : '未发现可验证的模型来源标记，无法判断具体是哪一个 AI'
```

The `cursor` pattern requires `cursor ai`, `cursor editor`, or `generated by cursor`, not bare `cursor`. The reason is practical: `cursor` is a generic database programming term (`db.cursor()`), and a bare match fires on any code touching a database.

The wording of `modelHint` is the point. "Found the word Claude" and "generated by Claude" are separated by a chasm — the word could be:
- a genuine model signature (`// Generated by Claude`)
- a colleague named Claude
- a project name containing Claude
- the user testing this very detector (as the test case above does)

So `modelHint` states explicitly "this only means the source contains a marker; it cannot prove the tool generated it." That is not a disclaimer, it is a factual statement.

## Writing tests for "this cannot be proven"

The biggest risk of the design above is that someone later (including me, three months from now) finds those qualifiers verbose and deletes them.

So the qualifiers became test assertions. This is the practice I am most pleased with in the project:

```ts
it('does not treat TODO markers as proof of human authorship', () => {
  const result = analyzeCode('function run() {\n  // TODO: replace this later\n  return 1\n}\n')
  expect(result.valid).toBe(true)
  expect(result.metrics.todoCount).toBe(1)
  expect(result.signals.some(signal => signal.label === '保留 TODO/FIXME')).toBe(true)
})

it('only reports model names as unverified source markers', () => {
  const result = analyzeCode('// Generated by Claude\nexport function add(a: number, b: number) { return a + b }')
  expect(result.modelHint).toContain('Claude')
  expect(result.modelHint).toContain('不能证明')
})
```

The second test's `expect(result.modelHint).toContain('不能证明')` ("cannot prove") is the best assertion in the project. It turns "the disclaimer must stay" into part of CI. Anyone who changes `modelHint` to "Claude generation detected" breaks the test immediately.

The first test is equally valuable, but it asserts two different things:
- `metrics.todoCount === 1`: TODO counting is correct
- `signals.some(s => s.label === '保留 TODO/FIXME')`: TODO counts as a **negative** signal

The second assertion is the important one. If someone later decides "TODO means human-written, so it should add trust," and flips `score -= 8` to `score += 8`, this test still passes (it only checks that the signal exists). So the test protects *existence*, not *direction*. A stricter version would also assert `impact === 'negative'` and `score < 18` (below baseline). That is the test's shortcoming, and it is on the "if I rewrote it" list.

Now look at short-sample handling, which has two layers:

```ts
const sampleNote = codeLines >= 40
  ? '样本达到 40 行以上，更适合观察代码风格；仍不代表作者身份结论。'
  : `当前只有 ${codeLines} 行代码，样本偏短，结果可靠性有限；建议结合更完整的提交记录。`
```

Plus an earlier hard gate:

```
if (code.trim().length < 20) {
  return {
    valid: false,
    error: '请至少输入 20 个字符的代码，再进行分析',
    score: 0,
    level: 'low',
    label: '代码太短',
    caveat: '样本过短时，任何风格判断都没有统计意义。',
    modelHint,
    sampleNote,
    metrics,
    signals: []
  }
}
```

Twenty characters and forty lines are two different thresholds with two different meanings: under 20 characters there is no judgment at all (`valid: false`), under 40 lines there is a judgment with an explicit downgrade note. The layering is intentional — typing `const x = 1` should produce "too short, not analyzed," not the conclusion "low AI tendency."

The tests cover both layers:

```ts
it('rejects samples that are too short to analyze', () => {
  const result = analyzeCode('const x = 1')
  expect(result.valid).toBe(false)
  expect(result.error).toContain('20')
})
it('returns an explainable result for a code sample', () => {
  const result = analyzeCode(sampleCode())
  expect(result.valid).toBe(true)
  expect(result.score).toBeGreaterThanOrEqual(0)
  expect(result.score).toBeLessThanOrEqual(100)
  expect(result.metrics.codeLines).toBeGreaterThan(0)
  expect(result.signals.length).toBeGreaterThan(0)
  expect(result.sampleNote).toContain('当前只有')
})
```

The last assertion, `expect(result.sampleNote).toContain('当前只有')`, is interesting: it asserts that *this* sample is judged short. `sampleCode()` returns a `groupBy` function of about ten lines, well under forty. If someone later moves the threshold from 40 to 5, the test breaks — reminding them "you changed the semantics; go check the wording."

There is also a size ceiling test:

```ts
it('rejects oversized sources before scoring', () => {
  const result = analyzeCode('x'.repeat(MAX_SOURCE_LENGTH + 1))
  expect(result.valid).toBe(false)
  expect(result.error).toContain('不能超过')
})
```

`MAX_SOURCE_LENGTH = 1_000_000`. The reasoning for that number: GitHub's per-file limit is 100MB, but no real source file exceeds 1MB (auto-generated files aside, and those should not be style-analyzed anyway). A 1MB string takes a few tens of milliseconds to regex-scan in a browser, which is acceptable; 10MB would stutter.

## CodeMirror 6: three Compartments and one race

The editor is the only heavyweight component in the project. The 3,834-byte `CodeEditor.vue` wraps CodeMirror 6 and exposes one `v-model` plus a few props.

CodeMirror 6's architecture is "state plus extensions": extensions are immutable once created, so changing one means reconfiguring. `Compartment` exists for exactly this — it wraps a set of extensions into a replaceable slot.

```ts
let languageCompartment: Compartment
let themeCompartment: Compartment
let readonlyCompartment: Compartment
```

Three slots for the three things that change at runtime: language (the user switches tools), theme (the user toggles dark/light), and read-only (output box versus input box).

At creation the current values go into the slots:

```ts
const extensions: Extension[] = [
  basicSetup,
  languageCompartment.of(language),
  updateListener,
  EditorView.lineWrapping,
  themeCompartment.of(themeExt()),
  readonlyCompartment.of(EditorState.readOnly.of(props.readonly)),
]
if (props.placeholder) extensions.push(cmPlaceholder(props.placeholder))
const state = EditorState.create({ doc: props.modelValue, extensions })
view = new EditorView({ state, parent: editorRef.value })
```

`EditorView.lineWrapping` is not in a Compartment because it never changes — soft wrapping is the only correct choice for this kind of tool (horizontal scrolling in an output box is nearly unreadable).

The theme follows the `dark` class on `document.documentElement`, observed with a `MutationObserver`:

```ts
mo = new MutationObserver(() => {
  if (view) view.dispatch({ effects: themeCompartment.reconfigure(themeExt()) })
})
mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
```

`attributeFilter: ['class']` is a performance detail. Without it, the observer fires for **every** attribute change on the element — including `style`, `data-*`, and anything CodeMirror itself adds. With it, only class matters.

**Now the race.** Language packs are imported dynamically, and the user may switch tools before the import finishes. What happens if an `await` comes back and the answer is "you are out of date"?

`createEditor` carries an `editorToken`:

```ts
let editorToken = 0

async function createEditor() {
  if (!editorRef.value) return
  const token = ++editorToken
  const language = await langExt()
  if (token !== editorToken || !editorRef.value) return
  // ...continue creating
}
```

Each call increments the token and remembers its own value; after the `await` it checks "am I still the latest?" If not, it exits silently. Without this gate, rapid language switching could let an earlier import finish later, leaving the SQL editor configured with the json pack — a very hard-to-reproduce bug.

The language watcher has the same gate:

```ts
watch(() => props.language, async () => {
  const token = ++editorToken
  const language = await langExt()
  if (view && token === editorToken) view.dispatch({ effects: languageCompartment.reconfigure(language) })
})
```

**`modelValue` synchronization has a reverse guard:**

```ts
watch(() => props.modelValue, v => {
  if (view && v !== view.state.doc.toString()) {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } })
  }
})
```

The `v !== view.state.doc.toString()` check is mandatory. When the user types: internal editor state changes → `updateListener` emits → parent updates `modelValue` → watcher fires → an unconditional dispatch would "set" what the user just typed and jump the cursor to the start. That is the classic bug in v-model wrappers.

`onBeforeUnmount` does two things: `editorToken++` invalidates any in-flight async operation, `view?.destroy()` frees the DOM and timers CodeMirror holds, `mo?.disconnect()` tears down the observer. Skipping any of them leaks memory over an SPA session.

## Theme flash: decide before the bundle runs

Every dark-mode-capable site hits this: the user prefers dark → page loads → white flash → JS runs → dark. That flash (FOUC, Flash of Unstyled Content) is painful at night.

The root cause is execution order: CSS blocks rendering, but `<script type="module">` is deferred, so it runs after HTML parsing. The theme class always arrives after first paint.

The fix is a synchronous inline script in `<head>`, before any CSS applies:

```
(function () {
  try {
    var t = localStorage.getItem('theme')
    var dark = t === 'dark' || ((!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (dark) document.documentElement.classList.add('dark')
  } catch (e) {}
})()
```

That is `public/theme-init.js` (265 bytes), included by `index.html` with a plain `<script>` (not a module), so it is **blocking** — nothing paints until it finishes.

Every step of the three-line logic has a reason:

`var t = localStorage.getItem('theme')` reads the raw string without `JSON.parse`. This is the one code path in the project that cannot fail, and `JSON.parse` throws on a corrupted value. Storing a raw string means reading it involves only `===`, which never throws.

`t === 'dark'` handles an explicit dark preference. `(!t || t === 'system') && matchMedia(...)` handles "never set" plus "following the system." Both fold into one `dark` boolean.

`try/catch` is mandatory. In Safari private mode, under some enterprise policies, and inside cross-origin iframes, accessing `localStorage` itself throws `SecurityError`. If that throws uncaught, the whole script stops — not just the theme, but everything after it. An empty `catch (e) {}` is correct here, because the failure mode is "fall back to light."

**The store side must agree**, or you end up with two implementations:

```ts
export const useSettingsStore = defineStore('settings', () => {
  const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
  const theme = ref<'light'|'dark'|'system'>(
    storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system' ? storedTheme : 'system'
  )
  function applyTheme() {
    if (typeof window === 'undefined') return
    const isDark = theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('theme', theme.value)
  }
  watch(theme, applyTheme, { immediate: true })
  // ...
})
```

Note the three-value validation of `storedTheme`: only `'light'`, `'dark'`, `'system'` are accepted, and anything else (including a value the user edited by hand) falls back to `'system'`. That matches `theme-init.js`, which treats "no valid preference" as "follow the system."

Both `typeof window !== 'undefined'` checks exist for SSG. `vite-ssg` executes components in Node, where there is no `window` and no `localStorage`; without the checks, the build crashes.

`watch(theme, applyTheme, { immediate: true })` runs once during store initialization, aligning the store with the class `theme-init.js` already set.

System `prefers-color-scheme` changes must be observed too:

```ts
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') applyTheme()
  })
}
```

`if (theme.value === 'system')` is the key: a user who explicitly chose light should not follow the system into dark.

**There is a real small bug worth admitting here**: `applyTheme()` unconditionally calls `localStorage.setItem('theme', theme.value)`, including on the first execution from `immediate: true`. A user who has never set a theme gets `'system'` written on their first visit. Functionally harmless (`'system'` is the default), but it erases the information "the user has never expressed a preference." If a "choose your theme" first-visit prompt were ever added, that distinction would be gone. The correct fix is to skip persistence on the first run.

## Search: focus, aria, and a Tab trap

The search dialog (Ctrl+K) is only 5,237 bytes, but it contains nearly everything an accessible dialog needs.

**Save focus on open, return it on close:**

```ts
let restoreFocus: HTMLElement | null = null

watch(() => props.open, async v => {
  document.body.classList.toggle('overflow-hidden', v)
  if (v) {
    restoreFocus = document.activeElement as HTMLElement | null
    query.value = ''
    selected.value = 0
    await nextTick()
    inputRef.value?.focus()
  } else {
    restoreFocus?.focus()
  }
})
```

`document.activeElement` is recorded before opening and focused again after closing. Keyboard users who press Esc stay where they were, instead of being dumped at the top of the page.

`focus()` waits for `await nextTick()` because the dialog renders with `v-if`, so the element does not exist in the same tick. `nextTick` waits for the DOM update.

`overflow-hidden` on `body` prevents background scrolling. `onBeforeUnmount` must remove it too — otherwise, if the component unmounts while open (say, during a route change), the entire page becomes permanently unscrollable. That is a very common bug.

**Keyboard navigation:**

```ts
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); selected.value = Math.min(selected.value + 1, results.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selected.value = Math.max(0, selected.value - 1) }
  else if (e.key === 'Enter') { const t = results.value[selected.value]; if (t) go(t.path) }
  else if (e.key === 'Escape') { close() }
  else if (e.key === 'Tab') {
    const focusables = [...(dialogRef.value?.querySelectorAll<HTMLElement>('button, input') ?? [])]
      .filter(el => !el.hasAttribute('disabled'))
    if (focusables.length) {
      const index = focusables.indexOf(document.activeElement as HTMLElement)
      const next = focusables[(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length]
      e.preventDefault()
      next.focus()
    }
  }
}
```

`e.preventDefault()` on the arrow keys is mandatory — without it, the caret in the input moves and pressing ↓ to select the next result just jumps to the end of the text.

**The Tab trap** is the most refined part. `(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length` handles two things at once: cycling forward/backward, and landing correctly when the current focus is not in the list (`index === -1` gives `0` for the first item and `n - 2` for the second-to-last). Written with `if` boundary checks instead, the code would be three times longer and easier to get wrong.

`e.preventDefault(); next.focus()` together keep focus cycling inside the dialog and never escaping to the background page. That is the **practical requirement** of `aria-modal="true"` — the modal semantic claims "the background is not interactive," and letting Tab escape would be lying to assistive technology.

**aria completeness:**

```html
<div ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" ...>
  <span id="search-dialog-title" class="sr-only">搜索工具</span>
  <input ref="inputRef" v-model="query" role="combobox" aria-controls="search-results"
         :aria-activedescendant="results[selected]?.id ? `search-${results[selected].id}` : undefined"
         aria-autocomplete="list" ... />
  <kbd>ESC</kbd>
  ...
  <div id="search-results" role="listbox" ...>
    <button v-for="(t,i) in results" :key="t.id" :id="`search-${t.id}`" role="option"
            :aria-selected="i===selected" ...>
```

Four roles do their jobs: `dialog` + `aria-modal` declare a modal; `combobox` + `aria-autocomplete="list"` declare that the input filters a list; `listbox`/`option` declare the result list; `aria-activedescendant` links "currently selected" back to the input — so a screen reader announces "JSON formatter selected" while focus stays in the input.

Using `aria-activedescendant` instead of moving focus to the option is the standard combobox approach. Moving focus would blur the input and prevent further typing.

`aria-selected="i===selected"` keeps visual highlight and semantics in sync. The visual treatment is a left gradient bar plus a background color, both purely decorative; semantics come entirely from `aria-selected`.

**Result cap**: `searchTools(query.value).slice(0, 12)`. Twelve is an empirical value — what fits on one screen. Loading 42 results does not help search, it just makes the user scroll.

The loop `watch(results, value => { selected.value = Math.min(selected.value, Math.max(0, value.length - 1)) })` handles "the user selected item 10, then kept typing until only 3 results remain." Without clamping, `selected` points at a nonexistent index, Enter does nothing, and the feature looks broken.

## localStorage breaks, so validate every read

`localStorage` serves four purposes here: theme, favorites, recents, and possibly settings later. It looks like "a simple key-value store"; it is actually an **external input that can be arbitrarily corrupted.**

Four reasons: users can edit it in DevTools; other pages on the same origin (a legacy subpath, say) can write the same keys; private-mode quota can be zero and `setItem` throws `QuotaExceededError`; and older code in an SPA may have written a different shape.

So every read and write goes through a wrapper:

```ts
export function safeGet<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const v = localStorage.getItem(key)
    if (!v) return fallback
    const parsed: unknown = JSON.parse(v)
    return isValid && !isValid(parsed) ? fallback : parsed as T
  } catch {
    return fallback
  }
}
export function safeSet(key: string, val: unknown) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(val)) } catch { void 0 }
}
export function safeRemove(key: string) {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key) } catch { void 0 }
}
```

`safeGet`'s third parameter is a type guard, and that is the key design. It is not a plain assertion but a **runtime validator**:

```ts
const favorites = ref<string[]>(
  safeGet<string[]>('favorites', [], (value): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string')
  )
)
```

`Array.isArray(value) && value.every(item => typeof item === 'string')` checks two levels: the outer value is an array, and every element is a string. Checking only the outer level is insufficient — if storage holds `[1, 2, 3]`, then `favorites.value.includes('json-formatter')` always returns `false`, favorites silently stop working, and the user sees the toggle respond but loses the favorite on reload.

The `value is string[]` return annotation **narrows the type** after the check passes: `safeGet` returns `string[]` rather than `unknown`. That is the value of a type guard over an assertion — an assertion is you telling the compiler "trust me"; a guard is the function proving it.

`catch { return fallback }` covers `JSON.parse` throwing. A corrupted value (say `"favorites": "not json"`) makes `JSON.parse` throw; without the catch, store initialization fails and the page goes blank.

`catch { void 0 }` in `safeSet` deliberately swallows the error. `setItem` throws `QuotaExceededError` when quota is full, and "favoriting a tool when quota is full" should not crash the page — the worst case is that this favorite is not saved. `void 0` tells the linter "I know I swallowed it, on purpose."

**Capacity deserves its own note.** `localStorage` is typically 5MB (counted in UTF-16 characters, so 2.5MB usable). Recents cap at 20 ids:

```ts
function push(id: string) {
  recent.value = [id, ...recent.value.filter(x => x !== id)].slice(0, 20)
}
```

`[id, ...filter(x => x !== id)]` removes the old position and puts the id first, so revisiting a tool never duplicates it. `.slice(0, 20)` truncates to 20 entries. Twenty short strings is about 400 bytes, nowhere near quota.

The benefit is that "recents" means the right thing: not "the last 20 visits" but "the last 20 distinct tools." A user who keeps formatting JSON keeps it in slot one instead of filling all 20 positions with it.

**Why not IndexedDB.** The design document proposed IndexedDB for "tool history" (saving every formatted input). That feature was never built, for a very concrete reason: every tool here handles sensitive data (JWTs, passwords, customer JSON), and persisting input to disk is the **single worst feature** this project could add. One "save history" checkbox could leave a token sitting on disk for three months. localStorage holds only tool ids and a theme, never user input — a security decision, not a capacity decision.

## CSP: `connect-src https:` is the one compromise

A purely local toolbox should have a strict CSP. `public/_headers` reads:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Line by line, each with a concrete reason:

`X-Frame-Options: DENY` and CSP's `frame-ancestors 'none'` are the same thing in two generations. The former serves old browsers, the latter is the current standard. Both are written because it costs nothing.

`X-Content-Type-Options: nosniff` stops browsers from "guessing" content types. Without it, an uploaded `.txt` containing HTML can, in some cases, execute as HTML.

`Referrer-Policy: strict-origin-when-cross-origin` guarantees that outbound navigation sends only the origin (`https://devbox.example`), never the full path. A tool page URL can contain a search term, which should not leak.

`Permissions-Policy` closes camera, microphone, and geolocation entirely. The site needs none of them, and explicit closure prevents a future third-party script from requesting them.

`script-src 'self'` has no `'unsafe-inline'` and no `'unsafe-eval'`. That bans inline `<script>` and `eval`. **It directly shapes the architecture**: `theme-init.js` must be a separate file rather than an inline script (the reason in the earlier section), and neither CodeMirror nor the Vue runtime may rely on `eval` (Vue's runtime-compiler build needs `eval`, so only precompiled SFCs are usable).

The `'unsafe-inline'` in `style-src 'self' 'unsafe-inline'` is mandatory. Vue's `<style scoped>` injects `<style>` tags at runtime, and CodeMirror sets inline styles via `element.style` (cursor position, line height). Without this exemption the whole editor loses its styling. It is an explicit trade: style injection risk (CSS injection) is far below script injection, and this site never renders user-supplied HTML (the Markdown preview goes through DOMPurify).

`img-src 'self' data: blob:` serves three purposes. `data:` is the Base64 image tool's preview (`data:image/png;base64,...`); `blob:` is image compression and EXIF preview (`URL.createObjectURL(file)`); `'self'` is the favicon.

`font-src 'self' data:` allows fonts inlined as data URLs, which some bundling strategies need.

`worker-src 'self' blob:` is reserved for moving heavy work into a Worker later (`new Worker(URL.createObjectURL(new Blob([...])))` needs `blob:`). Nothing uses it yet, but adding it costs no safety.

**`connect-src 'self' https:` is the one obvious compromise.** Strictly speaking the site needs three domains: `cloudflare-dns.com` (DoH), `ipwho.is` (IP lookup), and the user-supplied target (HTTP Ping).

Why not hardcode them?

Because the third cannot be hardcoded. HTTP Ping's entire purpose is "measure any address the user enters." With only three permitted domains, that tool is dead.

A scheme-level grant of `https:` means "any HTTPS address is reachable." It is better than `*` (which at least bans HTTP and `ws:`), worse than an allowlist (after XSS, data can be exfiltrated to any HTTPS endpoint).

One middle path: give the Ping tool its own page with a stricter CSP — but static hosting (Cloudflare Pages) matches `_headers` by path, not query string, and Ping's path is the fixed `/tools/ping`. It is theoretically possible to write `connect-src *` for that path and a strict version everywhere else. **That improvement was not made. It is laziness, not impossibility.**

Worth being precise about: relaxing `connect-src` only affects "where scripts can send requests." It does not touch `script-src 'self'` — an attacker can exfiltrate data, but cannot load external scripts. So the worst case is data exfiltration, not code execution. That distinction matters when assessing risk.

## SSG and PWA: two cache systems must not fight

The project does both static generation (SSG) and PWA, and both concern caching while their logic runs in opposite directions.

**SSG's goal is "every URL has real HTML."** `vite-ssg` renders each route to static HTML at build time, which gives:
- crawlers complete content without executing JS
- a faster first paint (the HTML already contains content)
- per-page `<title>` and meta

`generate-sitemap.mjs` works with SSG: it lists every path, matching one-to-one with the files SSG actually emits. That one-to-one correspondence is what makes the sitemap trustworthy — list a path SSG never generated and search engines hit a 404, which lowers trust rather than raising it.

**PWA's goal is "works offline."** `VitePWA` registers a service worker that caches build output:

```
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'theme-init.js', 'icons/*.png'],
  manifest: {
    name: 'DevBox · 程序员工具箱',
    short_name: 'DevBox',
    description: '快速、免费、隐私优先的程序员在线工具箱，包含开发、编码、安全、网络诊断和 AI 代码风格分析工具',
    theme_color: '#0f172a',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' as any }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
  }
})
```

`registerType: 'autoUpdate'` means that after a new deployment, the user's next visit picks up the new version. The price is that **a user can be updated mid-session** — if a new version changes a chunk hash, a page still loading old code cannot fetch the old chunk. Workbox's default strategy of clearing old caches after activation avoids this in most cases, but not absolutely.

`html` in `globPatterns` is critical. Every `/tools/json-formatter/index.html` SSG emits must be cached, or offline visits to tool pages 404. But that also means **HTML is cached** — offline, the user sees the previous HTML snapshot, which may not match the current registry. For a toolbox that is acceptable (the tools live in JS), but it is a real boundary.

The `as any` on `purpose: 'any maskable'` is a type patch. `vite-plugin-pwa`'s types allow only `'any' | 'maskable' | 'monochrome'`, while the spec permits space-separated multiple values. The `as any` bypasses the library's type limitation, not the browser.

**The place where two cache systems fight hardest is update timing.** Say the user opened the page last week and the SW cached old chunks. A new version ships this week. Next open:
1. HTML comes from the network (`index.html` is network-first, or cached but replaced on the next update)
2. The HTML references new chunk hashes
3. New chunks are not cached, so they come from the network
4. Success

That flow works because chunk filenames carry hashes — a new HTML never references an old chunk. But if HTML were cached forever, the user would see the old version indefinitely. Workbox defaults `index.html` to NetworkFirst, which sidesteps the problem.

**A concrete small deliberate choice**: `includeAssets` lists `theme-init.js` explicitly. The file is not in Vite's module graph (it is copied verbatim from `public/`), so `globPatterns` (`**/*.js`) would include it automatically. Listing it explicitly makes the intent clear: this file must be available offline, because it is the first gate against the flash.

`icons/icon-512x512.png` appears twice, once with `purpose: 'any'` and once with `purpose: 'maskable'`. That is an Android requirement: a maskable icon is cropped to a circle, squircle, or teardrop, and its content must leave a safe margin. Using one file for both purposes is not ideal (maskable wants a smaller content ratio), but it is the "ship it first" choice — the correct approach is a dedicated maskable icon with 20% padding on all sides.

## Known limits: an honest list

At this point, the list of what the project cannot do belongs on the record. Every item is a trade-off I made while writing the code, not an oversight.

**One: AI detection cannot prove authorship.** It is a style heuristic. Short samples, formatted code, team templates, or human imitation of AI style can all be misjudged. Model names in `modelHint` are unverified string matches. This is the tool's most important boundary, and the wording is locked by tests.

**Two: HTTP Ping is not ICMP Ping.** It measures HTTP request round-trip time, affected by CORS, CDN, caching, firewalls, and HTTP service state. A server that disables HEAD will "time out" even if ICMP works fine. The page title "Ping latency test" is imprecise, but "HTTP HEAD round-trip measurement" is unsearchable.

**Three: ReDoS protection is incomplete.** The nested-quantifier check is a regex-level heuristic; it cannot catch alternation backtracking (`(a|aa)+`), back-references, or multi-level nesting. The length ceilings of 1000/200000 constrain scale, not structure. The real fix is a Web Worker with a timeout and terminate, at the cost of interactivity.

**Four: CIDR test coverage is thin.** `cidr/processor.test.ts` is 294 bytes covering the `/24` happy path. `/0`, `/31`, `/32`, and `255.255.255.255/32` — the cases needing special handling — are untested. Those three special cases were found by reading code, not by tests. IPv6 is not implemented at all.

**Five: CSP's `connect-src https:` is too broad.** Any HTTPS address is reachable. Per-path `_headers` would improve it; that was not done.

**Six: Privacy annotation relies on discipline.** Add a `fetch()` to a tool without setting `processing: 'external'` and the page keeps showing "local." A type cannot express "does this function body make a network call"; that needs CI-level static analysis.

**Seven: The AES minimum-length check is lenient.** `payload.length < 29` should be `< 44` (16 salt + 12 iv + 16 tag). It does not affect security (`decrypt` rejects malformed input), but it is a miscalculated number.

**Eight: Search has no weighting.** Results come in registry order: `json` yields json-formatter, json-viewer, json-diff, then csv-json. That is accidentally reasonable, not deliberately reasonable.

**Nine: No i18n.** Chinese and English names coexist as two fields, not a locale system. A third language would force a change to the `name`/`nameZh` shape.

**Ten: Styles inside single-file components are not shared.** The 42 `.vue` files may each write duplicate button styles. `src/style.css` provides `.btn-primary`, `.btn-ghost`, `.card`, `.icon-chip` and friends, but nothing enforces their use. Style consistency here depends on discipline, not constraint.

**Eleven: A first visit writes the theme to storage.** `applyTheme()` calls `setItem` during the `immediate: true` first run, erasing the "user never expressed a preference" state.

**Twelve: No E2E tests.** All 31 files are processor unit tests. Not one verifies the full path "open the JSON page, type garbage, see the error message." The Playwright regression mentioned in the README was run by hand, not in CI.

The list is not short, but every item is "known, and deliberately accepted." A project that dare not list its limits usually has not thought about where they are.

## If I rewrote it, these five things would change first

In priority order:

**First, add a CI check for privacy annotation.** One lint rule: scan every `.vue` and `.ts` under `src/tools/*/`; if `fetch(`, `XMLHttpRequest`, `navigator.sendBeacon`, or `WebSocket` appears while the registry entry for that tool is not `external`/`mixed`, fail. That is more effective than any document — documents get ignored, CI does not.

**Second, move regex execution into a Worker.** The static check catches 80%; a Worker plus a 1-second timeout catches the other 20%. Implementation notes: the Worker must not import CodeMirror, keeping it dependent only on the processor; messaging uses `postMessage` + `structuredClone`, and since input and output are strings the cost is manageable. Live highlighting smoothness suffers; the compromise is a 300ms debounce before computing.

**Third, complete the CIDR boundary tests.** `/0`, `/1`, `/31`, `/32`, `0.0.0.0/0`, `128.0.0.0/1`, `255.255.255.255/32`, each asserting network address, broadcast address, usable count, and mask. Then add IPv6 using `BigInt` rather than `number`, because 128 bits exceeds JS's 53-bit safe integer range.

**Fourth, split `ToolDefinition` into two layers.** Today "metadata" and "component reference" live together, so importing the registry in Node exposes functions like `() => import(...)`. `generate-sitemap.mjs` only reads `path` and `id` so it never calls them, but that relies on "happens not to be invoked" rather than on structure. The correct split is `tools.meta.ts` (pure data, Node-safe) and `tools.components.ts` (the component map, loaded only in the browser).

**Fifth, fix the first-visit theme write.** Give `applyTheme` a `persist` parameter and pass `false` on the `immediate` run. Ten lines, and the "never chose" state survives.

One more I want to build but cannot design cleanly: **data flow between tools.** For example, seeing a Base64 blob in a JWT payload and jumping to the Base64 decoder with the data attached. That feature is tempting, but it needs a "cross-tool temporary data" channel, and that channel is itself a privacy risk (data passes between pages and may get forgotten in localStorage). So it stays at the bottom of the list.

## Wrap-up: a toolbox's complexity lives in tool number 43

Looking back, none of the 42 tools is an algorithmic challenge. JSON formatting, Base64, JWT decoding, UUID generation, timestamp conversion — each is under 100 lines standing alone.

What actually consumed the time were the things that would explode at tool 43 if left unwritten:

**One registry**, deriving routes, search, categories, favorites, recents, sitemap, and SEO from a single source. Adding a tool is filling in one row, not editing seven files.

**One processor contract**, taking logic out of the framework. Thirty-one test files run in milliseconds because they touch no DOM, no Vue, no `this`.

**One privacy enum**, making "does data leave the browser" part of the type rather than an essay on an About page.

**A set of input ceilings**, keeping untrusted input out of the UI: 1000-character regexes, 200,000-character subjects, one million characters of source, a CIDR prefix from 0 to 32, batch generation from 1 to 100.

**An honest grading scheme**, preserving the distance between "AI style tendency is high" and "AI generated," and locking that distance with tests.

**A capability boundary that does not lie**, with the HTTP Ping page stating it is not ICMP, the AI detection page stating it cannot prove authorship, and the DNS page stating the domain goes to Cloudflare.

Together those are under thirty percent of the code, and they decide whether the project survives tool 43.

If this article has one transferable conclusion, it is this: **when building a collection-style product, design the boundary of the concept "tool" before writing the first tool.** The first three tools can be delivered with hand-written pages, but tool twenty will make you pay for the first nineteen. A ten-line interface definition can save dozens of refactors later — that is not architectural perfectionism, it is making a correct investment in time.

The code is at [github.com/zhoujungis/devtools](https://github.com/zhoujungis/devtools). All 42 tools run locally in the browser, and none of them requires a login.
