---
title: "方块世界 3D：一台纯 JS 体素引擎的四道闸"
slug: block-world-3d-voxel-engine
cover_image: /photos/block-world-3d-voxel-engine-cover.png
date: 2026-11-19
tags: [Three.js, 体素, 游戏开发, Electron, 性能优化]
---

> 适用读者：想用 Three.js 做体素世界、又不想引入完整游戏引擎的人；对「程序化生成 + 区块流式加载 + 实例化渲染」感兴趣的前端工程师；正在被帧率、内存和存档格式折磨的独立开发者
> 结论先行：方块世界 3D 只在渲染层使用 Three.js，地形、区块、光照、物理、红石、生物 AI、存档全部自己写。它用 28×28 的 Worker 预采样把地形计算挪出主线程，用 251 层的字符串键 Map 存方块，用 1 个字节同时编码天空光和火把光，用 InstancedMesh 按「方块类型 + 状态」合批，再用 4,096 预算的优先队列跑方块更新。实测一个区块的预采样约 5 ms（本机 4.0–5.9 ms），地形采样 16–25 万点/秒，A* 单次寻路 0.05 ms；代价是字符串键约 80 字节/条、红石还不完整、云存档 schema 落后客户端两个版本
> 阅读时间：约 36 分钟 | 难度：进阶 | 收获：一套不依赖游戏引擎的体素世界实现路径 + 区块/光照/渲染/模拟/存档的关键代码与参数 + 一份用真实模块跑出来的性能数据和缺口清单

**目录**

- 边界：什么是引擎，什么是玩法
- 世界：字符串键、251 层与 81 个区块
- 地形：七层噪声与 34 个群系
- 区块：28×28 的 Worker 预采样
- 生成：17 类结构如何钉在种子上
- 光照：一个字节装下天空光与火把光
- 渲染：埋块剔除与 InstancedMesh
- 物理与手感：1.6 高、0.10 半径、6 格触及
- 方块更新：4,096 预算的优先队列
- 红石：信号、延迟与活塞
- 生物：A* 900 节点与 60 类生物
- 存档：v6、15 秒与 D1 分片
- 实测：约 5 ms 一个区块
- 38 套测试与性能门槛
- 六个仍然不完整的地方
- 小结

---

## 边界：什么是引擎，什么是玩法

「用 Three.js 做一个 Minecraft」听起来像一句玩笑。Three.js 只负责三件事：场景图、材质、把三角形画到屏幕上。它不知道什么是方块，不知道什么叫「站在地上」，更不知道红石信号该怎么衰减。

方块世界 3D 的边界划得很清楚：

| 层 | 谁负责 | 代码位置 |
| --- | --- | --- |
| 渲染 | Three.js：相机、材质、InstancedMesh、雾、阴影 | `src/rendering/` |
| 世界数据 | 自己写：方块 Map、区块、方块状态、水位 | `src/world/block-store.js` |
| 地形 | 自己写：噪声、群系、洞穴、矿脉 | `src/world/terrain.js` |
| 生成 | 自己写：树、村庄、17 类结构、战利品 | `src/world/generation.js` |
| 物理 | 自己写：AABB 碰撞、重力、游泳、梯子 | `src/physics/player-physics.js` |
| 模拟 | 自己写：流体、火焰、作物、随机刻、红石 | `src/systems/` |
| 存档 | 自己写：schema v6、Electron SQLite、D1 云同步 | `src/persistence/`、`cloudflare/worker.mjs` |

整个仓库（不含 Three.js 与构建产物）是 103 个文本文件、约 2.3 万行，其中 `game.js` 这个入口就有 87 KB。它不是一个「Three.js 示例」，而是一个把游戏循环拆成二十多个模块的小型引擎。

先看资源规模。用真实模块数出来的静态数据是：

```text
blocks                 528
expanded block names   263
items                  835
crafting recipes       332
stonecutter recipes     80
hostile types           40
animal types            20
villager professions    13
surface biomes          34
world height           251 (-50..200)
load / unload radius   4 / 5 chunks
autosave interval      15000 ms
```

README 的徽章还写着「479 种方块 / 325 个配方」，代码里已经是 528 / 332。这种漂移本身就是一个提醒：**游戏内容的数量增长得比文档快，真正可信的是数据表，不是宣传图。**

## 世界：字符串键、251 层与 81 个区块

世界的数据结构非常朴素：

```js
world = new Map();          // key: "x,y,z" → value: "stone"
blockStates = new Map();    // key: 同上 → { facing, half, powered, ... }
worldLevels = new Map();    // key: 同上 → 0..8，用于水和岩浆
```

`keyOf(x, y, z)` 就是模板字符串。它不紧凑，但有两个好处：调试时一眼能看懂；序列化时直接就是 JSON 的键，不需要额外的编码层。

垂直范围是 `MIN_Y = -50` 到 `MAX_Y = 200`，一共 251 层。水平方向按 16×16 的区块切分，加载半径 4、卸载半径 5：

- 加载半径 4 → `(4×2+1)² = 81` 个区块；
- 卸载半径 5 → 离开 5 个区块才真正释放，避免在边界反复加载；
- 视野距离 112 格，雾在远处收尾。

