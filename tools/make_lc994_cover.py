# -*- coding: utf-8 -*-
"""
make_lc994_cover.py — 【LC 994】腐烂的橘子 的封面。

构图：左右两个面板，中间分隔线（沿用 lc139/lc322/lc1262/lc200 封面骨架）。
左 = 多源 BFS 分层：第 2 分钟扩散后的网格（源带圆点、本分钟刚腐烂的描绿）；
右 = 距离场 / 时刻表：跑完的章表（数字 = 腐烂时刻 = 到最近源的距离）；
下面两张卡片：骨架 / 易错点与同族。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（· 等符号也交给中文字体）；几何自检。
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
NEW_FILL = (246, 236, 216)
WATER = (238, 242, 238)
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
code_cell = font("consola.ttf", 17)
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
d.text((W / 2, 44), "腐烂的橘子：多源 BFS，和一张腐烂时刻表",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("所有腐烂橘子同时入队（第 0 分钟）", tiny_font, MUTED),
                  ("，每分钟向外扩一圈", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("多源 BFS", card_title, GREEN), ("　分层扩散", tiny_font, MUTED)])
mixed(810, 122, [("距离场", card_title, ORANGE), ("　腐烂时刻表", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 350), fill=BORDER, width=2)

ROWS = COLS = 3
CELL, GAP = 44, 6
totalW = COLS * CELL + (COLS - 1) * GAP
totalH = ROWS * CELL + (ROWS - 1) * GAP
GY = 178


def draw_grid(cx, cell_fn):
    x0 = cx - totalW / 2
    for r in range(ROWS):
        for c in range(COLS):
            x = x0 + c * (CELL + GAP)
            y = GY + r * (CELL + GAP)
            fill, txt, tcol, outline, ow, tf, dot = cell_fn(r, c)
            d.rounded_rectangle((int(x), int(y), int(x + CELL), int(y + CELL)), radius=7,
                                fill=fill, outline=outline, width=ow)
            d.text((int(x + CELL / 2), int(y + CELL / 2)), txt, font=tf, fill=tcol, anchor="mm")
            if dot:
                d.ellipse((int(x + 7), int(y + 7), int(x + 15), int(y + 15)), fill=ORANGE)


# 左：第 2 分钟 rot 完（(0,1)/(1,0) 刚腐烂；源 (0,0) 带圆点）
LEFT_GRID = [
    [2, 2, 1],
    [2, 1, 0],
    [0, 1, 1],
]
LEFT_NEW = {(0, 1), (1, 0)}


def bfs_cell(r, c):
    v = LEFT_GRID[r][c]
    if v == 0:
        return WATER, "0", MUTED, BORDER, 1, code_cell_dim, False
    if (r, c) == (0, 0):
        return GOLD, "2", WHITE, GOLD, 2, code_cell, True
    if (r, c) in LEFT_NEW:
        return NEW_FILL, "2", GOLD, GREEN, 3, code_cell, False
    return GREEN_FILL, "1", WHITE, GREEN, 2, code_cell, False


draw_grid(290, bfs_cell)
d.text((290, 156), "第 2 分钟刚腐烂 2 块（描绿）；圆点 = 源",
       font=row_label, fill=MUTED, anchor="mm")
mixed(290, 356, [("分钟数在整层扩散完后 +1　", tiny_font, MUTED),
                 ("→ 答案 4", code_mid, GREEN)])

# 右：跑完的距离场（章 = 腐烂时刻）
STAMP = [
    ["0", "1", "2"],
    ["1", "2", "·"],
    ["·", "3", "4"],
]
STAMP_DOT = {(0, 0)}


def stamp_cell(r, c):
    txt = STAMP[r][c]
    if txt == "·":
        return WATER, "·", MUTED, BORDER, 1, code_cell_dim, False
    return GOLD, txt, WHITE, GOLD, 2, code_cell, (r, c) in STAMP_DOT


draw_grid(810, stamp_cell)
d.text((810, 156), "每格 = 腐烂时刻 = 到最近源的距离",
       font=row_label, fill=MUTED, anchor="mm")
mixed(810, 356, [("答案 = max(stamp) = ", tiny_font, MUTED),
                 ("4", code_mid, ORANGE)])

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
    [("初始：所有 ", tiny_font, INK), ("2", code_small, GREEN), (" 入队（多源，缺一不可）", tiny_font, INK)],
    [("逐层扩散：", tiny_font, INK), ("for _ in range(len(q))", code_small, GREEN)],
    [("入队即标记 + ", tiny_font, INK), ("fresh", code_small, GREEN), (" 计数定 −1", tiny_font, INK)],
    [("O(m·n)", code_small, GREEN), ("　时间；队列最坏 O(m·n)", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "易错点（追问）", [
    [("只入队一个源 → 分钟数偏大", tiny_font, ORANGE)],
    [("按格子加分钟（应按整层）", tiny_font, ORANGE)],
    [("−1 判据：fresh > 0，不是「队列空了」", tiny_font, ORANGE)],
    [("同族：542 / 1091 / 1162 / 934 / 1765 / 286", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 542 01 矩阵 · LC 1091 二进制矩阵最短路 · LC 1162 地图分析 · LC 934 最短的桥 · LC 1765 地图中的最高点 · LC 286 墙与门",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert totalW < 470, "网格超面板宽"
tw_title = d.textlength("腐烂的橘子：多源 BFS，和一张腐烂时刻表", font=title_font)
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
for out in ("frontend/public/photos/lc-994-cover.png", "photos/lc-994-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
