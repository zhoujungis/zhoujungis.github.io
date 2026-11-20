# -*- coding: utf-8 -*-
"""Cover for the NanoQA versioned quality-loop article.

Same visual system as tools/make_shuge_cover.py: warm paper background, green /
terracotta / gold accents, rounded cards, and a self-check that every text run
stays inside the canvas. The layout is about the article's thesis: one quality
loop with a version snapshot pinned to each execution, and a second panel for the
four hard boundaries.
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


d.text((W / 2, 42), "NanoQA：一套测试管理系统的四道硬边界", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("需求", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("用例", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("计划", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("执行", tiny_font, ORANGE), (" → ", tiny_font, DIM),
                  ("缺陷", tiny_font, ORANGE), (" → ", tiny_font, DIM),
                  ("报告", tiny_font, GOLD),
                  ("　——　Django + Vue 3，26 个模型", tiny_font, MUTED)])

mixed(300, 126, [("质量闭环", card_title, GREEN), ("　一条链，不是六张孤岛", tiny_font, MUTED)])
mixed(806, 126, [("版本快照", card_title, ORANGE), ("　结果绑定当时的用例", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("Requirement", "覆盖率分母", GOLD, GOLD_FILL),
    ("TestCase", "current_version 游标", GREEN, WHITE),
    ("TestCaseVersion", "steps JSONB", GREEN, GREEN_FILL),
    ("TestPlan → Run", "预建 not_run", GREEN, WHITE),
    ("TestResult", "FK → 版本", ORANGE, ORANGE_FILL),
    ("Defect", "四张表同事务", ORANGE, WHITE),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 374, [("乐观锁 WHERE updated_at　状态机四张表　审计同事务", tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("models", "26", GREEN),
    ("urls", "67", GREEN),
    ("views", "73", GREEN),
    ("tests", "232", GOLD),
    ("py lines", "12,132", ORANGE),
    ("vue lines", "17,395", ORANGE),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=code_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("列表 P95 188 ms　搜索 98 ms　报告 171 ms", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("重复检测 O(n²)：800 条要 55.5 秒", tiny_font, ORANGE)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "四道硬边界", [
    [("用例版本化　", tiny_font, INK), ("内容变化才 +1", tiny_font, MUTED)],
    [("结果绑快照　", tiny_font, INK), ("历史报告不会变", tiny_font, MUTED)],
    [("并发编辑　", tiny_font, INK), ("409 而非覆盖", tiny_font, MUTED)],
    [("审计同事务　", tiny_font, INK), ("字段级 diff", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "仍然存在的边界", [
    [("重复检测　", tiny_font, INK), ("未分桶，二次增长", tiny_font, MUTED)],
    [("AI 只有 Mock　", tiny_font, INK), ("真实网关抛错", tiny_font, MUTED)],
    [("权限不做缓存　", tiny_font, INK), ("每次多两次查询", tiny_font, MUTED)],
    [("软删无级联　", tiny_font, INK), ("报告侧要兜底", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/NanoQA · Django · DRF · Vue 3 · 19 migrations · 27 permissions",
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
img.save("frontend/public/photos/nanoqa-versioned-quality-loop-cover.png")
img.save("photos/nanoqa-versioned-quality-loop-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/nanoqa-versioned-quality-loop-cover.png",
            "photos/nanoqa-versioned-quality-loop-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
