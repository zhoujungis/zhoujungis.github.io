> Who this is for: frontend engineers who want to put a genuinely usable product on the edge without being captured by a framework or a server; anyone building small products on Cloudflare Pages Functions and D1 who keeps getting bitten by auth, rate limiting, accounting definitions, and concurrent writes; and anyone who has written a player and then discovered that playback is the easy twenty percent.
> TL;DR: ECHO SPACE is an immersive audio player deployed on Cloudflare Pages. The frontend is dependency-free native HTML/CSS/JS; the backend is Pages Functions plus D1. The hard part is not getting audio to come out. It is four boundaries. Authentication has to fit 10,000 PBKDF2 iterations inside the edge CPU budget. Listening time has to be measured from `currentTime` deltas rather than a timer, or seeking inflates the stats. A single listening session has to collapse into one row, which is the `sessionId` + UPSERT + partial-unique-index trio. And free-mode playlists have to cut a total training duration into song segments, rest segments, and warm-up/stretch phases so that every second adds up exactly. The article walks through seven API routes, four D1 migrations and four tables, and it pins the honest limits — in-isolate rate limiting, legacy history that cannot be precisely de-duplicated, server trust in client-submitted titles — to the files that cause them.
> Reading time around 38 minutes. Level: advanced.

**Contents**

- This is not a player demo
- The topology: static assets, Pages Functions, and D1
- Why the frontend uses no framework and ships no bundle
- Authentication: PBKDF2, a 16-byte salt, and 10,000 iterations
- Sessions: cookie flags, a 30-day lifetime, and probabilistic sweeping
- Rate limiting: an in-isolate map with LRU eviction
- Request body limits: Content-Length is not trusted, streaming is the backstop
- Playback accounting: currentTime deltas, not setInterval
- Session de-duplication: sessionId, UPSERT, and a partial unique index
- Schema migration: adding columns to an old history table without rewriting it
- Aggregation: per-session dedup, a 14-day calendar, and the UTC+14 trap
- Free-mode playlists: turning a training plan into a pure function
- Scheduling rules: three rest models for jump rope, running, and hiking
- The duration index: know how long a track is without downloading it
- The executor: a 250ms tick, stall compensation, and phase transitions
- The silence scene: breathing guidance and a focus timer
- Online audio: a JOOX proxy, temporary URLs, and a five-minute refresh
- Cloud playlists: optimistic locking and rev conflicts
- Security headers and CSP: six policies one page needs
- Checks and tests: Node's built-in test runner plus asset validation
- Known limitations: an honest list
- If I rewrote it, I would change these five things first
- Conclusion: the complexity of an edge app lives in its boundaries

---

## This is not a player demo

Most "music player" projects end up in the same place: one HTML file, one `<audio>` tag, and a script that pulls a playlist from a public endpoint. It makes sound, but it is not a product, because nobody answers six questions:

- A user can play without logging in, so how long did they listen, what did they hear, and where is that stored?
- If they pause, resume, and refresh the page on the same song, how many history rows are left behind?
- If they drag the progress bar forward sixty seconds, do those sixty seconds count as listening time?
- If two tabs save a playlist at once, who overwrites whom?
- "Jump rope for 30 minutes, resting 30 seconds after each song" — who guarantees the plan totals exactly 1800 seconds?
- When the rate limiter is running on ten thousand edge machines, who exactly is it limiting?

ECHO SPACE grew out of those six questions. Its size is modest: a handful of native modules under `public/`, seven handlers under `functions/api/`, and data in four D1 tables. There is no framework, no bundler, no millisecond-scale build output; opening the page is one static HTML request plus a few `/api/*` calls. But the complexity is not in the line count. It is in the boundaries: the authentication CPU budget, the session cookie lifetime, the definition of listening time, the primary key of de-duplication, migration compatibility, and the physical location of the rate limiter.

Here is the thesis up front, and the rest of the article unpacks it:

- Authentication uses PBKDF2-SHA-256 with a random 16-byte salt and **a fixed 10,000 iterations** — not for maximum strength, but to stay under the Pages Functions CPU ceiling.
- A session is a row in `echo_sessions` in D1. The cookie is `HttpOnly; Secure; SameSite=Lax`, valid for thirty days, and expiry is handled by "delete a batch at login plus sweep at a 2% probability on authenticated requests."
- Listening time is **never** accumulated with `setInterval`. It uses real `audio.currentTime` deltas and discards any single delta larger than five seconds.
- Each playback session gets a `sessionId`, writes go through `INSERT ... ON CONFLICT DO UPDATE`, and a partial unique index on `(username, session_id)` folds repeated network retries into a single row.
- The core of free-mode playlists, `buildPlan()`, is a pure function: given track durations and a total number of seconds, it returns a segment array whose seconds sum to exactly the total — something a unit test can pin down.
- Rate limiting is an in-isolate `Map` that can only ever be best-effort. That is written into the README as a known limitation instead of hidden in a comment.

This article ties each of those to a file, a function, and a constant. First, why it is worth writing.

## The topology: static assets, Pages Functions, and D1

ECHO SPACE has exactly three pieces of infrastructure:

```text
Browser
  |
  |-- static assets -----------> Cloudflare Pages
  |                               public/index.html
  |                               public/js/*.js
  |                               public/styles.css
  |                               public/audio/*
  |
  |-- /api/* -------------------> Pages Functions
                                    functions/api/*.js
                                      |
                                      `--> Cloudflare D1: echo-space-db
```

`wrangler.toml` is short, and it is what defines the topology:

```toml
name = "echo-space-run"
compatibility_date = "2026-08-27"
pages_build_output_dir = "./public"

[[d1_databases]]
binding = "DB"
database_name = "echo-space-db"
database_id = "788e722f-9aea-48d2-89ad-f449ed393aa2"
```

`pages_build_output_dir` points at `public/`, so Pages serves that directory as the static site; `binding = "DB"` gives every Function `env.DB`. There is no separate API server, no container, no process to keep alive. That is the appealing part of an edge app, and it is also the part people misjudge.

The misjudgment is thinking "static assets plus Functions" means "no state." The opposite is true: all the state lives in D1, and D1 is a **geographically distributed SQLite**. Everything you know about `INSERT`, `UPDATE`, unique indexes, and transactional batches still applies, but the concurrency model, the latency, and the fact that each invocation is a fresh isolate all shape your API design. Every section below about sessions, rate limiting, de-duplication, and optimistic locking is really answering one question: in an environment with no resident process, where every request may land on a different isolate, how do you write the state correctly?

## Why the frontend uses no framework and ships no bundle

The frontend under `public/` is native HTML/CSS/JS — no React, no Vue, no Vite:

```text
public/
├── index.html          # page skeleton: scene cards, player, login modal, profile
├── styles.css          # dark theme, scene colors, responsive, motion, focus styles
├── free-mode.js        # pure-function free-mode scheduler (unit-testable)
├── tracks-data.js      # scene directory and local track metadata
├── durations-data.js   # precomputed audio duration index
├── _headers            # Pages cache and security response headers
├── audio/              # the actual audio files
└── js/
    ├── main.js         # entry: init, routing, event wiring
    ├── core.js         # global state, audio element, SCENE_META, helpers
    ├── auth.js         # login/register modal and local auth state
    ├── player.js       # play, pause, skip, seek, volume, media keys
    ├── scene.js        # scene switching, list rendering, order, next
    ├── stats.js        # listening-time accounting and session flush
    ├── free-training.js# free-mode executor (250ms tick)
    ├── library.js      # JOOX online search and cloud playlists
    ├── profile.js      # profile page and stats rendering
    ├── timer.js        # silence-scene breathing guide and timer
    ├── views.js        # view transitions and hero sync
    ├── settings.js     # settings page and grouped tabs
    └── dialog.js       # toast, focus trap, background inert
