---
title: "花园保卫战：用 3700 行原生 JS 手搓一个植物大战僵尸"
slug: pvz-vanilla-js-canvas-engine
cover_image: /photos/pvz-vanilla-js-canvas-engine-cover.png
date: 2026-11-25
tags: [JavaScript, Canvas, 游戏开发, 项目实战]
---

> 适用读者：写过页面、但没独立做过一个"能玩"的游戏的人；想搞清楚一帧到底是什么、游戏循环该怎么写的前端工程师；以及任何被"没有引擎就做不出游戏"这句话劝退过的人。
> 结论先行：花园保卫战是一个零依赖、零构建、纯原生 JavaScript 写的植物大战僵尸同人游戏。全部逻辑塞在一个 3,731 行的 `game.js` 里，一个 IIFE 包住整台引擎：146 个函数、81 个 `draw*`、9 个 `update*`，60 个关卡、24 种植物、16 种僵尸、4 种模式、16 个 Playwright 端到端测试套件。真正难的不是把豌豆画出来，而是四件事：素材要在 GIF、PNG、代码手绘之间无缝回退；同一套网格要同时撑起水面、迷雾、屋顶斜坡三种地形；僵尸波次要在"前期循序渐进、收尾全类型登场"之间编排；旧存档要能迁移进新章节而不丢进度。文章会给出游戏循环、波次调度、地形数学、迷雾挖洞、测试钩子的真实实现，也会把"单文件、近似碰撞、坡度只影响视觉"这些边界写清楚。
> 阅读时间：约 48 分钟 | 难度：进阶 | 收获：一套可以直接照抄的 Canvas 游戏循环骨架 + 波次调度与地形差异的具体做法 + 一份用 E2E 测 Canvas 游戏的可行路径

**目录**

- 这不是一个"画个草坪"的 Demo
- 一个 IIFE 装下整台引擎
- 游戏循环：dt 封顶 34ms，掉帧不穿墙
- 状态对象：所有系统的唯一真相源
- 关卡数据：60 关怎么组织
- 波次调度：makeSchedule 的四条规则
- 植物行为：一个 updatePlants 里的 24 个 if
- 僵尸 AI：16 种行为怎么塞进一个循环
- 弹道系统：直线、抛射、穿刺三种模型
- 素材回退：GIF → PNG → 代码手绘
- 程序动画：静态 PNG 怎么动起来
- 水面：为什么必须先用荷叶
- 迷雾：离屏画布 + destination-out 挖洞
- 屋顶：一条坡度函数的连锁反应
- 阳光经济与冷却循环
- 三种额外模式：砸罐子、我是僵尸、无尽
- 测试钩子：window.__pvzTest 的设计
- E2E 测 Canvas：当 getImageData 不可用时
- 存档迁移：旧关卡 ID 到新章节的映射
- 已知边界：一份诚实的清单
- 如果重写，我会先改这五件事
- 小结：游戏引擎的复杂度都在"帧"

---

## 这不是一个"画个草坪"的 Demo

大多数"网页版植物大战僵尸"的归宿是一样的：一个 canvas，几行 `drawImage`，一个 `setInterval` 让僵尸往左走。它能动，但它不是游戏，因为没有人回答下面六个问题：

- 一帧应该跑多久？如果某一帧卡了 2 秒，僵尸会不会直接穿过你的坚果墙？
- 60 个关卡的数据放在哪？是全写死成 60 个对象，还是用规则生成？
- 一个"太阳花产阳光"的行为，和一个"三线射手同时打三行"的行为，怎么共存在同一个循环里？
- 水面关卡里，为什么射手不能直接种在水上？这个约束写在哪？
- 迷雾关卡的雾怎么画？是贴一张半透明的图，还是要挖洞？
- 屋顶是斜的，植物和僵尸要不要跟着抬起？碰撞要不要跟着变？

花园保卫战是围绕这六个问题长出来的。它的规模已经不小：`game.js` 3,731 行、146 个函数，其中 81 个是 `draw*`、9 个是 `update*`；24 种植物、16 种僵尸、60 个关卡、4 种游戏模式；外加 16 个 Playwright 端到端测试套件。它没有引擎、没有打包器、没有 npm 运行时依赖，双击 `index.html` 就能玩。但它的复杂度不在"写了很多行"，而在帧边界：一帧的时间怎么算、状态怎么组织、素材怎么回退、地形怎么差异、存档怎么兼容。

先把结论摆出来，后面逐条拆：

- 游戏循环用 `requestAnimationFrame`，并且把 `dt` 硬封顶在 34ms——这是防止"切后台回来僵尸瞬移"的第一道闸。
- 所有运行时状态集中在一个 `state` 对象里，所有系统都读写它，没有隐藏的局部状态。
- 关卡数据是 6 个数组拼起来的 60 个对象，夜晚章节还用 `Array.from` 规则生成，避免手写 10 段重复文案。
- 波次由 `makeSchedule()` 生成，四条规则叠加：开场延迟、中盘旗帜波、收尾全类型轮换、行号错位分配。
- 素材加载有三级回退：GIF 失败换同名 PNG，PNG 失败就纯代码手绘——所以即使一个素材都没加载成功，游戏依然完整可玩。
- 迷雾不是贴图，是离屏画布 + `destination-out` 在雾层上"挖洞"，路灯花的位置就是洞。
- 屋顶坡度只影响渲染坐标，不影响碰撞——这是一个刻意的取舍，后面会讲它带来的后果。

## 一个 IIFE 装下整台引擎

打开 `game.js`，第一行和最后一行是这样的：

```js
(() => {
  "use strict";
  // ……3700 行……
})();
```

整个游戏是一个立即执行函数表达式。它没有 `export`，没有全局变量泄漏（除了刻意暴露的测试钩子 `window.__pvzTest`），也没有任何模块系统。在 `index.html` 里，它就是一个普通的 `<script src="game.js">`。

这个选择非常值得先讲，因为它决定了后面所有代码的形状。

**为什么不用模块。** 模块化的好处是隔离和按需加载，但代价是需要一个 import 图、一个加载顺序、以及可能的打包步骤。一个单文件游戏天然没有加载顺序问题：`const` 声明在同一作用域里从上到下依次求值，函数声明会被提升，所以 `showMainMenu()` 可以在文件末尾调用，而它用到的函数定义在文件开头。这省掉了"这个函数是不是还没定义"的一整类 bug。

**代价是什么。** 所有东西共享一个作用域，命名必须自己守纪律。作者的纪律体现在两件事上：常量用大写（`W`、`H`、`FIELD_X`、`CELL_W`），函数用动词开头（`draw*`、`update*`、`spawn*`、`make*`），数据结构用名词（`state`、`plantDefs`、`zombieDefs`、`LEVELS`）。读代码时，看名字就能猜到它属于哪一层。

