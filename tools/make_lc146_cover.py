# -*- coding: utf-8 -*-
"""
make_lc146_cover.py — 【LC 146】LRU 缓存 的封面。

构图：左右两个面板，中间分隔线（沿用既有骨架）。
左 = LRU：H/节点/虚线幽灵 T 的链表淘汰帧 + 哈希表 chips；
右 = LFU 对照：同串操作淘汰 freq 最小者（频率角标 + 淘汰箭头）；
下面两张卡片：骨架 / 追问（线程安全 + LFU）。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
→ 和 = 之外的数学符号（⇒ ⇔）在 msyh 里是豆腐块，一律避免；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (121, 168, 146)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
SENT_FILL = (232, 235, 230)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 16)
code_node = font("consola.ttf", 15)
code_badge = font("consola.ttf", 11)
sub_font = font("msyh.ttc", 12)   # 副标题含中文（「哨兵」「淘汰」），必须用 CJK 字体

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
d.text((W / 2, 44), "LRU 缓存：哈希表 + 双向链表的 O(1) 手写",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("get / put 全 O(1)", tiny_font, MUTED),
                  ("　·　队首 = 最近使用，队尾 = 淘汰对象", tiny_font, MUTED),
                  ("　·　禁库手写", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("LRU", card_title, GREEN), ("　淘汰队尾（最久未使用）", tiny_font, MUTED)])
mixed(810, 122, [("LFU 对照", card_title, ORANGE), ("　淘汰 freq 最小", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 372), fill=BORDER, width=2)

ROW_Y = 190
BOX_H = 46


def chain_box(x, w, main, sub, fill, border, tcol, dashed=False):
    if dashed:
        # PIL 没有虚线圆角矩形：用短线段画个虚线轮廓近似
        step = 9
        for xx in range(int(x), int(x + w), step):
            d.line((xx, ROW_Y, min(xx + 5, x + w), ROW_Y), fill=border, width=2)
            d.line((xx, ROW_Y + BOX_H, min(xx + 5, x + w), ROW_Y + BOX_H), fill=border, width=2)
        for yy in range(int(ROW_Y), int(ROW_Y + BOX_H), step):
            d.line((x, yy, x, min(yy + 5, ROW_Y + BOX_H)), fill=border, width=2)
            d.line((x + w, yy, x + w, min(yy + 5, ROW_Y + BOX_H)), fill=border, width=2)
    else:
        d.rounded_rectangle((int(x), ROW_Y, int(x + w), ROW_Y + BOX_H), radius=9,
                            fill=fill, outline=border, width=2)
    d.text((int(x + w / 2), int(ROW_Y + BOX_H / 2 + (0 if sub else 0))), main,
           font=code_node, fill=tcol, anchor="mm")
    if sub:
        d.text((int(x + w / 2), int(ROW_Y + BOX_H + 12)), sub, font=sub_font, fill=MUTED, anchor="mm")


def arrow(x1, x2, y):
    d.line((int(x1), int(y), int(x2), int(y)), fill=BORDER, width=2)
    d.polygon([(int(x1), int(y)), (int(x1 + 5), int(y - 4)), (int(x1 + 5), int(y + 4))], fill=BORDER)
    d.polygon([(int(x2), int(y)), (int(x2 - 5), int(y - 4)), (int(x2 - 5), int(y + 4))], fill=BORDER)


# ── 左面板：LRU 淘汰帧（3:3 在队首；2:2 虚线圈 = 被淘汰）──
LX = 160
SW, NW, GAP = 44, 64, 26
chain_box(LX, SW, "H", "哨兵", SENT_FILL, BORDER, MUTED)
x = LX + SW + GAP
arrow(LX + SW + 2, x - 2, ROW_Y + BOX_H / 2)

chain_box(x, NW, "3:3", "#3", GREEN_FILL, GREEN, WHITE)
x += NW + GAP
arrow(x - GAP + 2, x - 2, ROW_Y + BOX_H / 2)

chain_box(x, NW, "2:2", "#2 淘汰", WHITE, ORANGE, ORANGE, dashed=True)
x += NW + GAP
arrow(x - GAP + 2, x - 2, ROW_Y + BOX_H / 2)

chain_box(x, SW, "T", "哨兵", SENT_FILL, BORDER, MUTED)

mixed(290, 292, [("哈希表：", row_label, MUTED), ("1 → #1", code_mid, INK), ("　", tiny_font, MUTED),
                 ("（队列里在册的 key = 链表里的节点）", tiny_font, MUTED)])
mixed(290, 330, [("put(3,3) 时淘汰 ", tiny_font, INK), ("(2,2)", code_mid, ORANGE),
                 ("：摘队尾 + 哈希表双删", tiny_font, MUTED)])

# ── 右面板：LFU 淘汰帧（同串操作，淘汰 freq 最小的 1:1）──
d.line((636, ROW_Y + BOX_H / 2, 700, ROW_Y + BOX_H / 2), fill=ORANGE, width=2)
d.polygon([(706, ROW_Y + BOX_H / 2), (696, ROW_Y + BOX_H / 2 - 5), (696, ROW_Y + BOX_H / 2 + 5)], fill=ORANGE)
d.text((636, ROW_Y - 16), "淘汰优先 →", font=card_title, fill=ORANGE, anchor="lm")

RX = 716
chain_box(RX, NW, "1:1", "freq 2", WHITE, ORANGE, ORANGE, dashed=True)
x = RX + NW + GAP
arrow(x - GAP + 2, x - 2, ROW_Y + BOX_H / 2)
chain_box(x, NW, "2:2", "freq 3", GOLD_FILL, GOLD, GOLD)

# freq 角标（示意画在盒子右上，直接写在副标题里了；再点一个小圆强调）
d.ellipse((int(RX + NW - 18), int(ROW_Y - 6), int(RX + NW - 2), int(ROW_Y + 10)), fill=WHITE, outline=ORANGE, width=2)
d.text((int(RX + NW - 10), int(ROW_Y + 2)), "2", font=code_badge, fill=ORANGE, anchor="mm")
d.ellipse((int(x + NW - 18), int(ROW_Y - 6), int(x + NW - 2), int(ROW_Y + 10)), fill=GOLD_FILL, outline=GOLD, width=2)
d.text((int(x + NW - 10), int(ROW_Y + 2)), "3", font=code_badge, fill=GOLD, anchor="mm")

mixed(810, 292, [("同串操作对照：LRU 淘 ", tiny_font, INK), ("2", code_mid, GREEN),
                 ("，LFU 淘 ", tiny_font, INK), ("1", code_mid, ORANGE)])
mixed(810, 330, [("LFU 的 get 会涨 freq → 淘汰优先级完全不同", tiny_font, MUTED)])

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
    [("哈希表 key → 节点　+　双向链表（哨兵 H / T）", tiny_font, INK)],
    [("三个动作：", tiny_font, INK), ("addToFront / unlink / moveToFront", code_small, GREEN)],
    [("put 三情形：改值并移前 / 直接插 / 先淘再插", tiny_font, INK)],
    [("O(1)", code_small, GREEN), (" 时间；", tiny_font, MUTED), ("O(capacity)", code_small, GREEN), (" 空间；禁库手写", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "追问", [
    [("线程安全：get 也写链表 → 锁 / 分段 / 近似", tiny_font, ORANGE)],
    [("LFU（460）：频率桶 + minFreq；同串操作淘汰不同 key", tiny_font, ORANGE)],
    [("近似算法：CLOCK / W-TinyLFU（Caffeine）", tiny_font, ORANGE)],
    [("同族：460 / 432 / 707 / 2296 / 面试 16.25", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 460 LFU 缓存 · LC 432 全 O(1) 数据结构 · LC 707 设计链表 · LC 2296 设计文本编辑器 · 面试题 16.25 LRU 缓存",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength("LRU 缓存：哈希表 + 双向链表的 O(1) 手写", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert LX + SW + GAP + NW + GAP + NW + GAP + SW < 540, "左侧链表越界"
assert 716 + NW + GAP + NW < 1060, "右侧链表越界"
assert ROW_Y - 20 > 132, "链表压住面板标题"
assert ROW_Y + BOX_H + 60 < CARD_Y - 14, "链表与卡片重叠"
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
for out in ("frontend/public/photos/lc-146-cover.png", "photos/lc-146-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