一个区块的方块数量取决于地形高度。海平面是 2，地表大多在 -10 到 40 之间，所以一列大约有 60–100 个非空方块；16×16 列就是 1.5 万–2.5 万个键。81 个区块全加载，Map 里会有接近 190 万条记录。

我单独测了这种键的内存开销：30 万条 `"x,y,z" → "stone"`，`--expose-gc` 后保留堆 23.0 MB，平均 **80 字节/条**。按 186 万条估算，光方块 Map 就接近 150 MB。这不是精确值（V8 的字符串驻留、Map 扩容都会影响），但量级足够说明问题：**字符串键换来的是可读性，付出的是内存。**

为什么不用 `Uint16Array` 或分块位图？因为世界不是固定大小的。无限地形意味着区块按需创建、按需卸载，还要支持「玩家改动过的方块」单独持久化。用 Map 存稀疏数据，删除和查询都是 O(1)，实现成本最低。等世界规模再上一个量级，才值得换成「每区块一个定型数组 + 调色板」。

区块对象本身很小：

```js
const chunk = { x: chunkX, z: chunkZ, keys: new Set(), meshes: [] };
```

`keys` 是这个区块里所有非空方块的键。它有两个用途：重建光照/网格时只遍历本区块，不用扫全世界；卸载时按 `keys` 把方块从全局 Map 里删掉。

`ensureChunks()` 的卸载逻辑是：

```js
for (const key of chunk.keys) {
  world.delete(key);
  worldLevels.delete(key);
  blockStates.delete(key);
  fallingBlockKeys.delete(key);
  copperBlockKeys.delete(key);
}
for (const mesh of chunk.meshes) removeChunkMesh(mesh);
chunks.delete(chunkKey);
```

这里有一个可以改进的地方：它只清了 5 张索引表，`waterSet`、`lavaSet`、`fireKeys`、`cropKeys`、`leafKeys`、`torchKeys` 等没有跟着删。模拟循环在访问时会检查「这个区块还在不在」，不在就跳过；等区块重新加载时，才顺手把失效键删掉。这意味着长期探索会让这些集合保留一些已卸载区块的键——不会算错，但会慢慢变大。对一个「走多远都不崩」的沙盒来说，这是一个需要留意的长期内存项。

方块状态是另一张 Map。楼梯的朝向、台阶的上下半、门的上半下半、红石中继器的延迟、比较器的模式、水的等级、作物成长阶段，都放在这里。`setBlock()` 会同时维护十几张索引表：

```text
fallingBlockKeys   沙、砂砾、混凝土粉末
copperBlockKeys    会氧化的铜块
farmlandKeys       耕地
fireKeys           火焰
leafKeys           树叶
saplingKeys        树苗
growableKeys       可催熟作物
waterSet / lavaSet 流体
cropKeys           作物
torchKeys          光源
```

这些表不是为了好看，而是为了让「随机刻」不用扫描整个世界。每帧只遍历这些集合，成本与「活跃方块数」成正比，而不是与「世界方块数」成正比。

## 地形：七层噪声与 34 个群系

地形生成的核心是七个噪声盐：

```js
const NOISE_SALT = {
  continents: 0x1a2b3c4d,
  erosion:    0x2b3c4d5e,
  ridges:     0x3c4d5e6f,
  temperature:0x4d5e6f70,
  vegetation: 0x5e6f7081,
  river:      0x6f708192,
  detail:     0x708192a3,
  variant:    0x8192a3b4,
};
```

每个盐对应一个 `fractalNoise2D`，用 2–5 个八度的 value noise 叠加。`latticeNoise2D` 先对坐标和种子做整数混合，再用 `mix32` 打散；这样做比 `Math.sin` 哈希更稳定，也不会在不同平台上产生浮点差异。

`heightAt(x, z)` 不是简单地把噪声相加，而是分了三层：

```text
base       = 大陆度 → 基础海拔（-14 到 30）
macro      = 低频细节 × (5 + 低侵蚀 × 8)
detail     = 高频细节 × 2.6
mountain   = 低侵蚀 × 陆地掩码 × 山脊掩码^1.38 × (92 + 峰形 × 142)
natural    = base + macro + detail + mountain
```

然后再处理海洋、河流和峡谷：

- 大陆度低于阈值时，海底深度按 `SEA_LEVEL - 5 - oceanStrength × 8` 下压；
- 河流用「扭曲坐标 + 两条噪声通道」生成，河道中心下切到海平面附近；
- 山脊用 `1 - |ridge| × 2.15`，再乘侵蚀掩码，只有「低侵蚀 + 高陆地 + 高脊」三条同时成立才会起高山。

群系不是按高度硬切，而是用「气候目标 + 加权距离」选：

```text
distance = Δtemperature² × 1.45
         + Δvegetation² × 1.25
         + Δcontinentalness² × 0.45
         + Δerosion² × 0.58
         + Δridges² × 0.72
```

十二个目标（平原、森林、丛林、白桦、沼泽、山地、雪原、沙漠、针叶、热带草原、恶地、草甸）里取距离最近的一个，再用 `variant` 噪声派生变种：平原可能变成向日葵平原，森林可能变成黑森林或花森林，丛林可能变成竹林或稀疏丛林。最终得到 34 种地表群系。

洞穴是另一套系统，不走群系：