**`"use strict"` 不是摆设。** 在严格模式下，给未声明的变量赋值会直接抛错，而不是悄悄创建全局变量。对一个 3000 多行的单文件来说，这条规则的性价比极高：它把"我拼错了一个变量名"从"运行到一半行为诡异"变成"立刻报错"。

## 游戏循环：dt 封顶 34ms，掉帧不穿墙

整个游戏只有一个循环，在文件最末尾：

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

这九行里有四个关键决策，每一个都值得单独说。

**第一，用 `requestAnimationFrame` 而不是 `setInterval`。** `setInterval(fn, 16)` 看起来能跑 60 帧，但它不保证和浏览器的刷新节奏对齐，而且在后台标签页里会被节流甚至暂停。`requestAnimationFrame` 由浏览器在每次重绘前调用，天然和屏幕刷新同步，切后台时会自动暂停——这正好是我们要的"切走就冻结"。顺带一提，这里的渲染上下文是 Canvas 2D（`canvas.getContext("2d")`），没有 WebGL：这个游戏的所有画面——植物、僵尸、雾、水波——都是 2D 绘制调用的组合。

**第二，`dt` 用真实时间差，而不是固定步长。** `(now - state.lastFrame) / 1000` 得到的是"距离上一帧过了多少秒"。用真实时间差意味着：即使某台机器只能跑 30 帧，僵尸的移动速度（像素/秒）依然是对的，只是每帧移动的距离更大。如果用固定步长（每帧固定移动 4 像素），慢机器上的僵尸就会走得比快机器慢——这是新手最常见的时间bug。

**第三，`Math.min(.034, ...)` 是防穿墙的核心。** 34 毫秒大约是 30 帧的时间。为什么要封顶？想象用户切到别的标签页 10 秒再切回来：`now - lastFrame` 会算出 10,000ms，`dt` 就是 10 秒。如果直接用这个 `dt`，这一帧里所有僵尸都会按"10 秒"的位移前进，直接穿过你的防线、冲进房子，游戏瞬间结束。封顶之后，无论实际隔了多久，这一帧最多只推进 34ms，视觉上就是"回来时卡了一下"，而不是"回来时游戏已经输了"。

**第四，`|| 0` 处理首帧。** 第一帧时 `state.lastFrame` 是 `performance.now()` 的初始值，`now - lastFrame` 可能非常接近 0，`/1000` 之后是个极小的数。`|| 0` 在它恰好为 `NaN` 或 `0` 时兜底，避免第一帧就用一个奇怪的值。

循环体本身只有三件事：`update(dt)` 推进所有系统，`draw()` 把所有东西画出来，`requestAnimationFrame(loop)` 预约下一帧。这个"更新"和"渲染"的分离是游戏引擎的基本纪律：`update` 只改状态，不碰画布；`draw` 只读状态，不改状态。后面所有 `updatePlants`、`updateZombies`、`drawPlants`、`drawZombies` 的划分，都源自这条纪律。

## 状态对象：所有系统的唯一真相源

`state` 是整个游戏的唯一真相源。它的字段覆盖了每一局运行需要的全部信息：

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

这看起来像一个"什么都有"的大对象，但它其实有清晰的分层：

- **模式层**：`mode`（`title` / `playing` / `paused` / `ended`）、`minigame`、`endless`、`wave`。这些决定"现在在玩什么"。
- **关卡层**：`levelIndex`、`unlockedLevel`、`availablePlants`、`schedule`、`spawned`、`totalZombies`。这些决定"这一局怎么打"。
- **实体层**：`plants`、`zombies`、`projectiles`、`suns`、`particles`、`floaters`、`fx`、`heads`、`graves`、`mowers`。这些是"场上的所有东西"。
- **交互层**：`selected`、`shovel`、`hover`、`cooldowns`、`sun`。这些是"玩家能操作什么"。
- **表现层**：`time`、`elapsed`、`banner`、`shake`、`sound`、`audio`、`lastFrame`。这些是"怎么展示"。

用一个对象而不是多个对象的理由很实际：每个 `update*` 函数都需要读取多个层次的状态。比如 `updateZombies` 要读 `state.plants`（找目标）、`state.mowers`（触发割草机）、`state.time`（判断减速/眩晕），还要写 `state.shake`（巨人砸墙时震屏）。如果拆成多个对象，每个函数都要跨对象引用，反而更啰嗦。一个 `state` 加上一致的命名，就是单文件架构下最省心的"全局上下文"。

代价是：你必须自己记得"哪些字段属于哪一层"。这就是为什么后面每个 `update*` 开头都会先做 `if (state.mode !== "playing") return;` 这样的守卫——`state` 是共享的，所以每个系统都得自己确认"我现在该不该跑"。

## 关卡数据：60 关怎么组织

60 个关卡不是写死成 60 个对象的。它们来自 6 个章节数组：

```js
const DAY_LEVELS = [ /* 10 个显式对象 */ ];
const NIGHT_LEVELS = [
  ...Array.from({ length: 7 }, (_, index) => ({
    id: `2-${index + 1}`,
    name: `夜晚 2-${index + 1}`,
    description: [ /* 7 句文案 */ ][index],
    // ……
  })),
  /* 另外 3 个显式对象 */
];
const POOL_LEVELS = [ /* 10 */ ];
const FOG_LEVELS = [ /* 10 */ ];
const ROOF_LEVELS = [ /* 10 */ ];
const FINAL_LEVELS = [ /* 10 */ ];

const LEVELS = [...DAY_LEVELS, ...NIGHT_LEVELS, ...POOL_LEVELS,
                ...FOG_LEVELS, ...ROOF_LEVELS, ...FINAL_LEVELS];
```

这里有一个很好的、教科书式的取舍。白天章节的 10 关是**全手写**的：

```js
{ id: "1-3", name: "白天 1-3", description: "路障僵尸加入了进攻。",
  rows: [0, 1, 2, 3, 4], plants: ["sunflower", "peashooter", "wallnut"],
  initialSun: 100, zombieCount: 15, zombieTypes: ["basic", "cone"],
  reward: "potato", theme: "day", skySuns: true },
```

因为白天的 10 关是"教学曲线"，每一关都在教一个新东西（阳光→豌豆→坚果→土豆雷→寒冰→双发→樱桃→气球），字段差异大，值得逐个手写。而夜晚章节有 7 关只是"同一套机制、不同的僵尸数量与文案"，所以用 `Array.from` 生成，只在 `description` 数组里给每关一句不同的说明。剩下 3 关因为引入了墓碑机制，又回到手写。

