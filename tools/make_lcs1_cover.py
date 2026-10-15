# -*- coding: utf-8 -*-
"""
make_lcs1_cover.py — 【允许一个错的最长公共连续子串】的封面。

构图：中部双状态转移的核心一行（f 左上 / g 左上 → 不等时 g 只从 f 接），
配两张串条与 DP 表片段；底部两张卡片（额度不变量 / 五个坑）。
红线：中英混排逐段绘制（consola 无中文字形，中文一律 msyh）；坐标 int()；
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
ORANGE_FILL = (248, 236, 230)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
RED = (179, 69, 47)
RED_FILL = (249, 236, 232)
DIM = (154, 163, 156)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


def auto(text, size, bold=False):
    """含中文用 msyh，纯 ASCII 用 consola（consola 没有中文字形）。"""
    name = "msyhbd.ttc" if bold else "msyh.ttc"
    if all(ord(c) < 0x2E80 for c in text):
        name = "consolab.ttf" if bold else "consola.ttf"
    return font(name, size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
eq_font = font("consolab.ttf", 19)
eq_cn = font("msyhbd.ttc", 19)

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


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "允许一个错的最长公共连续子串", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("两个状态分家", auto("两个状态分家", 16, True), MUTED),
    ("  错误额度只能从干净的 f 接", auto("  错误额度只能从干净的 f 接", 15), MUTED),
])
mixed(W / 2, 138, [("同族", card_title, GREEN),
                   ("  连续=子串不是子序列 · 转移只走对角线 · 空间可滚到 O(min(n,m))", tiny_font, MUTED)])

# ── 中部：两串 + DP 表（值由真 DP 计算，不手填） ───────────────────────────
S = "abcdef"
T = "abcdxf"
N, M = len(S), len(T)


def dp_tables(s, t):
    """与文章同源的双状态 DP，封面上的每个数字都由它算出来。"""
    n, m = len(s), len(t)
    f = [[0] * (m + 1) for _ in range(n + 1)]
    g = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                f[i][j] = f[i - 1][j - 1] + 1
                g[i][j] = g[i - 1][j - 1] + 1
            else:
                f[i][j] = 0
                g[i][j] = max(f[i - 1][j - 1] + 1, 1)
    return f, g


F, G = dp_tables(S, T)
BEST = max(max(r) for r in G)

CELL = 76
CGAP = 8
CH = 40
TX = 48
TY = 172
GRID_Y = 272
GRID_H = 32
gridW = M * CELL + (M - 1) * CGAP

# 两串字符条
for row, (str_, label, col) in enumerate([(S, "s", ORANGE), (T, "t", GREEN)]):
    y = TY + row * (CH + 6)
    d.text((TX - 12, y + CH / 2), label, font=auto(label, 15, True), fill=col, anchor="rm")
    for i, ch in enumerate(str_):
        x = TX + i * (CELL + CGAP)
        mismatch = S[i] != T[i]
        accent, fill = (RED, RED_FILL) if mismatch else (col, WHITE)
        d.rounded_rectangle((x, y, x + CELL, y + CH), radius=7, fill=fill, outline=accent, width=2)
        d.text((x + CELL / 2, y + CH / 2), ch, font=auto(ch, 20, True), fill=accent, anchor="mm")

# DP 表：全 6×6，g 为大字，f 为左上角小字
for i in range(1, N + 1):
    y = GRID_Y + (i - 1) * GRID_H
    d.text((TX - 12, y + (GRID_H - 4) / 2), f"s{i - 1}", font=auto(f"s{i - 1}", 11), fill=MUTED, anchor="rm")
    for j in range(1, M + 1):
        x = TX + (j - 1) * (CELL + CGAP)
        is_key = (i == 5 and j == 5)
        is_best = (i == 6 and j == 6)
        if is_best:
            accent, fill = GREEN, GREEN_FILL
        elif is_key:
            accent, fill = GOLD, GOLD_FILL
        elif S[i - 1] == T[j - 1]:
            accent, fill = GREEN, WHITE
        else:
            accent, fill = DIM, WHITE
        d.rounded_rectangle((x, y, x + CELL, y + GRID_H - 4), radius=6, fill=fill, outline=accent, width=2)
        d.text((x + 8, y + 10), str(F[i][j]), font=auto(str(F[i][j]), 9), fill=MUTED, anchor="lm")
        d.text((x + CELL / 2 + 6, y + (GRID_H - 4) / 2), str(G[i][j]),
               font=auto(str(G[i][j]), 17, True), fill=accent, anchor="mm")

# ── 右侧说明列（居中排版：居中不可能越过左边框，天然免疫溢出） ───────────
RX = TX + gridW + 32
RW = W - 40 - RX
CX = RX + RW // 2
d.rounded_rectangle((RX, TY, RX + RW, 464), radius=12, fill=WHITE, outline=ORANGE, width=2)

mixed(CX, TY + 28, [("答案", eq_cn, ORANGE), (f" {BEST}", eq_font, ORANGE)])
mixed(CX, TY + 54, [("每行最大值 1 → 6 单调递增", mini_font, MUTED)])
mixed(CX, TY + 88, [("金色格 (5,5)", auto("金色格 (5,5)", 14, True), GOLD),
                    ("  e 对 x 不等", mini_font, MUTED)])
mixed(CX, TY + 110, [("f 断成 0，g = f 左上 4 + 1 = 5", auto("f 断成 0，g = f 左上 4 + 1 = 5", 13, True), INK)])
mixed(CX, TY + 144, [("绿色格 (6,6)", auto("绿色格 (6,6)", 14, True), GREEN),
                     ("  f 与 f 相等", mini_font, MUTED)])
mixed(CX, TY + 166, [("g = g 左上 5 + 1 = 6，不消耗额度", mini_font, INK)])
mixed(CX, TY + 200, [("不等时若误用 g 左上", mini_font, RED)])
mixed(CX, TY + 222, [("ab/ba 1 → 2", auto("ab/ba 1 -> 2", 14, True), RED)])
mixed(CX, TY + 256, [("穷举 14641 组：错法 61.8% 不同", mini_font, RED)])
mixed(CX, TY + 284, [("O(n x m) 时间 · 滚动 O(min(n,m))", mini_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 486
CARD_H = 92
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 30
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 26


bottom_card(LEFT_X, GREEN, "额度不变量", [
    [("g 只能从更干净的档接", auto("g 只能从更干净的档接", 15, True), INK)],
    [("1 处错误版从 f 接，k 处版从 g[e-1] 接", mini_font, MUTED)],
    [("滚动数组：左上角必须在覆盖前取出", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "五个坑都能过样例", [
    [("不等时误用 g 左上", auto("不等时误用 g 左上", 15, True), INK),
     ("  ·  忘了 max(...,1)", mini_font, MUTED)],
    [("滚动数组覆盖左上角", auto("滚动数组覆盖左上角", 15, True), INK),
     ("  ·  连续当子序列做", mini_font, MUTED)],
    [("「至多一处」当成「恰好一处」", auto("「至多一处」当成「恰好一处」", 15, True), INK)],
])

d.text((W / 2, 598), "同族：最长公共子序列（可跳格） · 最长公共子串 · k 处错误扩展 g[i][j][e] · DNA 序列比对 / 拼写纠错",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/lcs1-cover.png", "photos/lcs1-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
