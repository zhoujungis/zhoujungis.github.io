# -*- coding: utf-8 -*-
"""
make_lc93_cover.py — 【LC 93】复原 IP 地址 的封面。

构图：中央一行字符格子 "25525511135"，已切段之间橙色实竖线分隔，
答案区两行；下面两张卡片：剪枝分两层 / 三个易错点。

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
code_mid = font("consola.ttf", 20)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol, dashed=False):
    if dashed:
        for i in range(5):
            xx = x + i * 5
            if xx > x + cw - 2:
                break
            d.line((xx, y, xx, y + 3), fill=stroke, width=2)
            d.line((xx, y + ch - 3, xx, y + ch), fill=stroke, width=2)
        for i in range(4):
            yy = y + 6 + i * ((ch - 14) // 3)
            d.line((x, yy, x + 3, yy), fill=stroke, width=2)
            d.line((x + cw - 3, yy, x + cw, yy), fill=stroke, width=2)
    else:
        d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "复原 IP 地址：分段回溯，剪枝分两层", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("段合法性（前导零 / >255）与可行性（剩余位数装不装得进剩余段）是两个独立问题", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 93", card_title, GREEN),
                   ('  "25525511135" → ["255.255.11.135", "255.255.111.35"]', tiny_font, MUTED)])

# ── 中央字符行 + 分隔 ────────────────────────────────────────────────────────
S = "25525511135"
CW, CH, GAP = 46, 48, 9
COLS = len(S)
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = (W - ROW_W) / 2
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]

for i, t in enumerate(S):
    cell(colX[i], 186, CW, CH, WHITE, BORDER, t, INK)

# 段分隔（第 4 段答案 255|255|111|35 → 切点在 3, 6, 9 之后）
CUTS = [3, 6, 9]
for c in CUTS:
    gx = colX[c] + CW + GAP / 2
    d.line((gx, 174, gx, 246), fill=ORANGE, width=3)

# 段标签
SEGS = [("255", 0, 3), ("255", 3, 6), ("111", 6, 9), ("35", 9, 11)]
for name, a, b in SEGS:
    cxA = colX[a]
    cxB = colX[b - 1] + CW
    d.text(((cxA + cxB) / 2, 258), name, font=code_small, fill=GREEN, anchor="mm")

# 答案区
mixed(W / 2, 296, [('answers: "255.255.11.135" · "255.255.111.35"', code_small, GOLD)])

mixed(W / 2, 336, [('第一刀 try "2"：段完全合法，但剩余 10 位装不进 3 段（最多 9 位）—— 可行性剪枝整枝砍掉', tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 374
CARD_H = 148
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


bottom_card(LEFT_X, GREEN, "剪枝分两层", [
    [("层一 段合法性：", tiny_font, INK), ('"01"', code_small, ORANGE), (" 前导零 · ", tiny_font, INK), ('"511"', code_small, ORANGE), (" > 255", tiny_font, INK)],
    [("层二 可行性：剩余位数落在 ", tiny_font, INK), ("[segs, segs × 3]", code_small, ORANGE)],
    [("搜索空间 C(11, 3) = 165 —— 天生常数级", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "三个易错点", [
    [('"0"', code_small, GREEN), (" 合法、", tiny_font, INK), ('"01"', code_small, ORANGE), (" 非法 —— 别一刀切", tiny_font, INK)],
    [("第 4 段必须恰好用完全部数字", tiny_font, INK)],
    [("长度不在 [4, 12] 直接无解，不进搜索", tiny_font, INK)],
])

d.text((W / 2, H - 16), "同族：LC 131 分割回文串（段合法性换成「是回文」） · LC 22 括号生成（可行性剪枝经典） · 回溯模板四件套",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-93-cover.png", "photos/lc-93-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