```

The reasons for going framework-free are concrete, not aesthetic:

1. **Two requests to first paint.** One static HTML file plus one CSS response; the rest of the JS is native `import`, which the browser caches and parallelizes. No bundle means no hydration and no "blank screen, then fill in."
2. **Audio playback wants low-level control.** `audio.currentTime`, `timeupdate`, `seeked`, the Media Session API, `sendBeacon` — you want the DOM directly. A framework's reactivity only adds a layer of "when should this sync" overhead here.
3. **Testable pure functions must run without a framework.** The free-mode scheduler lives in `public/free-mode.js` and can be loaded into Node with `vm.runInNewContext`, so it needs no jsdom and no component mounting.

The cost is equally honest: with no component system, "the play button's icon and aria state" tends to scatter across four audio event handlers. The author eventually collapsed it into one function in `player.js`:

```js
// player.js — the single entry point for the play/pause icon and aria state
export function syncPlayButton(active, label = "播放 / 暂停") {
  $("ic-play").classList.toggle("hidden", active);
  $("ic-pause").classList.toggle("hidden", !active);
  const button = $("btn-play");
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", label);
}
```

`core.js` holds the global state and scene metadata, so no module keeps a second copy:

```js
// core.js — a single source of truth
const SCENE_META = {
  silence: { name: "静默", en: "SILENCE", list: "白噪音 · 冥想" },
  jump:    { name: "跳绳", en: "JUMP ROPE", list: "DJ 节奏歌单" },
  run:     { name: "跑步", en: "RUNNING", list: "步频歌单" },
  hike:    { name: "爬山", en: "HIKING", list: "山野歌单" },
};

const state = {
  scene: null,
  tracks: [],
  idx: -1,
  playing: false,
  shuffle: false,
  loop: "all",
  volume: readVolume(),
  seeking: false,
};
```

One easily missed detail: `SCENE_COLORS` also lives in `core.js`, so the color of a profile bar and the color of a dot in "recent plays" come from the same source instead of two hex literals in two components. With no props to pass, `state` and these constants are the de facto shared context, and they have to be singular.

Native modules also change how ordering works. `scene.js` keeps an `order` array that is the single source of playback order. `rebuildOrder()` fills it `0..n-1` and, when shuffle is on, applies a Fisher–Yates swap. `nextIndex(dir)` locates the current track's position in `order`, moves by ±1, wraps to `0` when loop is on, and returns `-1` (stop) when loop is off and the end is reached. Keeping `order` separate from `state.tracks` means shuffle never mutates the displayed list, so the UI order and the playback order can differ without one corrupting the other. There is a subtle repair step too: if `state.idx` is somehow not in `order` (for example after a list swap), `nextIndex` rebuilds the order before looking up the position, so a stale index cannot strand playback. Because every module imports `core.js` and `scene.js` through native ES modules, the browser builds the dependency graph itself; there is no bundler that might accidentally inline a dead module or duplicate a constant, and the network panel shows exactly which file is responsible for which behavior.

## Authentication: PBKDF2, a 16-byte salt, and 10,000 iterations

Start with the shape of password storage. In `functions/api/_auth.js`, the salt and hash are produced like this:

```js
export const PASSWORD_ITERATIONS = 10000;

export function createPasswordSalt() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, saltHex, iterations = PASSWORD_ITERATIONS) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations,
      hash: "SHA-256",
    },
    material,
    256,
  );
  return bytesToHex(new Uint8Array(derived));
}
```

Three choices are worth pausing on.

**Why PBKDF2 and not Argon2 or scrypt.** Because of Web Crypto. Pages Functions run in the Workers runtime, where `crypto.subtle.deriveBits` is native, while Argon2 needs WASM or extra CPU time, which is expensive in an environment with a per-invocation CPU budget. PBKDF2 is not the strongest password KDF, but it is the one that reliably finishes within ten thousand iterations.

**Why 10,000 iterations and not the hundreds of thousands OWASP recommends.** This is the most counter-intuitive decision in the article, and the comment says it plainly:

```js
// Keep this below the Pages Functions CPU budget. Raising it can make auth
// requests time out at the edge.
export const PASSWORD_ITERATIONS = 10000;
```

On a server you control, you absolutely should push iterations to 600,000. But the free/low tier of Pages Functions has a hard per-request CPU ceiling, and PBKDF2 is pure CPU work; raise the iterations and login requests time out at the edge. The author chose "login works" over "the hash is theoretically optimal" — a real engineering trade-off, written into the code and into the README's known limitations, not quietly buried.

**Why a 16-byte salt and a 256-bit hash.** A 16-byte (128-bit) random salt resists rainbow tables and is cheap; `deriveBits(..., 256)` produces 256 bits, which is 64 hex characters and fits a `TEXT` column. Neither needs to be "bigger," because every millisecond at the edge is on the books.

The comparison after login is also worth noting: `hashPassword(password, account.password_salt)` is compared as a plain string against the stored `password_hash`. There is no `timingSafeEqual`, because both sides are server-derived hex strings and the result is not directly exposed to the attacker (the error is always "incorrect account or password"). It is an acceptable choice, and one worth knowing about.

Registration is where D1 is used most carefully. Creating an account is two writes — the `echo_users` row and an `echo_sessions` row — and a failure between them would leave a user who can never log in, or a session pointing at nobody. The handler wraps both in a single `env.DB.batch([...])`, which D1 executes atomically: either both rows exist or neither does. If the batch throws a `UNIQUE constraint failed` error — a race with a simultaneous registration — the handler maps it to `409` instead of `500`, so the client sees "already registered" rather than "server broken." Before that it runs two explicit lookups (username, then email) to give a specific error in the common case, and the batch's unique constraint is the backstop for the race between those lookups and the insert.

Login is the mirror image. It looks the account up with `WHERE username = ? OR email = ?`, verifies the PBKDF2 hash against the stored salt, and then does a batch that deletes that user's expired sessions and inserts a fresh one. Deleting expired sessions at login keeps the table from growing for accounts that do come back, complementing the probabilistic sweep for accounts that do not. Both paths end by calling `clearAuthRateLimit(request)` and returning a `Set-Cookie`; both refuse non-same-origin requests before touching the database; and both cap the body at 8 KiB through `readJson`. The symmetry is deliberate — the two handlers are short enough to read side by side and diff.

## Sessions: cookie flags, a 30-day lifetime, and probabilistic sweeping

After authentication, the server does not issue a JWT. It issues a random session token stored in D1:

```js
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const SESSION_COOKIE = "echo_token";