这个模式的通用名字叫"显式声明 + 规则生成"。判断标准很简单：**如果一关和另一关的差异只是数值和文案，就生成；如果差异是机制，就手写。** 生成本质上是在复用"机制模板"，手写则在为"新机制"留出空间。

每个关卡对象都带 `theme` 字段（`day` / `night` / `pool` / `fog` / `roof`），这个字段后面会反复出现——它是整台引擎"地形差异"的开关。

## 波次调度：makeSchedule 的四条规则

僵尸什么时候出来、从哪一行出来、是什么类型，全部由 `makeSchedule()` 在开局时一次性算好：

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

这段代码不长，但有四条独立的规则在叠加，每一条都对应一个设计意图。

**规则一：开场延迟 5.5 秒。** 玩家开局需要时间种第一批向日葵、积累阳光。5.5 秒足够种两三株，不多不少。

**规则二：旗帜波（waveAt）的位置。** 僵尸数 ≥20 的关卡有两波旗帜攻势，分别在 48% 和倒数第 4 只；少于 20 只的关卡只有一波，在倒数第 3 只。旗帜波会额外加 4.5 秒间隔（让玩家喘口气），同时把类型强制成 `flag`——旗帜僵尸血更多、速度更快，是"这一波很凶"的信号。`if (type === "flag" && !isWave) type = "basic"` 这一行是在说：旗帜僵尸只在旗帜波出现，平时如果随机到它，就降级成普通僵尸。

**规则三：前期递进 + 收尾全轮换。** 这是整段代码最精妙的地方。前半段用"类型池逐渐扩大"的方式控制难度：

```js
const typePoolSize = Math.min(
  level.zombieTypes.length,
  1 + Math.floor(i / Math.max(4, level.zombieCount / level.zombieTypes.length))
);
```

意思是：第 0 只只可能是一种类型，随着 `i` 增大，能出现的类型逐渐变多。这样"铁桶僵尸"不会在第一只就冲出来，而是随波次深入才解禁。而后半段是反过来的：

```js
if (i >= level.zombieCount - level.zombieTypes.length) {
  type = level.zombieTypes[(i - ...) % level.zombieTypes.length];
}
```

最后 `len(zombieTypes)` 只僵尸会**完整轮换该关所有类型**，保证"终局全类型登场"。这条规则解决了一个具体的体验问题：如果靠随机，某些稀有僵尸（比如气球僵尸）可能整局都不出现，玩家就永远练不到对付它的方法。强制轮换保证了"每一关的最后几只，一定把该关的僵尸图鉴走一遍"。

**规则四：行号错位分配。** `row = level.rows[(i * 3 + Math.floor(i / 3)) % level.rows.length]`。`i * 3` 让相邻僵尸落在不同行，`Math.floor(i / 3)` 每三只微调一次，避免出现"每 5 只一轮"的明显周期性。这个公式让僵尸看起来是"随机散布"的，但其实是确定性的——这对测试非常友好（同样的关卡，同样的顺序，可以精确断言）。

最后 `sort` 按时间排序，返回一个按时间递增的数组。运行时只需要一个游标 `state.spawned`，每帧检查"下一个该出生的僵尸时间到了没"：

```js
while (state.spawned < state.schedule.length &&
       state.elapsed >= state.schedule[state.spawned].time) {
  const next = state.schedule[state.spawned++];
  spawnZombie(next.type, next.row);
  // ……
}
```

这就是"预计算 + 游标推进"的模式：调度在开局算一次，运行时只做 O(1) 的指针移动。

## 植物行为：一个 updatePlants 里的 24 个 if

24 种植物，行为各不相同：向日葵产阳光、豌豆射手打直线、三线射手打三行、樱桃炸弹范围爆炸、大嘴花一口吞、地刺踩踏、磁力菇吸铁……这些行为全部塞在一个 `updatePlants(dt)` 里，用 `if / else if` 按类型分派：

```js
function updatePlants(dt) {
  for (const p of state.plants) {
    if (p.dead) continue;
    p.age += dt;
    p.action = Math.max(0, p.action - dt);

    if (p.type === "sunflower" || p.type === "twinsunflower" || p.type === "sunshroom") {
      // 产阳光：timer 到点就 spawnSun，双向日葵产两份
      // ……
    } else if (p.type === "peashooter" || p.type === "snowpea" || p.type === "repeater"
               || p.type === "puff" || p.type === "threepeater" || p.type === "cactus") {
      // 射手：先判断本行/多行有没有目标，有才进入冷却并开火
      const rows = p.type === "threepeater"
        ? [p.row - 1, p.row, p.row + 1].filter(r => r >= 0 && r < ROWS)
        : [p.row];
      const maxRange = p.type === "puff" ? p.x + CELL_W * 3 : 1260;
      const hasTarget = () => rows.some(r =>
        state.zombies.some(z => attackableZombie(z) && z.row === r
          && z.x > p.x && z.x < maxRange && zombieVisible(z)));
      if (hasTarget()) {
        p.shootTimer -= dt;
        if (p.shootTimer <= 0) { /* push projectile；不同植物不同参数 */ }
      } else {
        p.shootTimer = Math.min(p.shootTimer, .4);
      }
    } else if (p.type === "chomper") {
      // 大嘴花：找最近的、距离够近的目标，一口 120 伤害
      // ……
    }
    // ……地刺、磁力菇、火炬树桩、大喷菇……
  }
}
```

读这段代码，你会发现几个反复出现的设计手法。

**手法一：同类行为合并到同一个分支。** 6 种射手（豌豆、寒冰、双发、小喷、三线、仙人掌）共享同一个"判断有没有目标 → 减冷却 → 开火"的骨架，只有参数不同：三线射手的 `rows` 是 `[row-1, row, row+1]`，小喷菇的 `maxRange` 只有 3 格，仙人掌的子弹带 `pierce: true`。这种"骨架 + 参数"的合并，让 6 种植物只占一个 `else if` 分支。

**手法二：先查目标，再走冷却。** 射手不是无脑按时间开火，而是 `hasTarget()` 为真才减 `shootTimer`。如果没有目标，`shootTimer` 会被压到最多 0.4 秒——这样僵尸一进入射程，最多 0.4 秒内就会开第一枪，而不是等完一整个冷却。这个细节让"刚种下就遇到僵尸"的手感对了。

**手法三：`p.action` 是给渲染层用的信号。** 每次开火、每次受伤、每次大招，都会设 `p.action = .18` 之类的值。`updatePlants` 不直接去画后坐力，它只是设一个"动作计时器"；`drawPlant` 读到 `p.action > 0` 才去施加位移或摆动。这是"更新层只改状态、渲染层只读状态"纪律的具体体现。