- `caveFieldAt` 用四个三角函数叠加出一个「腔体场」，超过 1.12 才算洞穴；
- `isTunnel` 每 20 格一个区段，按种子决定是否生成水平隧道；
- `isRavine` 用扭曲噪声找窄而深的峡谷，宽度随高度变化；
- `aquiferAt` 在深海平面以下生成含水层，深处生成岩浆；
- `isLavaLake` 用 34×12 的格子找岩浆湖。

矿脉不是逐块随机，而是「格子候选 + 椭球距离」：每种矿有自己的 `spacing`、`verticalSpacing`、`radius` 和 `chance`，先在 3×3×3 的邻格里生成候选中心，再判断当前点是否落在椭球内。这样矿脉会成簇，不会像撒胡椒面。

## 区块：28×28 的 Worker 预采样

主线程最怕的是「玩家一边走，地形一边算」。`chunk.worker.js` 把地形采样放进 Worker：

```js
const MARGIN = 6;
const width = chunkSize + MARGIN * 2;   // 16 + 12 = 28
const originX = chunkX * chunkSize - MARGIN;
const originZ = chunkZ * chunkSize - MARGIN;

for (let localZ = 0; localZ < width; localZ += 1) {
  for (let localX = 0; localX < width; localX += 1) {
    const x = originX + localX;
    const z = originZ + localZ;
    heights[index] = heightAt(x, z);
    biomes[index] = BIOME_IDS.get(biomeAt(x, z)) ?? 0;
    slopes[index] = Math.min(255, terrainSlopeAt(x, z));
  }
}
self.postMessage({ id, ok: true, heights, biomes, slopes },
  [heights.buffer, biomes.buffer, slopes.buffer]);
```

几个决定性能的细节：

- **6 格边距**：树冠、结构、坡度需要看区块外 2–6 格，预采样 28×28 而不是 16×16，主线程生成时就不必跨区块查询；
- **定型数组**：高度用 `Int16Array`，群系和坡度用 `Uint8Array`，内存紧凑，传输也快；
- **Transferable**：三个 buffer 直接转移所有权，不做结构化克隆；
- **一次只算一层**：Worker 只返回高度、群系、坡度，不返回方块。方块填充留在主线程，因为要读全局的 `world`、`blockStates` 和存档改动。

实测 81 个区块（半径 4）一共 63,504 个采样点，CPU 时间 385–479 ms，平均 **4.8–5.9 ms/区块**。半径 1 是 4.0–5.8 ms/区块，半径 2 是 4.2–5.2 ms。注意这里并不是「规模越大越便宜」：`terrainRouterAt` 的缓存上限是 16,384 条，半径 4 的 63,504 个采样点会让缓存反复清空，单块成本反而略高。这个细节说明，缓存命中率比「JIT 热了没有」更能解释区块生成的差异。

这说明 Worker 的价值不是「算得快」，而是「不阻塞帧」。5 ms 的预算如果落在主线程，会明显吃掉 60 FPS 的一帧；放进 Worker，主线程只需要做方块填充和网格构建。

## 生成：17 类结构如何钉在种子上

`generateChunk(chunkX, chunkZ)` 的顺序是固定的：

```text
1. 取预采样（或回退到 heightAt/biomeAt/terrainSlopeAt）
2. 逐列填地形：基岩 → 洞穴 → 表层/填充层 → 石头/矿脉
3. 海平面以下填水
4. 深处填岩浆/含水层
5. 装饰洞穴（繁茂/滴水石/深暗）
6. 种树（根可以落在区块外 2 格）
7. 地表植被（花、草、仙人掌、甘蔗、南瓜、蘑菇）
8. 村庄
9. 17 类结构
10. 应用玩家改动
```

结构不是「随机找个地方盖」，而是「用种子算出固定位置」。每个结构有自己的 `bounds` 和区域网格，先判断当前区块是否落在结构的包围盒里，再决定要不要生成。村庄的规则最直观：

```js
const gridX = Math.floor(chunk.x / 32);
const gridZ = Math.floor(chunk.z / 32);
const centerX = (gridX * 32 + 16) * 16 + 8;
const centerZ = (gridZ * 32 + 16) * 16 + 8;
if (Math.abs(centerX) + Math.abs(centerZ) < 128) return;   // 出生点附近不刷
if (hash(gridX * 127, gridZ * 911) >= .065) return;        // 6.5% 的格子有村庄
```

每 32 个区块一个网格，网格中心最多生成一个村庄；3–6 栋房子，13 个职业各一个村民，一个铁傀儡，一块农田，一个战利品箱。床是真实的 POI，两栋床留出繁殖容量，不是装饰。

房子生成有一个很实用的细节：

```js
// 结构地基必须压平天然洞口和起伏，否则同一个种子会生成缺角房屋。
if (getBlock(x, y, z)) put(x, y, z, null);
put(x, y, z, "planks");
```

先把地基位置的方块清空，再铺木板。这样即使地下刚好有洞穴，房子也不会缺一角。结构生成最怕的就是「种子固定但地形边界条件不固定」；把地基压实，是让快照回归能通过的前提。

矿车轨道、下界堡垒、末地城、海底神殿、林地府邸、远古城市、试炼密室、沙漠神殿、丛林神庙、雪屋、掠夺者前哨、废弃传送门、沉船、废弃矿井、末地漂流船，一共 17 类。它们的共同点是：位置由种子决定，内部布局由局部随机决定，战利品由 `STRUCTURE_LOOT` 表决定。

