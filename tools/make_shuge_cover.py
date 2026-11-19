# -*- coding: utf-8 -*-
"""Cover for the ShuGe (書閣) Cloudflare RAG article."""

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


d.text((W / 2, 42), "書閣 ShuGe：在边缘搭一套可引用页码的 RAG", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("解析", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("分块", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("索引", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("混合检索", tiny_font, ORANGE), (" → ", tiny_font, DIM),
                  ("带引用回答", tiny_font, GOLD),
                  ("　——　Cloudflare Pages，无服务器", tiny_font, MUTED)])

mixed(300, 126, [("一条文档流水线", card_title, GREEN), ("　五段", tiny_font, MUTED)])
mixed(806, 126, [("检索得分", card_title, ORANGE), ("　两路召回 + 一次重排", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("upload", "≤50MB → R2", GOLD, GOLD_FILL),
    ("parse", "12 种格式，纯 JS", GREEN, WHITE),
    ("chunk", "1,191 块 · 539.8 字", GREEN, GREEN_FILL),
    ("embed", "1024 维 · 批次 100", GREEN, WHITE),
    ("index", "475,979 条倒排", GREEN, GREEN_FILL),
    ("search", "BM25 × Vectorize", ORANGE, ORANGE_FILL),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 374, [("waitUntil 异步执行　失败重试 3 次　进度 5→100", tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("RRF", "1 / (60 + rank)", GREEN),
    ("vector", "0.22", GREEN),
    ("bm25", "0.32", GREEN),
    ("coverage", "0.22", GOLD),
    ("anchor", "0.22", ORANGE),
    ("neighbor", "× 0.78", ORANGE),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=code_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("topK 8　候选 360　SQL 绑定 80/批", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("注入检测命中后：上下文隔离 + 前端告警", tiny_font, ORANGE)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "实测（三国志）", [
    [("563,852 字　", tiny_font, INK), ("→ 1,191 块", tiny_font, MUTED)],
    [("分块　", tiny_font, INK), ("37.9 ms，平均 540 字", tiny_font, MUTED)],
    [("本地向量　", tiny_font, INK), ("43,729 块/秒", tiny_font, MUTED)],
    [("倒排　", tiny_font, INK), ("475,979 条 posting", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "四个真实边界", [
    [("400 词上限　", tiny_font, INK), ("99.7% 的块被截断", tiny_font, MUTED)],
    [("D1 向量回退　", tiny_font, INK), ("每次扫 4,000 块", tiny_font, MUTED)],
    [("哈希向量　", tiny_font, INK), ("只懂词面，不懂语义", tiny_font, MUTED)],
    [("图片/旧 .doc　", tiny_font, INK), ("无 OCR，需先转 docx", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/knowledge_base · React 18 · Hono · D1 · R2 · Vectorize · 29 tables",
       font=tiny_font, fill=MUTED, anchor="mm")

assert 42 + 14 < 82 - 9, "title overlaps subtitle"
assert 82 + 9 < 126 - 12, "subtitle overlaps panel titles"
assert 144 < 156, "divider touches left card"
assert 156 + 6 * 34 - 4 <= 360, "pipeline overflows"
assert 374 + 9 < CARD_Y - 20, "left panel text overlaps cards"
assert CARD_Y + CARD_H + 12 < H - 20, "cards overlap footer"
for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"horizontal overflow: y={cy} x={x} w={w}"

os.makedirs("frontend/public/photos", exist_ok=True)
img.save("frontend/public/photos/shuge-cloudflare-rag-cover.png")
img.save("photos/shuge-cloudflare-rag-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/shuge-cloudflare-rag-cover.png",
            "photos/shuge-cloudflare-rag-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