**手法四：死亡标记 + 统一清理。** 植物不会在循环里被直接 `splice` 掉（那会破坏正在进行的 `for...of`），而是标记 `p.dead = true`，等这一帧所有系统跑完，在 `update()` 末尾统一过滤：

```js
state.plants = state.plants.filter(p => !p.dead);
state.zombies = state.zombies.filter(z => !z.dead || z.dying > 0);
state.projectiles = state.projectiles.filter(p => !p.dead && p.x < 1285);
state.suns = state.suns.filter(s => s.life > 0 && s.collectT < 1);
```

"延迟删除"是游戏循环里的标准技巧：在遍历中直接删除元素，要么漏掉下一个元素，要么在别的系统里引用到已删除对象。标记 + 帧末清理，两个问题一起解决。

## 僵尸 AI：16 种行为怎么塞进一个循环

`updateZombies(dt)` 更复杂，因为它要处理 16 种僵尸各自的特异行为。它的结构不是"按类型分派"，而是"先做通用移动与攻击，再叠加特殊行为"：

```js
function updateZombies(dt) {
  for (const z of state.zombies) {
    if (z.dead) continue;
    z.age += dt;

    // 矿工：地下潜行到草坪左缘，出土后掉头向右啃
    if (z.digging) { /* …… */ }
    // 潜水僵尸：接近植物时下潜（不可被子弹命中），越过植株后浮出
    if (z.type === "diver" && isWater(z.row)) { /* …… */ }
    // 舞王：定期召唤两只伴舞
    if (z.type === "dancer" && attackableZombie(z)) { /* …… */ }
    // 小丑：随身盒子随机爆炸，无差别伤害
    if (z.type === "jackbox" && attackableZombie(z)) { /* …… */ }
    // 撑杆跳 / 跳跳：遇到第一株植物就跳过
    if (z.type === "pole" && !z.jumped) { /* …… */ }
    if (z.type === "pogo") { /* …… */ }
    // 读报：报纸被打破后狂暴加速
    if (z.type === "newspaper" && !z.newspaperAngry && z.hp < 120) { /* …… */ }

    // 通用：气球飞行 / 找目标攻击 / 前进 / 触发割草机
    if (z.balloon) { /* …… */ } else { /* 找目标 → 攻击 or 前进 */ }
    if (z.x < 230 && !z.facingRight) { /* 割草机 or 失败 */ }
  }
}
```

**特殊行为是"叠加"而不是"分派"。** 注意这里用的是一连串独立的 `if`（不是 `else if`），所以一只僵尸可能同时满足多个条件——比如潜水僵尸既走通用的前进逻辑，又额外处理"下潜"。这是刻意的：特殊行为大多数是"在通用行为之上打一个补丁"，而不是"替代通用行为"。

**潜水的实现很能说明问题：**

```js
if (z.type === "diver" && isWater(z.row)) {
  const ahead = state.plants.some(p => !p.dead && p.row === z.row
    && z.x - p.x >= -20 && z.x - p.x < CELL_W * 2.2);
  if (ahead && !z.submerged) { z.submerged = true; burst(z.x, z.y - 20, "#8fd4e4", 8, 70); }
  if (!ahead && z.submerged) { z.submerged = false; burst(z.x, z.y - 20, "#8fd4e4", 8, 70); }
}
```

它没有"潜水状态机"，就是每帧看一眼"前方 2.2 格内有没有植物"，有就 `submerged = true`，没有就 `false`，并在状态翻转时喷一簇水花。弹道系统再根据 `z.submerged` 决定这颗子弹要不要命中它。用"每帧重新判断"代替"状态切换"，代码量少一半，也不会出现"卡在潜水状态出不来"的 bug。

**通用攻击逻辑是全场唯一真正共享的部分：**

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
    target.hp -= big ? 999 : 22;   // 巨人一口 999，普通 22
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

这段里有三个值得学的点：

1. **目标选择用"行 + x 区间"。** `z.x >= p.x - 42 && z.x <= p.x + 50` 是一个简单的水平重叠测试；`p.row === z.row` 保证只打同一行。没有四叉树、没有包围盒，因为植物大战僵尸本质是"一行内的线性碰撞"，行是天然的隔离维度。
2. **`(b.layer ?? 1) - (a.layer ?? 1) || b.x - a.x` 的排序。** 先按 `layer` 降序（荷叶上种的植物 `layer` 更高，优先被啃），再按 x 降序（更靠右的优先）。`?? 1` 让没有 `layer` 字段的普通植物默认为 1。这一行排序就把"先啃上面的、再啃前面的"两条规则同时表达了。
3. **`speedMul` 是减速/眩晕的唯一出口。** 寒冰射手的减速、玉米投手的定身，最后都落在这一个 `speedMul` 上：`stunUntil > time` 就是 0（停住），`slowUntil > time` 就是 0.5（半速），否则 1。所有控制效果不需要各自改 `z.x`，只需要改这两个时间戳。

## 弹道系统：直线、抛射、穿刺三种模型

`updateProjectiles(dt)` 要处理三种弹道。它不是按"子弹类型"分类，而是按"运动模型"分类：

```js
function updateProjectiles(dt) {
  for (const p of state.projectiles) {
    if (p.dead) continue;
    p.age += dt;
    if (p.lob) {
      // 抛射（卷心菜/玉米/西瓜）：抛物线，落点在目标 x
      // ……
    } else {
      // 直线（豌豆/寒冰/双发/仙人掌/三线）：按 vx 水平移动
      p.x += p.vx * dt;
      // ……
    }
  }
}
```

**直线弹道**最简单：每帧 `x += vx * dt`，然后检查这一行有没有僵尸被它命中。命中判定是"子弹的 x 落在僵尸的 x 附近"，一旦命中就把 `p.dead = true`。仙人掌的子弹带 `pierce: true` 和一个 `pierced` 数组，命中一个僵尸后不销毁，而是把那个僵尸记进 `pierced`，继续往前飞——这就是"穿刺"。

**抛射弹道**多了一个 `lob` 标记和落点计算。它不走水平直线，而是从投手的头顶沿抛物线飞到目标位置。因为屋顶关卡里"直射型射手会失效"（子弹会被屋顶挡），投手系必须用抛射越过坡面。这个设计让"屋顶用投手、平地用射手"成为一个有物理依据的策略，而不是凭空规定。

**三种模型共用一个数组** `state.projectiles`，靠字段（`lob`、`pierce`）区分行为。这比"三种子弹三个数组"省心：`draw`、碰撞、清理都只遍历一个数组，新增一种弹道只需要加一个字段和一小段分支。

## 素材回退：GIF → PNG → 代码手绘