结构位置还有一层缓存：

```js
const cacheKey = `${seed}:${type}`;
if (structureCenterCache.has(cacheKey)) return { ...structureCenterCache.get(cacheKey) };
```

每个世界、每种结构只算一次中心点，之后所有区块共享。这很重要：如果每生成一个区块都重新算一遍「最近的村庄在哪」，结构定位会从毫秒级变成秒级。

跨区块结构是另一个麻烦。房子的包围盒可能横跨四个区块，每个区块生成时都要判断「我这一部分该盖什么」。代码用 `structureIntersects(type, minX, maxX, minZ, maxZ)` 做包围盒相交，再在区块内部裁剪坐标。这样无论从哪个区块先加载，最终拼出来的房子都是一样的。

这也是 `world-generation-v1.json` 快照测试存在的理由：结构生成没有「运行时状态」，只有「种子 + 坐标」。只要快照不变，就说明这次改动没有意外移动任何一座村庄。

实测在当前种子（1337）下，17 类结构全部能定位到，单轮耗时 1.9–3.7 ms。这个数字说明「结构定位」本身不是瓶颈，真正的成本在方块填充和网格构建。

## 光照：一个字节装下天空光与火把光

每个区块有一块 `Uint8Array(16 × 16 × 251)` 的光照数组，共 64,256 字节。一个字节拆成两半：

```text
高 4 位：天空光 0–15
低 4 位：火把光 0–15
```

`setLight()` 用位运算写入：

```js
chunk.light[index] = (sky !== null ? (sky << 4) : (cell & 0xF0))
                   | (torch !== null ? torch : (cell & 0x0F));
```

天空光是自上而下扫的：

- 从 `MAX_Y` 往下，遇到不透明方块就把 `level` 置 0；
- 水每格衰减 2，其他透明方块衰减 1；
- 空气保持当前 level。

这个简化模型没有做水平方向的天空光扩散，所以山洞入口的明暗过渡不如原版细腻；但它便宜，一个区块 16×16×251 的扫描是固定的 64,256 次操作。

火把光是 BFS。每个光源从 14 开始，向六个方向扩散，遇到不透明方块停止，已经更亮的格子不重复入队：

```js
const existing = lightAt(nx, ny, nz) & 0x0F;
if (existing >= current.l - 1) continue;
setLight(nx, ny, nz, null, current.l - 1);
queue.push({ x: nx, y: ny, z: nz, l: current.l - 1 });
```

渲染时，每个实例的颜色由光照数组计算：

```text
brightness = max(1, min(15, round(sky × min(1, daylight + 0.2))), torch)
base       = brightness × 3
color      = LIGHT_RAMP[base..base+2]
variation  = 0.94 + hash(x × 3 + y, z × 5) × 0.1
ao         = 1 - min(0.24, blockedNeighbors × 0.045)
final      = color × variation × ao
```

`LIGHT_RAMP` 是 16 级预计算的颜色表，避免每帧做 pow。夜里还会抬一个「可读性下限」：

```js
const readableFloor = 0.36 + daylight × 0.16;
```

这不是物理正确的光照，而是「晚上也要看得清轮廓」的产品取舍。体素游戏里，纯物理正确的夜晚通常太黑，玩家会调 gamma；不如在渲染层直接把下限抬起来。

## 渲染：埋块剔除与 InstancedMesh

渲染层最贵的不是画三角形，而是 draw call。一个区块有上万块方块，如果每块一个 Mesh，浏览器会先被 draw call 拖死。

代码按「方块类型 + 状态签名」分桶：

```js
const bucketKey = `${type}|${stateSignature(type, state)}`;
```

每个桶创建一个 `InstancedMesh`，所有同类型同状态的方块共享几何体和材质，只传实例矩阵。一个区块的 draw call 数量等于「不同方块类型 × 不同状态」的数量，通常是个位数到几十。

在进桶之前，先做埋块剔除：

```js
const buried = occludesBlockFace(type, x, y, z, x+1, y, z) &&
               occludesBlockFace(type, x, y, z, x-1, y, z) &&
               occludesBlockFace(type, x, y, z, x, y+1, z) &&
               occludesBlockFace(type, x, y, z, x, y-1, z) &&
               occludesBlockFace(type, x, y, z, x, y, z+1) &&
               occludesBlockFace(type, x, y, z, x, y, z-1);
if (!buried) { /* 进桶 */ }
```

六个面都被不透明方块挡住的地下方块，直接不渲染。这一条能砍掉地下 60%–80% 的实例，尤其在深层矿洞附近。

几个性能开关：

- `mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage)`：方块实例位置基本不变，静态用法让驱动少做同步；
- 阴影只给「距离玩家 1 个区块以内、非水/叶/植物」的方块开；
- 接收阴影只给 2 个区块以内；
- 水单独一层：水体、水面、水沫三个 InstancedMesh，`renderOrder` 分别是 1/2/3；
- 火把用一个小尺寸的缩放矩阵，不单独建模；
- 作物按成长阶段改高度，不换几何体。

水面还有一个细节：只在「上方不是水」的格子生成水面，再在「四周有固体方块」的格子生成水沫。这样水平面不会在每一格都叠一层透明面，透明排序的压力小很多。

