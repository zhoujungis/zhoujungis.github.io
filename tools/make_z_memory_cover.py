# -*- coding: utf-8 -*-
"""Cover for the Z Memory article.

Left panel: the lifecycle of one memory. Right panel: the five scoring factors
and the hybrid retrieval split. Bottom cards: what "explainable" buys, and the
limits that remain.
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


title_font = font("msyhbd.ttc", 28)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
sym_small = font("msyh.ttc", 16)

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


# Title
d.text((W / 2, 44), "Z Memory：让 AI 记住并说清理由", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("候选先审核", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("冲突不覆盖", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("得分可拆解", tiny_font, GOLD),
                  ("　——　本地 SQLite，不上向量库服务", tiny_font, MUTED)])

# Panel titles
mixed(302, 128, [("一条记忆的旅程", card_title, GREEN), ("　两段写入", tiny_font, MUTED)])
mixed(805, 128, [("检索得分", card_title, ORANGE), ("　五个因子", tiny_font, MUTED)])

d.line((550, 146, 550, 360), fill=BORDER, width=2)

# Left panel: lifecycle
LX0, LX1 = 76, 528
steps = [
    ("candidate", "提取候选，人工审核", GOLD, GOLD_FILL),
    ("normalize", "去空白、小写、CJK 保留", GREEN, WHITE),
    ("dedup", "同类型 ≥ 0.82 合并", GREEN, GREEN_FILL),
    ("conflict", "并置，不覆盖旧记录", ORANGE, ORANGE_FILL),
    ("store", "来源 + 关系 + 事件", GREEN, WHITE),
]
y = 160
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 348, [("临时记忆 7 天过期　事件与审计在硬删后仍保留", tiny_font, MUTED)], anchor="lm")

# Right panel: scoring
RX0, RX1 = 570, 1040
rows = [
    ("relevance", "0.40", GREEN),
    ("importance", "0.25", GREEN),
    ("confidence", "0.20", GOLD),
    ("recency", "0.10", ORANGE),
    ("frequency", "0.05", ORANGE),
]
y = 158
for name, weight, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=code_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, weight, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 318, [("hybrid　", tiny_font, MUTED), ("FTS5 0.60", code_small, GREEN),
                 (" + ", tiny_font, MUTED), ("hash-384 0.40", code_small, ORANGE)], anchor="lm")
mixed(RX0, 348, [("score 归一化　", tiny_font, MUTED), ("recency 半衰期 180–3650 天", tiny_font, MUTED)], anchor="lm")

# Bottom cards
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
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "可解释是什么", [
    [("来源　", tiny_font, INK), ("每条挂原文摘录", tiny_font, MUTED)],
    [("排序　", tiny_font, INK), ("五个乘数逐项返回", tiny_font, MUTED)],
    [("冲突　", tiny_font, INK), ("supersedes / contradicts", tiny_font, MUTED)],
    [("删除　", tiny_font, INK), ("内容走，审计留", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "四个限制", [
    [("哈希向量　", tiny_font, INK), ("只懂词面，不是语义", tiny_font, MUTED)],
    [("语义扫描　", tiny_font, INK), ("O(n)，无 ANN", tiny_font, MUTED)],
    [("rrf_k　", tiny_font, INK), ("配置存在但未使用", tiny_font, MUTED)],
    [("中文冲突　", tiny_font, INK), ("不同选择仍靠规则", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "仓库 zhoujungis/z-memory · Tauri 2 · Rust · SQLite + FTS5 · 35 commands · v0.1",
       font=tiny_font, fill=MUTED, anchor="mm")

# Geometry self-check
assert 44 + 15 < 84 - 9, "title overlaps subtitle"
assert 84 + 9 < 128 - 12, "subtitle overlaps panel title"
assert 146 < 160, "divider touches left card"
assert 160 + 5 * 34 <= 334, "lifecycle overflows panel"
assert 348 + 9 < CARD_Y - 20, "right panel content overlaps bottom cards"
assert CARD_Y + CARD_H + 10 < H - 20, "bottom cards overlap footer"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"horizontal overflow: y={cy} x={x} w={w}"

os.makedirs("frontend/public/photos", exist_ok=True)
img.save("frontend/public/photos/z-memory-explainable-provenance-cover.png")
img.save("photos/z-memory-explainable-provenance-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/z-memory-explainable-provenance-cover.png",
            "photos/z-memory-explainable-provenance-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