这是整个项目最值得借鉴的一段工程实现。素材加载不是"加载失败就报错"，而是三级回退：

```js
const spriteSources = {
  sunflower: ["assets/pvz/images/SunFlower.gif", "assets/pvz/images/SunFlower.png"],
  peashooter: ["assets/pvz/images/Peashooter.gif", "assets/pvz/images/Peashooter.png"],
  // ……
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

`image.onerror = () => loadSprite(type, sourceIndex + 1)` 这一行就是回退：GIF 加载失败，就用同一个数组里的下一个（通常是 PNG）；如果都失败，函数直接 `return`，`sprites[type]` 保持 undefined。

**第三级回退在渲染层。** `drawPlant` 先尝试画精灵，画不出来就走代码手绘：

```js
let sprite = sprites[p.type], sw = 88, sh = 104, bottom = 38;
// ……根据血量、状态换精灵……
if (drawSprite(sprite, 0, bottom, sw, sh)) {
  if (LEVELS[state.levelIndex].theme === "roof") drawFlowerPot();
  ctx.restore();
  return;
}
// 精灵不存在 → 手绘
if (p.type === "sunflower") drawSunflower(p);
if (p.type === "peashooter") drawPeashooter(p);
if (p.type === "wallnut") drawWallnut(p, health);
// ……24 种植物各有一个手绘函数……
```

`drawSprite` 在精灵不存在时返回 `false`，于是 `drawPlant` 继续往下走，调用对应的手绘函数。24 种植物、16 种僵尸，每一种都有一个用 `ctx.arc`、`ctx.ellipse`、`ctx.fillRect`、`ctx.quadraticCurveTo` 拼出来的手绘版本。

这个设计的价值在于"降级可用"：即使一个素材都没加载成功（比如离线打开、路径错、CDN 挂了），游戏依然完整可玩——只是画面从 GIF 动画变成了扁平的手绘图形。对同人作品来说，这既是鲁棒性，也是避免素材版权纠纷时的一种退路。

## 程序动画：静态 PNG 怎么动起来

素材回退带来一个副作用：有些植物本来就没有 GIF，只有一张静态 PNG。如果原样画出来，场上会是一堆"不动的贴纸"，和旁边会动的 GIF 植物格格不入。

解法是"给静态素材叠加程序动画"：

```js
const STATIC_SPRITES = new Set([
  "twinsunflower", "sunshroom", "lilypad", "plantern", "puff",
  "cabbage", "kernel", "melon", "chomper", "threepeater",
  "spikeweed", "tallnut", "garlic", "torchwood", "fumeshroom"
]);

// drawPlant 内部：
const bob = Math.sin(p.age * 2.6 + p.row) * 2;
const hurt = p.action > 0 && p.hp < p.maxHp ? Math.sin(p.action * 48) * 3 : 0;
ctx.translate(p.x + hurt, sceneY(p.y + bob, p.x));
if (STATIC_SPRITES.has(p.type)) {
  ctx.rotate(Math.sin(p.age * 2 + p.row) * .045);
  if (p.action > 0 && p.type !== "spikeweed") ctx.translate(-4, 0);
}
```

三个程序动画叠加在一起：

- **呼吸浮动 `bob`**：`Math.sin(p.age * 2.6 + p.row) * 2`，让植物上下浮动 2 像素。`+ p.row` 是"相位偏移"，让同一列的植物不要完全同步地上下，看起来更自然。
- **轻微摇摆 `rotate`**：只对静态素材生效，`Math.sin(p.age * 2 + p.row) * .045` 弧度（约 2.6 度）。这是"贴纸感"的主要来源，加了它，静态 PNG 也会像在微风中轻晃。
- **攻击后坐 `hurt` / `translate(-4, 0)`**：当 `p.action > 0`（刚开过火或刚受过伤），整株向左平移 4 像素，制造"后坐力"。配合 `Math.sin(p.action * 48) * 3` 的高频抖动，就是"被打了一下"的反馈。

这套程序动画的妙处在于：它不区分素材来源——GIF 植物也有 `bob` 和血量抖动，静态 PNG 只是多了 `rotate` 和后坐。所以两批素材在同一个场景里，观感是一致的。

## 水面：为什么必须先用荷叶

水池关卡的核心约束是"水面格不能直接种地面植物"。这个约束写在一个只有 6 行的函数里：

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

`canPlantAt` 的三行逻辑对应三种情况：

1. **水面 + 空格**：只能种荷叶（`type === "lilypad"`）。
2. **已有植物**：只有当已有的是荷叶、且要种的不是荷叶时，才允许——这叫"叠种"，荷叶是水面上的平台，植物种在荷叶上面。
3. **普通格**：随便种。

这个函数被三个地方调用：鼠标悬停时（决定格子高亮颜色）、点击时（决定能不能种）、以及测试里（直接断言规则）。一处定义、三处复用，这是"把规则写成一个纯函数"的典型收益。

**渲染层的水面**则是另一套逻辑。`drawWaterRows()` 负责画蓝色水面、波纹、泡沫，`drawPoolCoping()` 画池边的石沿。而水面上的荷叶会多画一个椭圆阴影和一圈水波，植物的"脚"要沉到水面以下——这些都在 `draw` 系列函数里，和 `canPlantAt` 的规则完全解耦。

## 迷雾：离屏画布 + destination-out 挖洞

迷雾关卡最有意思。直觉做法是"贴一张半透明的雾图在屏幕上"，但那样路灯花就照不亮——因为雾是不透明的叠加层。作者用了 canvas 的合成模式来解决：

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
  // ……在雾层上画半透明的矩形和大椭圆，形成雾体……
  fc.globalCompositeOperation = "destination-out"; // 关键：挖洞
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
  // ……把 fogLayer 整体 drawImage 到主画布……
}
```

关键在 `globalCompositeOperation = "destination-out"`。正常的绘制是"画上去"（`source-over`）；`destination-out` 是"擦掉"——用新绘制的图形的 alpha 去剪掉已有像素。所以：

1. 先在 `fogLayer` 上画满雾（半透明灰）。
2. 切换成 `destination-out`，在每盏路灯花的位置画一个径向渐变圆。渐变从中心 alpha=1 到边缘 alpha=0，等于"中心擦得最干净、边缘擦得越来越少"。
3. 切换回 `source-over`，把整层雾 `drawImage` 到主画布。

结果就是：雾是实体的一层，但被路灯花"照出"了柔和的透光区。这个技巧在 canvas 游戏里非常常见（遮罩、探照灯、视野范围），但用对的时机不多——很多人第一反应是"画多个不透明矩形"，那样既有硬边、又难做渐变。

