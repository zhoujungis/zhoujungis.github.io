# -*- coding: utf-8 -*-
"""Cover for the AutoTest remote pytest console article.

Same visual system as tools/make_nanoqa_cover.py: warm paper background, green /
terracotta / gold accents, rounded cards, and a self-check that every text run
stays inside the canvas. The layout is the pipeline: developer box -> queue ->
SSE -> N pytest processes -> reports -> one mail, plus the numbers and the
boundaries that actually carried load.
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


d.text((W / 2, 42), "AutoTest：把 pytest 装进可远程遥控的控制台", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("开发机 :5173", tiny_font, GREEN), ("  → 代理 →  ", tiny_font, DIM),
                  ("测试服务器 :3000", tiny_font, GREEN), ("　SSE · 单批互斥 · 一封信", tiny_font, MUTED)])

mixed(300, 126, [("一条远程流水线", card_title, GREEN), ("　HTTP 变成进程", tiny_font, MUTED)])
mixed(806, 126, [("真实规模", card_title, ORANGE), ("　不是演示仓库", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("tests/debug|release", "只认 test_*.py", GREEN, WHITE),
    ("Testbed queue", "顺序即执行顺序", GREEN, GREEN_FILL),
    ("GET /run-tests-stream", "stdout / stderr / report / close", ORANGE, ORANGE_FILL),
    ("pytest × N", "一脚本一进程", GREEN, WHITE),
    ("reports/<id>/", "nodeid 合并", GREEN, GREEN_FILL),
    ("core.finish_report_mail", "整批只发一封", ORANGE, ORANGE_FILL),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

_cap = "Python 五级回退　adb：connect → devices"
assert d.textlength(_cap, font=tiny_font) <= 460, "left caption crosses the divider"
mixed(LX0, 374, [(_cap, tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("HTTP routes", "10", GREEN),
    ("SSE events", "4", GREEN),
    ("Vue components", "7", GREEN),
    ("config tables", "3", GOLD),
    ("test scripts", "3", GOLD),
    ("Python fallbacks", "5", ORANGE),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=code_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("单批锁：一个布尔挡四种竞态", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("报告 ID 叫 daily，其实从不归零", tiny_font, ORANGE)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "真正难的 4 件事", [
    [("解释器发现　", tiny_font, INK), ("文件 → PATH → py → 扫描", tiny_font, MUTED)],
    [("批次互斥　", tiny_font, INK), ("计数 / 目录 / 发信 / 4723", tiny_font, MUTED)],
    [("报告合并　", tiny_font, INK), ("nodeid 主键，summary 要聚合", tiny_font, MUTED)],
    [("邮件去重　", tiny_font, INK), ("DEFER 环境变量 + 一进程", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "仍然存在的边界", [
    [("停止按钮　", tiny_font, INK), ("POST /stop-tests 没有后端", tiny_font, MUTED)],
    [("self.config　", tiny_font, INK), ("从未赋值，首行就抛", tiny_font, MUTED)],
    [("大小写　", tiny_font, INK), ("TestBed.vue vs Testbed.vue", tiny_font, MUTED)],
    [("安全　", tiny_font, INK), ("无鉴权 + 0.0.0.0 + 明文凭据", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/AutoTest · Vue 3 · Node/Express · pytest · Appium · PostgreSQL",
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
img.save("frontend/public/photos/autotest-pytest-mobile-console-cover.png")
img.save("photos/autotest-pytest-mobile-console-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/autotest-pytest-mobile-console-cover.png",
            "photos/autotest-pytest-mobile-console-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