几何体和材质都是按类型复用的。`getBlockGeometry(type, state)` 对「楼梯朝北、上半、未含水」这种组合缓存一份几何体，`materials[type]` 对每种方块复用一份材质。README 提到 528 种方块里有 250 种使用程序化纹理，仓库里还有一张 `common-blocks.png` 作为基础图集；程序化纹理的好处是不用为每种变种画一张贴图，坏处是首次生成有成本，所以必须缓存。

这也解释了为什么「状态签名」要参与分桶：同样是楼梯，朝北和朝东的实例矩阵不同，但几何体可以共享；同样是台阶，上半和下半需要不同的几何体偏移。把状态拼进 `bucketKey`，是在「减少 draw call」和「复用几何体」之间取的一个平衡点。

## 物理与手感：1.6 高、0.10 半径、6 格触及

玩家参数全在 `constants.js`：

```js
PLAYER_HEIGHT = 1.6;
PLAYER_RADIUS = 0.10;
EYE_HEIGHT = 1.43;
REACH = 6;
CAMERA_FOV = 56;
THIRD_PERSON_DISTANCE = 3.8;
MOUSE_LOOK_SENSITIVITY = 0.0015;
TOUCH_LOOK_SENSITIVITY = 0.0055;
```

0.10 的半径比原版（约 0.3）窄很多。这是一个明确的手感取舍：窄半径让玩家更容易挤进一格宽的缝隙，减少「明明看着能过却卡住」的挫败感；代价是贴墙时更容易穿模，所以碰撞检测不能只做中心点，还要做 AABB 的四角。

移动是「输入 → 期望速度 → 碰撞求解 → 落地判定」四步。水、梯子、蜘蛛网、冰面各自改加速度和摩擦；第三人称相机用 14 的跟随速度做阻尼，避免转头时相机瞬移。

`REACH = 6` 决定了方块交互距离。挖掘、放置、开门、点火、喂食、交易都用这个距离做统一校验，防止「隔空操作」。

## 方块更新：4,096 预算的优先队列

方块世界会同时发生很多「稍后要做」的事：水要流、火要烧、作物要长、红石中继器要延迟、活塞要推、侦测器要发脉冲。逐帧遍历整个世界不现实，所以有一个统一的事件队列。

事件的结构是：

```js
{ x, y, z, type, due, priority, sequence, dedupeKey, payload }
```

排序规则是「到期时间 → 优先级 → 入队顺序」：

```js
function compareEvents(a, b) {
  return a.due - b.due || b.priority - a.priority || a.sequence - b.sequence;
}
```

`dedupeKey` 用来合并同一格子的重复事件。比如连续放水，不需要排一百个「流体更新」，排一个就够；后来的事件如果比已存在的更晚，直接丢弃。

`tick(dt, { budget })` 每帧最多处理 4,096 个事件：

- 到期且在当前加载区块内的事件入堆；
- 不在加载范围内的计入 `inactive`，不处理但保留；
- 处理完返回 `processed / processedByType / inactive / remaining / saturated`；
- `saturated = true` 说明预算打满，下一帧继续。

这个设计的价值是**可观测**。如果某次红石电路卡住，日志里能看到 `remaining` 一直不降、`saturated` 一直为 true，问题就定位在「事件生产速度大于消费速度」，而不是「游戏莫名其妙卡」。

延迟不是拍脑袋定的。`setBlock()` 在写入方块时，会按类型排下一次 tick：

| 类型 | 延迟 | 用途 |
| --- | --- | --- |
| 作物 | 6.5 秒 | 成长阶段 |
| 水 | 0.4 秒 | 流动 |
| 岩浆 | 1.2 秒 | 流动（更慢） |
| 火 | 0.5 秒 | 蔓延/熄灭 |
| 树苗/可催熟/耕地 | 2 秒 | 生态更新 |

这些延迟和 `randomTickSpeed = 3`、`simulationDistance = 4` 一起存在存档里。玩家改设置，存档会记住；换一台机器打开，节奏不变。对单机游戏来说，这比「服务端权威」简单得多，但也意味着「改本地文件就能改随机刻速度」——单机游戏不需要防作弊。

## 红石：信号、延迟与活塞

红石是体素游戏里最容易失控的系统，因为它天生是图计算：信号会传播、会反馈、会形成时钟。

方块世界 3D 的实现是「每帧重算脏区」，不是事件驱动的电路求解器：

- 红石粉的强度 0–15，BFS 每格减 1；
- 中继器延迟 `(configured + 1) × 0.1` 秒，`configured` 取值 1–4，所以是 0.2–0.5 秒；
- 比较器支持 `compare` 与 `subtract` 两种模式；
- 火把是反相器：输入亮则输出灭；
- 侦测器检测方块状态变化，发一个脉冲；
- 活塞先收集要推的方块，再整体移动，最多 12 块（`collectPistonMove`）；
- 目标方块被箭或投掷物击中时输出 15。

信号传播用 `propagateDust(seeds)`：把当前所有电源（拉杆、按钮、火把、压力板、比较器输出）作为种子，BFS 扩散，遇到比当前更弱的格子就更新。每一帧只重算「脏区」，不是全图。

红石的难点不在信号，而在**顺序**。两个中继器互相指向对方，谁先更新？代码用 `blockUpdateQueue` 的 due 时间和 sequence 决定顺序，保证同一帧内的事件有确定性；跨帧则依赖延迟。这让红石电路可复现，也让「时钟」类电路能稳定振荡。

