# -*- coding: utf-8 -*-
"""Cover for the DevBox (registry-driven toolbox) article.

Same visual system as tools/make_pvz_cover.py: warm paper background, green /
terracotta / gold accents, rounded cards, and a self-check that every text run
stays inside the canvas. The layout is the argument: one registry derives
routes / search / sitemap, then the four engineering boundaries.
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


d.text((W / 2, 40), "DevBox：42 个在线工具，一份注册表", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 80, [("ToolDefinition", tiny_font, GREEN), ("  →  ", tiny_font, DIM),
                  ("routes · search · sitemap", tiny_font, GREEN),
                  ("　零后端 · 数据不出浏览器", tiny_font, MUTED)])

mixed(300, 124, [("一份注册表派生七处", card_title, GREEN), ("　16,595 字节", tiny_font, MUTED)])
mixed(806, 124, [("真实规模", card_title, ORANGE), ("　不是 42 个页面", tiny_font, MUTED)])
d.line((550, 142, 550, 366), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("tools.ts", "42 条 ToolDefinition", GREEN, WHITE),
    ("router/index.ts", "routes.map()", GREEN, GREEN_FILL),
    ("searchTools()", "名称 + 关键词", GREEN, WHITE),
    ("Home / Category", "分类计数自动", GREEN, GREEN_FILL),
    ("generate-sitemap", "Node 直接读 .ts", ORANGE, ORANGE_FILL),
    ("App.vue", "useHead 生成 SEO", GREEN, GREEN_FILL),
]
y = 154
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

_cap = "加一个工具 = 填一条记录，改 0 个文件"
assert d.textlength(_cap, font=tiny_font) <= 460, "left caption crosses the divider"
mixed(LX0, 372, [(_cap, tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("工具", "42", GREEN),
    ("分类", "8", GREEN),
    ("processor", "34", GREEN),
    ("单元测试", "31", GOLD),
    ("懒加载语言包", "8", GOLD),
    ("外部请求工具", "3", ORANGE),
]
y = 150
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=row_label, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 338, [("Vue 3 · TypeScript · Vite · CodeMirror 6 · Tailwind", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 362, [("RFC 6238 官方向量当 TOTP 测试", tiny_font, ORANGE)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "四个工程边界", [
    [("注册表　", tiny_font, INK), ("新增工具不改路由/搜索/SEO", tiny_font, MUTED)],
    [("隐私枚举　", tiny_font, INK), ("local / external / mixed 进类型", tiny_font, MUTED)],
    [("输入上限　", tiny_font, INK), ("正则拦嵌套量词，源码卡 1M", tiny_font, MUTED)],
    [("纯函数　", tiny_font, INK), ("34 个 processor，31 份单测", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "诚实标出的边界", [
    [("AI 检测　", tiny_font, INK), ("说明风格倾向，不证明作者", tiny_font, MUTED)],
    [("HTTP Ping　", tiny_font, INK), ("浏览器发不出 ICMP", tiny_font, MUTED)],
    [("ReDoS　", tiny_font, INK), ("启发式拦截，非完备", tiny_font, MUTED)],
    [("CSP　", tiny_font, INK), ("connect-src https: 的妥协", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/devtools · Vue 3 + TS + Vite · 零后端 · 42 个工具",
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
img.save("frontend/public/photos/devbox-registry-driven-toolbox-cover.png")
img.save("photos/devbox-registry-driven-toolbox-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/devbox-registry-driven-toolbox-cover.png",
            "photos/devbox-registry-driven-toolbox-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
