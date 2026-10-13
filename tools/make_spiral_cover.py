# -*- coding: utf-8 -*-
"""
make_spiral_cover.py — 【螺旋填数】的封面。

构图：中央 3x3 九宫格（右下上左 已填 / 下右上左 待填对照），
右侧四边界收缩示意；底部两张卡片（口径对齐 / 守卫）。
红线：中英混排逐段绘制；坐标 int()；底部小注不超 900px。
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 16)
code_mid = font("consola.ttf", 22)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((int(x), cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def grid_at(x0, y0, cell, gap, vals, filled, colors=None):
    for r in range(3):
        for c in range(3):
            x = x0 + c * (cell + gap)
            y = y0 + r * (cell + gap)
            col = colors(r, c) if colors else (BORDER, WHITE, MUTED)
            stroke, fillc, tcol = col
            d.rounded_rectangle((int(x), int(y), int(x + cell), int(y + cell)),
                                radius=7, fill=fillc, outline=stroke, width=2)
            v = vals[r][c]
            if v and (r, c) in filled:
                d.text((int(x + cell / 2), int(y + cell / 2)), str(v),
                       font=font("consola.ttf", 20), fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "螺旋填数：先对齐口径，再谈 O(MxN)", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("右、下、左、上", code_small, MUTED),
    (" 循环，撞到未填区域的边缘就变向", tiny_font, MUTED),
])

mixed(W / 2, 138, [("矩阵", card_title, GREEN),
                   ("  同族：LC 54 螺旋矩阵 · LC 59 螺旋矩阵 II · LC 885", tiny_font, MUTED)])

# ── 左侧：3x3 右下上左（已填满）─────────────────────────────────────────────
RD = [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
DR = [[1, 8, 7], [2, 9, 6], [3, 4, 5]]
CELL, GAP = 74, 10
LEFT = 96
grid_at(LEFT, 186, CELL, GAP, RD, {(r, c) for r in range(3) for c in range(3)},
        colors=lambda r, c: (GOLD, GOLD_FILL, GOLD) if RD[r][c] == 1 else (BORDER, WHITE, INK))
d.text((LEFT - 18, 223), "右、下、左、上", font=mini_font, fill=MUTED, anchor="rm")

# ── 右侧：3x3 下右上左（未填的对照）─────────────────────────────────────────
RX = LEFT + 3 * CELL + 2 * GAP + 96
grid_at(RX, 186, CELL, GAP, DR, {(r, c) for r in range(3) for c in range(3)},
        colors=lambda r, c: (GREEN, GREEN_FILL, GREEN) if DR[r][c] == 1 else (BORDER, WHITE, INK))
d.text((RX + 3 * CELL + 2 * GAP + 18, 223), "下、右、上、左", font=mini_font, fill=MUTED, anchor="lm")

# 中间箭头 + 说明
mixed(LEFT + (3 * CELL + 2 * GAP) + (RX - LEFT - 3 * CELL - 2 * GAP) / 2, 260,
      [("互为转置", mini_font, GOLD)])
mixed(LEFT + (3 * CELL + 2 * GAP) + (RX - LEFT - 3 * CELL - 2 * GAP) / 2, 286,
      [("仅方阵成立", tiny_font, MUTED)])

# ── 右下：四边界收缩示意 ─────────────────────────────────────────────────────
SX = RX + 3 * CELL + 2 * GAP + 90
SY = 186
d.rounded_rectangle((SX, SY, SX + 250, SY + 242), radius=10, fill=WHITE, outline=BORDER, width=2)
d.text((SX + 125, SY + 22), "四边界收缩（本圈）", font=mini_font, fill=INK, anchor="mm")
# 内部小网格示意
GX, GY = SX + 30, SY + 44
CS, CG = 34, 6
for r in range(4):
    for c in range(4):
        x = GX + c * (CS + CG)
        y = GY + r * (CS + CG)
        d.rounded_rectangle((int(x), int(y), int(x + CS), int(y + CS)), radius=4,
                            fill=WHITE, outline=BORDER, width=1)
# 已填区域（前两行 + 右列）淡金
for c in range(4):
    d.rounded_rectangle((int(GX + c * (CS + CG)), int(GY), int(GX + c * (CS + CG) + CS), int(GY + CS)),
                        radius=4, fill=GOLD_FILL, outline=GOLD, width=2)
for r in range(1, 4):
    d.rounded_rectangle((int(GX + 3 * (CS + CG)), int(GY + r * (CS + CG)),
                         int(GX + 3 * (CS + CG) + CS), int(GY + r * (CS + CG) + CS)),
                        radius=4, fill=GOLD_FILL, outline=GOLD, width=2)
# 剩余边界虚线框（自拼）
x1, y1 = GX + (CS + CG) - 3, GY + (CS + CG) - 3
x2, y2 = GX + 3 * (CS + CG) + CS + 3, GY + 3 * (CS + CG) + CS + 3
for xx in range(int(x1), int(x2), 9):
    d.line((xx, int(y1), min(xx + 5, int(x2)), int(y1)), fill=GREEN, width=2)
    d.line((xx, int(y2), min(xx + 5, int(x2)), int(y2)), fill=GREEN, width=2)
for yy in range(int(y1), int(y2), 9):
    d.line((int(x1), yy, int(x1), min(yy + 5, int(y2))), fill=GREEN, width=2)
    d.line((int(x2), yy, int(x2), min(yy + 5, int(y2))), fill=GREEN, width=2)

mixed(SX + 125, SY + 224, [
    ("上 ", tiny_font, MUTED), ("0", code_small, INK), ("  下 ", tiny_font, MUTED),
    ("3", code_small, INK), ("  左 ", tiny_font, MUTED), ("1", code_small, INK),
    ("  右 ", tiny_font, MUTED), ("3", code_small, INK),
])

# ── 底部两行说明 ─────────────────────────────────────────────────────────────
mixed(W / 2, 452, [
    ("漏掉第三、第四条边的守卫，只在剩余区域退化成", tiny_font, MUTED),
    ("单行 / 单列", tiny_font, ORANGE),
    (" 时才炸：", tiny_font, MUTED),
    ("1x3", code_small, ORANGE), (" 会输出 ", tiny_font, MUTED), ("[[5,4,3]]", code_small, ORANGE),
])
mixed(W / 2, 478, [
    ("时间 ", tiny_font, MUTED), ("O(MxN)", code_small, GREEN),
    (" 已是最优（输出本身有 MxN 个数，下界贴平）；额外空间 ", tiny_font, MUTED),
    ("O(1)", code_small, GREEN),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 512
CARD_H = 84
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 26
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 26


bottom_card(LEFT_X, GREEN, "口径：右下上左", [
    [("几何上是顺时针，面经常叫逆时针；", tiny_font, INK)],
    [("LC 54 / 59 用的就是这一套", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "真逆时针：下右上左", [
    [("方阵下恰好是前者的转置；", tiny_font, INK)],
    [("非方阵不成立（2x3 就不同）", mini_font, MUTED)],
])

d.text((W / 2, H - 14), "先声明方向顺序再写码 —— 口径比代码更难补救",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/spiral-matrix-fill-cover.png", "photos/spiral-matrix-fill-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
