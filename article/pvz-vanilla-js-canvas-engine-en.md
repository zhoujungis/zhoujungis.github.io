> Who this is for: people who have built pages but never built a game that is actually playable; frontend engineers who want to know what a frame really is and how a game loop should be written; and anyone who has been told "you can't make a game without an engine" and believed it.
> TL;DR: Garden Defense is a zero-dependency, zero-build Plants-vs-Zombies fan game written in pure vanilla JavaScript. All the logic lives in one 3,731-line `game.js`, a single IIFE that wraps the whole engine: 146 functions, 81 `draw*` functions, 9 `update*` functions, 60 levels, 24 plants, 16 zombies, 4 modes, and 16 Playwright end-to-end suites. The hard part is not drawing a pea. It is four things: sprites must degrade seamlessly from GIF to PNG to hand-drawn code; one grid must carry water, fog, and a sloped roof; the zombie waves must escalate gradually and still rotate every type in by the finale; and old saves must migrate into new chapters without losing progress. This article walks through the loop, the wave scheduler, the terrain math, the fog cut-out, and the test hook, and it is explicit about the boundaries: one file, approximate collision, a roof slope that only affects visuals.
> Reading time around 38 minutes. Level: advanced.

**Contents**

- This is not a "draw a lawn" demo
- One IIFE holds the whole engine
- The game loop: cap dt at 34ms so drops don't clip through walls
- The state object: the single source of truth
- Level data: how 60 levels are organized
- Wave scheduling: the four rules inside makeSchedule
- Plant behaviors: 24 ifs inside one updatePlants
- Zombie AI: 16 behaviors in one loop
- Projectiles: three motion models
- Sprite fallback: GIF to PNG to hand-drawn code
- Procedural animation: making static PNGs move
- Water: why you must plant a lily pad first
- Fog: an offscreen canvas plus destination-out holes
- The roof: the chain reaction of one slope function
- Sun economy and the cooldown loop
- Three extra modes: vase breaker, I zombie, endless
- The test hook: designing window.__pvzTest
- E2E-testing canvas: when getImageData is unavailable
- Save migration: mapping old level IDs to new chapters
- Known limits: an honest list
- If I rewrote it, these five things first
- Conclusion: a game engine's complexity lives in the frame

---

## This is not a "draw a lawn" demo

Most "web Plants vs Zombies" projects end up the same way: a canvas, a few `drawImage` calls, and a `setInterval` that moves zombies left. It moves, but it is not a game, because nobody answers six questions:

- How long should a frame take? If one frame stalls for two seconds, will the zombies walk straight through your wall-nut?
- Where do 60 levels of data live — 60 hard-coded objects, or generated from rules?
- How can "a sunflower produces sun" and "a threepeater fires down three lanes" coexist in one loop?
- In a pool level, why can't a shooter be planted directly on water? Where is that rule written?
- How is fog drawn — a semi-transparent overlay, or a hole punched in it?
- The roof is sloped; should plants and zombies lift with it? Should collision change too?

Garden Defense grew out of those six questions. Its scale is already substantial: `game.js` is 3,731 lines and 146 functions, 81 of them `draw*` and 9 `update*`; 24 plants, 16 zombies, 60 levels, 4 modes; plus 16 Playwright end-to-end suites. There is no engine, no bundler, no npm runtime dependency; double-click `index.html` and it plays. But the complexity is not "a lot of lines." It is the frame boundaries: how a frame's time is computed, how state is organized, how sprites fall back, how terrain differs, how saves stay compatible.

Here is the thesis, and the rest unpacks it:

- The loop uses `requestAnimationFrame` and hard-caps `dt` at 34ms — the first gate against "zombies teleport when you come back from another tab."
- All runtime state lives in one `state` object that every system reads and writes; there is no hidden local state.
- Level data is six arrays concatenated into 60 objects, and the night chapter is partially generated with `Array.from` to avoid ten copies of the same boilerplate.
- Waves come from `makeSchedule()`, which stacks four rules: an opening delay, mid-game flag waves, a full type rotation at the end, and staggered lane assignment.
- Sprite loading has three levels of fallback: if the GIF fails, try the PNG; if the PNG fails, draw it in code — so even with zero assets loaded, the game is fully playable.
- Fog is not a texture. It is an offscreen canvas with holes punched via `destination-out`, and each plantern is a hole.
- The roof slope only affects render coordinates, not collision — a deliberate trade-off whose consequences I will spell out.

## One IIFE holds the whole engine

Open `game.js` and the first and last lines are:

```js
(() => {
  "use strict";
  // ... 3700 lines ...
})();
```

The whole game is an immediately-invoked function expression. It has no `export`, no leaked globals (except the deliberate test hook `window.__pvzTest`), and no module system. In `index.html` it is a plain `<script src="game.js">`.

This choice is worth discussing first because it shapes every line after it.

**Why no modules.** Modules buy isolation and on-demand loading, but they cost an import graph, an ordering, and possibly a build step. A single-file game has no ordering problem by construction: `const` declarations evaluate top to bottom in the same scope, function declarations hoist, so `showMainMenu()` can be called at the bottom of the file while the functions it uses are defined at the top. That eliminates a whole class of "is this defined yet" bugs.

**The cost.** Everything shares one scope, so naming has to be disciplined. The author's discipline shows in three habits: constants are uppercase (`W`, `H`, `FIELD_X`, `CELL_W`), functions start with a verb (`draw*`, `update*`, `spawn*`, `make*`), and data structures are nouns (`state`, `plantDefs`, `zombieDefs`, `LEVELS`). Reading the file, the name tells you which layer you are in.

**`"use strict"` is not decoration.** In strict mode, assigning to an undeclared variable throws instead of silently creating a global. For a 3,000-line single file, that rule has an excellent cost/benefit: it turns "I typo'd a variable name" from "weird behavior at runtime" into "an immediate error."

## The game loop: cap dt at 34ms so drops don't clip through walls

There is exactly one loop, at the very end of the file:

```js
function loop(now) {
  const dt = Math.min(.034, (now - state.lastFrame) / 1000 || 0);
  state.lastFrame = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

Nine lines, four important decisions, each worth its own paragraph.

**One: `requestAnimationFrame`, not `setInterval`.** `setInterval(fn, 16)` looks like 60fps, but it does not align with the browser's paint rhythm, and background tabs throttle or pause it. `requestAnimationFrame` is called by the browser before each repaint, so it is inherently in sync with the display, and it pauses automatically when the tab is hidden — exactly the "freeze when you leave" behavior we want. For the record, the rendering context is Canvas 2D (`canvas.getContext("2d")`, not WebGL: every visual in this game — plants, zombies, fog, water ripples — is a composition of 2D draw calls.

**Two: `dt` is a real time delta, not a fixed step.** `(now - state.lastFrame) / 1000` is "how many seconds since the last frame." Using real time means that even on a machine that only manages 30fps, zombie speed (pixels per second) is still correct — each frame just moves farther. With a fixed step (4 pixels every frame), zombies on a slow machine would move slower than on a fast one. That is the most common timing bug in beginner games.

**Three: `Math.min(.034, ...)` is the anti-clipping core.** 34ms is roughly a 30fps frame. Why cap it? Imagine the user switches tabs for ten seconds and comes back: `now - lastFrame` is 10,000ms, so `dt` is ten seconds. Used directly, every zombie advances ten seconds' worth of distance in that one frame, walks straight through your defenses, and reaches the house — the game is over instantly. After the cap, no matter how long the gap, the frame advances at most 34ms; visually you get "a hiccup when I came back," not "the game was already lost when I came back."

**Four: `|| 0` handles the first frame.** On the very first frame, `state.lastFrame` is the initial `performance.now()`, so `now - lastFrame` can be near zero, and after `/1000` it is tiny. `|| 0` catches the case where it is `NaN` or `0` and prevents a weird first frame.

The body does only three things: `update(dt)` advances every system, `draw()` renders everything, `requestAnimationFrame(loop)` books the next frame. This separation of update and render is a basic engine discipline: `update` only mutates state and never touches the canvas; `draw` only reads state and never mutates it. Every `updatePlants`, `updateZombies`, `drawPlants`, `drawZombies` split later descends from this rule.

The render side is a fixed call order, and that order *is* the depth sort:

```js
function draw() {
  ctx.save();
  const sx = state.shake ? (Math.random() - .5) * state.shake : 0;
  const sy = state.shake ? (Math.random() - .5) * state.shake * .5 : 0;
  ctx.translate(sx, sy);
  drawWorld();        // sky, clouds, fence, house
  drawMowers();
  drawVases();
  drawGridHover();
  drawPlants();
  drawProjectiles();
  drawZombies();
  drawSuns();
  drawParticles();
  drawFog();
  drawHUD();
  drawBanner();
  ctx.restore();
}
```

Because there is no z-index and no scene graph, painter's algorithm is the only depth rule: whatever is drawn later sits on top. Plants before zombies means a zombie chews "in front of" the plant; fog after everything means it covers the field; HUD and banner last means they are never occluded. Screen shake is a single `ctx.translate` at the top, applied to the whole world and undone by `ctx.restore()` — so one `state.shake` value shakes every layer at once, without any per-object code. Note the vertical shake is halved (`* .5`): full horizontal plus half vertical reads as a sideways impact rather than a uniform jolt. The outer `save`/`restore` is also what keeps the shake and any per-object transforms from leaking into the next frame.

## The state object: the single source of truth

`state` is the single source of truth for the whole game. Its fields cover everything one run needs:

```js
const state = {
  mode: "title",
  levelIndex: loadProgress(),
  unlockedLevel: loadProgress(),
  availablePlants: LEVELS[loadProgress()].plants,
  endless: false,
  minigame: null,
  brains: 0,
  wave: 0,
  time: 0,
  elapsed: 0,
  sun: 150,
  selected: null,
  shovel: false,
  plants: [],
  zombies: [],
  projectiles: [],
  suns: [],
  particles: [],
  floaters: [],
  fx: [],
  heads: [],
  graves: [],
  mowers: [],
  cooldowns: {},
  skySunTimer: 3.8,
  schedule: [],
  spawned: 0,
  totalZombies: 0,
  banner: null,
  shake: 0,
  sound: true,
  audio: null,
  lastFrame: performance.now()
};
```

It looks like a "holds everything" object, but it is layered:

- **Mode layer:** `mode` (`title` / `playing` / `paused` / `ended`), `minigame`, `endless`, `wave`. These decide *what you are playing*.
- **Level layer:** `levelIndex`, `unlockedLevel`, `availablePlants`, `schedule`, `spawned`, `totalZombies`. These decide *how this run is set up*.
- **Entity layer:** `plants`, `zombies`, `projectiles`, `suns`, `particles`, `floaters`, `fx`, `heads`, `graves`, `mowers`. These are *everything on the field*.
- **Interaction layer:** `selected`, `shovel`, `hover`, `cooldowns`, `sun`. These are *what the player can do*.
- **Presentation layer:** `time`, `elapsed`, `banner`, `shake`, `sound`, `audio`, `lastFrame`. These are *how it is shown*.

One object rather than several is a practical choice: every `update*` function reads across layers. `updateZombies` reads `state.plants` (to find targets), `state.mowers` (to trigger the lawnmower), `state.time` (to check slow/stun), and writes `state.shake` (when a gargantuar smashes). Split into several objects and every function cross-references them, which is more verbose. One `state` plus consistent naming is the least painful "global context" in a single-file architecture.

The cost is that you must remember which field belongs to which layer. That is why every `update*` begins with a guard like `if (state.mode !== "playing") return;` — `state` is shared, so each system has to confirm for itself whether it should run.

The other half of that shared context is the board geometry, declared once at the top of the file:

```js
const W = 1280;
const H = 720;
const FIELD_X = 222;
const FIELD_Y = 185;
const CELL_W = 77;
const CELL_H = 92;
const ROWS = 5;
const COLS = 9;
```

Everything else is derived from these seven numbers. A cell's center is one line:

```js
function cellCenter(row, col) {
  return { x: FIELD_X + col * CELL_W + CELL_W / 2, y: FIELD_Y + row * CELL_H + CELL_H / 2 };
}
```

`addPlant` uses that center and fills in every default up front:

```js
function addPlant(type, row, col) {
  const def = plantDefs[type];
  const pos = cellCenter(row, col);
  const plant = {
    type, row, col, x: pos.x, y: pos.y + 8,
    hp: def.hp, maxHp: def.hp, age: 0, action: 0,
    shootTimer: type === "peashooter" ? 0.55 : 0,
    sunTimer: ["sunflower", "twinsunflower", "sunshroom"].includes(type) ? 6.5 : 0,
    layer: type === "lilypad" ? 0 : 1,
    armed: type !== "potato",
    dead: false
  };
  state.plants.push(plant);
  state.sun -= def.cost;
  state.cooldowns[type] = def.cooldown;
  state.selected = null;
  burst(pos.x, pos.y + 22, "#765129", 8, 70);
  sound("plant");
}
```

Three things matter here. `layer` is 0 for a lily pad and 1 for everything else — that single field is what makes "stacking on a lily pad" work, both in `plantAt` (which sorts by `layer` to return the top plant) and in the zombie target selection (which sorts by `layer` to chew the top plant first). `y: pos.y + 8` nudges the plant eight pixels down so its sprite bottom sits on the cell rather than floating above it. And the cooldown is set at plant time, not at selection time, so switching cards does not reset anything.

## Level data: how 60 levels are organized

The 60 levels are not 60 hard-coded objects. They come from six chapter arrays:

```js
const DAY_LEVELS = [ /* 10 explicit objects */ ];
const NIGHT_LEVELS = [
  ...Array.from({ length: 7 }, (_, index) => ({
    id: `2-${index + 1}`,
    name: `夜晚 2-${index + 1}`,
    description: [ /* 7 lines */ ][index],
    // ...
  })),
  /* 3 more explicit objects */
];
const POOL_LEVELS = [ /* 10 */ ];
const FOG_LEVELS = [ /* 10 */ ];
const ROOF_LEVELS = [ /* 10 */ ];
const FINAL_LEVELS = [ /* 10 */ ];

const LEVELS = [...DAY_LEVELS, ...NIGHT_LEVELS, ...POOL_LEVELS,
                ...FOG_LEVELS, ...ROOF_LEVELS, ...FINAL_LEVELS];
```

There is a good, textbook trade-off here. The ten day levels are **fully hand-written**:

```js
{ id: "1-3", name: "白天 1-3", description: "路障僵尸加入了进攻。",
  rows: [0, 1, 2, 3, 4], plants: ["sunflower", "peashooter", "wallnut"],
  initialSun: 100, zombieCount: 15, zombieTypes: ["basic", "cone"],
  reward: "potato", theme: "day", skySuns: true },
