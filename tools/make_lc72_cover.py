# -*- coding: utf-8 -*-
"""
make_lc72_cover.py — 【LC 72】编辑距离 的封面。

构图：左侧 horse->ros 完整 dp 表（最后一格金色，三个邻居分色），
右侧「三个邻居 = 三种操作」放大图；底部两张卡片（O(mn) 转移 / O(n) 滚动数组）。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm" 画内容；坐标/宽度 int()；
底部小注不超 900px。
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
DIM = (154, 163, 156)
DIM_FILL = (246, 245, 241)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 16)
code_mid = font("consola.ttf", 20)
code_tiny = font("consola.ttf", 11)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol, tsize=20, width=2):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=7,
                        fill=fill, outline=stroke, width=width)
    if t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=font("consola.ttf", tsize),
               fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "编辑距离：前缀对前缀", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("dp[i][j]", code_small, MUTED), (" = ", code_small, MUTED),
    ("a 的前 i 个字符 变成 b 的前 j 个字符", tiny_font, MUTED),
    (" 的最少操作数", tiny_font, MUTED),
])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 128, [("LC 72", card_title, GREEN),
                   ("  horse → ros，答案 3（右下角那一格）", tiny_font, MUTED)])

# ── 左侧：完整 dp 表 ─────────────────────────────────────────────────────────
ROWS = ["", "h", "o", "r", "s", "e"]
COLS = ["", "r", "o", "s"]
DP = [
    [0, 1, 2, 3],
    [1, 1, 2, 3],
    [2, 2, 1, 2],
    [3, 2, 2, 2],
    [4, 3, 3, 2],
    [5, 4, 4, 3],
]
CW, CH = 78, 30
GX, GY = 6, 4
HDR_W = 44
T_LEFT = 96
T_TOP = 178
colX = [T_LEFT + HDR_W + c * (CW + GX) for c in range(4)]
rowY = [T_TOP + r * (CH + GY) for r in range(6)]

# 列头 / 行头
for c, name in enumerate(COLS):
    d.text((int(colX[c] + CW / 2), T_TOP - 18), name if name else '""',
           font=mini_font, fill=MUTED, anchor="mm")
for r, name in enumerate(ROWS):
    d.text((int(T_LEFT + HDR_W - 10), int(rowY[r] + CH / 2)), name if name else '""',
           font=mini_font, fill=MUTED, anchor="rm")

# 三个邻居的位置：(4,2) 对角金 / (4,3) 上方绿 / (5,2) 左方橙；最后一格金色
NB = {(4, 2): (GOLD, GOLD_FILL), (4, 3): (GREEN, WHITE), (5, 2): (ORANGE, WHITE)}
for r in range(6):
    for c in range(4):
        x, y = colX[c], rowY[r]
        if (r, c) == (5, 3):
            cell(x, y, CW, CH, GOLD_FILL, GOLD, str(DP[r][c]), GOLD, tsize=19, width=3)
        elif (r, c) in NB:
            stroke, fill = NB[(r, c)]
            cell(x, y, CW, CH, fill, stroke, str(DP[r][c]), INK, tsize=19, width=2)
        elif r == 0 or c == 0:
            cell(x, y, CW, CH, DIM_FILL, BORDER, str(DP[r][c]), DIM, tsize=17, width=1)
        else:
            cell(x, y, CW, CH, WHITE, BORDER, str(DP[r][c]), INK, tsize=19)

mixed(int(T_LEFT + HDR_W + (4 * CW + 3 * GX) / 2), rowY[5] + CH + 15, [
    ("第一行 / 第一列", tiny_font, ORANGE),
    (" 是语义规定的边界，不是凑数；答案在右下角", tiny_font, MUTED),
])

# ── 右侧：三个邻居 = 三种操作 ────────────────────────────────────────────────
PX = 560
d.text((PX + 124, 152), "最后一格 dp[5][3]：三个邻居，三种收尾",
       font=mini_font, fill=INK, anchor="mm")

NBW, NBH = 112, 48
nb = [
    (0, 0, "3", GOLD, GOLD_FILL, "对角 · 替换"),
    (1, 0, "2", GREEN, WHITE, "上方 · 删除"),
    (0, 1, "4", ORANGE, WHITE, "左方 · 插入"),
    (1, 1, "3", ORANGE, GOLD_FILL, "本格 dp[5][3]"),
]
for gx, gy, val, stroke, fill, label in nb:
    x = PX + gx * (NBW + 14)
    y = 176 + gy * (NBH + 14 + 16)
    cell(x, y, NBW, NBH, fill, stroke, val, INK, tsize=22,
         width=4 if (gx, gy) == (1, 0) else 2)
    d.text((int(x + NBW / 2), y + NBH + 11), label, font=mini_font,
           fill=stroke, anchor="mm")

mixed(PX + 118, 330, [
    ("对角 3+1 / 上方 2+1 / 左方 4+1", tiny_font, MUTED),
])
mixed(PX + 118, 356, [
    ("最小是", tiny_font, MUTED), ("上方 2+1 = 3（删除）", tiny_font, ORANGE),
])
mixed(PX + 118, 382, [
    ("打平时标注互换不影响数值，只影响操作序列", tiny_font, MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 428
CARD_H = 136
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 36
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 32


bottom_card(LEFT_X, GREEN, "O(m·n)：三种操作 = 三个邻居", [
    [("替换 = 对角 ", tiny_font, INK), ("dp[i-1][j-1]", code_small, GOLD),
     ("；相同则免费", tiny_font, INK)],
    [("删除 = 上方 ", tiny_font, INK), ("dp[i-1][j]", code_small, GREEN),
     ("；插入 = 左方 ", tiny_font, INK), ("dp[i][j-1]", code_small, ORANGE)],
    [("答案在右下角 dp[m][n]", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "O(n)：只有对角会丢", [
    [("上方 = ", tiny_font, INK), ("buf[j]", code_small, GREEN),
     ("（写之前还在）", tiny_font, INK)],
    [("左方 = ", tiny_font, INK), ("buf[j-1]", code_small, ORANGE),
     ("（刚写完）", tiny_font, INK)],
    [("对角已被覆盖 → 提前存进 ", mini_font, MUTED), ("prev", code_small, GOLD)],
])

d.text((W / 2, H - 16), "同族：LC 583（只许删除 = m+n-2*LCS） · LC 1143（最长公共子序列） · 要操作序列得存整张表",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-72-cover.png", "photos/lc-72-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