export function sessionCookie(token) {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ].join("; ");
}
```

Each flag has a job: `HttpOnly` keeps JavaScript from reading the token so XSS cannot steal it; `Secure` sends it only over HTTPS, which the edge provides by default; `SameSite=Lax` blocks most cross-site request forgery while still allowing normal navigation from external links; `Max-Age` tells the browser to drop it after thirty days. The token itself is `crypto.randomUUID()`, 135 bits of randomness — not guessable.

The interesting part is how expired sessions are cleaned up. Pages Functions have no cron trigger, so you cannot run a cleanup job at 3 a.m. The author uses two pieces of logic. The first is inside `authenticatedUsername()`: when a user arrives with a token, and that session has expired, delete it on the spot:

```js
export async function authenticatedUsername(request, env) {
  const token = sessionToken(request);
  if (!token) return null;
  const session = await env.DB.prepare(
    "SELECT username, expires_at FROM echo_sessions WHERE token = ?",
  ).bind(token).first();
  if (!session || session.expires_at <= Date.now()) {
    if (session) await env.DB.prepare("DELETE FROM echo_sessions WHERE token = ?").bind(token).run();
    return null;
  }
  // With a 2% probability, run a global sweep of all expired sessions.
  if (Math.random() < SESSION_SWEEP_PROBABILITY) {
    try {
      await env.DB.prepare("DELETE FROM echo_sessions WHERE expires_at <= ?").bind(Date.now()).run();
    } catch {}
  }
  return session.username;
}
```

The second piece is that 2% sweep. The idea: since there is no timer, spread the cleanup across normal requests — on average, one in fifty authenticated requests executes `DELETE FROM echo_sessions WHERE expires_at <= ?` on the side. Expired rows do not pile up, and any single request pays at most one lightweight DELETE. The `try {} catch {}` is deliberate: a failed sweep must not break the request.

This design is imperfect, but it honestly acknowledges that the edge has no timers. The real improvement is to move the sweep into a Durable Object alarm or a Cloudflare Cron Trigger hitting a `/_sweep` endpoint — both appear in the "if I rewrote it" list.

Two helpers support all of this and are worth seeing because they encode small robustness decisions. `parseCookie()` splits the `Cookie` header on `;`, finds the first `=`, and then tries `decodeURIComponent` on the value with a fallback to the raw value if decoding throws — so a malformed cookie cannot crash an authenticated request. `requestAddress()` prefers `CF-Connecting-IP`, falls back to the first entry of `X-Forwarded-For`, and finally to the literal string `"unknown"`; that single address becomes the rate-limit key, which is why the limiter can be per-client even though the function sees only a `Request`. `isSameOrigin()` is deliberately lenient in one case: if the request has no `Origin` header at all (some same-origin navigations and non-browser clients), it returns `true`, and only compares origins when the header is present. That is the right behavior for a site that also needs to serve ordinary form posts, but it is exactly why the limiter and the session check matter alongside it — CSRF defense rests on `SameSite=Lax` and the origin check together, not on one of them.

## Rate limiting: an in-isolate map with LRU eviction

The limiter is the part of `_auth.js` most worth reading on its own. Its interface is small:

```js
export function createRateLimiter({ windowMs, max, maxBuckets = 10000 }) {
  const buckets = new Map();
  return {
    check(key) { /* ... */ },
    clear(key) { buckets.delete(key); },
  };
}

const authLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 10 });
```

That means "at most 10 times per key in 5 minutes." The `check()` implementation has three layers of defense, each worth reading.

**Layer one: lazy expiry.** There is no timer scanning the map; every `check()` compares `now - bucket.startedAt >= windowMs` and resets if expired. This is the usual token-bucket / sliding-window shape.

**Layer two: a capacity ceiling.** `maxBuckets = 10000` exists to stop an attacker from growing memory with unlimited keys. When the map exceeds the ceiling, first delete every expired bucket; if it is still over, treat `Map` insertion order as approximate LRU and evict from the oldest:

```js
if (buckets.size > maxBuckets) {
  for (const [bucketKey, bucketValue] of buckets) {
    if (now - bucketValue.startedAt >= windowMs) buckets.delete(bucketKey);
  }
  // If every bucket is still active, evict the oldest so attacker-controlled
  // keys cannot grow memory without bound.
  while (buckets.size > maxBuckets) buckets.delete(buckets.keys().next().value);
}
```

**Layer three: reset on success.** Both `login.js` and `register.js` call `clearAuthRateLimit(request)` after success, deleting the current address's bucket. So "a few wrong passwords, then finally a correct one" does not keep consuming quota.

Now the **physical boundary**, which the README spells out:

> The current rate-limit Map lives inside the Pages Functions isolate and can only be best-effort protection at the edge. If you need strong resistance, add distributed rate limiting in Cloudflare WAF, Rate Limiting Rules, or Durable Objects.

That sentence matters. Cloudflare runs thousands of isolates, each holding its own map. An attacker only has to make requests land on different isolates to bypass "10 per isolate." So the real job of this limiter is not "stop distributed brute force" but "stop rapid retries from one connection/user" and "reduce write pressure on D1." Hiding that in a code comment would be a failure; putting it in the docs as a known limitation is what respects the reader.

The limiter is applied at different granularities. Authentication uses one limiter keyed by address (`5 minutes / 10 attempts`). History writes use another keyed by username (`60 seconds / 30 writes`). Library saves use a third keyed by username (`60 seconds / 30 saves`). Search uses two at once: one per username and one per IP, so a single account cannot hammer the upstream and a single address cannot fan out across accounts. Every rejection goes through the same `json()` helper, which sets `Cache-Control: no-store` so a `429` is never cached and replayed, and includes a `Retry-After` header computed from the bucket's remaining window. That last detail matters on the client: a retry-after value lets the UI say "try again in 42 seconds" instead of a vague "too many requests," and it prevents a client from tight-looping the same rejected call.

## Request body limits: Content-Length is not trusted, streaming is the backstop

Every write endpoint caps the body size, defaulting to 8 KiB. The intuitive approach is to read `Content-Length`:

```js
export function requestExceedsLimit(request, maxBytes = 8192) {
  const length = Number(request.headers.get("content-length"));
  return Number.isFinite(length) && length > maxBytes;
}
```

But `Content-Length` is optional: a chunked request can omit it. The real defense counts bytes while reading:

```js
export async function readJson(request, maxBytes = 8192) {
  if (requestExceedsLimit(request, maxBytes)) throw tooLarge();
  if (!request.body) return request.json();
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw tooLarge();
    }
    chunks.push(value);
  }
  reader.releaseLock();
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
```

The value is not "reject big payloads" but "cannot be bypassed by omitting a header." `reader.cancel()` stops pulling data as soon as possible so it does not keep filling memory; `releaseLock()` releases the stream correctly. Any endpoint that accepts JSON gets both "size cap" and "valid JSON" by calling `readJson`, with no duplicated try/catch.

The playlist endpoint is the exception; it needs a larger cap, so it passes an explicit limit:

```js
const libraryJson = await readJson(request, MAX_LIBRARY_BYTES + 1024);
```

The extra 1024 bytes account for the JSON envelope (field names, braces, quotes), because `validateLibrary()` later checks the serialized byte length precisely.

## Playback accounting: currentTime deltas, not setInterval

This is the section most often written wrong and most often ignored. Almost every naive "track listening time" implementation looks like this:

```js
// Anti-pattern: do not do this
setInterval(() => { if (playing) totalSeconds += 1; }, 1000);
```

It has three fatal problems. First, timers are throttled in background tabs, so the seconds do not match real listening. Second, if the user drags the bar three minutes forward, you never find out. Third, if the timer is not cleared properly on pause, it keeps counting.

ECHO SPACE measures "real media-time deltas." The core is in `public/js/stats.js`:

```js
export function recordAudioProgress() {
  if (!seg) return;
  const current = audio.currentTime;
  if (!Number.isFinite(current)) return;
  const previous = seg.mediaTime;
  if (state.playing && !state.seeking && Number.isFinite(previous)) {
    const delta = current - previous;
    // Ignore seeks and browser timestamp jumps; normal timeupdate intervals
    // are much smaller than five seconds.
    if (delta > 0 && delta <= 5) seg.acc += delta;
  }
  seg.mediaTime = current;
}
```

There are four judgment calls, each matching a real failure:

1. **Only accumulate when `state.playing` is true.** No adding while paused.
2. **Only accumulate when `!state.seeking`.** While dragging, the `input` event sets `state.seeking` true and accumulation pauses; the `change` event (the real drop point) calls `syncMediaTime()` to reset the anchor to the new `currentTime`, so the skipped span is not counted.
3. **`delta > 0`.** Seeking backward yields a negative delta; skip it.
4. **`delta <= 5`.** The most important rule. A background tab resuming, a system sleep/wake, or network buffering can make the gap between two `timeupdate` events jump to tens of seconds or minutes; during normal playback it is usually 0.25–1 second. Treating "a jump larger than five seconds" as anomalous is what makes this accounting valid.

Putting the pieces in order makes the accounting concrete. The user clicks a row; `playIndex()` calls `playTrack()`, which bumps `playbackGeneration`, flushes any previous segment, sets `state.idx`, and calls `startPlaybackSession()` — minting a `sessionId` and recording the starting `mediaTime`. Audio begins; `timeupdate` fires a few times per second, and each call to `recordAudioProgress()` adds a small positive delta. Every thirty seconds the interval flushes a checkpoint with `keepOpen: true`, so the server has a recent total while the session keeps accumulating. If the user drags the bar, the `input` handler sets `state.seeking`; accumulation pauses, and the `change` handler sets `audio.currentTime` and calls `syncMediaTime()` so the anchor jumps to the drop point without counting the skipped span. If the user pauses, `flushSegment()` sends the final total and clears `seg`, so resuming starts a new `sessionId`. If the user closes the tab instead, `pagehide` calls `recordAudioProgress()` one last time and `sendBeacon`s the total. Four different exits, one identity per session, and the server-side UPSERT makes the repeated writes idempotent.

There is one more guard that is easy to miss: `sendHistory()` refuses to send when `!getMe()` (not logged in), when the payload has no `sessionId`, or when `seconds < 5`. That means an anonymous listener never generates server traffic at all — the player works, but the server never sees a row. It also means the five-second floor is enforced on both sides of the wire, so a bug in the client cannot produce a spam of one-second rows.

Three companion timing points complete the picture. `timeupdate` only calls `recordAudioProgress()`; a 30-second interval flushes "if at least five seconds have accrued, but keep the session open":

```js
setInterval(() => {
  if (!seg || !state.playing) return;
  recordAudioProgress();
  if (seg.acc >= 5) flushSegment({ keepOpen: true });
}, 30000);
```

And on page close it uses `sendBeacon`, because `fetch` may be cancelled after `pagehide`:

```js
window.addEventListener("pagehide", () => {
  if (!seg || !getMe()) return;
  recordAudioProgress();
  const seconds = Math.round(seg.acc);
  if (seconds < 5) return;
  const body = JSON.stringify({ sessionId: seg.id, scene: seg.scene, title: seg.title, artist: seg.artist, seconds });
  try {
    navigator.sendBeacon("/api/history", new Blob([body], { type: "application/json" }));
  } catch {
    sendHistory({ sessionId: seg.id, scene: seg.scene, title: seg.title, artist: seg.artist, seconds });
  }
});
```

`sendBeacon` means "hand the data to the browser and try even if the page unloads," which fits "last-ditch flush on close." Combined with the five-second floor, a user who opens a song for two seconds and closes it produces no junk row.

## Session de-duplication: sessionId, UPSERT, and a partial unique index

The hardest problem in playback stats is not measuring time. It is not double-counting. A user pauses and resumes, a checkpoint fires every thirty seconds, and a beacon fires on close — one listening session produces many network writes. If every `POST /api/history` were an `INSERT`, the history would fill with dozens of rows for the same song.

The fix is to give each continuous playback a `sessionId`:

```js
export function startPlaybackSession(track) {
  if (!track || !state.scene) return;
  seg = {
    id: crypto.randomUUID(),   // the unique id of one playback session
    scene: state.scene,
    title: track.t,
    artist: track.a,
    acc: 0,
    mediaTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
  };
}
```

On pause, `flushSegment()` clears `seg` (`keepOpen: false`); on resume, `playTrack` calls `startPlaybackSession()` and generates a new `sessionId`. So "pause then resume" is two sessions by definition — a product choice that lets "listened three minutes, paused, listened two more" be distinguished from "listened five minutes straight."

What actually folds duplicate writes into one row is the server statement:

```sql
INSERT INTO echo_history (username, session_id, updated_at, scene, title, artist, seconds, played_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT DO UPDATE SET
  updated_at = excluded.updated_at,
  seconds = MAX(echo_history.seconds, excluded.seconds)
```

`ON CONFLICT DO UPDATE` needs a conflict target, and here it is not spelled out as `ON CONFLICT (username, session_id)` because the table has a **partial unique index**:

```sql
CREATE UNIQUE INDEX idx_history_user_session
  ON echo_history(username, session_id)
  WHERE session_id IS NOT NULL;
```

That partial index is the pivot of the whole design, with three details:

- **`(username, session_id)`, not `session_id` alone.** The `sessionId` is generated client-side with `crypto.randomUUID()` and could theoretically collide; adding `username` makes the constraint mean "one user's one session," so two users with the same UUID do not collide.
- **`seconds = MAX(echo_history.seconds, excluded.seconds)`.** Later requests only raise the seconds, never lower them. Even with out-of-order requests or a late beacon, history does not shrink.
- **`WHERE session_id IS NOT NULL`.** Legacy rows have no `session_id`; the partial index excludes them, so the table can hold both new session-level rows and old per-row records without a backfill on migration.

Before the write there are two validations. `sessionId` must match `^[A-Za-z0-9_-]{16,80}$` to block odd characters and oversized keys; `seconds` must satisfy `0 < seconds <= 3 * 3600`, and anything else returns `{ ok: true, skipped: true }`. Note it returns success, not an error: "this one was not recorded" is not the client's fault.

## Schema migration: adding columns to an old history table without rewriting it

The fourth migration file is the key to understanding the schema evolution:

```sql
-- 0002_history_sessions.sql
ALTER TABLE echo_history ADD COLUMN session_id TEXT;
ALTER TABLE echo_history ADD COLUMN updated_at INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS idx_history_user_session
  ON echo_history(username, session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_history_user_updated ON echo_history(username, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON echo_sessions(expires_at);
```

The order matters: add columns first, then create the partial unique index. SQLite (and D1) allows adding columns to an existing table with new columns defaulting to `NULL`; because the index carries `WHERE session_id IS NOT NULL`, every old row's `session_id` is `NULL`, so it never enters the unique index and never conflicts. In other words, **the migration rewrites no old data**: old records continue to exist as one row per event, new records exist as one row per session.

The full `echo_history` shape (from `schema.sql`) is:

```sql
CREATE TABLE IF NOT EXISTS echo_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  session_id TEXT,
  updated_at INTEGER,
  scene TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  played_at INTEGER NOT NULL
);
```

Note that `updated_at` and `played_at` are two different things: `played_at` is the **first write time** and never changes; `updated_at` is the **most recent checkpoint time** and is updated on every UPSERT. That distinction matters in aggregation — "recent plays" sorts by `updated_at`, while the "14-day active calendar" attributes by `played_at`.

There are four migrations, with a clear rhythm:

| Migration | What it does | Why it is separate |
| --- | --- | --- |
| `0001_init.sql` | Create `echo_users`, `echo_sessions`, `echo_history` and base indexes | Initial structure |
| `0002_history_sessions.sql` | Add `session_id`, `updated_at`; create the partial unique index | Session-level dedup without touching old rows |
| `0003_libraries.sql` | Create the cloud playlist table `echo_libraries` | New feature |
| `0004_library_rev.sql` | Add an optimistic-lock `rev` column | Detect concurrent writes |

The discipline of "one migration does one thing" is far more reliable than "rerun a big schema.sql." The README also says explicitly: do not run the `ALTER`s in `schema.sql` against a live database; use `npm run db:migrate`, because the migration system records which files have run.

## Aggregation: per-session dedup, a 14-day calendar, and the UTC+14 trap

`GET /api/history` is the most complex handler in the backend. It returns four groups in one request: totals, per-scene distribution, the last 14 days, and the last 50 rows. Four queries run concurrently via `Promise.all`, then get assembled.

**Totals: dedup by session.** The key is `COUNT(DISTINCT COALESCE(session_id, 'legacy:' || id))`:

```sql
SELECT COUNT(DISTINCT COALESCE(session_id, 'legacy:' || id)) AS plays,
       COALESCE(SUM(seconds), 0) AS seconds,
       MIN(played_at) AS first_at
FROM echo_history WHERE username = ?
```

`COALESCE(session_id, 'legacy:' || id)` means: new data uses `session_id` as the identity of "one playback"; old data has no `session_id`, so `'legacy:' || id` synthesizes a unique value. `COUNT(DISTINCT ...)` then counts new session-level plays correctly while remaining compatible with old per-row records. `SUM(seconds)` just adds up — because the UPSERT already collapsed each session into one row, there is nothing to double count.

**Per-scene distribution:** the same `COUNT(DISTINCT ...)` with `GROUP BY scene`, assembled into an object:

```js
const byScene = {};
for (const row of bySceneRows.results || []) {
  byScene[row.scene] = { plays: row.plays, seconds: row.seconds };
}
```

**The 14-day calendar: here is a real trap.** The frontend wants "the last 14 days, how many seconds each day," with date labels on the axis. The intuitive approach is "take today, subtract 13 days, generate fourteen date strings." But if you compute only in the server's timezone, users in UTC+12 to UTC+14 see every date shifted by a day. The author's fix: determine "today" in the **requested** timezone, then generate the fourteen calendar dates using UTC anchors:

```js
const dayKey = (ts) => toDateKey(new Date(ts), formatter);
const todayParts = Object.fromEntries(
  formatter.formatToParts(new Date()).map((p) => [p.type, p.value]),
);
// Build the 14 labels as UTC noon anchors, then format in UTC, so a
// UTC+12..+14 timezone does not shift the dates back a day.
for (let i = 13; i >= 0; i--) {
  const anchor = new Date(
    Date.UTC(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day) - i, 12),
  );
  days.push({ date: toDateKey(anchor, utcFormatter), seconds: 0 });
}
```

The comment about "UTC noon anchors" is the essence. If you anchor at local midnight, UTC+14's "today" and UTC's "today" differ by a day; anchoring at noon and formatting in UTC keeps the labels stable across timezones. This trap even has a dedicated test (`tests/history.test.mjs`) using `Pacific/Kiritimati` (UTC+14) to assert the last day is the user's local today:

```js
test("history day labels keep the requested UTC+14 calendar date", async () => {
  const request = new Request("https://example.test/api/history?tz=Pacific%2FKiritimati", {
    headers: { cookie: "echo_token=test-token" },
  });
  const response = await onRequestGet({ request, env: { DB: fakeDb() } });
  const body = await response.json();
  assert.equal(body.days.length, 14);
  assert.equal(body.days.at(-1).date, /* local today */);
});
```

**The last 50 rows:** sorted by `COALESCE(updated_at, played_at)` descending, so a just-checkpointed session floats to the top instead of sinking by first-play time:

```sql
SELECT scene, title, artist, seconds, COALESCE(updated_at, played_at) AS played_at
FROM echo_history WHERE username = ?
ORDER BY COALESCE(updated_at, played_at) DESC LIMIT 50
```

The `tz` parameter itself is not trusted blindly either: `requestedTimeZone()` first tries a format with `Intl.DateTimeFormat`, falling back to `UTC` if the timezone is invalid. That is more forgiving than an allowlist and safer than no validation.

## Free-mode playlists: turning a training plan into a pure function

Free mode is the most "product-like" feature in ECHO SPACE: you pick a total training duration (10–180 minutes), and the system cuts it into song segments, rest segments, warm-up, and stretch, guaranteeing that **the seconds of every segment sum to exactly the duration you chose**. That guarantee is not assembled in the UI; it is pinned by a pure function and a unit test.

The core is `buildPlan()` in `public/free-mode.js`, with a plain signature:

```js
function buildPlan(scene, tracks, durations, totalSeconds, order) { /* ... */ }
```

Inputs are the scene, the track list, each track's duration, the total seconds, and the playback order; the output is a `segments` array. It starts by computing the warm-up and stretch shares:

```js
function guidedPhaseSeconds(totalSeconds) {
  const total = Math.max(0, Math.round(Number(totalSeconds) || 0));
  // Warm-up and stretch are at most three minutes each, and at most 20% of the total.
  return Math.min(GUIDED_PHASE_MAX_SECONDS, Math.floor(total * 0.2));
}
```

Then the main loop does one thing: carve a slice of "the current song" out of the remaining time until nothing remains. The key line is:

```js
const seconds = Math.min(duration, remaining);
```

That line guarantees "the last song does not extend the session because its own duration exceeds what is left." If only twelve seconds remain but the next song is four minutes, the segment is twelve seconds, not 240. After the loop there is a backstop:

```js
if (remaining > 0) {
  segments.push({ type: "work", trackIndex: null, title: "训练结束前的缓冲", seconds: remaining });
  remaining = 0;
}
```

Normally `remaining` always hits zero; this protects against "empty or malformed playlist" dropping seconds. The returned object carries `totalSeconds`, `workSeconds`, `restSeconds`, and `segments`, where `totalSeconds` is the original choice and the seconds in `segments` must equal it — an invariant the test asserts directly:

```js
test("buildPlan keeps requested duration exact", () => {
  const tracks = [{ t: "A", a: "x" }, { t: "B", a: "y" }];
  const plan = free.buildPlan("run", tracks, [120, 120], 1800, [0, 1]);
  assert.equal(plan.segments.reduce((sum, s) => sum + s.seconds, 0), 1800);
  assert.equal(plan.totalSeconds, 1800);
});
```

Besides `buildPlan`, `buildSelectedPlan()` handles "the user manually picked a few songs." It differs from `buildPlan` in that it does not truncate by total duration; it plays the selection through in order, computing warm-up/stretch from the "actual song total" rather than the chosen duration. And `estimateSelectedTotal()` gives a "estimated total including rests" preview on the button before the user generates a plan. All three share one property: no DOM, no global state, only inputs — so they load into Node with `vm.runInNewContext` and get tested directly.

## Scheduling rules: three rest models for jump rope, running, and hiking

The three sport scenes' rest rules are pulled into a `PROFILES` table:

```js
const PROFILES = {
  silence: { restEvery: 0, restSeconds: 0, label: "连续播放" },
  jump:    { restEvery: 1, restSeconds: 30, label: "每首歌后休息 30 秒" },
  run:     { restEvery: 4, restSeconds: 45, label: "每 4 首后休息 45 秒" },
  hike:    { restEvery: 0, restSeconds: 300, label: "每 30 分钟休息 5 分钟", isTimeBased: true, intervalOptions: HIKE_INTERVALS },
};
```

Three models, each matching a rhythm:

- **Jump rope: triggered by song count.** `restEvery: 1` — rest 30 seconds after every song. Jump rope is high-intensity interval work, and one song per cycle fits.
- **Running: triggered by song count, but rarer.** `restEvery: 4` — rest 45 seconds every four songs, with songs flowing continuously in between. Running wants a stable cadence, and frequent interruptions break it.
- **Hiking: triggered by time.** `isTimeBased: true`, `restEvery` is 0, and rest is driven by accumulated work time: `accWork += seconds; if (accWork >= intervalSeconds) { rest }`. The interval is chosen from `HIKE_INTERVALS = [15, 30, 45, 60, 90, 120]`, defaulting to 30 minutes. Hiking is low-intensity and long, so time-based rest matches the effort curve.

One detail: if the remaining time is under five seconds, the rest segment is skipped (`if (rest < 5) continue;`). That is not laziness; a "three-second rest" is meaningless and would litter the plan with fragments. Skipping those seconds does not break the total, because later song segments absorb the remainder.

`buildSelectedPlan()` has a branch for "time-based" versus "count-based". Time-based inserts a rest when accumulated work reaches the interval, with no rest after the last song; count-based inserts a rest when `workCount % restEvery === 0`, also with no rest after the last song. So "the session ends" is always a clean finish, never "rest, then end."

## The duration index: know how long a track is without downloading it

Free mode needs each track's duration, but audio files are several MB, and many are MP3. You cannot download ten songs just to plan thirty minutes. `tools/generate-durations.mjs` solves this: **before deploy**, it reads each file's container header, parses the duration, and writes a static index `public/durations-data.js`.

The key constraint is "read only 4 MB":

```js
// Container headers and Xing metadata are usually near the front;
// avoid loading a multi-megabyte audio file just to read its duration.
const length = Math.min(size, 4 * 1024 * 1024);
```

MP4/M4A is parsed through the `mvhd` atom: find the `mvhd` marker, read the version, take 32-bit timescale/duration for version 0 or 64-bit for version 1, then `duration / timescale` is seconds. MP3 is parsed through the frame header: skip ID3v2, find the first valid frame header, read the bitrate and sample rate; if the `Xing` or `Info` marker follows, read "total frames × samples per frame / sample rate," which is more accurate than a bitrate estimate.

There is a fallback: some MP4 files put the `moov` atom at the end (no faststart). If the first 4 MB has no `mvhd`, the script reads a bounded tail window:

```js
if (headDuration || size <= length) return headDuration;
// Some MP4/M4A files place the moov atom at EOF; read a bounded tail window.
const tailOffset = size - length;
const tail = Buffer.alloc(length);
```

The "read head + read tail" combination avoids loading the whole file while covering almost every container layout. The generated index looks like:

```js
window.ECHO_DURATIONS = { silence: [612.4, 533.1, ...], jump: [...], ... };
```

`durationHint()` in `core.js` resolves in order: "track's own duration → static index → parse 'minutes' from the title → default 210 seconds." The fallback chain keeps "a plan can still be generated even if the index is missing," just with a coarser estimate.

## The executor: a 250ms tick, stall compensation, and phase transitions

Generating a plan is paper; the executor is what actually runs. `public/js/free-training.js` holds a `freeSession` and ticks every 250ms:

```js
freeTicker = setInterval(tickFreeTraining, 250);
```

`tickFreeTraining()` handles two kinds of segment differently.

**Work segments: driven by the real audio progress.** It compares `audio.currentTime` against the segment's `seconds` and advances near the end:

```js
if (segment.type === "work" && !freeSession.internal) {
  const cur = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  if (cur >= segment.seconds - 0.25) {
    advanceFreeSegment();
    return;
  }
}
```

There is a "stall compensation" mechanism worth learning. If audio buffers (so `audio.paused` or `currentTime` stops moving) while the countdown keeps running on wall-clock time, the user sees "the countdown ends before the song plays through." So when a stall is detected, the executor pushes the segment end and the total end **later**:

```js
const stalled = audio.paused || Math.abs(cur - freeLastMedia) < 0.001;
if (stalled) {
  const delay = Math.max(0, now - (freeSession.lastTick || now));
  freeSession.phaseEndAt += delay;
  freeSession.totalEndAt += delay;
  stopMetro();
}
```

So "stalled three seconds" means "the whole session shifts three seconds," not "three seconds of listening lost." This compensation applies only to work segments; rest, warm-up, and stretch are pure timers and need no compensation.

**Non-work segments: driven by the wall clock.** With no audio progress to rely on, they use `phaseEndAt` directly:

```js
if (segment.type !== "work" && now >= freeSession.phaseEndAt) advanceFreeSegment();
```

`advanceFreeSegment()` has a `transitioning` lock, so a 250ms tick and an audio event (`ended`/`timeupdate`) firing together cannot "advance two segments." Each transition does `index += 1`, then `beginFreeSegment()` resets `phaseEndAt` and `freeLastMedia` and acts differently per segment: work segments call `playTrack()` to start audio; rest segments `audio.pause()` and trigger speech.

There is also a 0.18–0.25 second lead. Why not wait for `cur === seconds` exactly? Because audio events and timers jitter by tens of milliseconds, and waiting strictly could hang at the last segment if real audio is a few milliseconds shorter than planned. The lead guarantees an advance while being inaudible.

The free-mode executor also owns the metronome, and it is built on the Web Audio API rather than `setInterval` for the same reason playback stats avoid timers. `startMetro()` schedules oscillator clicks with a lookahead: it keeps a `next` timestamp in `AudioContext` time and, on a 90ms `setTimeout`, schedules every click that falls within the next 300ms, then schedules itself again. This is the standard lookahead-scheduler pattern — a coarse timer wakes up, but the actual clicks are placed on the audio clock, so they do not drift when the main thread is busy. Each click is a square oscillator ramped from 880Hz to 420Hz over 80ms with a fast gain envelope, which reads as a crisp tick rather than a tone. The metronome pauses during rest and warm-up (`ensureMetroDuringWork()` only starts it on work segments), and the BPM is persisted in `localStorage` so a runner's preferred cadence survives a reload.

There is a subtle interaction between the metronome and the audio that is worth flagging: the metronome must not count as "audio progress" for stall detection. The executor distinguishes "the metronome is running" from "the song is playing" by checking `state.playing` and the segment type, and it stops the metronome whenever the song stalls or the segment is not a work segment. Without that distinction, a stalled song with a running metronome would look "alive" and the stall compensation would never fire, so the countdown would race ahead of silent audio.

`pauseFreeTraining()` / `resumeFreeTraining()` handle pause/resume. On pause they record "seconds left in the current segment" and "seconds left overall"; on resume they recompute `phaseEndAt`/`totalEndAt` from the wall clock and `audio.play()` again. An `internal` flag prevents the executor's own `audio.pause()` from triggering the "user paused" logic and recursing.

## The silence scene: breathing guidance and a focus timer

The silence scene does not participate in free mode. It has two separate things: a breathing visual guide and a focus timer, both in `public/js/timer.js`.

The breathing guide is a set of CSS animations (expand on inhale, contract on exhale), switched by `startBreathVisual()` / `stopBreathVisual()` and active only while the silence scene is playing. It involves no timing logic; it is purely visual companionship.

The timer is a 15/30/45/60-minute focus countdown. It shares the same `AudioContext` as the free-mode executor (`ensureAudioCtx()` in `core.js`), because browsers limit AudioContext count and reusing one after a user gesture is more stable. When the timer ends, it plays a chime and stops the audio.

One easily missed detail: the silence timer uses **wall-clock time** (`Date.now()` deltas), not audio progress. White-noise audio may loop, so `currentTime` resets and cannot drive a countdown. This is also the clearest proof that "listening-time stats" and "focus countdown" are two different time definitions and must not be mixed.

## Online audio: a JOOX proxy, temporary URLs, and a five-minute refresh

Jump rope, running, and hiking draw songs from online search (JOOX), while silence uses local audio. Online audio brings three problems: CORS, the key, and temporary URLs.

CORS and the key are both solved by the server-side proxy in `functions/api/search.js`:

```js
const JOOX_ENDPOINT = "https://apicx.asia/api/joox_music";
const MAX_UPSTREAM_BYTES = 512 * 1024;
const searchLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const searchIpLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120 });
```

The proxy has five protections: only same-origin authenticated requests; a per-user limit of 30/minute; a per-IP limit of 120/minute; reject upstream responses over 512 KiB; and a nine-second upstream timeout (`AbortController`). `readLimitedText()` follows the same idea as `readJson()` — count while reading, never trust `Content-Length`. The token comes from `env.JOOX_TOKEN`; if missing, return 503 instead of crashing.

Two smaller protections round out the proxy. `readLimitedText()` checks `Content-Length` first, then counts bytes as it reads, cancelling the upstream body if it exceeds 512 KiB. The JSON parse is defensive — a non-JSON body becomes `data = null`, which is reported as a 502 rather than leaking a stack trace. And every failure path returns a distinguishable message: 400 for a bad keyword, 401 for no session, 403 for a cross-origin call, 429 with `Retry-After` for either limiter, 502 for an upstream error or oversized response or timeout, 503 when `JOOX_TOKEN` is missing, and 500 for an unexpected throw. That mapping is what lets the frontend tell the difference between "you are not logged in," "slow down," and "the upstream is down," instead of showing one generic error for all of them.

There is also a useful shape to the search result. The upstream returns a list of songs with a temporary `audioUrl`, but the client only keeps the stable identifiers and refetches the URL right before playback. That is why `GET /api/search` can return temporary URLs freely — they are used once and never persisted — while `PUT /api/library` strips them. The split keeps the stored playlist small and keeps credentials and expiring links out of the database.

Temporary URLs are a frontend problem. JOOX's `audioUrl` expires and cannot live in a playlist long-term. So `library.js`'s `fetchJooxDetails()` fetches it right before playback, and `player.js` uses a five-minute window to decide "does this need a refresh":

```js
function needsOnlineRefresh(track) {
  return Boolean(track && isOnlineScene(state.scene) && track.source === "joox"
    && (!track.audioUrl || Date.now() - (track.audioFetchedAt || 0) > 5 * 60 * 1000));
}
```

Along with the `playbackGeneration` counter, if the user skips during an async fetch, the old request is cancelled via `AbortController`, so "a half-fetched old result" cannot overwrite the new song. This is a textbook async-race fix: bump a generation, compare it on return, discard if it changed.

## Cloud playlists: optimistic locking and rev conflicts

`PUT /api/library` has to answer "two tabs save at once, who overwrites whom." The answer is optimistic locking, not pessimistic (the edge has no long transactions). The table has a `rev` column:

```sql
ALTER TABLE echo_libraries ADD COLUMN rev INTEGER NOT NULL DEFAULT 1;
```

The client reads the current `rev` with the playlist and echoes it back on save. The server's update is a conditional UPSERT:

```sql
INSERT INTO echo_libraries (username, library_json, updated_at, rev)
VALUES (?, ?, ?, 1)
ON CONFLICT(username) DO UPDATE SET
  library_json = excluded.library_json,
  updated_at = excluded.updated_at,
  rev = echo_libraries.rev + 1
