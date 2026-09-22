# -*- coding: utf-8 -*-
"""生成 LC 19 文章封面 frontend/public/photos/lc-19-cover.png。

风格对齐 lc-141-142-cover.png：米色底、左上 ALGORITHM 小标、居中标题、
下方一条链路示意（slow 绿 chip 停在前驱 3 上，待删节点 4 虚线变灰，
3 -> 5 一条跨过 4 的删除弧线）。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
CUT = (179, 69, 46)

TITLE = "删除链表的倒数第 N 个结点"


def font(name, size):
    return ImageFont.truetype(name, size)


MSYH_BD = r"C:\Windows\Fonts\msyhbd.ttc"
MSYH = r"C:\Windows\Fonts\msyh.ttc"
CONSOLA = r"C:\Windows\Fonts\consola.ttf"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# ── 左上小标 + 标题 ──────────────────────────────────────────────────────────
tag_font = font(CONSOLA, 20)
title_font = font(MSYH_BD, 44)

tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 62), tag, font=tag_font, fill=MUTED)
# 小标右侧一条细线
d.line((88 + tw + 18, 62 + 14, 88 + tw + 78, 62 + 14), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 100), TITLE, font=title_font, fill=INK)

# ── 链路示意 ────────────────────────────────────────────────────────────────
nodes = ["dummy", "1", "2", "3", "4", "5"]
NW, NH = 74, 54
GAP = 58
row_w = len(nodes) * NW + (len(nodes) - 1) * GAP
x0 = (W - row_w) / 2
cy = 350
top = cy - NH / 2

green_cut = 3   # slow 停在 3（nodes 下标 3）
gray_idx = 4    # 被删的 4


def node_font(label):
    return font(CONSOLA, 22) if label == "dummy" else font(MSYH_BD, 26)


centers = []
for i, label in enumerate(nodes):
    x = x0 + i * (NW + GAP)
    centers.append((x + NW / 2, cy))
    is_dummy = label == "dummy"
    is_gray = i == gray_idx
    is_green = i == green_cut
    if is_green:
        fill, stroke = (223, 232, 226), GREEN
    elif is_gray:
        fill, stroke = BG, (190, 194, 188)
    elif is_dummy:
        fill, stroke = BG, (170, 175, 168)
    else:
        fill, stroke = (255, 255, 255), BORDER
    r = 12
    d.rounded_rectangle(
        (x, top, x + NW, top + NH), radius=r, fill=fill,
        outline=stroke, width=3 if is_green else 2,
    )
    if is_dummy or is_gray:
        # 虚线框：在描边上打背景色缺口，近似 dashed
        step = 9
        for sx in range(int(x), int(x + NW), step * 2):
            d.line((sx, top, min(sx + step, x + NW), top), fill=BG, width=4)
            d.line((sx, top + NH, min(sx + step, x + NW), top + NH), fill=BG, width=4)
        for sy in range(int(top), int(top + NH), step * 2):
            d.line((x, sy, x, min(sy + step, top + NH)), fill=BG, width=4)
            d.line((x + NW, sy, x + NW, min(sy + step, top + NH)), fill=BG, width=4)
    f = node_font(label)
    d.text((x + NW / 2, cy), label, font=f, fill=MUTED if (is_dummy or is_gray) else INK, anchor="mm")

# 箭头（相邻节点之间）
for i in range(len(nodes) - 1):
    sx = x0 + i * (NW + GAP) + NW
    ex = x0 + (i + 1) * (NW + GAP)
    col = (150, 156, 148) if i + 1 == gray_idx else (120, 128, 122)
    d.line((sx + 4, cy, ex - 8, cy), fill=col, width=2)
    d.polygon([(ex, cy), (ex - 9, cy - 5), (ex - 9, cy + 5)], fill=col)

# 删除弧线：3 -> 5（跨过 4），二次贝塞尔采样成平滑曲线
fx = centers[3][0] + NW / 2
tx = centers[5][0] - NW / 2
lift = 92
ctrl = ((fx + tx) / 2, cy - 2 * lift)
pts = []
for k in range(41):
    t = k / 40
    bx = (1 - t) ** 2 * (fx + 4) + 2 * (1 - t) * t * ctrl[0] + t**2 * tx
    by = (1 - t) ** 2 * cy + 2 * (1 - t) * t * ctrl[1] + t**2 * cy
    pts.append((bx, by))
d.line(pts, fill=CUT, width=3, joint="curve")
# 箭头方向取曲线末端切线
dx = pts[-1][0] - pts[-4][0]
dy = pts[-1][1] - pts[-4][1]
import math
ang = math.atan2(dy, dx)
ah = 11
d.polygon(
    [
        (tx, cy),
        (tx - ah * math.cos(ang - 0.42), cy - ah * math.sin(ang - 0.42)),
        (tx - ah * math.cos(ang + 0.42), cy - ah * math.sin(ang + 0.42)),
    ],
    fill=CUT,
)

# slow chip（绿色，贴在 3 上方）
chip_font = font(CONSOLA, 19)
cw, ch = 64, 30
cx = centers[3][0] - 8
chy = top - 52
d.rounded_rectangle((cx - cw / 2, chy - ch / 2, cx + cw / 2, chy + ch / 2), radius=15, fill=GREEN)
d.text((cx, chy), "slow", font=chip_font, fill=(255, 255, 255), anchor="mm")
d.line((cx, chy + ch / 2, cx, top), fill=GREEN, width=2)

# fast chip（橙色，贴在 3 下方 —— 同步结束时 fast 已出链，示意「先走」的位置感）
fcx = centers[5][0] + 6
fchy = top + NH + 46
d.rounded_rectangle((fcx - cw / 2, fchy - ch / 2, fcx + cw / 2, fchy + ch / 2), radius=15, fill=ORANGE)
d.text((fcx, fchy), "fast", font=chip_font, fill=(255, 255, 255), anchor="mm")
d.text((fcx, fchy + 34), "先走 n+1 步", font=font(MSYH, 17), fill=MUTED, anchor="mm")

# 底部小注
d.text((W / 2, H - 46), "一趟扫描 · 间隔锁死 n+1", font=font(MSYH, 20), fill=MUTED, anchor="mm")

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-19-cover.png"
img.save(out)
print("saved", out)
