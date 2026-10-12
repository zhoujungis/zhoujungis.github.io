# -*- coding: utf-8 -*-
"""
make_lc207_cover.py — 【LC 207】课程表 的封面。

构图：左右两个面板，中间分隔线（沿用 lc139/lc322/lc1262/lc200/lc994 骨架）。
左 = Kahn：正修到一半的图（0 修完描绿、1/2 在队列描金、3 还在等，角标 = 入度）
      + 队列 / 顺序两行 chip；
右 = DFS 三色：同一张图三色同框（黑 = 安全 / 灰 = 递归栈里 / 白 = 没访问）
      + 递归栈 / 后序两行 chip；
下面两张卡片：骨架 / 易错点与同族。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（·、⇔ 等符号也交给中文字体）；几何自检。
"""

import math
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
GRAY_FILL = (152, 162, 154)
WATER = (238, 242, 238)
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
code_node = font("consola.ttf", 16)
code_badge = font("consola.ttf", 12)
code_chip = font("consola.ttf", 13)

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
d.text((W / 2, 44), "课程表：Kahn 的入度表，和 DFS 的三色标记",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("prerequisites 的 ", tiny_font, MUTED), ("[a, b]", code_small, INK),
                  (" 是边 ", tiny_font, MUTED), ("b → a", code_small, INK),
                  ("（先修 → 后修）；能修完 ", tiny_font, MUTED), ("= 无环", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("Kahn", card_title, GREEN), ("　入度表 + 队列", tiny_font, MUTED)])