```

Because the ten day levels are the *teaching curve*, each one introduces a new thing (sun → peashooter → wall-nut → potato mine → snow pea → repeater → cherry bomb), and their fields differ meaningfully, so each is worth writing out. The night chapter has seven levels that are "the same mechanics, different zombie counts and captions," so they are generated with `Array.from`, and only the `description` array gives each a different line. The last three night levels introduce gravestones, so they go back to hand-written.

The general name for this pattern is "explicit declarations plus rule generation." The test is simple: **if one level differs from another only in numbers and captions, generate it; if the difference is a mechanic, hand-write it.** Generation reuses a "mechanic template"; hand-writing reserves space for a new mechanic.

Every level object carries a `theme` field (`day` / `night` / `pool` / `fog` / `roof`). That field shows up again and again — it is the switch for the whole "terrain differences" system.

Plants unlock through the level data too, with no separate progression table. Two tiny functions derive everything from the level array itself:

```js
function collectedPlants(listCap, rewardCap) {
  const set = new Set();
  for (let i = 0; i <= listCap; i++) for (const t of LEVELS[i].plants) set.add(t);
  for (let i = 0; i < rewardCap; i++) if (LEVELS[i].reward) set.add(LEVELS[i].reward);
  return plantOrder.filter(t => set.has(t));
}
```

A player owns every plant that any reached level handed out in its `plants` list, plus every `reward` from a level already cleared (`rewardCap`). `resetGame` calls it twice: once with `unlockedLevel` to build the current seed bank, and once with `unlockedLevel - 1` to know what was owned *before* this level, so the win screen can show "new plant unlocked" only for the genuinely new one. Because progression is derived, adding a plant means adding it to a level's `plants`/`reward` — there is no second place to keep in sync. The cost is the same as everything else here: the derivation is O(levels × plants) every reset, which is trivially small at 60 levels.

`visiblePlants()` is the mode-aware view of that set:

```js
function visiblePlants() {
  if (state.minigame === "vase" || state.minigame === "zpuzzle") return [];
  return state.availablePlants?.length ? state.availablePlants : plantOrder;
}
```

The two minigames show no seed bank (you do not plant from cards there), and normal levels fall back to the full catalog only if `availablePlants` is somehow empty — a defensive default rather than a crash.

## Wave scheduling: the four rules inside makeSchedule

When zombies appear, in which lane, and of what type is all computed once at level start by `makeSchedule()`:

```js
function makeSchedule(level) {
  const result = [];
  let t = 5.5;
  const waveAt = level.zombieCount >= 20
    ? [Math.floor(level.zombieCount * .48), level.zombieCount - 4]
    : [level.zombieCount - 3];
  for (let i = 0; i < level.zombieCount; i++) {
    const isWave = waveAt.includes(i);
    if (isWave) t += 4.5;
    let type;
    if (i >= level.zombieCount - level.zombieTypes.length) {
      type = level.zombieTypes[(i - (level.zombieCount - level.zombieTypes.length))
             % level.zombieTypes.length];
    } else {
      const typePoolSize = Math.min(
        level.zombieTypes.length,
        1 + Math.floor(i / Math.max(4, level.zombieCount / level.zombieTypes.length))
      );
      type = level.zombieTypes[i % Math.max(1, typePoolSize)];
    }
    if (type === "flag" && !isWave) type = "basic";
    if (isWave && level.zombieTypes.includes("flag")) type = "flag";
    const row = level.rows[(i * 3 + Math.floor(i / 3)) % level.rows.length];
    result.push({ time: t, type, row, wave: isWave });
    t += Math.max(2.25, 5.6 - level.zombieCount * .1);
  }
  return result.sort((a, b) => a.time - b.time);
}
```

Four independent rules stack here, each with a design intent.

**Rule one: a 5.5-second opening delay.** The player needs time to plant the first sunflowers and bank sun. 5.5 seconds is enough for two or three plants — no more, no less.

**Rule two: where the flag waves (waveAt) land.** Levels with ≥20 zombies get two flag waves, at 48% and four from the end; levels with fewer get one, three from the end. A flag wave adds 4.5 seconds of spacing (a breather) and forces the type to `flag` — flag zombies have more HP and move faster, the signal that "this wave is nasty." The line `if (type === "flag" && !isWave) type = "basic"` says: flag zombies only appear in flag waves; if one is randomly chosen otherwise, downgrade it to a basic zombie.

**Rule three: gradual escalation, full rotation at the end.** This is the cleverest part. The first half controls difficulty by growing the type pool:

```js
const typePoolSize = Math.min(
  level.zombieTypes.length,
  1 + Math.floor(i / Math.max(4, level.zombieCount / level.zombieTypes.length))
);
```

That means: the zeroth zombie can only be one type, and as `i` grows, more types become possible. A bucket zombie never shows up first; it unlocks as the waves deepen. The second half flips it:

```js
if (i >= level.zombieCount - level.zombieTypes.length) {
  type = level.zombieTypes[(i - ...) % level.zombieTypes.length];
}
```

The last `len(zombieTypes)` zombies **rotate through every type in the level**, guaranteeing "every type appears by the finale." This solves a concrete experience problem: with pure randomness, a rare zombie (say the balloon zombie) might never appear in a run, and the player would never practice countering it. Forced rotation guarantees that "the last few zombies of every level walk through that level's zombie catalog."

**Rule four: staggered lane assignment.** `row = level.rows[(i * 3 + Math.floor(i / 3)) % level.rows.length]`. `i * 3` puts adjacent zombies in different lanes, and `Math.floor(i / 3)` nudges it every three zombies, avoiding an obvious "every five zombies, one cycle" pattern. The formula makes zombies look scattered while staying deterministic — which is great for tests (same level, same order, exact assertions).

Finally `sort` by time returns an array in increasing time order. At runtime there is only a cursor, `state.spawned`, checked each frame for "is the next zombie due":

```js
while (state.spawned < state.schedule.length &&
       state.elapsed >= state.schedule[state.spawned].time) {
  const next = state.schedule[state.spawned++];
  spawnZombie(next.type, next.row);
  // ...
}
```

That is the "precompute plus cursor" pattern: scheduling is computed once at start, and runtime only does an O(1) pointer move.

## Plant behaviors: 24 ifs inside one updatePlants

The 24 plants behave differently: sunflowers produce sun, peashooters fire straight, threepeaters hit three lanes, cherry bombs explode in an area, chompers swallow, spikeweeds trample, magnets pull metal. All of it lives in one `updatePlants(dt)`, dispatched by type with `if / else if`:

```js
function updatePlants(dt) {
  for (const p of state.plants) {
    if (p.dead) continue;
    p.age += dt;
    p.action = Math.max(0, p.action - dt);

    if (p.type === "sunflower" || p.type === "twinsunflower" || p.type === "sunshroom") {
      // produce sun: when the timer hits zero, spawnSun; twin sunflower yields two
      // ...
    } else if (p.type === "peashooter" || p.type === "snowpea" || p.type === "repeater"
               || p.type === "puff" || p.type === "threepeater" || p.type === "cactus") {
      // shooters: only tick the cooldown when a target exists
      const rows = p.type === "threepeater"
        ? [p.row - 1, p.row, p.row + 1].filter(r => r >= 0 && r < ROWS)
        : [p.row];
      const maxRange = p.type === "puff" ? p.x + CELL_W * 3 : 1260;
      const hasTarget = () => rows.some(r =>
        state.zombies.some(z => attackableZombie(z) && z.row === r
          && z.x > p.x && z.x < maxRange && zombieVisible(z)));
      if (hasTarget()) {
        p.shootTimer -= dt;
        if (p.shootTimer <= 0) { /* push a projectile with per-plant params */ }
      } else {
        p.shootTimer = Math.min(p.shootTimer, .4);
      }
    } else if (p.type === "chomper") {
      // chomper: find the nearest in-range target, bite for 120
      // ...
    }
    // ... spikeweed, magnet, torchwood, fumeshroom ...
  }
}
```

Read it and several repeated techniques appear.

**Technique one: merge similar behaviors into one branch.** Six shooters (pea, snow, repeater, puff, threepeater, cactus) share one "has target → tick cooldown → fire" skeleton, differing only in parameters: threepeater's `rows` is `[row-1, row, row+1]`, puff's `maxRange` is only three cells, cactus's bullet carries `pierce: true`. Skeleton plus parameters lets six plants fit one `else if`.

**Technique two: check the target before ticking the cooldown.** Shooters do not fire blindly on a timer; they decrement `shootTimer` only when `hasTarget()` is true. With no target, `shootTimer` is clamped to at most 0.4 seconds — so when a zombie enters range, the first shot lands within 0.4s instead of waiting out a full cooldown. That detail is why "planting right as a zombie arrives" feels right.

**Technique three: `p.action` is a signal for the renderer.** Every shot, hit, and special sets `p.action = .18` or similar. `updatePlants` does not draw recoil; it only sets an "action timer." `drawPlant` reads `p.action > 0` and applies the offset or sway. That is the update/render discipline in concrete form.

**Technique four: mark dead, clean up uniformly.** Plants are never `splice`d inside the loop (which would break the in-progress `for...of`); they get `p.dead = true`, and after every system has run, `update()` filters them:

```js
state.plants = state.plants.filter(p => !p.dead);
state.zombies = state.zombies.filter(z => !z.dead || z.dying > 0);
state.projectiles = state.projectiles.filter(p => !p.dead && p.x < 1285);
state.suns = state.suns.filter(s => s.life > 0 && s.collectT < 1);
```

"Deferred deletion" is standard in game loops: deleting during iteration either skips the next element or leaves other systems holding a dead reference. Mark plus end-of-frame cleanup solves both at once.

## Zombie AI: 16 behaviors in one loop

`updateZombies(dt)` is more involved because it handles 16 zombies' special behaviors. Its structure is not "dispatch by type" but "do the shared move-and-attack, then layer specials on top":

```js
function updateZombies(dt) {
  for (const z of state.zombies) {
    if (z.dead) continue;
    z.age += dt;

    // digger: tunnel to the left edge, surface, then turn around and chew
    if (z.digging) { /* ... */ }
    // diver: submerge near plants (immune to bullets), surface past them
    if (z.type === "diver" && isWater(z.row)) { /* ... */ }
    // dancer: summon two backup dancers periodically
    if (z.type === "dancer" && attackableZombie(z)) { /* ... */ }
    // jackbox: a random box explosion, indiscriminate damage
    if (z.type === "jackbox" && attackableZombie(z)) { /* ... */ }
    // pole vaulter / pogo: vault over the first plant
    if (z.type === "pole" && !z.jumped) { /* ... */ }
    if (z.type === "pogo") { /* ... */ }
    // newspaper: berserk and speed up once the paper is broken
    if (z.type === "newspaper" && !z.newspaperAngry && z.hp < 120) { /* ... */ }

    // shared: balloon flight / find target and attack / advance / trigger mower
    if (z.balloon) { /* ... */ } else { /* find target -> attack or advance */ }
    if (z.x < 230 && !z.facingRight) { /* mower or defeat */ }
  }
}
```

**Special behaviors are additive, not dispatched.** Note the chain of independent `if`s (not `else if`), so a zombie can satisfy several at once — a diver runs the shared advance and also handles submerging. That is deliberate: most specials are "a patch on top of the shared behavior," not "a replacement."

**The diver shows the idea well:**

```js
if (z.type === "diver" && isWater(z.row)) {
  const ahead = state.plants.some(p => !p.dead && p.row === z.row
    && z.x - p.x >= -20 && z.x - p.x < CELL_W * 2.2);
  if (ahead && !z.submerged) { z.submerged = true; burst(z.x, z.y - 20, "#8fd4e4", 8, 70); }
  if (!ahead && z.submerged) { z.submerged = false; burst(z.x, z.y - 20, "#8fd4e4", 8, 70); }
}
```

There is no "diver state machine." Each frame it checks "is there a plant within 2.2 cells ahead," sets `submerged` accordingly, and sprays water on the flip. The projectile system then consults `z.submerged` to decide whether a bullet hits. Re-evaluating every frame instead of switching states halves the code and eliminates "stuck submerged forever" bugs.

**The shared attack logic is the only truly common part:**

```js
const target = state.plants
  .filter(p => !p.dead && p.type !== "spikeweed" && p.row === z.row
    && z.x >= p.x - 42 && z.x <= p.x + 50)
  .sort((a, b) => (b.layer ?? 1) - (a.layer ?? 1) || b.x - a.x)[0];