当然，它还不完整。TNT、压力板、绊线、投掷器的完整系统都没有；漏斗方向固定向下；活塞不处理实体。这些会在缺口一节展开。

## 生物：A* 900 节点与 60 类生物

生物分两类：40 类敌对、20 类动物。定义是数据驱动的：

```js
const HOSTILE_TYPES = { zombie: {...}, skeleton: {...}, creeper: {...}, ... };
const ANIMAL_TYPES  = { cow: {...}, sheep: {...}, wolf: {...}, ... };
```

生成规则看五个条件：维度、群系、光照、高度、天气。`mobSpawnRules.js` 把它们压成可查询的函数，`canMobSpawn()` 在随机刻里被调用。

寻路是 A*，实现很克制：

```js
function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z) + Math.abs(a.y - b.y) * 1.25;
}
```

- 四方向移动，不做对角线；
- 每步允许「向上 1 格」或「向下最多 2 格」；
- 向上代价 0.6，向下每格 0.18；
- `maxNodes = 900`，`maxDistance = 32`，`goalTolerance` 可配；
- 找的是「最接近目标的节点」，不是「必须精确到达」，所以追不到时会停在最近点，而不是直接放弃。

实测在平坦合成世界里，500 次 20 格寻路平均 23.5 个路径节点、0.03 ms/次、29,451 次/秒。真实世界里方块更复杂，节点数会上升，但这个量级说明「每只怪每帧寻路」是可以承受的。

村民是另一套：13 种职业、5 级交易、需求与补货、POI 工作点、作息、繁殖、钟声避难、袭击与铁傀儡。它更像一个经济系统，而不是 AI。

Boss 有两个：末影龙（盘旋/栖息/俯冲/龙息/水晶治疗）和凋灵（灵魂沙 + 凋灵骷髅头召唤、远程/装甲阶段、凋零效果）。凋灵的完整阶段闭环还缺一块，后面会说。

## 存档：v6、15 秒与 D1 分片

存档分三层。

第一层是「世界状态快照」：

```js
{
  schemaVersion: 6,
  world: { id, name, seed, gameTime, difficulty, randomTickSpeed, simulationDistance },
  player: { position, yaw, pitch, health, hunger, inventory, stats, advancements, deathHistory, ... },
  dimensions: {
    overworld: { chunks: [...], entities: [...], redstone: {...} },
    nether: {...},
    end: {...}
  }
}
```

第二层是「区块改动」。存档不存整个世界，只存「玩家改过的方块」：

```js
{ x, y, z, type, state?, level? }
```

生成区块时，先按种子生成，再把改动覆盖上去。这是无限地形能存下来的关键：否则一个走过的世界就是几百 MB。

第三层是「运行时实体」。敌对生物、动物、村民、铁傀儡、掉落物、经验球、矿车，都按维度序列化，恢复时重建。

版本迁移是显式的。`SAVE_SCHEMA_VERSION = 6`，`MIN_SUPPORTED_SAVE_SCHEMA_VERSION = 1`，迁移逐级进行：

```js
if (sourceVersion === 1) { /* dimensions 从 player.dimensions 提升到顶层，补 offhand */ }
if (sourceVersion <= 2) { /* 补 effects / unlockedRecipes / beaconEffect */ }
if (sourceVersion <= 3) { /* 补 world.difficulty */ }
if (sourceVersion <= 4) { /* 补 randomTickSpeed / simulationDistance / spawnDimension / scheduledTicks */ }
if (sourceVersion <= 5) { /* 补 stats / advancements / deathHistory */ }
snapshot.schemaVersion = SAVE_SCHEMA_VERSION;
```

未知版本直接抛错：

```js
if (sourceVersion > SAVE_SCHEMA_VERSION) {
  throw new RangeError(`Save schema ${sourceVersion} is newer than supported schema ${SAVE_SCHEMA_VERSION}`);
}
```

拒绝「未来版本」比兼容它更重要。旧客户端读到新存档，最安全的做法是拒绝加载，而不是猜字段。

本地存档是 Electron + `node:sqlite`，按世界隔离；自动保存每 15 秒一次，退出、切维度、重置世界时也会保存。云端存档是 Cloudflare Pages Functions + D1，表结构是：

```text
worlds              世界元数据 + snapshot_json
users               账号 + PBKDF2 哈希 + salt + owner_id
world_dimensions    每个维度的状态 JSON
world_chunks        每个区块的改动 JSON
world_entities      每个实体的状态 JSON
```

云端不是存一个大 JSON，而是把维度、区块、实体拆行。这样保存时可以按 75 条一批 `batch`，读取时可以只取当前维度的区块，避免一次拉一个几十 MB 的快照。玩家核心快照有 500 KB 的上限，超了直接报错，不会悄悄截断。

本地与云端的关系是「同一份快照，两种存储」，不是「实时同步」。`desktop.worlds.save()` 写入当前设备（SQLite 或云端 D1），15 秒一次；云端按 `owner_id + world_id` 覆盖对应行，没有版本向量，也没有冲突合并。两台设备同时玩同一个世界，后保存的会覆盖先保存的。对单机游戏来说这可以接受，但要知道它不是「协作编辑」。世界菜单提供导出 JSON、复制、重命名、删除，本质上就是把「备份」交给用户，而不是做一个隐藏的版本历史。