离屏画布 `fogLayer` 在文件加载时就创建一次（IIFE 内），之后每帧只 `clearRect` + 重画，不重新 `createElement`。这是帧循环里的基本纪律：**能复用的对象绝不每帧新建**。

## 屋顶：一条坡度函数的连锁反应

屋顶关卡是"地形影响玩法"最集中的地方。它有一条简单的坡度函数：

```js
// 屋顶坡度：人字形屋脊，中间高两边低（纯视觉，不影响碰撞）
const ROOF_RISE = 110;
const ROOF_ROW_SCALE = .87;
const ROOF_PLAYFIELD_LIFT = -24;

function slopeAt(x) {
  const level = LEVELS[state.levelIndex];
  if (level.theme !== "roof") return 0;
  const mid = (FIELD_X + LAWN_RIGHT) / 2;
  const half = (LAWN_RIGHT - FIELD_X) / 2;
  const t = Math.max(0, Math.min(1, 1 - Math.abs(x - mid) / half)); // 1 在屋脊，0 在两侧
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

`slopeAt` 是一个"三角形山脊"：中心点是最高（`t = 1`），往两边线性降低。所有"贴地"的对象（植物、僵尸、子弹）在绘制时都要经过 `sceneY`，把"棋盘坐标"转换成"屏幕坐标"。

注意 `ROOF_ROW_SCALE = .87`：屋顶的行距被压缩到 87%，因为斜面上的行看起来更挤。所以 `sceneY` 不只是加一个坡度偏移，还做了一次纵向缩放。

而 `boardYFromScene` 是它的逆函数——把屏幕坐标换算回棋盘坐标。为什么需要逆函数？因为鼠标点击给的是屏幕坐标，而"点到了哪一格"要在棋盘坐标里算。一对正反函数，保证了"渲染"和"交互"用的是同一套坐标变换，不会出现"看到的位置和点到的位置差半格"。

**这里有一个重要的取舍，作者在注释里写得很清楚：`纯视觉，不影响碰撞`。** 坡度只改变渲染位置，碰撞判定仍然用平坦的行号 + x 区间。这意味着：

- 好处：碰撞逻辑完全不需要知道屋顶的存在，`updateZombies` 里那一套 `z.row === p.row && z.x >= p.x - 42` 在屋顶和水池上完全一样。
- 代价：视觉上的"高低差"不对碰撞负责。理论上，一个僵尸在屋脊、一个植物在屋檐，屏幕上看有 100 多像素的高度差，但碰撞判定认为它们在同一行。由于这块游戏的行是水平推进的、纵向差异不参与命中，实际玩起来不会觉得违和——但这是一个"用视觉近似换逻辑简单"的典型取舍。

## 阳光经济与冷却循环

整个游戏的经济系统只有两个资源：阳光和冷却。阳光是"钱"，冷却是"每张卡自己的喘息时间"。

阳光有三个来源：天降（白天章节）、植物产出、以及初始阳光。天降的逻辑在 `update` 里只有三行：

```js
state.skySunTimer -= dt;
if (LEVELS[state.levelIndex].skySuns && state.skySunTimer <= 0) {
  spawnSun(330 + Math.random() * 700, -35, "sky");
  state.skySunTimer = 8 + Math.random() * 2.5;
}
```

`skySuns` 是关卡字段——夜晚章节没有天空阳光，所以这一整段被跳过。间隔是 `8 + random * 2.5` 秒，不是固定值，这样阳光不会以完全机械的节奏落下。x 坐标随机在 `330 ~ 1030` 之间，正好落在草坪上方。

植物产出则写在 `updatePlants` 里，核心是"timer 到点就产，然后重置 timer"：

```js
p.sunTimer -= dt;
if (p.sunTimer <= 0) {
  if (p.type === "twinsunflower") {
    spawnSun(p.x - 18, p.y - 38, "plant", 50);
    spawnSun(p.x + 18, p.y - 38, "plant", 50);   // 双向日葵产两份
  } else {
    spawnSun(p.x, p.y - 35, "plant", p.type === "sunshroom" && p.age < 30 ? 25 : 50);
  }
  p.sunTimer = 14.5;
  p.action = .8;
}
```

这里有两个细节：双向日葵一次产两份（左右各一），阳光菇在"长大后"（`age >= 30`）才产 50，之前只产 25。`p.action = .8` 是给渲染层的"产阳光动画"信号。

冷却系统更简单，就是一个每帧递减的字典：

```js
plantOrder.forEach(type => state.cooldowns[type] = Math.max(0, state.cooldowns[type] - dt));
```

选卡时检查 `state.cooldowns[type] <= 0 && state.sun >= def.cost`，种下时把 `state.cooldowns[type]` 设成 `def.cooldown`。所有卡牌共享同一个"每帧减一点"的逻辑，没有各自独立的计时器对象。

## 三种额外模式：砸罐子、我是僵尸、无尽

除了冒险模式，还有三个模式，它们复用同一套引擎，但改了胜负条件和部分交互。

**砸罐子（vase）** 是"随机开盲盒"：30 个罐子随机分布，敲开可能是植物、阳光或僵尸。它的状态在 `state.vases`（二维数组）里，`smashVase(row, col)` 敲开一个，`plantVaseCard()` 把一个"罐子里的植物卡"种下去。胜利条件是 `state.vases.every(row => row.every(v => v.broken)) && state.zombies.length === 0`——所有罐子都敲开、且场上僵尸清空。

**我是僵尸（zpuzzle）** 是攻守反转：你操控僵尸，用"脑子"（初始 100~160 点）买僵尸，目标是吃掉场上所有植物。它的成本表是一个常量：

```js
const ZPUZZLE_COSTS = { basic: 10, cone: 15, newspaper: 20, pole: 25,
                        bucket: 25, balloon: 25, digger: 25 /* …… */ };
```

棋盘用字符画定义：

```js
const ZPUZZLE_MAP = { ".": null, S: "sunflower", P: "peashooter",
                      N: "snowpea", W: "wallnut", T: "potato" /* …… */ };