if (target) {
  z.attacking = true;
  z.attackTimer -= dt;
  if (z.attackTimer <= 0) {
    const big = z.type === "gargantuar";
    target.hp -= big ? 999 : 22;
    z.attackTimer = big ? 1.7 : .68;
    if (target.hp <= 0) removePlant(target);
  }
} else {
  z.attacking = false;
  const speedMul = z.stunUntil > state.time ? 0 : z.slowUntil > state.time ? .5 : 1;
  if (z.facingRight) z.x += z.speed * speedMul * dt;
  else z.x -= z.speed * speedMul * dt;
}
```

Three things to learn:

1. **Target selection is "lane plus x interval."** `z.x >= p.x - 42 && z.x <= p.x + 50` is a simple horizontal overlap test; `p.row === z.row` restricts it to one lane. No quadtree, no bounding boxes — Plants vs Zombies is fundamentally linear collision within a lane, and the lane is a natural isolation dimension.
2. **The sort `(b.layer ?? 1) - (a.layer ?? 1) || b.x - a.x`.** First by `layer` descending (a plant on a lily pad has a higher `layer` and is chewed first), then by x descending (farther right first). `?? 1` defaults plants without a `layer` to 1. One sort line encodes "chew the one on top first, then the front one."
3. **`speedMul` is the single exit for slow and stun.** Snow pea slows, kernel-pult stuns — both land on this one `speedMul`: `stunUntil > time` is 0 (frozen), `slowUntil > time` is 0.5, otherwise 1. Control effects never touch `z.x`; they only set timestamps.

Around that core sit three small helpers that encode the game's "what counts as a valid target" rules in one place each. `attackableZombie` is three negatives:

```js
function attackableZombie(z) {
  return !z.dead && !z.digging && !z.submerged;
}
```

A digging zombie is underground and cannot be shot; a submerged diver is under water and cannot be shot. Both are still alive and still moving, so every shooter and every projectile consults this one predicate instead of re-deriving "can I hit it" from scratch. Adding a new untargetable state means editing one line.

`zombieVisible` is the fog companion:

```js
function zombieVisible(z) {
  const level = LEVELS[state.levelIndex];
  if (!level.fog) return true;
  if (z.x < FOG_X) return true;
  return state.plants.some(p => !p.dead && p.type === "plantern" &&
    Math.hypot((p.row - z.row) * CELL_H, p.x - z.x) < LIGHT_RADIUS);
}
```

Outside fog, everything is visible. Inside fog, a zombie is visible only if it is left of the fog line or within a plantern's radius. Note the distance uses `(row - z.row) * CELL_H` for the vertical component — a Euclidean distance in board space, not a per-axis box — so the lit area is a circle, which matches the radial-gradient hole drawn on the fog layer. Shooter targeting calls `zombieVisible(z)`, so plants literally cannot shoot what the player cannot see.

`damageZombie` handles shields before HP:

```js
function damageZombie(z, dmg, explosive = false) {
  if (!explosive && z.shield > 0) {
    z.shield = Math.max(0, z.shield - dmg);
    z.hitFlash = .08;
    return;
  }
  z.hp -= dmg;
  z.hitFlash = .08;
  if (z.hp <= 0) killZombie(z, explosive);
}
```

The screen-door zombie's shield absorbs normal damage but not explosive damage, and the `explosive` flag is threaded through every damage source so a cherry bomb ignores shields. `hitFlash = .08` is a render-only signal: `drawZombie` reads it to flash white for 80ms on any hit.

The last line of defense is the lawnmower, and it is only a dozen lines:

```js
function updateMowers(dt) {
  for (const mower of state.mowers) {
    if (mower.active && !mower.gone) {
      mower.x += 590 * dt;
      for (const z of state.zombies) {
        if (!z.dead && z.row === mower.row && Math.abs(z.x - mower.x) < 62) killZombie(z, true);
      }
      if (mower.x > 1300) mower.gone = true;
    }
  }
}
```

A mower is a one-shot projectile tied to a lane: once `z.x < 230` in `updateZombies` sets `mower.active = true`, it races right at 590px/s, instantly kills anything within 62 pixels in its lane, and marks itself `gone` past x=1300. There is no health, no collision response — `killZombie(z, true)` is the explosive path, so it ignores shields too. The asymmetry matters: if the mower is already gone when a zombie reaches the house, `updateZombies` calls `finish(false)`. So the mower is not a safety net you can rely on forever; each lane gets exactly one, and using it is a visible mistake.

## Projectiles: three motion models

`updateProjectiles(dt)` handles three trajectories. It does not branch by "bullet type" but by "motion model":

```js
function updateProjectiles(dt) {
  for (const p of state.projectiles) {
    if (p.dead) continue;
    p.age += dt;
    if (p.lob) {
      // lob (cabbage / kernel / melon): parabola, landing at the target x
      // ...
    } else {
      // straight (pea / snow / repeater / cactus / threepeater): move by vx
      p.x += p.vx * dt;
      // ...
    }
  }
}
```

**Straight** is simplest: `x += vx * dt` each frame, then check whether a zombie in that lane is hit. A hit is "the bullet's x is near the zombie's x"; on a hit, `p.dead = true`. The cactus bullet carries `pierce: true` and a `pierced` array: it does not die on the first hit, it records the zombie in `pierced` and keeps flying — that is "piercing."

**Lob** adds a `lob` flag and landing computation. It does not travel horizontally; it arcs from the thrower's head to the target position. Because on the roof "straight shooters fail" (bullets are blocked by the slope), the lobbers must arc over the slope. That makes "lobbers on the roof, shooters on flat ground" a strategy with a physical basis rather than an arbitrary rule.

**All three models share one array**, `state.projectiles`, distinguished by fields (`lob`, `pierce`). That is easier than three arrays: `draw`, collision, and cleanup iterate one array, and adding a trajectory is one field plus a small branch.

## Sprite fallback: GIF to PNG to hand-drawn code

This is the most reusable piece of engineering in the project. Sprite loading is not "load or fail"; it is a three-level fallback:

```js
const spriteSources = {
  sunflower: ["assets/pvz/images/SunFlower.gif", "assets/pvz/images/SunFlower.png"],
  peashooter: ["assets/pvz/images/Peashooter.gif", "assets/pvz/images/Peashooter.png"],
  // ...
};

function loadSprite(type, sourceIndex = 0) {
  const sources = spriteSources[type];
  if (!sources || sourceIndex >= sources.length) return;
  const image = new Image();
  image.decoding = "async";
  image.onload = () => { sprites[type] = image; };
  image.onerror = () => loadSprite(type, sourceIndex + 1);
  image.src = sources[sourceIndex];
}
```

`image.onerror = () => loadSprite(type, sourceIndex + 1)` is the fallback: if the GIF fails, try the next entry in the array (usually the PNG); if all fail, the function returns and `sprites[type]` stays undefined.

**The third level lives in the renderer.** `drawPlant` tries the sprite first, and if it cannot draw one, falls back to hand-drawn code:

```js
let sprite = sprites[p.type], sw = 88, sh = 104, bottom = 38;
// ... pick a sprite by health and state ...
if (drawSprite(sprite, 0, bottom, sw, sh)) {
  if (LEVELS[state.levelIndex].theme === "roof") drawFlowerPot();
  ctx.restore();
  return;
}
// no sprite -> hand-draw
if (p.type === "sunflower") drawSunflower(p);
if (p.type === "peashooter") drawPeashooter(p);
if (p.type === "wallnut") drawWallnut(p, health);
// ... 24 plant draw functions ...
```

`drawSprite` returns `false` when the sprite is missing, so `drawPlant` falls through to the matching hand-drawn function. Every one of the 24 plants and 16 zombies has a hand-drawn version assembled from `ctx.arc`, `ctx.ellipse`, `ctx.fillRect`, and `ctx.quadraticCurveTo`.

The value is graceful degradation: even with zero assets loaded (offline, wrong path, CDN down), the game is fully playable — the art just changes from GIF animation to flat shapes. For a fan project, that is both robustness and an escape hatch when asset licensing is a concern.

## Procedural animation: making static PNGs move

The fallback creates a side effect: some plants have no GIF, only a static PNG. Drawn as-is, the field is a pile of unmoving stickers next to animated GIF plants.

The fix is to layer procedural animation onto static sprites:

```js
const STATIC_SPRITES = new Set([
  "twinsunflower", "sunshroom", "lilypad", "plantern", "puff",
  "cabbage", "kernel", "melon", "chomper", "threepeater",
  "spikeweed", "tallnut", "garlic", "torchwood", "fumeshroom"
]);