WHERE echo_libraries.rev = ?
```

If `WHERE echo_libraries.rev = ?` does not hold (another tab wrote first and the rev changed), the statement **updates no rows.** The server checks `result.meta.changes`; if zero, it returns 409 with the current `rev`:

```js
if (!result?.meta?.changes) {
  const row = await env.DB.prepare("SELECT rev FROM echo_libraries WHERE username = ?")
    .bind(auth.username).first();
  return json({ ok: false, code: "CONFLICT", rev: row?.rev ?? 1 }, 409);
}
```

On 409, the client can choose "take the server's version" or "force overwrite." That is far better than "last writer wins," which silently drops the other tab's edits.

The `rev` value is never trusted blindly. On a successful insert of a brand-new playlist, the server stores `rev = 1` and returns `(clientRev ?? 0) + 1`; on a conflict-free update, the SQL increments `rev` atomically, so even two updates racing within the same millisecond cannot produce the same next revision. The client is expected to echo the most recent `rev` it has loaded; if it echoes a stale one, the conditional `WHERE` fails and it gets the current `rev` back in the 409 body, which it can use to re-merge. This is a small protocol — two numbers and one status — but it makes concurrent editing correct without websockets or a lock table, which is the right trade at this scale.

The playlist data is validated strictly. `validateLibrary()` caps 2000 favorites, 200 playlists, 2000 tracks per playlist, and 1 MB serialized; each track keeps only stable identifiers (`uid`, `source`, `title`, `artist`, `songMid`, and so on). JOOX's temporary `audioUrl` is **always dropped**; only `local-fallback` local paths are kept, and they must pass a strict regex (no `..`, no URL-encoded slash/dot):

```js
if (output.source === "local-fallback"
    && /^audio\/(?:meditation|jumping|running|hiking)\/[^/?#\\]{1,500}$/.test(track.audioUrl)
    && !track.audioUrl.includes("..")
    && !/%2e|%2f|%5c/i.test(track.audioUrl)) {
  output.audioUrl = track.audioUrl.slice(0, 500);
}
```

That is a textbook trust boundary: even though `audioUrl` comes from the client, it must fall in a controlled path pattern, with directory traversal explicitly blocked in both raw and encoded forms.

## Security headers and CSP: six policies one page needs

`public/_headers` is Pages' static response-header configuration. It does two things: cache policy for audio and scripts, and security headers for all paths.

The cache policy is restrained: audio caches for 30 days with `stale-while-revalidate`; JS, CSS, `tracks-data.js`, `durations-data.js`, and `free-mode.js` are all `max-age=0, must-revalidate`. The latter is deliberate — these are "code," and a change must take effect immediately, not wait behind a CDN cache.

That split is worth spelling out because it is the most common source of "I deployed but nothing changed." Audio files are content-addressed by filename and change rarely, so a long cache plus `stale-while-revalidate` means the browser serves a cached copy instantly and refreshes it in the background for the next visit. Code files change on every deploy, so they get `max-age=0, must-revalidate`: the browser may keep a copy, but it must check with the server before using it, which turns a deploy into a single conditional request per file. The consequence is that a new `free-mode.js` is never mixed with an old `app.js` for longer than one navigation, which matters when the two share a data shape.

The security headers are six-plus:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  media-src 'self' https: blob:; connect-src 'self'; img-src 'self' data:;
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

Line by line:

- `nosniff` stops the browser from guessing MIME types, preventing a JSON response from being executed as a script.
- `Referrer-Policy` sends the full referrer only on same-origin requests and only the origin cross-site.
- `X-Frame-Options: DENY` plus CSP's `frame-ancestors 'none'` doubly forbid framing, preventing clickjacking.
- HSTS forces HTTPS for a year.
- COOP/CORP isolate the page and its resources to their own origin, reducing cross-origin leakage.
- `Permissions-Policy` turns off camera, microphone, and geolocation — this player needs none of them.
- CSP's `media-src` allows `https:` and `blob:` because online audio and local recording may both use blob URLs; `style-src`'s `'unsafe-inline'` is a necessary compromise for native inline styles, but `script-src 'self'` still forbids any inline script.

The value is this: even if one day someone injects a malicious inline script into `index.html`, CSP blocks it. Security is not "trust that the code is right"; it is "assume the code is wrong and still hold."

## Checks and tests: Node's built-in test runner plus asset validation

ECHO SPACE's test strategy is light but covers the three most error-prone areas.

**One: pure-function scheduling.** `tests/free-mode.test.mjs` loads `free-mode.js` into a fake `window` with `vm.runInNewContext`, then tests `buildPlan`, `buildSelectedPlan`, and `estimateSelectedTotal` directly. Four tests pin: exact total duration, preserved selection order plus jump-rope rests, hiking's five-minute recovery, and ignored duplicate/invalid indices.

**Two: timezone stats.** `tests/history.test.mjs` uses a fake D1 (returning fixed rows) to drive `onRequestGet` and verifies that UTC+14 calendar labels do not shift. It needs no real database, because the handler only depends on `env.DB.prepare(...).bind(...).first()/all()`.

**Three: assets and syntax.** `tools/check.mjs` does four things: recursively check the syntax and relative imports of every `.js` under `public/` and `functions/api/`; load `tracks-data.js` to confirm its shape; check that each track's audio file exists; and check for unregistered files under `public/audio/`. Its success line looks like:

```text
OK: 20 JS files, 10 tracks, all audio files mapped
```

The value is catching broken links before deploy. A missing audio file, a wrong filename in `tracks-data.js`, a JS import of a nonexistent module — if these only show up as a 404 in production, the cost is much higher.

`.github/workflows/check.yml` runs `npm run check` and `npm test` on push and pull request with both Node 18 and 22. Note it does **not** deploy, and does **not** verify D1 migrations, because migrations need live credentials; pre-deploy migration and smoke testing remain manual. That is a sensible split: CI owns "is the code right," deploy owns "is the live environment right."

The API's error surface is deliberately uniform, which keeps the frontend simple. Every handler returns `{ error }` (or `{ ok: false, error }`) with a matching status: `400` for bad input, `401` for no session, `403` for a cross-origin origin, `409` for a uniqueness or rev conflict, `413` for an oversized body, `429` for a limiter hit (with `Retry-After`), `500` for an unexpected throw, and `502`/`503` when an upstream dependency is unavailable. Because `json()` sets `Cache-Control: no-store` on every response, none of these can be cached by the edge or the browser and replayed stale. A small, consistent error vocabulary is worth more than clever per-endpoint messages, because the client can branch on the status instead of parsing prose.

The README is also careful about migrations on a live database. Before applying remote migrations it recommends exporting a D1 backup, because migrations are not reversible in SQLite and a wrong `ALTER` on a table with years of history is not something you want to discover after the fact. The migration system itself (`wrangler d1 migrations apply`) records which files ran, so re-running is a no-op ("No migrations to apply!"), and the initial schema file is described as a reference for new environments — not something to replay against production. That distinction between "bootstrap a fresh database" and "evolve a live one" is one of the small disciplines that separates a hobby project from something you can operate.

## Known limitations: an honest list

A project's maturity often shows in whether it dares to document its weaknesses. The README has a "Known limitations" section; I have organized it into a table and added the code locations:

| Limitation | What it means | Where |
| --- | --- | --- |
| Rate limiting is per-isolate | Cross-isolate distributed attacks bypass it | `createRateLimiter` in `_auth.js` |
| No email verification or reset | Registration checks format, not ownership | `register.js` |
| Legacy history cannot dedup precisely | Old rows have no `session_id`, counted as `legacy:id` | `COALESCE` in `history.js` |
| Daily stats attribute by first write | A midnight-spanning session counts on the start day | `played_at` semantics |
| Server trusts client title/artist | History write does not validate the track exists | `history.js` POST |
| Password iterations CPU-bound | 10,000, below general recommendations | `PASSWORD_ITERATIONS` |
| Username case not unified | Stored as-is | `echo_users.username` |

The two most important are "server trusts client title/artist" and "rate limiting is per-isolate." The former means a logged-in user could theoretically forge a "listened to this song" record; closing it requires a server-side track manifest. The latter means the limiter is "stop rapid retries," not "stop distributed brute force."

That list is itself a good product-documentation example: it does not pretend to be perfect; it hands the reader both the trade-off and its cost.

## If I rewrote it, I would change these five things first

If I were rebuilding this repo, I would change five things in priority order.

**One: move rate limiting somewhere that crosses instances.** Use Cloudflare's Rate Limiting Rules, or a Durable Object as a global counter, or at least a fixed-window table in D1. The in-isolate map's problem is not "written badly"; it is "physically cannot be global."

**Two: validate the track server-side on history writes.** Today `POST /api/history` accepts client-provided `title`/`artist`. A safer design stores only a `trackId` in history and joins the title and artist from a server-side manifest at read time. Forged history then becomes impossible.

**Three: hand expired-session sweeping to Cron or a Durable Object alarm.** The 2% probabilistic sweep is clever, but it means "if nobody visits, nothing is cleaned." A once-daily Cron Trigger would be much cleaner.

**Four: unify the username case policy.** Today registration stores as-is and login queries `username` and `email.toLowerCase()`. Chinese usernames are fine, but English ones allow both `Alice` and `alice`. Either lowercase at registration or query with `COLLATE NOCASE`.

**Five: make midnight attribution exact instead of approximate.** Daily stats currently attribute by `played_at`, so a play from 23:50 to 00:20 counts entirely on the first day. Exactness requires splitting the newly accumulated seconds across dates at checkpoint time — more write complexity, but a truer "14-day active" metric.

None of these is "only possible in a rewrite"; all are "what the next version should prioritize." A good project document lets a reader see at a glance "which are deliberate trade-offs, which are temporary debt."

## Conclusion: the complexity of an edge app lives in its boundaries

Reading ECHO SPACE end to end, you notice it has almost no "algorithmic hard problems." No function needs a derivation, no SQL needs an execution-plan tuning session. Its complexity is concentrated entirely in boundaries:

- **CPU boundary:** PBKDF2 can only afford 10,000 iterations, or login times out.
- **State boundary:** no resident process, so session cleanup is "delete at login plus a 2% sweep."
- **Time boundary:** listening time must come from `currentTime` deltas, discarding jumps over five seconds.
- **Uniqueness boundary:** one playback must collapse into one row, via `sessionId` + UPSERT + a partial unique index.
- **Timezone boundary:** the 14-day calendar must not shift by a day even at UTC+14.
- **Concurrency boundary:** two tabs saving a playlist rely on a `rev` optimistic lock, not a long transaction.
- **Security boundary:** CSP, request-size caps, same-origin checks, traversal filters — not one may be missing.

None of these is "something a framework solves for you." React will not decide how many PBKDF2 iterations to use; Vue will not decide whether the eight seconds between two `timeupdate` events was a seek; no ORM will hand you a "dedup by session" partial unique index. Real edge-app engineering is thinking through every boundary, then writing it into the code, the tests, and the docs.

What makes ECHO SPACE worth studying is not "it is a player built on Cloudflare." It is that it lays out, completely, the questions a player must answer to become a product — and gives each one an honest, verifiable, trade-off-aware answer. That is more useful than any "best practices checklist."