```

一个字符串数组就是一个棋盘，`.` 是空地，`S`/`P`/`N`/`W`/`T` 是预置的植物。这种"用字符画做关卡"的手法，让 3 个棋盘的数据非常紧凑、肉眼可读、改起来也直观。

胜负条件在 `update` 里：

```js
} else if (state.minigame === "zpuzzle") {
  const alivePlants = state.plants.filter(p => !p.dead).length;
  const aliveZombies = state.zombies.filter(z => !z.dead).length;
  if (alivePlants === 0) finish(true);       // 植物吃光 → 赢
  else if (aliveZombies === 0 && state.brains < Math.min(...Object.values(ZPUZZLE_COSTS))) {
    finish(false);                            // 僵尸没了、脑子也买不起最便宜的 → 输
  }
}
```

第二个条件是精髓：不是"僵尸死光就输"，而是"僵尸死光且脑子不够买最便宜的那只"才输。这样玩家在僵尸死光、但脑子还有余额时，还能继续买，游戏不会突然结束。

**无尽模式（endless）** 复用冒险模式的关卡，但打完一波就自动开下一波：

```js
} else if (state.spawned >= state.schedule.length && state.zombies.length === 0 && state.elapsed > 6) {
  if (state.endless) beginEndlessWave(state.wave + 1);
  else finish(true);
}
```

`beginEndlessWave(wave)` 按波次递增僵尸种类和数量，`endlessTypes(wave)` 和 `endlessPlants(wave)` 两个纯函数决定"这一波能出什么僵尸、解锁什么植物"。

## 测试钩子：window.__pvzTest 的设计

一个 IIFE 里的游戏，对外是完全封闭的——这本来很好，但会让自动化测试无从下手：你不能在测试里 `import` 任何东西，也拿不到 `state`。

解法是刻意开一个测试窗口：

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

这个钩子的设计有三个讲究：

**用 getter 而不是直接赋值。** `get LEVELS() { return LEVELS; }` 每次访问都返回当前引用，而不是在 `window.__pvzTest` 创建时拷贝一份。这样即使 `LEVELS` 之后被修改，测试拿到的也是最新的。

**只暴露纯函数和"受控的修改"。** `canPlantAt`、`makeSchedule`、`slopeAt` 是纯函数，测试可以直接断言它们的返回值；`startLevel`、`addPlant`、`spawnZombie` 是受控的修改，测试可以用它们搭出任意场景。它没有暴露 `update` 的整个循环，而是给了一个 `updateOnce(dt)`，让测试能手动推进一帧。

**`updateOnce` 是可控时间的关键。** 游戏本身是 `requestAnimationFrame` 驱动的，测试没法"等游戏跑 3 秒"。但 `updateOnce(0.016)` 让测试可以手动推进 16ms，精确到帧。这就是"把时间抽象成一个可以手动传入的参数"的价值——它让不可测的实时循环，变成了可测的纯函数。

## E2E 测 Canvas：当 getImageData 不可用时

有了测试钩子，逻辑可以测了。但"画面画对了没"怎么测？`tests/pool.spec.js` 里有一个非常漂亮的解决方案。

先看问题：水池关卡要验证"水面行确实画成了蓝色"。直觉是用 `getImageData` 取像素。但在这个项目里，这条路走不通——游戏是通过 `file://` 打开的，背景图是本地文件，canvas 被"污染"（tainted）了，任何 `getImageData` 调用都会抛 `SecurityError`。

作者的解法是：用 Playwright 截图，然后**自己解码 PNG 像素**：

```js
test("水池关水面行渲染为蓝色(背景图合成后仍可见)", async ({ page }) => {
  await page.evaluate(() => {
    window.__pvzTest.state.unlockedLevel = 20;
    window.__pvzTest.startLevel(20);
  });
  await page.waitForFunction(() => window.__pvzTest.hasSprite("background"));
  await page.waitForTimeout(50); // 等背景合成后的下一帧渲染完成

  // canvas 内部坐标 → 视口坐标（.stage 居中缩放）
  const t = await page.evaluate(() => {
    const r = document.querySelector("#gameCanvas").getBoundingClientRect();
    return {
      x: Math.round(r.x + 568.5 * r.width / 1280),
      y: Math.round(r.y + 415 * r.height / 720)
    };
  });

  // 截 3x3 取中心像素。canvas 被 file:// 背景图污染，getImageData 不可用
  const buf = await page.screenshot({ clip: { x: t.x - 1, y: t.y - 1, width: 3, height: 3 } });
  const px = decodePngPixel(buf, 1, 1);
  // 判别: 水面渐变 绿<蓝; 背景 JPG 草地 绿>>蓝(实测草地 (5,163,26), 水面 (33,126,170))
  expect(px[1]).toBeLessThan(px[2]);
});
```

配套的 `decodePngPixel` 是一个手写的 PNG 解码器：

```js
function decodePngPixel(buf, x, y) {
  // 解析 IHDR 拿宽高和颜色类型，收集所有 IDAT 块，inflate 解压
  // 然后按 PNG 的行过滤（filter 0-4）逐行还原
  const bpp = colorType === 6 ? 4 : 3;
  const stride = w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(stride * h);
  for (let row = 0; row < h; row++) {
    const f = raw[row * (stride + 1)];
    // ……按 filter 类型还原 Sub/Up/Average/Paeth……
  }
  const idx = (y * w + x) * bpp;
  return [out[idx], out[idx + 1], out[idx + 2]];
}
```

这段代码完整实现了 PNG 的行过滤算法（Sub / Up / Average / Paeth 四种）。为什么要走到这一步？因为它是"在不能直接用浏览器 API 的情况下，验证渲染结果"的唯一途径。

真正值得学的是**断言方式**：

```js
expect(px[1]).toBeLessThan(px[2]); // 绿通道 < 蓝通道 → 偏蓝
```

它没有断言"像素必须等于 `(33,126,170)`"——那样会因为抗锯齿、缩放、显卡差异而失败。它断言的是一个**关系**："蓝通道比绿通道大"。草地的绿通道远大于蓝通道，水面则相反。用一个稳健的不等式，代替一个脆弱的精确值，这是像素级测试能长期存活的关键。

这段测试里还有两个容易被忽略的细节：

- **`waitForTimeout(50)` 的理由写在注释里。** `hasSprite` 只保证图片加载完成，不保证它已经被 `drawImage` 画到这一帧。等 50ms 是为了等"加载完成后的下一帧"渲染出来。
- **页面坐标是用 `getBoundingClientRect` 换算的。** canvas 内部是 1280×720，但屏幕上可能被 CSS 缩放过（`.stage` 居中缩放），所以截图坐标要按实际显示尺寸换算。

## 存档迁移：旧关卡 ID 到新章节的映射

游戏最初只有 22 关（白天 5 + 夜晚 7 + 水池 10），后来扩展到 60 关。这带来一个具体问题：老玩家的存档里，`pvz-adventure-level` 存的是**旧顺序的索引**，直接套到新关卡表上会错位。

