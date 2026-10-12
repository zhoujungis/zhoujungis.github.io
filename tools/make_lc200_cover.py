# -*- coding: utf-8 -*-
"""
make_lc200_cover.py — 【LC 200】岛屿数量 的封面。

构图：左右两个面板，中间分隔线（沿用 lc139/lc322/lc1262 封面骨架）。
左 = 染色 DFS：同一张 4×5 网格，已访问的陆地染灰、三处 seed 描金；
右 = 并查集：同一张网格，按"根"分组着色（同色 = 同一座岛）；
下面两张卡片：骨架 / 防爆栈与同族。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（≡、∞ 等符号也交给中文字体）；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (121, 168, 146)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
SEEN = (199, 207, 200)
WATER = (238, 242, 238)
BLUE = (138, 160, 192)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 18)
code_cell = font("consola.ttf", 16)
code_cell_dim = font("consola.ttf", 14)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    x = cx - sum(widths) / 2 if anchor == "mm" else cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "岛屿数量：一次染色，两个防爆栈的替代",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("扫描网格：遇到未访问的陆地就 ", tiny_font, MUTED), ("count += 1", code_small, INK),
                  ("，再淹掉整座岛", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("染色 DFS", card_title, GREEN), ("　显式栈", tiny_font, MUTED)])
mixed(810, 122, [("并查集", card_title, ORANGE), ("　数连通块", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 350), fill=BORDER, width=2)

GRID = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1],
]
ROWS, COLS = 4, 5
CELL, GAP = 34, 5
totalW = COLS * CELL + (COLS - 1) * GAP
totalH = ROWS * CELL + (ROWS - 1) * GAP
GY = 178


def draw_grid(cx, color_fn):
    x0 = cx - totalW / 2
    for r in range(ROWS):
        for c in range(COLS):
            x = x0 + c * (CELL + GAP)
            y = GY + r * (CELL + GAP)
            fill, txt, tcol, outline, ow, tf = color_fn(r, c)
            d.rounded_rectangle((int(x), int(y), int(x + CELL), int(y + CELL)), radius=6,
                                fill=fill, outline=outline, width=ow)
            d.text((int(x + CELL / 2), int(y + CELL / 2)), txt, font=tf, fill=tcol, anchor="mm")


SEEDS = {(0, 0), (2, 2), (3, 3)}
VISITED_DFS = {(0, 0), (0, 1), (1, 0), (1, 1), (2, 2), (3, 3), (3, 4)}  # 全访问完


def dfs_cell(r, c):
    if GRID[r][c] == 0:
        return WATER, "0", MUTED, BORDER, 1, code_cell_dim
    if (r, c) in SEEDS:
        return GOLD_FILL, "1", GOLD, GOLD, 3, code_cell
    if (r, c) in VISITED_DFS:
        return SEEN, "1", MUTED, BORDER, 2, code_cell
    return GREEN_FILL, "1", WHITE, GREEN, 2, code_cell


draw_grid(290, dfs_cell)
d.text((290, 156), "网格：灰 = 已访问，金框 = 三处 seed（各计一座岛）",
       font=row_label, fill=MUTED, anchor="mm")
mixed(290, 356, [("DFS 栈深度最坏 = 最长连通路径　", tiny_font, MUTED),
                 ("→ 蛇形长岛会爆栈", tiny_font, ORANGE)])

# 并查集：按根分组
GROUPS = {
    (0, 0): GREEN_FILL, (0, 1): GREEN_FILL, (1, 0): GREEN_FILL, (1, 1): GREEN_FILL,
    (2, 2): GOLD_FILL,
    (3, 3): BLUE, (3, 4): BLUE,
}


def uf_cell(r, c):
    if GRID[r][c] == 0:
        return WATER, "0", MUTED, BORDER, 1, code_cell_dim
    fill = GROUPS[(r, c)]
    tcol = GOLD if fill == GOLD_FILL else WHITE
    return fill, "1", tcol, fill, 2, code_cell


draw_grid(810, uf_cell)
d.text((810, 156), "同一张网格：同色 = 同一个根（同一座岛）",
       font=row_label, fill=MUTED, anchor="mm")
mixed(810, 356, [("每加一块 +1、成功合并 −1　→　", tiny_font, MUTED),
                 ("count = 3", code_mid, ORANGE)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 396
CARD_H = 172
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), CARD_Y, int(x + CARD_W), CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 42
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 33


bottom_card(LEFT_X, GREEN, "骨架", [
    [("扫描：遇到未访问的陆地 → ", tiny_font, INK), ("count += 1", code_small, GREEN)],
    [("染色：DFS / BFS 把整座岛标记（", tiny_font, INK), ("visited", code_small, GREEN), ("）", tiny_font, INK)],
    [("每座岛只 +1 一次；", tiny_font, INK), ("上下左右", tiny_font, GREEN), ("算连通，斜着不算", tiny_font, MUTED)],
    [("O(m·n)", code_small, GREEN), ("　时间；递归 DFS 额外 O(m·n) 调用栈", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "防爆栈（追问）", [
    [("递归 DFS 深度 = 最长连通路径 ", tiny_font, INK), ("→ 爆栈", tiny_font, ORANGE)],
    [("BFS 队列 / 显式栈：把栈搬到堆上", tiny_font, ORANGE)],
    [("并查集：数连通块，无递归（可增量）", tiny_font, ORANGE)],
    [("同族：695 / 130 / 463 / 1254 / 733 / 694 / 1905 / 1020", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 695 最大面积 · LC 130 被围绕的区域 · LC 463 周长 · LC 1254 封闭岛屿 · LC 733 图像渲染 · LC 694 不同岛屿 · LC 1905 子岛屿 · LC 1020 飞地",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert totalW < 470, "网格超面板宽"
tw_title = d.textlength("岛屿数量：一次染色，两个防爆栈的替代", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert 290 - totalW / 2 > 40 and 290 + totalW / 2 < 540, "左网格越界"
assert 810 - totalW / 2 > 552 and 810 + totalW / 2 < 1060, "右网格越界"
assert GY + totalH < 356 - 12, "网格压住结论行"
assert 356 + 12 < CARD_Y - 14, "结论行压住卡片徽标"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (84, 356):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert CARD_Y + CARD_H < H - 30, "底部卡片与 family 行重叠"
print("SELF-CHECK OK:", f"grid={int(totalW)}x{int(totalH)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-200-cover.png", "photos/lc-200-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