自动保存还有一个时间窗口：进程被杀，最多丢 15 秒的进度。切维度、退出世界、重置世界时会额外保存一次，所以正常操作不会丢；任务管理器强杀进程会。这个取舍和大部分单机游戏一致：用固定间隔换低开销，而不是每次方块变化都写盘。

## 实测：约 5 ms 一个区块

为了不靠感觉调参数，我用仓库里的真实模块跑了一组基准。环境是 Windows、Node 24.18.0，脚本直接 import `terrain.js`、`generation.js`、`ecology.js`、`catalog.js`、`entities.js`、`pathfinding.js`、`save-schema.js`，没有改实现。

测量方式需要先说明：Windows 上墙钟时间会随系统负载两倍波动，所以脚本用 `process.cpuUsage()` 统计进程 CPU 时间；调度器的最小刻度约 15 ms，小于这个量的操作就重复几十到几千次再均摊。即使这样，同一脚本多次运行的差异仍有 20%–50%，因此下面给的是区间，不是「精确到小数点后两位」的承诺。

地形采样：

| 步长 | 采样点 | CPU 时间 | 吞吐 |
| --- | --- | --- | --- |
| 16 | 4,225 | 7–22 ms | 19–60 万点/秒 |
| 8 | 16,641 | 63–123 ms | 13–26 万点/秒 |
| 4 | 66,049 | 260–400 ms | 16–25 万点/秒 |

步长 16 的那一行偏快，是因为采样点少、整个 4,225 条能塞进 16,384 条的路由缓存；步长 4 有 66,049 个点，缓存会被反复清空，单点成本反而上升。每个点包含 `heightAt + biomeAt`；如果再把 `terrainSlopeAt` 的五次内部高度采样算进去，单点真实成本会更高。这也是为什么「地形采样 20 万点/秒」不能直接换算成「区块生成 20 万点/秒」——后者还要做洞穴、矿脉、树和结构。

Worker 预采样：

| 半径 | 区块数 | 采样点 | CPU 时间 | 单区块 |
| --- | --- | --- | --- | --- |
| 1 | 9 | 7,056 | 36–52 ms | 4.0–5.8 ms |
| 2 | 25 | 19,600 | 104–130 ms | 4.2–5.2 ms |
| 4 | 81 | 63,504 | 385–479 ms | 4.8–5.9 ms |

每个区块 784 个采样点（28×28），每个点做高度、群系、坡度三次查询。半径 4 的 81 个区块总共 0.39–0.48 秒，这就是「进入世界」时地形部分的真实成本；性能预算里的 `worldReadyMs = 15000` 留了足够余量。单块成本随半径略微上升，原因还是路由缓存：半径 4 的 63,504 个采样点超过了 16,384 条上限，缓存整体清空的次数更多。

其它实测：

```text
结构定位      17 类全部命中，单轮 1.9–3.7 ms
存档迁移      v1 → v6，50,000 次，16–30 µs/次
A* 寻路       5,000 次，平均 23.5 节点，0.05–0.06 ms/次，1.6–2 万次/秒
方块键内存    300,000 条，保留堆 23.0 MB，80 字节/条
```

80 字节/条这个数字值得再强调一次。81 个区块、每区块约 2.3 万条，合计约 186 万条，按这个比例就是 149 MB。再叠加光照数组（每区块 64 KB × 81 ≈ 5.2 MB）、网格、实体、材质和 Three.js 自己的对象，一个 81 区块的世界稳定在几百 MB 量级。`heapGrowthMb = 20` 的预算只约束「移动 8 次后堆增长不超过 20 MB」，不是总内存。

这组数字没有包含 Three.js 渲染、浏览器事件循环、GPU 上传和实际存档 I/O。A* 跑的是平坦合成世界，真实地形里的节点展开会更多；结构定位只测了「算位置」，没测「盖房子」。所以它们适合回答「哪一层是瓶颈」，不适合当作「帧率承诺」。从这个角度看，结论很清楚：地形预采样是毫秒级，方块填充和网格构建才是需要继续压的部分；而 149 MB 的方块 Map 说明，真正的天花板可能不是 CPU，而是内存。

## 38 套测试与性能门槛

仓库里有 38 个 `test-*` 文件，覆盖：

- 地形与生成：`test-terrain`、`test-generation-snapshots`、`test-ecology`、`test-structures`；
- 方块规则：`test-blocks`、`test-block-rules`、`test-building-families`、`test-building-visual`；
- 生存：`test-progression`、`test-player-experience`、`test-difficulty`、`test-furnace`、`test-container-transfer`；
- 红石：`test-redstone`、`test-redstone-devices`、`test-redstone-e2e`；
- 生物：`test-mobs`、`test-mob-behavior`、`test-mob-spawn-rules`、`test-pathfinding`、`test-mob-navigation`；
- 探索与通关：`test-exploration-e2e`、`test-completion-e2e`；
- 存档：`test-persistence`、`test-save-migrations`、`test-sqlite`、`test-cloud-api`；
- 性能与桌面端：`test-performance`、`test-electron`。

里面有两个设计值得借鉴。