解法是带版本号的迁移：

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
  // 旧存档：把旧 ID 映射到新关卡表
  const oldId = OLD_LEVEL_IDS[saved];
  const newId = oldId ? oldId.replace(/^3-/, "5-") : null;
  const idx = newId ? LEVELS.findIndex(l => l.id === newId) : -1;
  const migrated = idx >= 0 ? idx : Math.max(0, Math.min(saved, LEVELS.length - 1));
  localStorage.setItem("pvz-version", "2");
  localStorage.setItem("pvz-adventure-level", String(migrated));
  return migrated;
}
```

核心是 `OLD_LEVEL_IDS[saved]`：把旧索引翻译成旧 ID（`1-1` ~ `3-10`），再 `replace(/^3-/, "5-")` 把旧的水池章节（`3-*`）映射到新的水池章节（`5-*`）。因为新版本把水池从第 3 章挪到了第 5 章（中间插入了迷雾和屋顶），所以这一步替换必不可少。

迁移完成后立即写回 `pvz-version = "2"`，下次启动就走 `if` 分支，不再重复迁移。这是一个标准的"一次性数据迁移"模式：**读旧格式 → 转换成新格式 → 打上版本标记 → 写回**。它保证了迁移的幂等性——迁移跑一次就够了，重复跑也不会出错。

## 已知边界：一份诚实的清单

一个项目成熟与否，看它敢不敢把短板写清楚。这个项目有好几处刻意的取舍，值得逐条列出来：

| 边界 | 具体表现 | 为什么这样选 |
| --- | --- | --- |
| 单文件 | 3,731 行全在 `game.js`，无模块拆分 | 免加载顺序、免打包，代价是文件大 |
| 近似碰撞 | 按行 + x 区间判定，非物理引擎 | 玩法本质是一行内线性推进，物理引擎过度设计 |
| 屋顶是纯视觉 | 坡度只改渲染，不改碰撞 | 碰撞逻辑无需感知地形，代价是高低差不严谨 |
| `dt` 封顶 34ms | 长时间挂起后会"慢放"而非"追赶" | 防穿墙优先于"时间严格同步" |
| 迷雾用离屏画布 | 每帧重画整层雾 | 简单直观，代价是每帧一次全屏绘制 |
| 素材第三级是手绘 | 没有素材时用手绘兜底 | 降级可用，代价是手绘版本不如 GIF 精致 |
| 难度靠数据 | 波次、血量、行号都在关卡对象里 | 调平衡改数据即可，代价是缺乏动态难度 |

其中"屋顶纯视觉"和"`dt` 封顶"是两条最需要说清楚的设计。"屋顶纯视觉"意味着理论上存在"僵尸在屋脊、植物在屋檐，视觉上隔了一百多像素，却被判定在同一行"的情况；由于这个游戏的行是水平推进、纵向不参与命中，实际玩起来不会违和，但如果要做一款"纵向也参与碰撞"的游戏，这套近似就不够用了。"`dt` 封顶"则是一个明确的价值判断：宁可让切后台回来时游戏"慢放"一下，也不能让僵尸一帧穿过防线。

## 如果重写，我会先改这五件事

如果让我基于这个仓库做一版重构，会按优先级改五件事。

**第一，把 `game.js` 拆成几个逻辑模块。** 不是拆成细碎的 ES module（那样会引入加载顺序问题），而是拆成 4~5 个"大的职责域"：`data.js`（plantDefs / zombieDefs / LEVELS）、`update.js`（所有 update*）、`draw.js`（所有 draw*）、`modes.js`（冒险/砸罐子/我是僵尸/无尽）、`main.js`（循环 + 钩子）。单文件最大的痛点是"找代码"，按职责切一刀就能解决大半。

**第二，把"植物行为"从 `if/else` 链改成行为表。** 现在 24 种植物共享一个巨大的 `updatePlants`，每加一种植物都要改这个函数。更好的做法是每种植物带一个 `update(p, dt, ctx)` 函数，`updatePlants` 只负责遍历调用。这样"加一种植物"= 加一条数据，而不是改一个 2000 行的函数。

**第三，给碰撞加一个"视觉/逻辑分离"的显式层。** 现在的 `sceneY` / `boardYFromScene` 已经是一对正反变换，但"屋顶视觉高、逻辑平"这件事是隐式的。显式建一个"逻辑网格 + 视觉变换"的双层结构，能让未来做"高度差参与判定"的关卡时不用推倒重来。

**第四，把 `dt` 封顶改成"固定步长累加器"。** 现在的 `Math.min(.034, dt)` 是"防穿墙"，但它会让慢机器上的游戏整体变慢。更好的方案是固定步长（比如 1/120 秒）+ 累加器：卡顿时多跑几个小步，而不是让每步变大。这是物理引擎的标准做法，代价是代码复杂一点。

**第五，给关卡数据加一个运行时校验器。** 60 个关卡对象全靠手写，很容易出现"引用了不存在的植物 ID"或"行号越界"。一个启动时的 `validateLevels()` 能把这些错误从"玩到那一关才崩溃"变成"启动即报错"。事实上测试套件里的 `levels.spec.js` 已经在做这件事，把它提前到启动时会更早发现问题。

## 小结：游戏引擎的复杂度都在"帧"

把花园保卫战从头看到尾，你会发现它几乎没有"需要推公式"的难题。没有复杂的寻路算法，没有真实的物理模拟，没有网络同步。它的复杂度全部集中在"帧"这件事上：

- **帧的时间边界**：`dt` 怎么算、怎么封顶，决定了"掉帧会不会穿墙"。
- **帧的状态边界**：所有系统共享一个 `state`，所以要靠守卫（`mode !== "playing"`）和延迟删除（标记 + 帧末过滤）来维持一致。
- **帧的渲染边界**：`update` 只改状态、`draw` 只读状态，程序动画（bob / rotate / 后坐）全部挂在 `p.action` 和 `p.age` 上。
- **帧的资源边界**：离屏画布只创建一次、精灵三级回退、静态素材用手绘兜底。
- **帧的地形边界**：水面、迷雾、屋顶各自改变"能种什么、看得见什么、画在哪"，但碰撞逻辑尽量不变。
- **帧的可测边界**：`__pvzTest` 暴露纯函数和 `updateOnce(dt)`，把"实时循环"变成"可以手动推进的函数"。

这些边界，没有一个是"引擎能自动帮你解决"的。任何游戏框架都不会替你决定 `dt` 要不要封顶、迷雾要不要挖洞、屋顶要不要影响碰撞。真正的游戏工程，就是把每一条边界都想清楚，然后写进代码、写进测试、写进 README。

花园保卫战值得学的地方，不是"它用原生 JS 复刻了植物大战僵尸"，而是它把"一个网页游戏要成为能玩的游戏，需要处理哪些帧上的问题"完整地摆了出来，并且对每个问题都给出了一个简洁、可验证、带取舍的答案。这比任何"游戏开发最佳实践"都更有参考价值。
