# -*- coding: utf-8 -*-
"""
make_lc233_cover.py — 【1~n 中数字 1 的个数】的封面。

构图：中央 n=1304 四个数位各自的三件套与贡献（131/130/200/305 = 766）；
底部两张卡片（找规律不暴力 / 官方样例掩盖的三个 bug）。
红线：中英混排逐段绘制；坐标 int()；底部小注不超 900px。
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
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
digit_label = font("msyhbd.ttc", 16)
code_small = font("consola.ttf", 16)
code_mid = font("consola.ttf", 22)
code_big = font("consola.ttf", 30)
digit_num = font("consola.ttf", 26)

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
d.text((W / 2, 50), "1~n 中数字 1 的个数", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("逐位拆解每一位，只扫 ", tiny_font, MUTED),
    ("O(log n)", code_small, MUTED),
    (" 轮；n = 1304 时答案 766", tiny_font, MUTED),
])
mixed(W / 2, 138, [("同族", card_title, GREEN),
                   ("  LC 233 · 数位统计入门 · count_digit 可换任意数字 d", tiny_font, MUTED)])

# ── 中部上：n = 1304 四个数位 ────────────────────────────────────────────────
DIGITS = [
    ("1", "千位 x1000", "cur=1", GOLD, GOLD_FILL),
    ("3", "百位 x100", "cur=3", GREEN, GREEN_FILL),
    ("0", "十位 x10", "cur=0", DIM, DIM_FILL),
    ("4", "个位 x1", "cur=4", GREEN, GREEN_FILL),
]
CW, CH, GAP = 92, 64, 14
ROW_W = 4 * CW + 3 * GAP
LEFT = int((W - ROW_W) / 2)
TOP = 180
for i, (num, label, cur, col, fill) in enumerate(DIGITS):
    x = LEFT + i * (CW + GAP)
    d.text((int(x + CW / 2), TOP - 22), label, font=mini_font, fill=MUTED, anchor="mm")
    d.rounded_rectangle((int(x), TOP, int(x + CW), TOP + CH), radius=7,
                        fill=fill, outline=col, width=2)
    d.text((int(x + CW / 2), TOP + 20), num, font=digit_num, fill=col, anchor="mm")
    d.text((int(x + CW / 2), TOP + 46), cur, font=code_small, fill=col, anchor="mm")

# ── 中部下：每一位的贡献 ──────────────────────────────────────────────────────
CONTRIB = [
    ("千位", "305", "0*1000 + 304 + 1", GOLD),
    ("百位", "200", "(1+1)*100", GREEN),
    ("十位", "130", "13*10", DIM),
    ("个位", "131", "(130+1)*1", GREEN),
]
CCW, CCH, CGAP = 240, 92, 18
CROW_W = 4 * CCW + 3 * CGAP
CLEFT = int((W - CROW_W) / 2)
CTOP = 268
for i, (name, val, formula, col) in enumerate(CONTRIB):
    x = CLEFT + i * (CCW + CGAP)
    d.rounded_rectangle((int(x), CTOP, int(x + CCW), CTOP + CCH), radius=12,
                        fill=WHITE, outline=col, width=2)
    d.text((int(x + CCW / 2), CTOP + 22), name, font=digit_label, fill=col, anchor="mm")
    d.text((int(x + CCW / 2), CTOP + 48), val, font=code_big, fill=col, anchor="mm")
    d.text((int(x + CCW / 2), CTOP + 74), formula, font=code_small, fill=MUTED, anchor="mm")

# ── 合计 ─────────────────────────────────────────────────────────────────────
mixed(W / 2, 392, [
    ("131 + 130 + 200 + 305 = ", code_mid, MUTED),
    ("766", code_big, GOLD),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 424
CARD_H = 112
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 32
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 28


bottom_card(LEFT_X, GREEN, "找规律，不暴力", [
    [("n 到 2^31-1，逐位只要 10 轮循环", tiny_font, INK)],
    [("暴力逐个数 2.15e10 次，根本跑不动", mini_font, MUTED)],
    [("每位只看 higher / cur / lower 三件套", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "样例掩盖的三个 bug", [
    [("n=13 时三个错误实现全过官方样例", tiny_font, INK)],
    [("换成 n=10 立刻现形：cur=0 分支没走到", mini_font, MUTED)],
    [("循环条件错写成 weight < n 还会漏最高位", mini_font, MUTED)],
])

d.text((W / 2, H - 40), "同族：LC 233 · 数位统计 · 递归版少一次循环 · Java 注意两处 int 溢出",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/lc-233-cover.png", "photos/lc-233-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