// inside drawPlant:
const bob = Math.sin(p.age * 2.6 + p.row) * 2;
const hurt = p.action > 0 && p.hp < p.maxHp ? Math.sin(p.action * 48) * 3 : 0;
ctx.translate(p.x + hurt, sceneY(p.y + bob, p.x));
if (STATIC_SPRITES.has(p.type)) {
  ctx.rotate(Math.sin(p.age * 2 + p.row) * .045);
  if (p.action > 0 && p.type !== "spikeweed") ctx.translate(-4, 0);
}
```

Three procedural animations stack:

- **Breathing bob:** `Math.sin(p.age * 2.6 + p.row) * 2` floats the plant two pixels up and down. The `+ p.row` is a phase offset so plants in the same column do not bob in perfect sync.
- **Gentle sway:** only for static art, `Math.sin(p.age * 2 + p.row) * .045` radians (about 2.6 degrees). This removes most of the "sticker" feel; static PNGs sway as if in a breeze.
- **Attack recoil:** when `p.action > 0` (just fired or just took a hit), the plant shifts four pixels left. Combined with the high-frequency `Math.sin(p.action * 48) * 3` shake, it reads as "got hit."

The beauty is that these do not care about the sprite source: GIF plants also bob and flash on damage; static PNGs merely add sway and recoil. So both art batches look consistent in the same scene.

`drawSprite` is the other half of making mixed art look uniform. It fits every image into a box while preserving aspect ratio, and anchors it at the bottom center:

```js
function drawSprite(image, centerX, bottomY, maxWidth, maxHeight) {
  if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) return false;
  const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(image, centerX - width / 2, bottomY - height, width, height);
  return true;
}
```

`Math.min` (fit-inside, not fill) means a wide sprite and a tall sprite both end up no larger than the box, so a sunflower and a tall-nut share a visual scale without either overflowing its cell. Anchoring at `bottomY - height` is what makes the plants "stand" on the cell instead of floating; the same anchor works for GIF and PNG because it depends on the drawn height, not the source. The `naturalWidth`/`naturalHeight` check is also the real load signal — an `<img>` with a broken `src` has `complete = true` but `naturalWidth = 0`, so this guard is what correctly returns `false` and triggers the hand-drawn fallback.

Health-based sprite swaps piggyback on the same call. A wall-nut picks among three sprites by HP fraction (`health < .32` is its most cracked state, `< .65` is lightly cracked, otherwise intact), and a potato mine swaps to `potatoArmed` once `p.armed` flips. The swap is just a different `sprite` variable before one `drawSprite` call — no special-case rendering path, so a cracked wall-nut still gets the same bob, sway, and shadow as an intact one.

## Water: why you must plant a lily pad first

The pool level's core constraint is "water cells cannot host ground plants." It is written in a six-line function:

```js
function isWater(row) {
  const level = LEVELS[state.levelIndex];
  return !!(level.waterRows && level.waterRows.includes(row));
}

function canPlantAt(type, row, col) {
  const existing = plantAt(row, col);
  if (isWater(row) && !existing) return type === "lilypad";
  if (existing) return existing.type === "lilypad" && type !== "lilypad";
  return true;
}
```

The three lines of `canPlantAt` map to three cases:

1. **Water and empty:** only a lily pad (`type === "lilypad"`).
2. **Already occupied:** only when the existing one is a lily pad and the new one is not a lily pad — that is "stacking," the lily pad is a platform and the plant sits on top.
3. **Ordinary cell:** anything goes.

The function is called in three places: on hover (to color the cell), on click (to allow planting), and in tests (to assert the rule directly). One definition, three reuses — the payoff of writing the rule as a pure function.

**Water rendering** is a separate system. `drawWaterRows()` paints the blue water, ripples, and foam, and `drawPoolCoping()` draws the stone edge. A lily pad gets an extra oval shadow and a ripple, and the plant's "feet" sink below the surface — all in the `draw` family, fully decoupled from `canPlantAt`.

## Fog: an offscreen canvas plus destination-out holes

The fog level is the most interesting. The intuitive approach is "paste a semi-transparent fog image over the screen," but then a plantern cannot light anything — fog is an opaque overlay. The author uses canvas compositing:

```js
const fogLayer = (() => {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  return c;
})();

function drawFog() {
  const level = LEVELS[state.levelIndex];
  if (!level.fog) return;
  const fc = fogLayer.getContext("2d");
  fc.clearRect(0, 0, W, H);
  // ... paint the fog body as semi-transparent rectangles and ellipses ...
  fc.globalCompositeOperation = "destination-out"; // the key: punch holes
  for (const p of state.plants) {
    if (p.dead || p.type !== "plantern") continue;
    const g = fc.createRadialGradient(p.x, p.y, 30, p.x, p.y, LIGHT_RADIUS + 30);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(.75, "rgba(0,0,0,.85)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    fc.fillStyle = g;
    fc.beginPath();
    fc.arc(p.x, p.y, LIGHT_RADIUS + 30, 0, Math.PI * 2);
    fc.fill();
  }
  fc.globalCompositeOperation = "source-over";
  // ... drawImage the whole fogLayer onto the main canvas ...
}
```

The key is `globalCompositeOperation = "destination-out"`. Normal drawing is "paint over" (`source-over`); `destination-out` is "erase" — it uses the new shape's alpha to cut pixels out of what is already there. So:

1. Paint fog across `fogLayer` (semi-transparent gray).
2. Switch to `destination-out`, draw a radial gradient circle at each plantern. The gradient goes from alpha 1 at the center to alpha 0 at the edge — "erase fully at the center, fade out toward the rim."
3. Switch back to `source-over` and `drawImage` the whole fog layer onto the main canvas.

The result: fog is a solid layer, but each plantern "lights" a soft translucent patch through it. This technique is common in canvas games (masks, spotlights, vision cones), but it is often misused — many first reach for "stack several opaque rectangles," which gives hard edges and poor gradients.

The fog also moves, and the motion is entirely procedural — no frames, no textures. A slow sine drift slides the main body sideways, and three smaller ellipses wander along the fog edge on their own phases:

```js
const drift = Math.sin(state.time * .25) * 14;
// ... main fog ellipse centered at fogX + (W - fogX) / 2 + drift ...
for (let i = 0; i < 3; i++) {
  const a = state.time * .22 + i * 2.1;
  const ex = fogX + 120 + i * 200 + Math.sin(a) * 26;
  const ey = FIELD_Y + 60 + ((i * 71) % (ROWS * CELL_H - 130)) + Math.cos(a * .8) * 16;
  fc.beginPath();
  fc.ellipse(ex, ey, 64 + Math.sin(a * 1.3) * 14, 28, a * .4, 0, Math.PI * 2);
  fc.fill();
}
```

Each ripple has its own phase (`i * 2.1`), its own drift radius, and a wobbling width (`64 + Math.sin(a * 1.3) * 14`), so the fog edge never looks like a repeating pattern. Because it all derives from `state.time`, it pauses when the game pauses and resumes exactly where it left off — no separate animation clock to keep in sync. The same "everything hangs off `state.time`" rule drives the clouds, the water foam, and the breathing bob, which is why pausing the game freezes the whole scene coherently.

The offscreen `fogLayer` is created once when the file loads (inside the IIFE); each frame only `clearRect` and repaints, never `createElement` again. That is a basic loop discipline: **never allocate an object you could reuse every frame.**

## The roof: the chain reaction of one slope function

The roof level concentrates "terrain affects gameplay." It has a simple slope function:

```js
// Roof slope: a gabled ridge, high in the middle, low on the sides (visual only, no collision)
const ROOF_RISE = 110;
const ROOF_ROW_SCALE = .87;
const ROOF_PLAYFIELD_LIFT = -24;

function slopeAt(x) {
  const level = LEVELS[state.levelIndex];
  if (level.theme !== "roof") return 0;
  const mid = (FIELD_X + LAWN_RIGHT) / 2;
  const half = (LAWN_RIGHT - FIELD_X) / 2;
  const t = Math.max(0, Math.min(1, 1 - Math.abs(x - mid) / half)); // 1 at the ridge, 0 at the sides
  return -t * ROOF_RISE;
}

function sceneY(baseY, x) {
  if (LEVELS[state.levelIndex].theme !== "roof") return baseY;
  return FIELD_Y + (baseY - FIELD_Y) * ROOF_ROW_SCALE + surfaceOffsetAt(x)
         + ROOF_PLAYFIELD_LIFT;
}

function boardYFromScene(y, x) {
  if (LEVELS[state.levelIndex].theme !== "roof") return y;
  return FIELD_Y + (y - FIELD_Y - surfaceOffsetAt(x) - ROOF_PLAYFIELD_LIFT) / ROOF_ROW_SCALE;
}
```

`slopeAt` is a triangular ridge: highest at the center (`t = 1`), falling linearly to the sides. Every "grounded" object (plants, zombies, bullets) passes through `sceneY` when drawn, converting "board coordinates" to "screen coordinates."

Note `ROOF_ROW_SCALE = .87`: lane spacing is compressed to 87% on the roof, because lanes look tighter on a slope. So `sceneY` is not just a slope offset; it also applies a vertical scale.

`boardYFromScene` is the inverse — converting screen coordinates back to board coordinates. Why the inverse? Because a mouse click gives screen coordinates, and "which cell did I hit" must be computed in board space. A forward/inverse pair guarantees that render and input use the same coordinate transform, so you never get "the position I see and the position I click are half a cell apart."

**There is an important trade-off, and the comment says it plainly: `visual only, no collision`.** The slope only changes render position; collision still uses flat lane numbers and x intervals. That means:

- Benefit: collision never has to know the roof exists; the `z.row === p.row && z.x >= p.x - 42` logic is identical on the roof and in the pool.
- Cost: the visual height difference is not collision-authoritative. In theory, a zombie at the ridge and a plant at the eave are 100+ pixels apart on screen yet collide as if in the same lane. Because lanes advance horizontally and vertical position does not affect hits, it does not feel wrong in play — but it is a classic "approximate the visuals to keep the logic simple" trade.

Why the inverse function is not optional shows up in input handling. A pointer event gives viewport pixels; the game needs a cell. The conversion is two steps:

```js
function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * W / rect.width,
    y: (event.clientY - rect.top) * H / rect.height
  };
}

