# -*- coding: utf-8 -*-
"""
make_lc5_cover.py — 【LC 5】最长回文子串 的封面。

构图：中央一行字符格子 "b a b a d"，字符中心 [0,2] 橙框 + 淡金区间 +
金下划线标注 best "bab"；旁边一个间隙中心虚线小示意。下面两张卡片：
2n-1 个中心 / 三个边界。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()。
"""

from PIL import Image, ImageDraw, ImageFont

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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_big = font("consola.ttf", 24)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((x, cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def cell(x, y, cw, ch, fill, stroke, t, tcol):
    d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_big, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "最长回文子串：枚举中心，不是枚举子串", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("回文由「中心 + 半径」决定 —— 中心只有 2n-1 个，每个向两边扩展", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 5", card_title, GREEN),
                   ('  "babad" → "bab"（"aba" 也对）· O(n^2) 时间 O(1) 空间', tiny_font, MUTED)])

# ── 中央字符行 ───────────────────────────────────────────────────────────────
CW, CH, GAP = 62, 54, 10
CHARS = "babad"
COLS = len(CHARS)
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = (W - ROW_W) / 2
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]
colC = [x + CW / 2 for x in colX]

# 列号
for i in range(COLS):
    d.text((colC[i], 180), str(i), font=font("consola.ttf", 12), fill=DIM, anchor="mm")

# v1 行：区间 [0,2] 淡金 + 中心 s[1] 橙框
for i, t in enumerate(CHARS):
    if i in (0, 2):
        cell(colX[i], 196, CW, CH, GOLD_FILL, GOLD, t, INK)
    elif i == 1:
        cell(colX[i], 196, CW, CH, GOLD_FILL, ORANGE, t, ORANGE)
    else:
        cell(colX[i], 196, CW, CH, WHITE, BORDER, t, INK)

# 间隙中心虚线示意（s[3]|s[4] 之间，长度 0 的空扫）
gx = colX[3] + CW + GAP / 2
for k in range(4):
    yy = 190 + k * 14
    d.line((gx, yy, gx, yy + 7), fill=DIM, width=2)
mixed(gx, 306, [("间隙中心：s[3] ≠ s[4]，长度 0", mini_font, DIM)])

# 金下划线 + best 标注
d.line((colX[0], 268, colX[2] + CW, 268), fill=GOLD, width=4)
mixed((colX[0] + colX[2] + CW) / 2, 292, [('best: "bab" (len 3)', code_small, GOLD)])

mixed(W / 2, 330, [("字符中心管奇数回文（\"bab\"）· 间隙中心管偶数回文（\"abba\"、\"cbbd\" 的 \"bb\"）—— 漏了间隙就漏了一半", tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 368
CARD_H = 152
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 34
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 30


bottom_card(LEFT_X, GREEN, "为什么是 2n-1 个中心", [
    [("字符中心 ", tiny_font, INK), ("expand(i, i)", code_small, GREEN), (" — n 个", tiny_font, INK)],
    [("间隙中心 ", tiny_font, INK), ("expand(i, i+1)", code_small, GREEN), (" — n-1 个", tiny_font, INK)],
    [("总时间 O(n^2) · 空间 O(1)，DP 要 O(n^2) 空间", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "三个边界", [
    [('"cbbd"', code_small, ORANGE), (" → ", tiny_font, INK), ('"bb"', code_small, GREEN), ("  偶数靠间隙", tiny_font, INK)],
    [('"ac"', code_small, ORANGE), (" → ", tiny_font, INK), ('"a"', code_small, GREEN), ("  无回文退单字符", tiny_font, INK)],
    [("同长度先到先得：", tiny_font, INK), ('"bab"', code_small, GREEN), (" 先于 ", tiny_font, INK), ('"aba"', code_small, ORANGE)],
])

d.text((W / 2, H - 16), "同族：LC 647 回文子串数目（同款 2n-1 中心计数） · LC 516 最长回文子序列（不连续 → 区间 DP） · Manacher O(n) 口头提即可",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-5-cover.png", "photos/lc-5-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
