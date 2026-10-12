# -*- coding: utf-8 -*-
"""
make_lc1262_cover.py — 【LC 1262】可被三整除的最大和 的封面。

构图：左右两个面板，中间分隔线（沿用 lc139/lc322 封面骨架）。
左 = 贪心：nums = [3,6,5,1,8]（值 + 对 3 的余数），下面三行余数桶
      m0 / m1 / m2（m2 高亮、最小的 5 描金），结论行 "r=2 → 削 5 → 18"。
右 = 取模 dp：dp[0]/dp[1]/dp[2] 三格（dp[0]=18 描金）+ 转移弧线，
      结论行 "dp[j] = 和 ≡ j (mod 3) 的最大和"。
下面两张卡片：贪心骨架 / 同族与对照。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（≡、∞ 等符号也交给中文字体）；几何自检。
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
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
DIM = (154, 163, 156)
PAST = (238, 240, 236)
WHITE = (255, 255, 255)
DASH = (216, 221, 214)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 18)
code_big = font("consola.ttf", 22)
code_tiny = font("consola.ttf", 11)
sym_mid = font("msyh.ttc", 18)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    """逐段绘制中英混排；每段的字体/颜色各自指定。"""
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    if anchor == "mm":
        x = cx - sum(widths) / 2
    else:
        x = cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None, width=2, tfont=None):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=6,
                        fill=fill, outline=stroke, width=width)
    tf = tfont or (sym_mid if t == "∞" else code_mid)
    if sub is not None:
        d.text((int(x + cw / 2), int(y + ch / 2 - 7)), t, font=tf, fill=tcol, anchor="mm")
        d.text((int(x + cw / 2), int(y + ch - 10)), sub, font=tiny_font,
               fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=tf, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "可被三整除的最大和：余数分组贪心 × 三格滚动取模 dp",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [
    ("全选求和 S → 看余数 r → 削掉最小的一撮；余数世界里 ", tiny_font, MUTED),
    ("1+1", code_small, INK), ("≡", tiny_font, INK), ("2", code_small, INK),
    ("、", tiny_font, MUTED),
    ("2+2", code_small, INK), ("≡", tiny_font, INK), ("1", code_small, INK),
    ("、", tiny_font, MUTED),
    ("1+2", code_small, INK), ("≡", tiny_font, INK), ("0", code_small, INK),
])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(292, 122, [("贪心  r = S % 3", card_title, GREEN), ("　O(n)", tiny_font, MUTED)])
mixed(808, 122, [("取模 dp", card_title, ORANGE), ("　不依赖正负", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 338), fill=BORDER, width=2)

# ── 左面板：nums 行 + 三行余数桶 ─────────────────────────────────────────────
d.text((292, 154), "nums：值 + 对 3 的余数（全为正，sum 是上界）",
       font=row_label, fill=MUTED, anchor="mm")

NUMS = [(3, 0), (6, 0), (5, 2), (1, 1), (8, 2)]
CW, GAP = 44, 6
AY = 168
AH = 44
total_a = len(NUMS) * CW + (len(NUMS) - 1) * GAP
ax0 = 292 - total_a / 2
for k, (v, rem) in enumerate(NUMS):
    dx = ax0 + k * (CW + GAP)
    cell(dx, AY, CW, AH, WHITE, BORDER, str(v), INK, sub=f"≡{rem}", subcol=MUTED)

# 三行桶
BUCKETS = [
    (0, "m0", [3, 6]),
    (1, "m1", [1]),
    (2, "m2", [5, 8]),
]
BY0 = 228
BH = 28
CHW, CHGAP = 34, 6
chx0 = 200
for b, (rem, name, vals) in enumerate(BUCKETS):
    y = BY0 + b * (BH + 8)
    hot = rem == 2
    d.text((130, y + BH / 2), f"{name} 余{rem}", font=row_label,
           fill=GREEN if hot else MUTED, anchor="lm")
    for j, v in enumerate(vals):
        x = chx0 + j * (CHW + CHGAP)
        is_pick = hot and j == 0
        fill, stroke, tcol, w = WHITE, BORDER, INK, 2
        if is_pick:
            fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3
        elif hot:
            stroke, w = GREEN, 2
        cell(x, y, CHW, BH, fill, stroke, str(v), tcol, width=w)

mixed(292, 350, [("r = 2 → 削 ", tiny_font, INK), ("m2", code_small, GREEN),
                 (" 最小的 ", tiny_font, INK), ("5", code_small, GOLD),
                 (" → ", tiny_font, MUTED), ("23 − 5 = 18", code_mid, GREEN)])

# ── 右面板：dp 三格 + 弧线 ───────────────────────────────────────────────────
d.text((808, 154), "dp[j] = 子集和 ≡ j (mod 3) 的最大和",
       font=row_label, fill=MUTED, anchor="mm")

DP = [18, 22, 23]
DW, DGAP = 150, 20
DY = 172
DH = 62
total_d = 3 * DW + 2 * DGAP
dx0 = 808 - total_d / 2
centers = [dx0 + i * (DW + DGAP) + DW / 2 for i in range(3)]

# 弧线：0→2（+5 落余 2）、1→0（+8 落余 0）
def arc(x1, x2, ytop, depth, color):
    d.line((int(x1), int(ytop), int((x1 + x2) / 2), int(ytop + depth)), fill=color, width=2)
    d.line((int((x1 + x2) / 2), int(ytop + depth), int(x2), int(ytop)), fill=color, width=2)


arc(centers[0], centers[2], DY + DH, 40, GREEN)
arc(centers[1], centers[0], DY + DH, 62, ORANGE)

for i, v in enumerate(DP):
    x = dx0 + i * (DW + DGAP)
    is_ans = i == 0
    fill, stroke, tcol, w = WHITE, BORDER, INK, 2
    if is_ans:
        fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3
    cell(x, DY, DW, DH, fill, stroke, str(v), tcol, sub=f"dp[{i}]  余 {i}",
         subcol=GOLD if is_ans else MUTED, width=w, tfont=code_big)

mixed(808, 316, [("逐元素：先快照 ", tiny_font, INK), ("old = dp", code_small, ORANGE),
                 ("，再 ", tiny_font, INK), ("max", code_small, ORANGE), ("（每件一次）", tiny_font, INK)])
mixed(808, 340, [("答案 ", tiny_font, MUTED), ("dp[0] = 18", code_mid, GOLD),
                 ("　（余 1 / 余 2 是中间产物）", tiny_font, MUTED)])

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


bottom_card(LEFT_X, GREEN, "贪心骨架", [
    [("r = 0 → ", tiny_font, INK), ("直接返回 S", tiny_font, GREEN), ("（全选即最优）", tiny_font, MUTED)],
    [("r = 1 → 削 ", tiny_font, INK), ("一个 ", tiny_font, ORANGE), ("m1", code_small, ORANGE),
     (" 或 ", tiny_font, MUTED), ("两个 ", tiny_font, ORANGE), ("m2", code_small, ORANGE)],
    [("r = 2 → 削 ", tiny_font, INK), ("一个 ", tiny_font, ORANGE), ("m2", code_small, ORANGE),
     (" 或 ", tiny_font, MUTED), ("两个 ", tiny_font, ORANGE), ("m1", code_small, ORANGE)],
    [("凑不齐 → ", tiny_font, INK), ("返回 0", tiny_font, GREEN), ("（空集）", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "同族与对照", [
    [("974：", tiny_font, INK), ("前缀和同余", tiny_font, ORANGE), ("（哈希计数）", tiny_font, MUTED)],
    [("1590：", tiny_font, INK), ("删最短段 ", tiny_font, ORANGE), ("≡ r", tiny_font, ORANGE),
     ("（前缀和）", tiny_font, MUTED)],
    [("1497：", tiny_font, INK), ("余数互补配对", tiny_font, ORANGE)],
    [("1018 / 2435：逐位取模 / 网格余数 dp", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 974 和可被 K 整除的子数组 · LC 1590 使数组和能被 P 整除 · LC 1497 检查数组对 · LC 1018 二进制前缀 · LC 2435 矩阵路径",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert total_a < 470, "nums 行超面板宽"
tw_title = d.textlength("可被三整除的最大和：余数分组贪心 × 三格滚动取模 dp", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert ax0 > 40 and ax0 + total_a < 540, "nums 行越出左面板"
assert dx0 > 552 and dx0 + total_d < 1060, "dp 行越出右面板"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (84, 350):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert AY + AH < BY0 - 4, "nums 行压住桶行"
assert BY0 + 2 * (BH + 8) + BH < 350 - 10, "桶行压住结论行"
assert 340 + 12 < CARD_Y - 14, "右面板结论行压住卡片徽标"
assert DY + DH + 62 < 316 - 10, "dp 弧线压住结论行"
assert CARD_Y + CARD_H < H - 30, "底部卡片与 family 行重叠"
print("SELF-CHECK OK:", f"nums_row={int(total_a)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-1262-cover.png", "photos/lc-1262-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