function updateHover(event) {
  const pos = pointerPosition(event);
  state.hover.x = pos.x; state.hover.y = pos.y;
  const boardY = boardYFromScene(pos.y, pos.x);       // undo the roof slope
  state.hover.col = Math.floor((pos.x - FIELD_X) / CELL_W);
  state.hover.row = Math.floor((boardY - FIELD_Y) / CELL_H);
  if (state.hover.col < 0 || state.hover.col >= COLS ||
      state.hover.row < 0 || state.hover.row >= ROWS ||
      !state.activeRows.includes(state.hover.row)) {
    state.hover.col = -1; state.hover.row = -1;
  }
  // ... set the cursor to default / pointer / crosshair based on what is under it ...
}
```

`pointerPosition` handles the CSS scaling: the canvas is 1280×720 internally but may be displayed smaller, so `* W / rect.width` maps viewport pixels back into canvas pixels. Then `boardYFromScene` undoes the roof transform before the row is computed — that is the whole reason the inverse exists. Without it, clicking a plant on the roof would be off by the slope at that x: the higher up the ridge you click, the more the row would drift. The bounds check also rejects lanes the level does not use (`activeRows`), so a level with only three active lanes cannot plant in the other two.

The same `boardYFromScene` is used in the click handler for the I-zombie mode, which is why one function serves both hover and click. And `plantAt(row, col)` is the read-side mirror of `addPlant`: it filters by row and column, drops dead plants, and sorts by `layer` so callers always get the topmost occupant of a cell.

## Sun economy and the cooldown loop

The entire economy is two resources: sun and cooldown. Sun is money; cooldown is each card's personal breather.

Sun has three sources: sky drops (day chapters), plant output, and starting sun. The sky draft is three lines in `update`:

```js
state.skySunTimer -= dt;
if (LEVELS[state.levelIndex].skySuns && state.skySunTimer <= 0) {
  spawnSun(330 + Math.random() * 700, -35, "sky");
  state.skySunTimer = 8 + Math.random() * 2.5;
}
```

`skySuns` is a level field — night chapters have no sky sun, so the whole block is skipped. The interval is `8 + random * 2.5` seconds, not fixed, so sun does not fall with a mechanical rhythm. The x coordinate is random in `330..1030`, right above the lawn.

Plant output lives in `updatePlants`, and the core is "when the timer hits zero, produce, then reset it":

```js
p.sunTimer -= dt;
if (p.sunTimer <= 0) {
  if (p.type === "twinsunflower") {
    spawnSun(p.x - 18, p.y - 38, "plant", 50);
    spawnSun(p.x + 18, p.y - 38, "plant", 50);   // twin sunflower yields two
  } else {
    spawnSun(p.x, p.y - 35, "plant", p.type === "sunshroom" && p.age < 30 ? 25 : 50);
  }
  p.sunTimer = 14.5;
  p.action = .8;
}
```

Two details: the twin sunflower yields two at once (left and right), and the sun-shroom yields 50 only after it "grows" (`age >= 30`), 25 before. `p.action = .8` is the signal to the renderer for the production animation.

The cooldown is even simpler — a per-frame decremented dictionary:

```js
plantOrder.forEach(type => state.cooldowns[type] = Math.max(0, state.cooldowns[type] - dt));
```

Selecting a card checks `state.cooldowns[type] <= 0 && state.sun >= def.cost`; planting sets `state.cooldowns[type] = def.cooldown`. Every card shares one "decrement a little each frame" rule, with no per-card timer objects.

Sound is built the same way: no audio files, only synthesized beeps. One AudioContext is created lazily on the first user interaction (browsers block audio before a gesture), and a single `beep` builds an oscillator and an envelope:

```js
function beep(freq, duration, volume = 0.05, wave = "sine", slide = 0) {
  if (!state.sound || !state.audio) return;
  const now = state.audio.currentTime;
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(state.audio.destination);
  osc.start(now);
  osc.stop(now + duration);
}
```

A named `sound(name)` maps game events to one or two beeps: planting is a short downward triangle, a sun pickup is two rising sine notes, a shot is a tiny 45ms square, an explosion is a low sawtooth, and winning is a three-note arpeggio (392 / 523 / 659 Hz) scheduled with `setTimeout`. The exponential ramp to `0.0001` (not 0) is deliberate — Web Audio requires a strictly positive target for `exponentialRampToValueAtTime`, so 0.0001 is the conventional "silence" value. There is no asset to download and no autoplay problem to solve: the first click starts the context, and the whole soundtrack is a few hundred bytes of parameters.

## Three extra modes: vase breaker, I zombie, endless

Beyond adventure mode there are three modes. They reuse the same engine but change the win condition and some interactions.

**Vase breaker** is a random blind box: 30 vases scattered; smashing one may reveal a plant, sun, or a zombie. State lives in `state.vases` (a 2D array); `smashVase(row, col)` breaks one and `plantVaseCard()` plants a card from a vase. The win condition is `state.vases.every(row => row.every(v => v.broken)) && state.zombies.length === 0` — every vase opened and the field cleared of zombies.

**I zombie** reverses attacker and defender: you control the zombies, spend "brains" (100–160 to start) to buy zombies, and try to eat every plant. The cost table is a constant:

```js
const ZPUZZLE_COSTS = { basic: 10, cone: 15, newspaper: 20, pole: 25,
                        bucket: 25, balloon: 25, digger: 25 /* ... */ };
```

The boards are defined as character art:

```js
const ZPUZZLE_MAP = { ".": null, S: "sunflower", P: "peashooter",
                      N: "snowpea", W: "wallnut", T: "potato" /* ... */ };
