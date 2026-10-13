# -*- coding: utf-8 -*-
"""
make_nim_cover.py — 【Nim 博弈 / 石子游戏】的封面。

构图：左侧石子堆 + 异或链（3 -> 7 -> 2），右侧制胜一手卡；底部两张卡片。
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
BAD = (179, 69, 46)
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


def cell(x, y, cw, ch, fill, stroke, t, tcol, tsize=20, width=2, sub=None):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=8,
                        fill=fill, outline=stroke, width=width)
    if t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=font("consola.ttf", tsize),
               fill=tcol, anchor="mm")
    if sub:
        d.text((int(x + cw / 2), y + ch - 14), sub, font=font("consola.ttf", 11),
               fill=(154, 163, 156), anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "石子游戏：一行异或判定先手必胜", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("piles[0] ^ ... ^ piles[n-1] != 0", code_small, MUTED),
    ("  先手必胜 —— Bouton 定理", tiny_font, MUTED),
])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("Nim 博弈", card_title, GREEN),
                   ("  同族：LC 292 巴什博弈 · LC 877 两端取 · 威佐夫博弈", tiny_font, MUTED)])

# ── 左侧：三堆 + 异或链 ─────────────────────────────────────────────────────
PILES = [("3", "0011"), ("4", "0100"), ("5", "0101")]
CW, CH, GAP = 118, 66, 16
LEFT = 70
for i, (v, b) in enumerate(PILES):
    x = LEFT + i * (CW + GAP)
    cell(x, 178, CW, CH, WHITE, BORDER, v, INK, tsize=24, sub=b)
d.text((LEFT - 16, 211), "各堆", font=mini_font, fill=MUTED, anchor="rm")

# 异或链
chain = [("3", GREEN), ("7", GREEN), ("2", ORANGE)]
for i, (v, col) in enumerate(chain):
    x = LEFT + i * (CW + GAP)
    cell(x, 274, CW, 40, WHITE, col, v, col, tsize=18, width=2 if i < 2 else 3)
    if i < 2:
        mixed(x + CW + GAP / 2, 294, [("^", code_small, MUTED)])
d.text((LEFT - 16, 294), "累计异或", font=mini_font, fill=MUTED, anchor="rm")

mixed(LEFT + (3 * CW + 2 * GAP) / 2, 348, [
    ("异或非 0 -> 存在一步走到异或为 0；异或为 0 -> 任何一步都走到非 0", tiny_font, MUTED),
])

# ── 右侧：制胜一手 ───────────────────────────────────────────────────────────
RX = 660
d.text((RX + 180, 172), "制胜一手：x = 2，最高置位 bit 1", font=mini_font, fill=INK, anchor="mm")

d.rounded_rectangle((RX, 196, RX + 360, 300), radius=10, fill=GOLD_FILL, outline=GOLD, width=2)
mixed(RX + 180, 222, [
    ("第 1 堆", tiny_font, INK), (" 3 ", code_mid, INK),
    ("改成", tiny_font, INK), (" 3 ^ 2 = 1", code_mid, GOLD),
])
mixed(RX + 180, 252, [
    ("取走 2 个，新局面", tiny_font, INK),
    (" (1, 4, 5)", code_small, GREEN),
])
mixed(RX + 180, 278, [
    ("异或 = 0 —— 必败态交到后手手里", tiny_font, ORANGE),
])

d.text((RX + 180, 330), "新值严格更小且非负：", font=mini_font, fill=MUTED, anchor="mm")
mixed(RX + 180, 356, [
    ("p 与 x 在最高位上都是 1，异或后该位被清掉", tiny_font, MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 152
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


bottom_card(LEFT_X, GREEN, "异或非 0：制胜一手", [
    [("取 ", tiny_font, INK), ("x", code_small, GOLD), (" 的最高置位 ", tiny_font, INK), ("h", code_small, GOLD)],
    [("找一堆 ", tiny_font, INK), ("p", code_small, INK), (" 在 bit ", tiny_font, INK), ("h", code_small, INK), (" 上为 1", tiny_font, INK)],
    [("改成 ", tiny_font, INK), ("p ^ x", code_small, ORANGE), ("（严格更小、非负）", tiny_font, INK)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "异或为 0：必败态", [
    [("动一堆 ", tiny_font, INK), ("p -> p'", code_small, INK), (" 后异或仍为 0", tiny_font, INK)],
    [("则 ", tiny_font, INK), ("p ^ p' = 0", code_small, INK), ("，即 ", tiny_font, INK), ("p = p'", code_small, INK), (" —— 等于没动", tiny_font, INK)],
    [("后手镜像应战，先手怎么走都赢不了", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 292（巴什博弈 n%(m+1)） · LC 877（两端取，偶数堆必胜） · 威佐夫博弈 · 反常 Nim",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/nim-stone-games-cover.png", "photos/nim-stone-games-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
