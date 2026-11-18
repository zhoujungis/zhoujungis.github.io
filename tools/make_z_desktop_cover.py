# -*- coding: utf-8 -*-
"""Cover for the Z Desktop article.

Layout follows the site's cover skeleton: title + subtitle, two panels split by
a divider, two bottom cards. Mixed CJK/Latin text is drawn segment by segment
so Consolas never renders Chinese or arrows.
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


title_font = font("msyhbd.ttc", 29)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
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
d.text((W / 2, 44), "Z Desktop：44 个本机工具怎么过闸",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("规划在前端", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("安全在 Rust", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("审批是一次性凭证", tiny_font, GOLD),
                  ("　——　模型可以规划，机器只能被批准后触碰", tiny_font, MUTED)])

# Panel titles
mixed(302, 128, [("五级风险", card_title, GREEN), ("　44 个工具一个入口", tiny_font, MUTED)])
mixed(805, 128, [("一次调用", card_title, ORANGE), ("　Rust 侧数据流", tiny_font, MUTED)])

# Divider
d.line((550, 146, 550, 360), fill=BORDER, width=2)

# Left panel: risk ladder
LX0, LX1 = 76, 528
levels = [
    ("SAFE", "自动允许", GREEN, GREEN_FILL),
    ("LOW", "可配置自动", GREEN, WHITE),
    ("MEDIUM", "默认需审批", GOLD, GOLD_FILL),
    ("HIGH", "每次确认", ORANGE, ORANGE_FILL),
    ("CRITICAL", "默认禁止", ORANGE, WHITE),
]
y = 160
for name, action, accent, fill in levels:
    card(LX0, y, LX1, y + 30, fill, accent, width=2, radius=8)
    d.text((int(LX0 + 16), int(y + 15)), name, font=code_small, fill=accent, anchor="lm")
    right_text(LX1 - 16, y + 15, action, row_label, INK)
    checks.append((int(y), int(LX0), int(LX1 - LX0)))
    y += 34

mixed(LX0, 348, [("未知工具回落 ", tiny_font, MUTED), ("MEDIUM", code_small, ORANGE),
                 ("　Always-allow 只对 ≤ MEDIUM 生效", tiny_font, MUTED)], anchor="lm")

# Right panel: call flow
RX0, RX1 = 570, 1040
card(RX0, 158, RX1, 196, GREEN_FILL, GREEN, width=2)
mixed((RX0 + RX1) / 2, 177, [("invoke tool_execute", code_small, GREEN)])

mixed((RX0 + RX1) / 2, 210, [("↓", sym_small, DIM)])

card(RX0, 224, RX1, 262, GOLD_FILL, GOLD, width=2)
mixed((RX0 + RX1) / 2, 243, [("security::permission::decide()", code_small, GOLD)])

mixed((RX0 + RX1) / 2, 276, [("↓", sym_small, DIM)])

card(RX0, 290, RX0 + 216, 326, WHITE, ORANGE, width=2)
mixed(RX0 + 108, 308, [("blocked", code_small, ORANGE)])

card(RX0 + 234, 290, RX0 + 470, 326, WHITE, ORANGE, width=2)
mixed(RX0 + 352, 308, [("approval", code_small, ORANGE)])

mixed(RX0, 348, [("拒绝 → 作为 failed 观察结果返回；允许 → 校验名+参后重放", tiny_font, MUTED)], anchor="lm")
assert RX1 - RX0 == 470

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


bottom_card(LEFT_X, GREEN, "三处收口", [
    [("前端只规划　", tiny_font, INK), ("判定与执行在 Rust", tiny_font, MUTED)],
    [("Shell 按段判级　", tiny_font, INK), ("; && || | 取最高", tiny_font, MUTED)],
    [("审批一次性　", tiny_font, INK), ("工具名 + 完整输入匹配", tiny_font, MUTED)],
    [("路径沙箱　", tiny_font, INK), ("只拦写入，读写不对称", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "七个缺口", [
    [("引号与转义　", tiny_font, INK), ("拆段误报", tiny_font, MUTED)],
    [("-EncodedCommand　", tiny_font, INK), ("词法绕过", tiny_font, MUTED)],
    [("读无边界　", tiny_font, INK), ("数据外泄面", tiny_font, MUTED)],
    [("验证器失败　", tiny_font, INK), ("fail-open 采纳输出", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "仓库 zhoujungis/z-desktop · Tauri 2 · Vue 3 · Rust · 44 tools · MIT · v0.1.0",
       font=tiny_font, fill=MUTED, anchor="mm")

# Geometry self-check
assert 44 + 15 < 84 - 9, "title overlaps subtitle"
assert 84 + 9 < 128 - 12, "subtitle overlaps panel title"
assert 146 < 160, "divider touches left card"
assert 160 + 5 * 34 <= 334, "risk ladder overflows panel"
assert 348 + 9 < CARD_Y - 20, "panel footnotes overlap bottom cards"
assert CARD_Y + CARD_H + 10 < H - 20, "bottom cards overlap footer"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"horizontal overflow: y={cy} x={x} w={w}"

os.makedirs("frontend/public/photos", exist_ok=True)
img.save("frontend/public/photos/z-desktop-permission-gate-cover.png")
img.save("photos/z-desktop-permission-gate-cover.png")
print(f"SELF-CHECK OK: W={W} H={H}")
for out in ("frontend/public/photos/z-desktop-permission-gate-cover.png",
            "photos/z-desktop-permission-gate-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