```

An array of strings is a board: `.` is empty, and `S`/`P`/`N`/`W`/`T` are preset plants. Character-art levels keep three boards compact, readable at a glance, and easy to edit.

The win/lose check is in `update`:

```js
} else if (state.minigame === "zpuzzle") {
  const alivePlants = state.plants.filter(p => !p.dead).length;
  const aliveZombies = state.zombies.filter(z => !z.dead).length;
  if (alivePlants === 0) finish(true);       // all plants eaten -> win
  else if (aliveZombies === 0 && state.brains < Math.min(...Object.values(ZPUZZLE_COSTS))) {
    finish(false);                            // no zombies and can't afford the cheapest -> lose
  }
}
```

The second condition is the clever bit: you do not lose when your zombies die, only when they are gone *and* you cannot afford the cheapest zombie. So a player whose zombies died but who still has brains can keep buying, and the game does not end abruptly.

**Endless** reuses adventure levels but automatically starts the next wave:

```js
} else if (state.spawned >= state.schedule.length && state.zombies.length === 0 && state.elapsed > 6) {
  if (state.endless) beginEndlessWave(state.wave + 1);
  else finish(true);
}
```

`beginEndlessWave(wave)` scales zombie types and counts with the wave; two pure functions, `endlessTypes(wave)` and `endlessPlants(wave)`, decide what a wave can spawn and what gets unlocked.

Those two functions are driven by literal rosters — arrays of allowed types per tier — and a small tier formula:

```js
function endlessTypes(wave) {
  const tier = wave <= 1 ? 0 : wave <= 3 ? 1 : wave <= 5 ? 2 : wave <= 7 ? 3
             : wave <= 9 ? 4 : wave <= 12 ? 5 : wave <= 15 ? 6 : wave <= 18 ? 7
             : wave <= 21 ? 8 : 9;
  const arr = [...ENDLESS_TYPE_ROSTER[tier]];
  if (wave % 5 === 0 && !arr.includes("flag")) arr.push("flag");
  return arr;
}
```

`ENDLESS_TYPE_ROSTER` is ten progressively larger arrays: tier 0 is `["basic"]`, tier 9 ends with the gargantuar. The nested ternary is ugly but honest — it is a hand-tuned curve, not a formula pretending to be elegant. The `wave % 5 === 0` line adds a flag wave every fifth wave for rhythm. `endlessPlants` does the same for the plant roster, so the player's available plants also widen as waves climb. Both return fresh arrays (`[...]`) so the mutation in `beginEndlessWave` never corrupts the shared constant — a small but important detail when your "data" is also referenced everywhere.

All four modes converge on one `finish(won)` function, and its shape is a lesson in keeping branching shallow:

```js
function finish(won) {
  state.mode = won ? "won" : "lost";
  const level = LEVELS[state.levelIndex];
  if (state.endless) { /* show wave reached, hide "next" */ }
  else if (state.minigame === "vase") { /* show vases cleared or not */ }
  else if (state.minigame === "zpuzzle") { /* brains eaten or not */ }
  else {
    /* adventure: show level id, and on a win unlock the next level */
    if (won && state.levelIndex < LEVELS.length - 1) {
      state.unlockedLevel = Math.max(state.unlockedLevel, state.levelIndex + 1);
      if (!unlockAllEnabled()) localStorage.setItem("pvz-adventure-level", String(state.unlockedLevel));
    }
  }
  if (won && !state.endless && !state.minigame && level.reward) {
    const owned = state.ownedBefore?.includes(level.reward);
    rewardName.textContent = owned
      ? `已拥有：${plantDefs[level.reward].name}`
      : `获得：${plantDefs[level.reward].name}`;
  }
  sound(won ? "win" : "lose");
}
```

Three details are worth calling out. Progression is written here and only here — `unlockedLevel` advances, and `localStorage` is updated only when the test-unlock flag is off, so `?unlock` never corrupts a real save. The reward is idempotent: it checks `state.ownedBefore` (the set computed before this level) and says "already owned" instead of pretending every clear is a fresh unlock. And the whole function ends with a single `sound(...)`, so every mode shares the same audio cue. The branching is a flat chain of `if / else if` over the mode, not nested conditionals — which is what keeps four modes readable in one screen.

## The test hook: designing window.__pvzTest

A game inside an IIFE is fully closed to the outside — which is good, but it makes automated testing impossible: you cannot `import` anything and you cannot reach `state`.

The solution is a deliberate test window:

```js
window.__pvzTest = {
  get LEVELS() { return LEVELS; },
  get state() { return state; },
  get plantDefs() { return plantDefs; },
  get zombieDefs() { return zombieDefs; },
  startLevel(i) { prepareLevel(i); startGame(); },
  setProgress(n) { localStorage.setItem("pvz-adventure-level", String(n)); },
  plantAt: (row, col) => plantAt(row, col),
  addPlant: (type, row, col) => addPlant(type, row, col),
  canPlantAt: (type, row, col) => canPlantAt(type, row, col),
  spawnZombie(type, row, x) { const z = spawnZombie(type, row); if (x !== undefined) z.x = x; return z; },
  zombieVisible: z => zombieVisible(z),
  damageZombie: (z, d, explosive) => damageZombie(z, d, explosive),
  makeSchedule: level => makeSchedule(level),
  updateOnce(dt) { update(dt); },
  hasSprite: type => !!sprites[type],
  slopeAt: x => slopeAt(x),
  startEndless() { startEndless(); },
  startVase() { startVase(); },
  smashVase: (row, col) => smashVase(row, col),
  plantVaseCard: (type, row, col) => plantVaseCard(type, row, col),
  beginEndlessWave: wave => beginEndlessWave(wave),
  startZombiePuzzle(index) { startZombiePuzzle(index); },
  spawnPuzzleZombie: (type, row) => spawnPuzzleZombie(type, row),
  get ZPUZZLE_COSTS() { return ZPUZZLE_COSTS; },
  get ZPUZZLE_BOARDS() { return ZPUZZLE_BOARDS; }
};
```

Three design decisions stand out.

**Getters, not assignments.** `get LEVELS() { return LEVELS; }` returns the current reference every time instead of copying it when `window.__pvzTest` is created. So even if `LEVELS` is mutated later, the test sees the latest.

**Only pure functions and controlled mutations.** `canPlantAt`, `makeSchedule`, `slopeAt` are pure and can be asserted directly; `startLevel`, `addPlant`, `spawnZombie` are controlled mutations tests can use to build any scene. It does not expose the whole `update` loop; it exposes `updateOnce(dt)` so a test can advance exactly one frame.

**`updateOnce` is the key to controlling time.** The game itself is driven by `requestAnimationFrame`, and a test cannot "wait three seconds for the game to run." But `updateOnce(0.016)` lets a test advance 16ms, frame by frame. That is the value of abstracting time into a parameter you can pass in — it turns an untestable real-time loop into a testable pure function.

## E2E-testing canvas: when getImageData is unavailable

With the hook, logic is testable. But how do you test "the picture is drawn correctly"? There is a beautiful solution in `tests/pool.spec.js`.

The problem first: the pool level must verify "water lanes are actually drawn blue." The intuitive way is `getImageData`. But here that path is closed — the game is opened via `file://`, the background is a local file, the canvas is *tainted*, and any `getImageData` throws `SecurityError`.

The author's answer: screenshot with Playwright, then **decode the PNG pixels by hand**:

```js
test("pool water lane renders blue (still visible after the background composites)", async ({ page }) => {
  await page.evaluate(() => {
    window.__pvzTest.state.unlockedLevel = 20;
    window.__pvzTest.startLevel(20);
  });
  await page.waitForFunction(() => window.__pvzTest.hasSprite("background"));
  await page.waitForTimeout(50); // wait for the frame after the background composites

  // canvas-internal coords -> viewport coords (.stage is centered and scaled)
  const t = await page.evaluate(() => {
    const r = document.querySelector("#gameCanvas").getBoundingClientRect();
    return {
      x: Math.round(r.x + 568.5 * r.width / 1280),
      y: Math.round(r.y + 415 * r.height / 720)
    };
  });

  // capture 3x3 and read the center pixel; canvas is tainted by the file:// background
  const buf = await page.screenshot({ clip: { x: t.x - 1, y: t.y - 1, width: 3, height: 3 } });
  const px = decodePngPixel(buf, 1, 1);
  // discriminator: water gradient has green < blue; grass JPG has green >> blue
  expect(px[1]).toBeLessThan(px[2]);
});
```

The companion `decodePngPixel` is a hand-written PNG decoder:

```js
function decodePngPixel(buf, x, y) {
  // parse IHDR for dimensions and color type, collect IDAT chunks, inflate
  // then undo the PNG row filters (0-4) row by row
  const bpp = colorType === 6 ? 4 : 3;
  const stride = w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(stride * h);
  for (let row = 0; row < h; row++) {
    const f = raw[row * (stride + 1)];
    // ... undo Sub/Up/Average/Paeth by filter type ...
  }
  const idx = (y * w + x) * bpp;
  return [out[idx], out[idx + 1], out[idx + 2]];
}
```

That code fully implements PNG's row filters (Sub / Up / Average / Paeth). Why go this far? Because it is the only way to verify the render when the browser API is unavailable.

What is really worth learning is the **assertion**:

```js
expect(px[1]).toBeLessThan(px[2]); // green channel < blue channel -> bluish
```

