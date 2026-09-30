# -*- coding: utf-8 -*-
"""
make_lc300_cover.py — 【LC 300】最长递增子序列 的封面。

构图：nums 行（金色链 2-5-7-101）+ dp 行 + tails 行（登记表）。
两张卡片：锚「以 i 结尾」 / 换一套记账（tails 二分）。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm" 画内容；坐标/宽度 int()。
"""

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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 16)
code_mid = font("consola.ttf", 20)
code_tiny = font("consola.ttf", 11)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((x, cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, tsize=20):
    d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if sub is not None:
        d.text((x + cw / 2, y + ch / 2 - 7), t, font=font("consola.ttf", tsize), fill=tcol, anchor="mm")
        d.text((x + cw / 2, y + ch - 12), sub, font=code_tiny, fill=DIM, anchor="mm")
    elif t:
        d.text((x + cw / 2, y + ch / 2), t, font=font("consola.ttf", tsize), fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "最长递增子序列：给状态加一个锚", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("dp[i]", code_small, MUTED), (" = ", code_small, MUTED),
    ("以 nums[i] 结尾", tiny_font, MUTED), (" 的最长递增长度 —— 答案是 ", tiny_font, MUTED),
    ("max(dp)", code_small, MUTED), ("，不是 ", tiny_font, MUTED),
    ("dp[n-1]", code_small, MUTED),
])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 300", card_title, GREEN),
                   ("  [10,9,2,5,3,7,101,18] → 4（[2,3,7,101]）", tiny_font, MUTED)])

CW, GAP = 52, 10
NUMS = [10, 9, 2, 5, 3, 7, 101, 18]
DP = [1, 1, 1, 2, 2, 3, 4, 4]
COLS = len(NUMS)
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = int((W - ROW_W) / 2)
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]
CHAIN = {2, 3, 5, 6}          # 金色链：2 -> 5 -> 7 -> 101
BEST_I = 6                     # 全局最优的末端

# ── nums 行（链上淡金，末端橙框）────────────────────────────────────────────
for i, t in enumerate(NUMS):
    if i == BEST_I:
        cell(colX[i], 176, CW, 44, GOLD_FILL, ORANGE, str(t), ORANGE)
    elif i in CHAIN:
        cell(colX[i], 176, CW, 44, GOLD_FILL, GOLD, str(t), GOLD)
    else:
        cell(colX[i], 176, CW, 44, WHITE, BORDER, str(t), INK)
d.text((LEFT - 16, 198), "nums", font=mini_font, fill=MUTED, anchor="rm")

# ── dp 行（链上的格子淡金，dp[6] 金框）──────────────────────────────────────
for i, t in enumerate(DP):
    if i == BEST_I:
        cell(colX[i], 234, CW, 40, GOLD_FILL, GOLD, str(t), GOLD, tsize=18)
    elif i in CHAIN:
        cell(colX[i], 234, CW, 40, GOLD_FILL, BORDER, str(t), INK, tsize=18)
    else:
        cell(colX[i], 234, CW, 40, WHITE, BORDER, str(t), INK, tsize=18)
d.text((LEFT - 16, 254), "dp", font=mini_font, fill=MUTED, anchor="rm")

# ── tails 行（登记表：长度对、内容被换过 —— 18 替换了 101）──────────────────
TAILS = [2, 3, 7, 18]
for t, v in enumerate(TAILS):
    x = colX[t]
    if t == len(TAILS) - 1:
        cell(x, 298, CW, 44, GREEN_FILL, GREEN, str(v), GREEN, sub=f"len {t}")
    else:
        cell(x, 298, CW, 44, WHITE, BORDER, str(v), INK, sub=f"len {t}")
for t in range(len(TAILS), COLS):
    d.rounded_rectangle((colX[t], 298, colX[t] + CW, 342), radius=7,
                        fill=None, outline=DIM, width=1)
d.text((LEFT - 16, 320), "tails", font=mini_font, fill=MUTED, anchor="rm")
mixed(W / 2, 368, [
    ("tails = [2,3,7,18]", code_small, MUTED),
    ("：长度 4 是答案，内容被覆盖过（101 被 18 换掉）—— 它不是 LIS 本身", tiny_font, MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 152
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 36
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 32


bottom_card(LEFT_X, GREEN, "O(n^2)：加一个锚", [
    [("dp[i] = ", code_small, INK), ("以 nums[i] 结尾", tiny_font, INK), (" 的最长长度", tiny_font, INK)],
    [("转移：接在某个 ", tiny_font, INK), ("nums[j] < nums[i]", code_small, ORANGE), (" 后面", tiny_font, INK)],
    [("每个 dp[j] 只算一次、被反复查表", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "O(n log n)：换一个锚", [
    [("tails[len] = ", code_small, INK), ("该长度下的最小末尾", tiny_font, INK)],
    [("tails 严格递增 → ", tiny_font, INK), ("bisect_left", code_small, ORANGE)],
    [("替换 = 末尾更小；追加 = ", mini_font, MUTED), ("长度加一", mini_font, ORANGE)],
])

d.text((W / 2, H - 16), "同族：LC 673（数最长方案数） · LC 1143（最长公共子序列） · LC 354（二维套娃） · 最长非减用 bisect_right",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-300-cover.png", "photos/lc-300-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
