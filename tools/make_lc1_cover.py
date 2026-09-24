# -*- coding: utf-8 -*-
"""生成 LC 1 文章封面 frontend/public/photos/lc-1-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
这张图只讲一件事 —— **「先查再存」和「先存再查」的区别**：

  左卡（绿，对的）—— 4 行核心代码，先 `if need in seen` 再 `seen[x] = i`；
        说明：查表那一刻表里只有左边的元素，所以命中下标必然 < i。

  右卡（橙，错的）—— 同样的 4 行，但把 `seen[x] = i` 提到了最前面；
        说明：当 target == 2 * x 时会查到"自己"，
        给出 `[3, 3]` 配 target = 6 → 返回 [0, 0] 的具体反例。

  底部 —— 一行点出变体：167 有序→双指针 O(1) · 15 三数 · 18 四数 · 454 分组哈希。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
ORANGE_FILL = (252, 243, 238)

TITLE = "两数之和 · 先查再存"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
card_title = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 20)
code_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
code_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)

# ── 页眉 ───────────────────────────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)

# ── 两张代码卡片 ───────────────────────────────────────────────────────────
# ⚠️ 行高要逐段记账：角标 40 + 代码 5 行 × 23 = 115 + 分隔线 + 说明 3 行 × 23 = 69。
# 初版按 CARD_H = 250 排，结果最后一行说明落在卡片外面（>422）。
CARD_Y = 160
CARD_H = 300
CARD_W = 442
GAPX = 44
LEFT_X = (W - (CARD_W * 2 + GAPX)) / 2
RIGHT_X = LEFT_X + CARD_W + GAPX

CODE_TOP_DY = 62          # 第一行代码相对卡片顶的偏移
CODE_LINE_H = 23
RULE_DY = 200             # 分隔线相对卡片顶的偏移
NOTE_TOP_DY = 222         # 第一行说明相对卡片顶的偏移
NOTE_LINE_H = 23


def code_card(x, accent, accent_fill, badge, lines, notes):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=accent_fill, outline=accent, width=2)
    # 角标（宽度按文字自适应 —— 写死宽度会裁字）
    bw = d.textlength(badge, font=card_title) + 34
    d.rounded_rectangle((x + 16, CARD_Y + 14, x + 16 + bw, CARD_Y + 40), radius=7, fill=accent)
    d.text((x + 16 + bw / 2, CARD_Y + 27), badge, font=card_title, fill=WHITE, anchor="mm")

    # ⚠️ 代码行必须**分段绘制**：Consolas 没有中文字形，
    # 直接在 code_font 里渲染中文注释会出一排豆腐块（□）。
    # 每行是 [(text, font, color), ...]，ASCII 用 Consolas、中文用微软雅黑。
    y = CARD_Y + CODE_TOP_DY
    for parts in lines:
        cx = x + 22
        for text, font, color in parts:
            d.text((cx, y), text, font=font, fill=color, anchor="lm")
            cx += d.textlength(text, font=font)
        y += CODE_LINE_H

    # 分隔线
    d.line((x + 22, CARD_Y + RULE_DY, x + CARD_W - 22, CARD_Y + RULE_DY), fill=BORDER, width=1)

    y = CARD_Y + NOTE_TOP_DY
    for text, color in notes:
        d.text((x + 22, y), text, font=tiny_font, fill=color, anchor="lm")
        y += NOTE_LINE_H


# 左：先查再存（对）
code_card(
    LEFT_X, GREEN, GREEN_FILL, "先查再存 · 对",
    [
        [("for i, x in enumerate(nums):", code_small, INK)],
        [("    need = target - x", code_small, INK)],
        [("    if need in seen:", code_small, GREEN)],
        [("        return [seen[need], i]", code_small, GREEN)],
        [
            ("    seen[x] = i", code_font, MUTED),
            ("      # ", code_font, MUTED),
            ("查完才登记", tiny_font, MUTED),
        ],
    ],
    [
        ("查表那一刻，表里只有「左边」的元素", MUTED),
        ("→ 命中的下标必然 < i", GREEN),
        ("→ 「不重复用同一元素」自动成立", GREEN),
    ],
)

# 右：先存再查（错）
code_card(
    RIGHT_X, ORANGE, ORANGE_FILL, "先存再查 · 错",
    [
        [("for i, x in enumerate(nums):", code_small, INK)],
        [
            ("    seen[x] = i", code_font, ORANGE),
            ("      # ", code_font, ORANGE),
            ("先登记", tiny_font, ORANGE),
        ],
        [("    need = target - x", code_small, INK)],
        [("    if need in seen:", code_small, ORANGE)],
        [("        return [seen[need], i]", code_small, ORANGE)],
    ],
    [
        ("当 target == 2 * x 时，need 就是 x 自己", MUTED),
        ("→ 查到的是「自己」，返回 [i, i]", ORANGE),
        ("→ [3, 3] 配 target = 6 会返回 [0, 0]", ORANGE),
        ("   两个下标相同 = 同一个元素用了两次", ORANGE),
    ],
)

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 88, W - 88, H - 88), fill=BORDER, width=2)
note = "变体连考：167 有序数组 → 双指针 O(1) 空间 · 15 三数之和 · 18 四数之和 · 454 四数相加 II"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 54), note, font=note_font, fill=MUTED)

import os
for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-1-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-1-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
