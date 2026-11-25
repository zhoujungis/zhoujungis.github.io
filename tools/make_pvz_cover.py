# -*- coding: utf-8 -*-
"""Cover for the PvZ (花园保卫战) vanilla-JS engine article.

Same visual system as tools/make_echo_space_cover.py: warm paper background,
green / terracotta / gold accents, rounded cards, and a self-check that every
text run stays inside the canvas. The layout is the frame loop: input ->
update -> draw, plus the systems that carried the load and the limits.
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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 26)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 16)

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


def right_text(x_right, y, text, f, color):
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


d.text((W / 2, 40), "花园保卫战：3700 行原生 JS 手搓一个植物大战僵尸", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 80, [("输入", tiny_font, GREEN), ("  →  update(dt) → draw()  →  ", tiny_font, DIM),
                  ("requestAnimationFrame", tiny_font, GREEN), ("　零框架 · 零构建", tiny_font, MUTED)])

mixed(300, 124, [("一个 IIFE 里的整台引擎", card_title, GREEN), ("　canvas 1280×720", tiny_font, MUTED)])
mixed(806, 124, [("真实规模", card_title, ORANGE), ("　不是玩具 Demo", tiny_font, MUTED)])
d.line((550, 142, 550, 366), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("makeSchedule()", "僵尸波次表", GREEN, WHITE),
    ("updatePlants", "24 种植物行为", GREEN, GREEN_FILL),
    ("updateZombies", "16 种僵尸 AI", ORANGE, ORANGE_FILL),
    ("updateProjectiles", "直线 / 抛射 / 穿刺", GREEN, WHITE),
    ("draw*() x81", "GIF 回退到手绘", GREEN, GREEN_FILL),
    ("drawFog", "destination-out 挖洞", ORANGE, ORANGE_FILL),
]
y = 154
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

_cap = "dt 封顶 34ms　→　掉帧不穿墙"
assert d.textlength(_cap, font=tiny_font) <= 460, "left caption crosses the divider"
mixed(LX0, 372, [(_cap, tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("代码行数", "3,731", GREEN),
    ("函数", "146", GREEN),
    ("植物", "24", GREEN),
    ("僵尸", "16", GOLD),
    ("关卡", "60", GOLD),
    ("E2E 套件", "16", ORANGE),
]
y = 150
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=row_label, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 338, [("六大章节：白天 / 夜晚 / 水池 / 迷雾 / 屋顶 / 终局", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 362, [("file:// 下 canvas 被污染，测试改读截图像素", tiny_font, ORANGE)], anchor="lm")

CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX_CARD = 40
LEFT_X = (W - CARD_W * 2 - GAPX_CARD) / 2


def bottom_card(x, accent, badge, lines):
    card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                         radius=7, fill=accent)
    d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
           fill=WHITE, anchor="mm")
    y = CARD_Y + 42
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 38


bottom_card(LEFT_X, GREEN, "真正难的 4 件事", [
    [("素材回退　", tiny_font, INK), ("GIF → PNG → 代码手绘", tiny_font, MUTED)],
    [("地形差异　", tiny_font, INK), ("水面 / 迷雾 / 屋顶坡度", tiny_font, MUTED)],
    [("波次编排　", tiny_font, INK), ("收尾段轮换全类型登场", tiny_font, MUTED)],
    [("存档迁移　", tiny_font, INK), ("旧关卡 ID 映射到新章节", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "仍然存在的边界", [
    [("单文件　", tiny_font, INK), ("3731 行，无模块拆分", tiny_font, MUTED)],
    [("碰撞　", tiny_font, INK), ("按行 + x 区间近似，非物理", tiny_font, MUTED)],
    [("屋顶　", tiny_font, INK), ("坡度只影响视觉，不改碰撞", tiny_font, MUTED)],
    [("素材版权　", tiny_font, INK), ("同人作品，不可商用", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/pvz · 原生 JS · Canvas 2D · 无框架 · Playwright E2E",
       font=tiny_font, fill=MUTED, anchor="mm")

assert 40 + 14 < 80 - 9, "title overlaps subtitle"
assert 80 + 9 < 124 - 12, "subtitle overlaps panel titles"
assert 142 < 154, "divider touches left card"
assert 154 + 6 * 34 - 4 <= 358, "pipeline overflows"
assert 372 + 9 < CARD_Y - 20, "left caption overlaps cards"
assert CARD_Y + CARD_H + 12 < H - 20, "cards overlap footer"
for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"horizontal overflow: y={cy} x={x} w={w}"

os.makedirs("frontend/public/photos", exist_ok=True)
os.makedirs("photos", exist_ok=True)
img.save("frontend/public/photos/pvz-vanilla-js-canvas-engine-cover.png")
img.save("photos/pvz-vanilla-js-canvas-engine-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/pvz-vanilla-js-canvas-engine-cover.png",
            "photos/pvz-vanilla-js-canvas-engine-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