mixed(810, 122, [("DFS 三色", card_title, ORANGE), ("　白 / 灰 / 黑", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 380), fill=BORDER, width=2)

NODE_R = 22
PANEL_CY = 215
OFFSETS = [(0, 0), (105, -48), (105, 48), (210, 0)]
EDGES = [(0, 1), (0, 2), (1, 3), (2, 3)]


def panel_positions(cx):
    return [(cx - 105 + dx, PANEL_CY + dy) for dx, dy in OFFSETS]


def draw_edge(p1, p2, color, width=2):
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    length = math.hypot(dx, dy) or 1
    ux, uy = dx / length, dy / length
    x1, y1 = p1[0] + ux * NODE_R, p1[1] + uy * NODE_R
    x2, y2 = p2[0] - ux * (NODE_R + 2), p2[1] - uy * (NODE_R + 2)
    d.line((int(x1), int(y1), int(x2), int(y2)), fill=color, width=width)
    # 箭头三角
    ax, ay = x2, y2
    bx, by = x2 - ux * 10, y2 - uy * 10
    px, py = -uy, ux
    d.polygon(
        [
            (int(ax), int(ay)),
            (int(bx + px * 5), int(by + py * 5)),
            (int(bx - px * 5), int(by - py * 5)),
        ],
        fill=color,
    )


def draw_chip(x, y, text, fill, border, color, w=32, h=24):
    d.rounded_rectangle((int(x), int(y), int(x + w), int(y + h)), radius=6,
                        fill=fill, outline=border, width=2)
    d.text((int(x + w / 2), int(y + h / 2)), text, font=code_chip, fill=color, anchor="mm")
    return w


# ── 左面板：Kahn（修完 0 之后） ─────────────────────────────────────────────
L_POS = panel_positions(290)
# 边状态：0→1、0→2 高亮（正在松弛）
for a, b in EDGES:
    hot = a == 0
    draw_edge(L_POS[a], L_POS[b], GOLD if hot else BORDER, 3 if hot else 2)

# 节点：0 绿（done）、1/2 金框米底（queued）、3 白底等（入度 2 已降到 1？→ 此帧即 pop 后）
# 选帧：pop(0) 之后 → 1/2 入度 0（入队），3 入度 2→1
NODE_STYLE = {
    0: (GREEN_FILL, GREEN, WHITE, "0"),
    1: (GOLD_FILL, GOLD, GOLD, "0"),
    2: (GOLD_FILL, GOLD, GOLD, "0"),
    3: (WHITE, BORDER, INK, "1"),
}
for v, (x, y) in enumerate(L_POS):
    fill, outline, tcol, badge = NODE_STYLE[v]
    d.ellipse((int(x - NODE_R), int(y - NODE_R), int(x + NODE_R), int(y + NODE_R)),
              fill=fill, outline=outline, width=3)
    d.text((int(x), int(y)), str(v), font=code_node, fill=tcol, anchor="mm")
    # 入度角标
    bx, by = x + 18, y - 18
    bfill = GOLD_FILL if badge == "0" else WHITE
    bcol = GREEN if badge == "0" else GOLD
    d.ellipse((int(bx - 10), int(by - 10), int(bx + 10), int(by + 10)),
              fill=bfill, outline=bcol, width=2)
    d.text((int(bx), int(by)), badge, font=code_badge, fill=bcol if badge == "0" else INK, anchor="mm")

mixed(290, 316, [("队列 queue", row_label, MUTED)], anchor="mm")
cx0 = 290 - 62
for i, v in enumerate([1, 2]):
    draw_chip(cx0 + i * 38, 330, str(v), GOLD_FILL if i == 0 else WHITE, GOLD if i == 0 else BORDER,
              GOLD if i == 0 else INK)
mixed(290, 368, [("order = [", tiny_font, MUTED), ("0", code_mid, GREEN), ("]（出队数 == 4 即无环）", tiny_font, MUTED)])

# ── 右面板：DFS（3、1 已变黑，0 在栈里，2 还没访问） ────────────────────────
R_POS = panel_positions(810)
for a, b in EDGES:
    draw_edge(R_POS[a], R_POS[b], BORDER, 2)

DFS_STYLE = {
    0: (GRAY_FILL, MUTED, WHITE),
    1: (INK, INK, WHITE),
    2: (WHITE, BORDER, INK),
    3: (INK, INK, WHITE),
}
for v, (x, y) in enumerate(R_POS):
    fill, outline, tcol = DFS_STYLE[v]
    d.ellipse((int(x - NODE_R), int(y - NODE_R), int(x + NODE_R), int(y + NODE_R)),
              fill=fill, outline=outline, width=3)
    d.text((int(x), int(y)), str(v), font=code_node, fill=tcol, anchor="mm")

mixed(810, 316, [("递归栈 stack", row_label, MUTED)], anchor="mm")
draw_chip(810 - 19, 330, "0", GRAY_FILL, MUTED, WHITE)
mixed(810, 368, [("后序 post = [3, 1]", tiny_font, MUTED), ("　反转 = 拓扑序", tiny_font, GOLD)])

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
    [("[a, b]", code_small, GREEN), (" 读作边 ", tiny_font, INK), ("b → a", code_small, GREEN), ("（先修 → 后修）", tiny_font, MUTED)],
    [("Kahn：0 入度入队，出队数 == n 即无环", tiny_font, INK)],
    [("DFS：白 / 灰 / 黑三色，灰色回边 = 环", tiny_font, INK)],
    [("O(V + E)", code_small, GREEN), ("　时间与空间；后序反转 = 拓扑序", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "易错点（追问）", [
    [("方向画反 → 顺序整个反过来", tiny_font, ORANGE)],
    [("判环用「队列空」（应为出队数 == n）", tiny_font, ORANGE)],
    [("DFS 只用一个 visited（必须分灰 / 黑）", tiny_font, ORANGE)],
    [("同族：210 / 269 / 310 / 802 / 1203 / 444", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 210 课程表 II · LC 269 火星词典 · LC 310 最小高度树 · LC 802 找到最终安全状态 · LC 1203 项目管理 · LC 444 序列重建",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength("课程表：Kahn 的入度表，和 DFS 的三色标记", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
for cx in (290, 810):
    xs = [x for x, _ in panel_positions(cx)]
    assert min(xs) - NODE_R - 20 > 40, "图左越界"
    assert max(xs) + NODE_R + 20 < (540 if cx == 290 else 1060), "图右越界"
    assert PANEL_CY - 48 - 28 > 132, "图顶（含入度角标）压住面板标题"
    assert 368 + 12 < CARD_Y - 14, "结论行压住卡片"
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
for out in ("frontend/public/photos/lc-207-cover.png", "photos/lc-207-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
