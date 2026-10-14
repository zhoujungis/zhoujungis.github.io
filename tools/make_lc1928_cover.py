# -*- coding: utf-8 -*-
"""
make_lc1928_cover.py — 【LC 1928】规定时间内到达终点的最小花费 的封面。

构图：左右两个面板，中间分隔线（沿用 lc704/lc322/lc139 封面骨架）。
左 = 分层图 dp 表（缩水题面 6×6）：绿色 = 最优链上的三格，金色 = 答案
      dp[3][5] = 48，虚线灰 ∞ = 该时刻到不了；终点列垫一条浅带。
右 = 两条路的现场对照：橙色卡 = 只图便宜（费 11、耗时 6，超时），
      绿色卡 = 守时间窗（费 48、耗时 3，来得及）。
下面两张卡片：dp 定义与转移 / 同族与分工。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（∞、箭头等符号也交给中文字体）；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
ORANGE_FILL = (246, 230, 224)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
DIM = (154, 163, 156)
PAST = (238, 240, 236)
WHITE = (255, 255, 255)
DASH = (216, 221, 214)
BAND = (245, 240, 228)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 31)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 18)
code_tiny = font("consola.ttf", 11)
sym_mid = font("msyh.ttc", 20)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    checks.append((int(cy), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def cell(x, y, cw, ch, value, kind, tfont):
    fills = {
        "inf": (PAST, DASH, DIM, 2),
        "val": (WHITE, BORDER, INK, 2),
        "chain": (GREEN_FILL, GREEN, GREEN, 3),
        "base": (GREEN_FILL, GOLD, GREEN, 3),
        "answer": (GOLD_FILL, GOLD, GOLD, 3),
    }
    fill, stroke, tcol, width = fills[kind]
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=6,
                        fill=fill, outline=stroke, width=width)
    d.text((int(x + cw / 2), int(y + ch / 2)), "∞" if value is None else str(value),
           font=tfont, fill=tcol, anchor="mm")


def seq_row(x, y, cities, color, fill, h=32, w=32, gap=26):
    """0 → 3 → 4 → 5 的小方块；箭头用中文字体（Consolas 无 →）。"""
    cx = x
    for i, c in enumerate(cities):
        d.rounded_rectangle((int(cx), int(y - h / 2), int(cx + w), int(y + h / 2)),
                            radius=6, fill=fill, outline=color, width=2)
        d.text((int(cx + w / 2), int(y)), str(c), font=code_mid, fill=color, anchor="mm")
        cx += w
        if i < len(cities) - 1:
            d.text((int(cx + gap / 2), int(y)), "→", font=sym_mid, fill=color, anchor="mm")
            cx += gap
    return cx - x


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 46), "规定时间内到达终点的最小花费：时刻必须进状态",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 86, [("dp[t][v] = 恰好在时刻 t 到达城市 v 的最小通行费；dp[0][0] = fees[0]、"
                   "其余 ∞，答案 = min over t ≤ maxTime", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(275, 128, [("分层图填表  t: 0 → 5", card_title, GREEN), ("　时刻当层", tiny_font, MUTED)])
mixed(825, 128, [("两条路对照  maxTime = 5", card_title, ORANGE), ("　便宜 ≠ 来得及", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 150, 550, 322), fill=BORDER, width=2)

LCX, RCX = 275, 825

# ── 左面板：分层图 dp 表 ─────────────────────────────────────────────────────
CW, GAP = 46, 6
COLS = 6
grid_w = COLS * CW + (COLS - 1) * GAP
gx0 = LCX - grid_w / 2
CH, RGAP = 25, 5
GRID_Y = 162
ROWS = 6
grid_bottom = GRID_Y + ROWS * CH + (ROWS - 1) * RGAP

GRID = [
    [5, None, None, None, None, None],
    [None, None, None, 25, None, None],
    [30, 6, None, None, 45, None],
    [None, None, None, 50, None, 48],
    [11, 31, 8, None, 68, None],
    [None, None, 50, 31, None, 71],
]
CHAIN = {(0, 0), (1, 3), (2, 4)}
ANSWER = (3, 5)

# 终点列浅带
d.rounded_rectangle((int(gx0 + 5 * (CW + GAP) - 4), int(GRID_Y - 6),
                     int(gx0 + 5 * (CW + GAP) + CW + 4), int(grid_bottom + 6)),
                    radius=9, fill=BAND)

# 列头
d.text((int(gx0 - 10), 150), "t \\ v", font=row_label, fill=DIM, anchor="rm")
for v in range(COLS):
    cx = gx0 + v * (CW + GAP) + CW / 2
    col = GOLD if v == 5 else MUTED
    d.text((int(cx), 150), str(v), font=row_label, fill=col, anchor="mm")

for t in range(ROWS):
    y = GRID_Y + t * (CH + RGAP)
    d.text((int(gx0 - 10), int(y + CH / 2)), f"t = {t}", font=row_label, fill=MUTED, anchor="rm")
    for v in range(COLS):
        value = GRID[t][v]
        if (t, v) == ANSWER:
            kind = "answer"
        elif (t, v) == (0, 0):
            kind = "base"
        elif (t, v) in CHAIN:
            kind = "chain"
        elif value is None:
            kind = "inf"
        else:
            kind = "val"
        cell(gx0 + v * (CW + GAP), y, CW, CH, value, kind,
             sym_mid if value is None else code_small)

mixed(gx0, 354, [("答案 = min over t ≤ 5 of ", tiny_font, MUTED),
                 ("dp[t][5]", code_mid, GOLD), (" = 48", tiny_font, MUTED)], anchor="lm")
mixed(gx0, 378, [("最优链 0 → 3 → 4 → 5（贵但快）：费 48 · 耗时 3", tiny_font, GREEN)],
      anchor="lm")

# ── 右面板：两条路对照 ───────────────────────────────────────────────────────
CARDW = 468
card_x = RCX - CARDW / 2
CARD_A_Y = 166
CARD_B_Y = 240
CARD_HH = 64


def right_text(x_right, y, text, f, color):
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def path_card(x, y, h, accent, fill, title, cities, meta, verdict, vcol):
    d.rounded_rectangle((int(x), int(y), int(x + CARDW), int(y + h)), radius=10,
                        fill=WHITE, outline=accent, width=2)
    mixed(x + 16, y + 18, [(title, row_label, accent)], anchor="lm")
    right_text(x + CARDW - 16, y + 18, meta, tiny_font, MUTED)
    seq_row(x + 16, y + 44, cities, accent, fill)
    right_text(x + CARDW - 16, y + 44, verdict, row_label, vcol)


path_card(card_x, CARD_A_Y, CARD_HH, ORANGE, ORANGE_FILL, "只图便宜 · 不看时间",
          [0, 1, 2, 5], "费 11 · 6分", "超时 6 > 5", ORANGE)
path_card(card_x, CARD_B_Y, CARD_HH, GREEN, GREEN_FILL, "守时间窗 · 最优",
          [0, 3, 4, 5], "费 48 · 3分", "来得及 3 ≤ 5", GREEN)

mixed(card_x + 4, 322, [("官方示例 maxTime ", tiny_font, MUTED), ("30 → 11", code_small, GOLD),
                        ("，", tiny_font, MUTED), ("29 → 48", code_small, ORANGE)], anchor="lm")
mixed(card_x + 4, 346, [("差 1 分钟，答案就从便宜路跳到贵路", tiny_font, INK)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), int(CARD_Y), int(x + CARD_W), int(CARD_Y + CARD_H)), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "dp 定义与转移", [
    [("定义：", tiny_font, INK), ("dp[t][v]", code_small, GREEN),
     (" = 恰在时刻 t 到达 v 的最少费", tiny_font, MUTED)],
    [("底座：", tiny_font, INK), ("dp[0][0] = fees[0]", code_small, GOLD),
     ("（起点也要付）", tiny_font, MUTED)],
    [("转移：", tiny_font, INK), ("dp[t+et][u]", code_small, GREEN),
     (" = min( 旧值, dp[t][v] + fees[u] )", tiny_font, MUTED)],
    [("剪枝：", tiny_font, INK), ("arr > maxTime", code_small, ORANGE),
     (" 的边直接丢掉", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "同族与分工", [
    [("787：", tiny_font, INK), ("maxTime", code_small, ORANGE),
     (" → 中转数 K（逐字同构）", tiny_font, MUTED)],
    [("743：", tiny_font, INK), ("去掉时间窗", tiny_font, ORANGE), ("，只剩最短路", tiny_font, MUTED)],
    [("1631 / 1514：", tiny_font, INK), ("求和", tiny_font, ORANGE), (" → ", tiny_font, ORANGE),
     ("max", code_small, ORANGE), (" / ", tiny_font, ORANGE), ("乘积", tiny_font, ORANGE)],
    [("1976：", tiny_font, INK), ("min", code_small, ORANGE), (" → ", tiny_font, ORANGE),
     ("+", code_small, ORANGE), ("（问方案数）", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "同族：LC 787 K 站中转内最便宜的航班 · LC 743 网络延迟时间 · "
       "LC 1631 最小体力消耗路径 · LC 1514 概率最大的路径 · LC 1976 到达目的地的方案数",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength("规定时间内到达终点的最小花费：时刻必须进状态", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert grid_w < 500, f"dp 表过宽 {grid_w}"
assert 150 + 10 < GRID_Y, "列头压住表格"
assert grid_bottom < 354 - 16, "表格压住结论行"
assert 378 + 10 < CARD_Y - 14, "结论行压住卡片徽标"
assert CARD_B_Y + CARD_HH < 322 - 8, "对照卡压住示例行"
assert 346 + 10 < CARD_Y - 14, "示例行压住卡片徽标"
assert CARD_A_Y > 128 + 26, "卡片压住面板标题"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
assert CARD_Y + CARD_H < H - 16 - 12, "底部卡片压住 family 行"
for cy, x0, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    else:
        assert x0 + wsum < W - 20, f"横排越界 y={cy}: x={x0} w={wsum}"
print("SELF-CHECK OK:", f"grid={int(grid_w)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-1928-cover.png", "photos/lc-1928-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
