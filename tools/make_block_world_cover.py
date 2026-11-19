# -*- coding: utf-8 -*-
"""Cover for the Block World 3D voxel-engine article."""

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


title_font = font("msyhbd.ttc", 27)
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


d.text((W / 2, 42), "方块世界 3D：一台纯 JS 体素引擎的四道闸", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("地形", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("区块", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("光照", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("实例化渲染", tiny_font, ORANGE), (" → ", tiny_font, DIM),
                  ("存档/云同步", tiny_font, GOLD),
                  ("　——　Three.js 之外全部自己写", tiny_font, MUTED)])

mixed(300, 126, [("每一帧之前", card_title, GREEN), ("　四层预算", tiny_font, MUTED)])
mixed(806, 126, [("性能门槛", card_title, ORANGE), ("　performance-budgets", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("terrain", "34 群系 · 7 层噪声", GOLD, GOLD_FILL),
    ("worker", "784 点 / 区块", GREEN, WHITE),
    ("light", "1 字节 = 天光 + 火把", GREEN, GREEN_FILL),
    ("render", "埋块剔除 + InstancedMesh", GREEN, WHITE),
    ("simulate", "4,096 事件 / tick", GREEN, GREEN_FILL),
    ("save", "schema v6 · 15 秒", ORANGE, ORANGE_FILL),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 374, [("半径 4 → 81 区块　卸载半径 5　视野 112", tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("frame median", "34 ms", GREEN),
    ("frame p95", "100 ms", GREEN),
    ("chunk move p95", "4,000 ms", GOLD),
    ("world ready", "15,000 ms", ORANGE),
    ("heap growth", "20 MB", ORANGE),
    ("loaded chunks", "≤ 25", ORANGE),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=code_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("世界高 251 层（-50…200）", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("A* 900 节点 / 32 格 / 2 体高", tiny_font, MUTED)], anchor="lm")

CARD_Y = 406
CARD_H = 174
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


bottom_card(LEFT_X, GREEN, "实测（Node 24）", [
    [("区块预采样　", tiny_font, INK), ("2.53 ms / 区块", tiny_font, MUTED)],
    [("地形采样　", tiny_font, INK), ("48.5 万点/秒", tiny_font, MUTED)],
    [("结构定位　", tiny_font, INK), ("17 类共 3.97 ms", tiny_font, MUTED)],
    [("存档迁移　", tiny_font, INK), ("v1→v6 约 8 µs", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "五个已知缺口", [
    [("红石　", tiny_font, INK), ("无 TNT / 压力板 / 绊线", tiny_font, MUTED)],
    [("云端 schema　", tiny_font, INK), ("仍写 v4，客户端 v6", tiny_font, MUTED)],
    [("方块键　", tiny_font, INK), ("字符串 Map ≈ 96 B/键", tiny_font, MUTED)],
    [("模式　", tiny_font, INK), ("无创造 / 旁观 / 指令", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/block_world_3d · Three.js r180 · Vite 7 · Electron 43 · 528 blocks · 332 recipes",
       font=tiny_font, fill=MUTED, anchor="mm")

assert 42 + 14 < 82 - 9, "title overlaps subtitle"
assert 82 + 9 < 126 - 12, "subtitle overlaps panel titles"
assert 144 < 156, "divider touches left card"
assert 156 + 6 * 34 - 4 <= 360, "stack overflows"
assert 374 + 9 < CARD_Y - 20, "left panel text overlaps cards"
assert CARD_Y + CARD_H + 12 < H - 20, "cards overlap footer"
for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"horizontal overflow: y={cy} x={x} w={w}"

os.makedirs("frontend/public/photos", exist_ok=True)
img.save("frontend/public/photos/block-world-3d-voxel-engine-cover.png")
img.save("photos/block-world-3d-voxel-engine-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/block-world-3d-voxel-engine-cover.png",
            "photos/block-world-3d-voxel-engine-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
