# -*- coding: utf-8 -*-
"""
make_btree_cover.py — 【B+ 树索引回源：页分裂长什么样】封面。

左 = SQLite balance_nonroot：中点选页、重排阈值、freelist 取页。
右 = InnoDB 八步手术单：split_rec、对半挂父、只许成功预留、整场重来；下卡两条长高路线。
底两卡 = 分裂触发与配平（hint_page_no 方向暗示、memo_release）· 只许成功的三层。

红线：中英混排逐段绘制；坐标/宽度 int()；Consolas 不画中文、箭头与
U+3000 全角空格（assert_ascii 生成期拦截）；几何自检；双份落盘。
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


title_font = font("msyhbd.ttc", 28)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
code_tiny = font("consola.ttf", 14)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
BOUND = W - 20

# Consolas 没有中文字形，也没有全角空格与箭头 —— 落进代码字体段会渲染成方框。
CODE_FONTS = (code_small, code_mid, code_tiny)


def assert_ascii(parts):
    for text, f, _ in parts:
        if f in CODE_FONTS:
            bad = [c for c in text if ord(c) > 127]
            assert not bad, f"代码字体段含非 ASCII 字符 {bad}：{text!r}"


def mixed(cx, cy, parts, anchor="mm"):
    assert_ascii(parts)
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    assert x >= 0 and x + total <= BOUND, f"文字越界: y={int(cy)} right={int(x + total)} bound={BOUND}"
    checks.append((int(cy), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def right_text(x_right, y, text, f, color):
    assert_ascii([(text, f, color)])
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
TITLE_TEXT = "B+ 树索引回源：页分裂长什么样"
title_w = d.textlength(TITLE_TEXT, font=title_font)
assert title_w <= W - 60, f"标题过宽: {int(title_w)}"
d.text((W / 2, 44), TITLE_TEXT, font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("SQLite ", tiny_font, GREEN), ("src/btree.c", code_small, ORANGE),
                  (" + ", tiny_font, DIM), ("InnoDB ", tiny_font, GREEN),
                  ("btr0btr.cc", code_small, ORANGE), (" · ", tiny_font, DIM),
                  ("分裂 = 选点 → 申请 → 改父 → 搬运 → 递归", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("SQLite 配平", card_title, GREEN), ("　balance_nonroot · NB = 3", tiny_font, MUTED)])
mixed(805, 126, [("InnoDB 手术单", card_title, ORANGE), ("　八步，可能整场重来", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：SQLite balance_nonroot ───────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def lever(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + h / 2, [(code, code_mid, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


lever(168, 40, "page_get_middle_rec", "按条数取中点", GREEN, GREEN_FILL)
lever(214, 40, "balance_nonroot", "装箱配平，新页最多 5", ORANGE, ORANGE_FILL)
lever(260, 40, "allocateBtreePage", "freelist 取页", GOLD, GOLD_FILL)

mixed(LX0, 326, [("nFree*3 <= usableSize*2", code_small, INK),
                 ("　超阈值才重排", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 354, [("split_rec", code_small, ORANGE), (" → ", tiny_font, DIM),
                 ("divider cell", code_small, GREEN), (" → ", tiny_font, DIM),
                 ("parent", code_small, GOLD), ("　递归向上传", tiny_font, MUTED)],
      anchor="lm")

# ── 右面板：InnoDB 八步手术单 ───────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 292, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("btr_page_split_and_insert", card_title, ORANGE),
                      ("　八步手术单", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 218, [("btr_attach_half_pages", code_small, GREEN),
                      ("　对半挂到父层", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 246, [("fsp_reserve_free_extents", code_small, GOLD),
                      ("　只许成功不许回滚", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 274, [("n_iterations", code_small, INK), (" → ", tiny_font, DIM),
                      ("goto func_start", code_small, GREEN),
                      ("　失败整场重来", tiny_font, MUTED)], anchor="lm")

card(RX0, 304, RX1, 400, GREEN_FILL, GREEN, width=2)
mixed(RX0 + 16, 326, [("长高两条路线", card_title, GREEN),
                      ("　根页是唯一的例外", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 18, 356, [("balance_deeper", code_small, INK),
                      ("　根原地变内部页", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 18, 384, [("btr_root_raise_and_insert", code_small, GOLD),
                      ("　先搬家再分裂", tiny_font, MUTED)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 420
CARD_H = 160
CARD_W = 470
GAPX_CARD = 40
LEFT_X = (W - CARD_W * 2 - GAPX_CARD) / 2


def bottom_card(x, accent, badge, lines):
    global BOUND
    card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
           fill=WHITE, anchor="mm")
    BOUND = x + CARD_W - 14
    yy = CARD_Y + 38
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 27


bottom_card(LEFT_X, GREEN, "分裂触发与配平", [
    [("page_move_rec_list_start", code_tiny, GREEN), ("　剪断重接搬一半", tiny_font, MUTED)],
    [("NB = 3", code_small, ORANGE), ("　装箱配平，新页最多 5", tiny_font, MUTED)],
    [("hint_page_no = page_no + 1", code_small, GOLD), ("　顺序写的方向暗示", tiny_font, MUTED)],
    [("memo_release", code_small, INK), ("　树锁提前释放", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "只许成功的三层", [
    [("fsp_reserve_free_extents", code_tiny, GREEN), ("　前置预留", tiny_font, MUTED)],
    [("point of no return", code_small, ORANGE), ("　门内不再回头", tiny_font, MUTED)],
    [("DB_OUT_OF_FILE_SPACE", code_small, GOLD), ("　唯一错误出口", tiny_font, MUTED)],
    [("freelist trunk", code_small, INK), ("　删表的页变成新页", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "B+ 树页分裂回源 · src/btree.c + btr0btr.cc + btr0cur.cc · 全部引文逐行回源核对",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 168, "分隔线顶住左卡片"
assert 168 + 40 < 214 - 4 and 214 + 40 < 260 - 4 and 260 + 40 < 326 - 9, "左面板杠杆框重叠"
assert 326 + 9 < 354 - 8, "左面板两行说明重叠"
assert 354 + 10 < CARD_Y - 20, "左面板说明压住底部卡片"
assert 160 + 12 < 184 - 9 and 184 + 9 < 218 - 10, "右面板卡标题重叠"
assert 218 + 9 < 246 - 10 and 246 + 9 < 274 - 10, "右面板卡行重叠"
assert 274 + 9 < 292 - 4, "右面板最后一行越出卡片"
assert 304 - 292 >= 10, "右侧两卡重叠"
assert 326 + 9 < 356 - 6 and 356 + 9 < 384 - 6, "右面板长高行重叠"
assert 384 + 9 < 400 - 4, "长高行越出卡片"
assert 400 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + 38 + 27 * 3 + 9 < CARD_Y + CARD_H - 4, "底部卡片行越出"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/btree-cover.png")
img.save("photos/btree-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/btree-cover.png",
            "photos/btree-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