第一，**生成快照**。`tools/snapshots/world-generation-v1.json` 保存了固定种子下的地形结果，改完生成器后对比快照，能立刻发现「无意中改了某个群系的边界」。程序化生成最怕「看起来差不多」，快照回归是唯一可靠的防线。

第二，**性能预算写成 JSON**：

```json
{
  "budgets": {
    "worldReadyMs": 15000,
    "chunkMoveP95Ms": 4000,
    "frameMedianMs": 34,
    "frameP95Ms": 100,
    "heapGrowthMb": 20,
    "maxLoadedChunks": 25
  }
}
```

`frameMedianMs = 34` 对应约 30 FPS 的中位帧时间（34 ms），`frameP95Ms = 100` 允许偶发卡顿；`chunkMoveP95Ms = 4000` 是「移动一个区块的 P95 不超过 4,000 ms」——这个数字看起来很宽，但它约束的是「最坏情况」而不是「平均手感」。`worldReadyMs = 15000` 则要求进入世界在 15,000 ms 内完成。把预算写进仓库，CI 才有东西可以对比；否则「性能优化」永远是一句口号。

## 六个仍然不完整的地方

**一、红石是简化版。** 没有 TNT、压力板、绊线、投掷器的完整系统；漏斗方向固定向下；活塞不处理实体；比较器的容器信号只覆盖部分容器。做红石电路可以，做原版那种大型机械不行。

**二、附魔与酿造被砍。** 只有 14 种附魔，冲突与概率规则简化；酿造只有 4 条基础链，没有喷溅、滞留、增效体系。织布机、炼药锅、砂轮、制箭台目前只是村民职业点，外观存在但功能不完整。

**三、凋灵没有完整阶段闭环。** 能召唤，也有远程/装甲阶段和凋零效果，但缺少原版那种「半血后装甲 + 召唤小怪」的完整节奏。

**四、没有创造、旁观、极限模式和指令。** 只有生存循环。对想「随便搭个东西」的玩家，这是硬缺失。

**五、字符串键的内存开销。** 80 字节/条，81 个区块接近 150 MB。换成「每区块定型数组 + 调色板」能显著下降，但会牺牲稀疏世界和存档改动的简洁性。这是一个有意的取舍，不是 bug。

**六、云端存档 schema 落后客户端两个版本。** 客户端 `SAVE_SCHEMA_VERSION = 6`，云端 `SCHEMA_VERSION = 4`，写入时会把快照标成 v4，读取时再走 v4→v6 迁移。因为迁移只补字段、不删字段，功能上能跑；但它意味着「云端存档格式」和「本地存档格式」不是同一个东西，长期维护会越来越别扭。另外云端的 PBKDF2 只有 10,000 次迭代，和主站的 120,000 次不是一个标准。

还有两个非缺陷但必须知道的边界：浏览器版只展示入口，完整玩法需要 Electron 桌面端；README 徽章的数据（479 方块 / 325 配方）已经落后于代码（528 / 332）。

## 小结

方块世界 3D 最值得看的不是「它像 Minecraft」，而是它把体素世界的五个硬问题拆成了可检查的代码：

- **世界**：字符串键 Map + 稀疏改动，换来调试和存档的简单；
- **地形**：七层噪声 + 气候目标 + 洞穴/河流/矿脉，34 个群系不是硬编码；
- **区块**：28×28 Worker 预采样，约 5 ms/区块，主线程只做填充和合批；
- **光照**：1 字节装天光与火把光，16 级色表 + AO + 夜间可读性下限；
- **渲染**：埋块剔除 + InstancedMesh，draw call 从万级降到几十；
- **模拟**：4,096 预算的优先队列，让红石、流体、作物、随机刻共享一套时钟；
- **存档**：只存改动、v1→v6 逐级迁移、拒绝未来版本、D1 按维度/区块/实体拆行。

它的短板也很清楚：红石不完整、模式不全、内存偏大、云端 schema 漂移。这些不是「以后再说」的 TODO，而是当前实现的实际边界。

如果你也想用 Three.js 做一个体素世界，最值得先抄的不是渲染，而是这三件事：**把地形放进 Worker、只存方块改动、把性能预算写成文件。** 前两件决定你能不能跑起来，第三件决定你能不能在半年后还知道它有没有变慢。

**体素世界的难点从来不是「画一个方块」，而是「让一百万个方块在正确的时刻出现、消失、变亮、流动，并且下次打开还在原地」。**

---

**参考链接**

- 项目仓库：[github.com/zhoujungis/block_world_3d](https://github.com/zhoujungis/block_world_3d)
- 世界常量：`src/config/constants.js`
- 地形：`src/world/terrain.js`
- 区块生成：`src/world/generation.js`
- 方块存储：`src/world/block-store.js`
- 光照：`src/rendering/lighting.js`
- 更新队列：`src/systems/block-update-queue.js`
- 红石：`src/systems/redstone.js`
- 寻路：`src/systems/pathfinding.js`
- 存档迁移：`src/persistence/save-schema.js`
- 云存档：`cloudflare/worker.mjs`、`migrations/`
- 实测脚本：`tools/bench_block_world.mjs`（本仓库）

*本文的常量、代码片段与数据表均核对自仓库源码；性能数字由 `tools/bench_block_world.mjs` 在本机 Node 24.18.0 上测得，未包含 Three.js 渲染与浏览器事件循环的开销。*
