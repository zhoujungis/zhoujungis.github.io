# -*- coding: utf-8 -*-
"""
make_lc470_cover.py — 【LC 470】用 Rand7() 实现 Rand10() 的封面。

构图：左右两个面板，中间分隔线（沿用既有骨架）。
左 = 49 格状态表（1..40 绿 = 接受、41..49 红 = 拒绝，命中 28 金框）+ 骰子结论行；
右 = 前像分组（10 个输出色块 ×4 + 拒绝 9 格）+ 均匀性与期望公式；
下面两张卡片：骨架 / 易错点与验证。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
中文一律 CJK 字体；避免 msyh 缺字形的 ⇒/⇔ 等符号；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (231, 242, 234)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
REJECT_FILL = (247, 236, 232)
WHITE = (255, 255, 255)

OUTPUT_COLORS = [
    (121, 168, 146), (194, 135, 47), (138, 160, 192), (176, 143, 176), (164, 176, 106),
    (192, 138, 138), (127, 167, 160), (199, 167, 106), (154, 163, 199), (179, 160, 138),
]

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 29)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 15)
code_cell = font("consola.ttf", 10)
code_chip = font("consola.ttf", 12)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    x = cx - sum(widths) / 2 if anchor == "mm" else cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "用 Rand7() 实现 Rand10()：拒绝采样的 2.45 次",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("两次独立采样凑出 49 个等概率状态", tiny_font, MUTED),
                  ("　·　", tiny_font, MUTED), ("v ≤ 40 接受、41..49 拒绝重掷", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("49 格状态表", card_title, GREEN), ("　接受区 / 拒绝区", tiny_font, MUTED)])
mixed(810, 122, [("前像分组", card_title, ORANGE), ("　每个输出恰好 4 格", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 372), fill=BORDER, width=2)

# ── 左：7×7 状态表 ───────────────────────────────────────────────────────────
CELL, GAP = 24, 2
GX0 = 290 - (7 * CELL + 6 * GAP) / 2
GY0 = 172
for r in range(7):
    for c in range(7):
        v = r * 7 + c + 1
        x = GX0 + c * (CELL + GAP)
        y = GY0 + r * (CELL + GAP)
        accepted = v <= 40
        fill = GREEN_FILL if accepted else REJECT_FILL
        outline = BORDER
        width = 1
        if v == 28:
            fill = GOLD_FILL
            outline = GOLD
            width = 3
        d.rounded_rectangle((int(x), int(y), int(x + CELL), int(y + CELL)), radius=4,
                            fill=fill, outline=outline, width=width)
        d.text((int(x + CELL / 2), int(y + CELL / 2)), str(v),
               font=code_cell, fill=GOLD if v == 28 else (MUTED if not accepted else (74, 94, 80)),
               anchor="mm")

mixed(290, 152, [("(a, b) = (4, 7)", code_mid, INK), ("　→　", tiny_font, MUTED),
                 ("v = (4-1)×7 + 7 = 28", code_mid, INK), ("　→　", tiny_font, MUTED),
                 ("接受，输出 8", tiny_font, GREEN)])
mixed(290, 368, [("49 = 4 × 10 + 9：", tiny_font, MUTED), ("40 个接受", tiny_font, GREEN),
                 ("、9 个拒绝重掷", tiny_font, ORANGE)])

# ── 右：前像分组（10 色块 ×4 + 拒绝块） ─────────────────────────────────────
CW, CH = 44, 30
gx0 = 810 - (5 * CW + 4 * 4) / 2
gy0 = 168
for k in range(1, 11):
    col = (k - 1) % 5
    row = (k - 1) // 5
    x = gx0 + col * (CW + 4)
    y = gy0 + row * (CH + 6)
    color = OUTPUT_COLORS[k - 1]
    d.rounded_rectangle((int(x), int(y), int(x + CW), int(y + CH)), radius=5, fill=color, outline=color, width=1)
    d.text((int(x + CW / 2), int(y + CH / 2)), str(k), font=code_chip, fill=WHITE, anchor="mm")

rej_x = gx0
rej_y = gy0 + 2 * (CH + 6) + 10
d.rounded_rectangle((int(rej_x), int(rej_y), int(rej_x + 5 * CW + 16), int(rej_y + CH - 4)),
                    radius=5, fill=(233, 230, 225), outline=BORDER, width=1)
d.text((int(rej_x + (5 * CW + 16) / 2), int(rej_y + (CH - 4) / 2)),
       "41..49 拒绝重掷（9 格）", font=tiny_font, fill=MUTED, anchor="mm")

mixed(810, 300, [("P(输出 = k | 接受) = ", tiny_font, MUTED), ("4/40 = 1/10", code_mid, ORANGE)])
mixed(810, 330, [("E[调用] = ", tiny_font, MUTED), ("2 × 49/40 = 2.45", code_mid, GREEN),
                 (" 次；下界 ≈ 1.18", tiny_font, MUTED)])
mixed(810, 362, [("变体 0~4 → 0~6：25 → 21 = 3 × 7，E = 50/21 ≈ 2.38", tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 396
CARD_H = 172
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), CARD_Y, int(x + CARD_W), CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 42
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 33


bottom_card(LEFT_X, GREEN, "骨架", [
    [("v = (a-1) × 7 + b → 均匀 1..49", tiny_font, INK)],
    [("v ≤ 40 接受 → ", tiny_font, INK), ("(v-1) % 10 + 1", code_small, GREEN), ("；否则整组重掷", tiny_font, INK)],
    [("每个输出恰好 4 个来源状态（40 = 4 × 10）", tiny_font, INK)],
    [("E = ", tiny_font, MUTED), ("2 × 49/40 = 2.45", code_small, GREEN), (" 次；下界 ≈ 1.18", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "易错点与验证", [
    [("只掷一次 / 取模写成 v % 10（应为 (v-1)%10+1）", tiny_font, ORANGE)],
    [("拒绝后只重掷一颗 —— 必须两个都重掷", tiny_font, ORANGE)],
    [("变体 0~4 → 0~6：25 → 21 = 3 × 7，E = 50/21", tiny_font, ORANGE)],
    [("验证：大样本频数 / 卡方；回收拒绝值可逼近下界", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族概率题：LC 384 打乱数组 · LC 398 随机数索引 · LC 528 按权重随机选择 · LC 478 在圆内随机生成点 · LC 497 非重叠矩形中的随机点",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength("用 Rand7() 实现 Rand10()：拒绝采样的 2.45 次", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert GX0 > 40 and GX0 + 7 * CELL + 6 * GAP < 540, "左侧状态表越界"
assert GY0 + 7 * CELL + 6 * GAP < 360, "状态表压住结论行"
assert gx0 > 552 and gx0 + 5 * CW + 16 < 1060, "右侧色块越界"
assert rej_y + CH < CARD_Y - 14, "拒绝块压住卡片"
assert 368 + 12 < CARD_Y - 14, "结论行压住卡片徽标"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy == 84:
        assert wsum < W - 80, f"副标题过宽 y={cy}: {wsum}"
    else:
        assert wsum < 470, f"面板行过宽 y={cy}: {wsum}"
assert CARD_Y + CARD_H < H - 30, "底部卡片与 family 行重叠"
print("SELF-CHECK OK:", f"title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-470-cover.png", "photos/lc-470-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
