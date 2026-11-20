# -*- coding: utf-8 -*-
"""Cover for the Routewise AI geo-constrained itinerary article.

Same visual system as tools/make_shuge_cover.py. The left panel is the four-layer
constraint chain (schedule -> chunk -> prompt -> validator); the right panel is
the real geo-validator measurements from tools/bench_routewise_geo.mjs.
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


def pick_font(value, mono=code_small, cjk=sym_small):
    """consola.ttf has no CJK glyphs: fall back to msyh for any non-ASCII string."""
    return mono if value.isascii() else cjk


d.text((W / 2, 42), "Routewise AI：让模型吐出一份能落在地图上的行程", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("固定排期", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("4 天切块", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("强制 JSON", tiny_font, GREEN), (" → ", tiny_font, DIM),
                  ("地理校验", tiny_font, ORANGE), (" → ", tiny_font, DIM),
                  ("失败回灌重试", tiny_font, GOLD),
                  ("　——　Cloudflare Pages，无服务器", tiny_font, MUTED)])

mixed(300, 126, [("四层约束", card_title, GREEN), ("　把不确定性移出模型", tiny_font, MUTED)])
mixed(806, 126, [("校验器实测", card_title, ORANGE), ("　只认距离，不认语义", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("buildCitySchedule", "7天3城 → 3/2/2", GOLD, GOLD_FILL),
    ("4 天一块", "16 天 → 4 块", GREEN, WHITE),
    ("并发上限 4", "子请求配额", GREEN, GREEN_FILL),
    ("normalizePlan", "结构 + 坐标", GREEN, WHITE),
    ("geographicIssues", "四类检查", ORANGE, ORANGE_FILL),
    ("重试 1 次", "把原因塞回提示词", ORANGE, WHITE),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=pick_font(name), fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 374, [("SSE：status / delta / complete / error　30 秒心跳", tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("相邻站点", "≤ 15 km", GREEN),
    ("活动区跨度", "≤ 22 km", GREEN),
    ("餐点绕路", "≤ 6 km", GREEN),
    ("折返比", "> 2.2× 且 > 25 km", ORANGE),
    ("ratio 2.47 却通过", "22–25 km 盲区", ORANGE),
    ("最坏 16×6 校验", "0.078 ms", GOLD),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=sym_small, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, pick_font(value), accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("一次生成 10 积分　最坏 8 次模型调用", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("Functions 1,101 行　小程序 28 个文件", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "三个不变量交给数据库", [
    [("积分扣减　", tiny_font, INK), ("WHERE credits >=", tiny_font, MUTED)],
    [("支付幂等　", tiny_font, INK), ("每条语句带 pending", tiny_font, MUTED)],
    [("邀请上限　", tiny_font, INK), ("daily reward slot", tiny_font, MUTED)],
    [("微信并发　", tiny_font, INK), ("唯一索引兜底", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "校验器管不到的", [
    [("营业时间　", tiny_font, INK), ("模型不知道", tiny_font, MUTED)],
    [("坐标与名称　", tiny_font, INK), ("一致性无校验", tiny_font, MUTED)],
    [("城市分配　", tiny_font, INK), ("机械均分", tiny_font, MUTED)],
    [("重试　", tiny_font, INK), ("只有一次", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/trip-planning · TypeScript · D1 · SSE · 微信小程序 · 251 城市 JSON",
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
img.save("frontend/public/photos/routewise-ai-geo-constrained-itinerary-cover.png")
img.save("photos/routewise-ai-geo-constrained-itinerary-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/routewise-ai-geo-constrained-itinerary-cover.png",
            "photos/routewise-ai-geo-constrained-itinerary-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