It does not assert "the pixel equals `(33,126,170)`" — that would fail on antialiasing, scaling, or GPU differences. It asserts a **relationship**: the blue channel is greater than the green. Grass has far more green than blue; water is the opposite. A robust inequality beats a fragile exact value — that is how pixel-level tests survive.

Two easily missed details in this test:

- **The `waitForTimeout(50)` has its reason in the comment.** `hasSprite` only guarantees the image loaded, not that it has been `drawImage`d into the current frame. Waiting 50ms waits for "the frame after loading."
- **Page coordinates are converted with `getBoundingClientRect`.** The canvas is 1280×720 internally, but may be CSS-scaled on screen (`.stage` is centered and scaled), so the screenshot coordinates must account for the real display size.

The other fifteen suites follow the same principle: assert the smallest observable thing that proves the rule. `levels.spec.js` is the best example, because it tests both the happy path and the nasty edges of save migration. It first pins the whole level table:

```js
const ids = await page.evaluate(() => window.__pvzTest.LEVELS.map(l => l.id));
expect(ids.length).toBe(60);
expect(ids[0]).toBe("1-1");
expect(ids[9]).toBe("1-10");
expect(ids[10]).toBe("2-1");
expect(ids[20]).toBe("3-1");
expect(ids[40]).toBe("5-1");
expect(ids[50]).toBe("6-1");
expect(ids[59]).toBe("6-10");
```

Then it exercises the migration with four cases that a careless implementation would get wrong: an old save at index 13 (old `3-2`) must become new index 41 (`5-2`), with the version stamp written; a versioned save is read directly without re-migrating; a negative save is clamped to 0 rather than throwing; and a non-integer save (`2.5`) floors to 2. The last two also attach a `pageerror` listener and assert the array is empty — so "does not crash" is a real assertion, not a hope. The remaining suites cover plants, plant behaviors, sun plants, lobbers, zombies, special zombies, pool, roof, fog, endless, vase, and I-zombie. The lesson is that a testable game is not one with *more* tests; it is one designed so each rule can be observed in isolation through a narrow hook.

## Save migration: mapping old level IDs to new chapters

The game originally had 22 levels (5 day + 7 night + 10 pool) and later grew to 60. That creates a concrete problem: an old save's `pvz-adventure-level` holds an **index into the old order**, and applying it to the new table shifts everything.

The fix is a versioned migration:

```js
const OLD_LEVEL_IDS = [
  ...Array.from({ length: 5 }, (_, i) => `1-${i + 1}`),
  ...Array.from({ length: 7 }, (_, i) => `2-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `3-${i + 1}`)
];

function loadProgress() {
  if (unlockAllEnabled()) return LEVELS.length - 1;
  const saved = Math.floor(Number(localStorage.getItem("pvz-adventure-level")));
  if (!Number.isFinite(saved)) return 0;
  if (localStorage.getItem("pvz-version") === "2") {
    return Math.max(0, Math.min(LEVELS.length - 1, saved));
  }
  // old save: map the old ID onto the new level table
  const oldId = OLD_LEVEL_IDS[saved];
  const newId = oldId ? oldId.replace(/^3-/, "5-") : null;
  const idx = newId ? LEVELS.findIndex(l => l.id === newId) : -1;
  const migrated = idx >= 0 ? idx : Math.max(0, Math.min(saved, LEVELS.length - 1));
  localStorage.setItem("pvz-version", "2");
  localStorage.setItem("pvz-adventure-level", String(migrated));
  return migrated;
}
```

The core is `OLD_LEVEL_IDS[saved]`: translate the old index into an old ID (`1-1` .. `3-10`), then `replace(/^3-/, "5-")` maps the old pool chapter (`3-*`) onto the new one (`5-*`). Because the new build moved the pool from chapter 3 to chapter 5 (inserting fog and roof before it), that replacement is essential.

After migrating, it immediately writes back `pvz-version = "2"`, so next launch takes the `if` branch and never re-migrates. That is the standard "one-time data migration" pattern: **read old format → convert → stamp a version → write back**. It guarantees idempotency — the migration runs once and is safe to repeat.

## Known limits: an honest list

A project's maturity shows in whether it documents its weak spots. This one has several deliberate trade-offs worth listing:

| Limit | What it means | Why this choice |
| --- | --- | --- |
| One file | 3,731 lines all in `game.js`, no module split | No load order, no bundler; cost is a big file |
| Approximate collision | Lane + x interval, not a physics engine | Gameplay is linear within a lane; a physics engine is overkill |
| Roof is visual-only | Slope changes render, not collision | Collision need not know terrain; cost is imprecise height |
| `dt` capped at 34ms | A long suspend "slow-mo"s instead of catching up | Anti-clipping beats strict time sync |
| Fog uses an offscreen canvas | Repaints the whole fog layer each frame | Simple and direct; cost is a full-screen draw |
| Third fallback is hand-drawn | No-asset case draws in code | Graceful degradation; cost is cruder art |
| Difficulty is data-driven | Waves, HP, lanes live in level objects | Rebalance by editing data; cost is no dynamic difficulty |

The two most important are "roof is visual-only" and "`dt` cap." The first means, in theory, a zombie at the ridge and a plant at the eave are 100+ pixels apart visually but collide as the same lane; because the game advances horizontally and vertical position does not affect hits, it does not feel wrong — but if you wanted a game where the vertical axis also participates in collision, this approximation would not be enough. The `dt` cap is an explicit value judgment: rather than let a returning tab teleport zombies through the line, accept a "slow-mo" hiccup.

## If I rewrote it, these five things first

If I rebuilt this repo, I would change five things in priority order.

**One: split `game.js` into a few logical modules.** Not fine-grained ES modules (which reintroduce load-order issues), but four or five "large responsibility" files: `data.js` (plantDefs / zombieDefs / LEVELS), `update.js` (all `update*`), `draw.js` (all `draw*`), `modes.js` (adventure / vase / I zombie / endless), `main.js` (loop plus hook). The biggest pain in a single file is finding code; one cut along responsibilities solves most of it.

**Two: turn plant behaviors from an `if/else` chain into a behavior table.** Today 24 plants share one huge `updatePlants`; adding a plant means editing that function. Better: each plant carries an `update(p, dt, ctx)` function and `updatePlants` just iterates. Then "add a plant" becomes "add data," not "edit a 2,000-line function."

**Three: make the visual/logic split of collision explicit.** `sceneY` / `boardYFromScene` are already a forward/inverse pair, but "roof is visually high, logically flat" is implicit. An explicit "logical grid plus visual transform" two-layer structure would let a future height-sensitive level avoid a rewrite.

**Four: replace the `dt` cap with a fixed-step accumulator.** `Math.min(.034, dt)` prevents clipping but slows the whole game on a slow machine. A fixed step (say 1/120s) plus an accumulator would run several small steps during a hitch instead of one big one. That is the physics-engine standard, at the cost of slightly more code.

**Five: add a runtime validator for level data.** 60 level objects are all hand-written, so it is easy to reference a nonexistent plant ID or an out-of-range lane. A startup `validateLevels()` would turn "crash on level 37" into "error at startup." In fact the `levels.spec.js` suite already does this; moving it to startup would catch problems earlier.

## Conclusion: a game engine's complexity lives in the frame

Read Garden Defense end to end and you find almost no "derive a formula" hard problems. No complex pathfinding, no real physics simulation, no network sync. Its complexity is entirely in the frame:

- **The frame's time boundary:** how `dt` is computed and capped decides whether a dropped frame clips through a wall.
- **The frame's state boundary:** every system shares one `state`, so consistency relies on guards (`mode !== "playing"`) and deferred deletion (mark plus end-of-frame filter).
- **The frame's render boundary:** `update` only mutates, `draw` only reads, and every procedural animation (bob / rotate / recoil) hangs off `p.action` and `p.age`.
- **The frame's resource boundary:** one offscreen canvas, three-level sprite fallback, hand-drawn art as the last resort.
- **The frame's terrain boundary:** water, fog, and roof each change "what you can plant, what you can see, where it is drawn," while collision stays as unchanged as possible.
- **The frame's test boundary:** `__pvzTest` exposes pure functions and `updateOnce(dt)`, turning a real-time loop into a function you can advance by hand.

None of these is "something an engine solves for you." No game framework will decide whether `dt` should be capped, whether fog should be cut out, or whether the roof should affect collision. Real game engineering is thinking through each boundary and writing it into the code, the tests, and the README.

What makes Garden Defense worth studying is not "it recreated Plants vs Zombies in vanilla JS." It is that it lays out, completely, the frame-level problems a web game must solve to become playable, and gives each a small, verifiable, trade-off-aware answer. That is more useful than any "game development best practices" list.
