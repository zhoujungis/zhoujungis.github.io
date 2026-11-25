# -*- coding: utf-8 -*-
"""Cover for the ECHO SPACE edge audio player article.

Same visual system as tools/make_autotest_cover.py: warm paper background,
green / terracotta / gold accents, rounded cards, and a self-check that every
text run stays inside the canvas. The layout is the request path: browser ->
static assets -> Pages Functions -> D1, plus the four boundaries that carried
the real load and the limits that are still honest.
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


d.text((W / 2, 42), "ECHO SPACE：在边缘做一个会算账的沉浸式播放器", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 82, [("浏览器", tiny_font, GREEN), ("  → 静态资源 /api/* →  ", tiny_font, DIM),
                  ("Pages Functions", tiny_font, GREEN), ("　D1 · 会话 · 去重", tiny_font, MUTED)])

mixed(300, 126, [("一条请求路径", card_title, GREEN), ("　没有服务器要常驻", tiny_font, MUTED)])
mixed(806, 126, [("真实规模", card_title, ORANGE), ("　不是播放器 Demo", tiny_font, MUTED)])
d.line((550, 144, 550, 368), fill=BORDER, width=2)

LX0, LX1 = 70, 530
steps = [
    ("public/index.html", "原生 HTML / CSS / JS", GREEN, WHITE),
    ("/api/register · /api/login", "PBKDF2 · Cookie", GREEN, GREEN_FILL),
    ("/api/history", "sessionId UPSERT", ORANGE, ORANGE_FILL),
    ("echo_history", "部分唯一索引去重", GREEN, WHITE),
    ("free-mode.js", "纯函数排程", GREEN, GREEN_FILL),
    ("/api/library", "乐观锁 rev", ORANGE, ORANGE_FILL),
]
y = 156
for name, action, accent, fill in steps:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

_cap = "currentTime 差值　→　不把拖动当成收听"
assert d.textlength(_cap, font=tiny_font) <= 460, "left caption crosses the divider"
mixed(LX0, 374, [(_cap, tiny_font, MUTED)], anchor="lm")

RX0, RX1 = 570, 1035
rows = [
    ("API 路由", "7", GREEN),
    ("D1 迁移", "4", GREEN),
    ("数据表", "4", GREEN),
    ("场景", "4", GOLD),
    ("休息模型", "3", GOLD),
    ("音频时长解析", "MP3 + MP4", ORANGE),
]
y = 152
for name, value, accent in rows:
    card(RX0, y, RX1, y + 26, WHITE, accent, width=2, radius=7)
    d.text((int(RX0 + 16), int(y + 13)), name, font=row_label, fill=INK, anchor="lm")
    right_text(RX1 - 16, y + 13, value, code_small, accent)
    checks.append((int(y), int(RX0), int(RX1 - RX0)))
    y += 30

mixed(RX0, 340, [("PBKDF2：10000 次是预算，不是安全", tiny_font, MUTED)], anchor="lm")
mixed(RX0, 364, [("限流只在 isolate 内，诚实地写进文档", tiny_font, ORANGE)], anchor="lm")

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
    [("会话去重　", tiny_font, INK), ("sessionId + UPSERT + 部分索引", tiny_font, MUTED)],
    [("播放口径　", tiny_font, INK), ("currentTime 差值，忽略拖动", tiny_font, MUTED)],
    [("自由组歌　", tiny_font, INK), ("纯函数保证总时长精确", tiny_font, MUTED)],
    [("时长索引　", tiny_font, INK), ("只读 4MB 头部解析容器", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "仍然存在的边界", [
    [("限流　", tiny_font, INK), ("只在 edge isolate 内存", tiny_font, MUTED)],
    [("旧历史　", tiny_font, INK), ("没有 session_id，无法精确去重", tiny_font, MUTED)],
    [("曲名作者　", tiny_font, INK), ("服务端信任前端提交", tiny_font, MUTED)],
    [("迁移　", tiny_font, INK), ("跨午夜归属是近似值", tiny_font, MUTED)],
])

d.text((W / 2, H - 15),
       "github.com/zhoujungis/echo_space · Cloudflare Pages · Pages Functions · D1 · vanilla JS",
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
os.makedirs("photos", exist_ok=True)
img.save("frontend/public/photos/echo-space-immersive-audio-player-cover.png")
img.save("photos/echo-space-immersive-audio-player-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/echo-space-immersive-audio-player-cover.png",
            "photos/echo-space-immersive-audio-player-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
