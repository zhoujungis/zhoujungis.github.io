# -*- coding: utf-8 -*-
"""
make_nanodb_cover.py — 【NanoDB：Go 嵌入式文档数据库】封面。

左 = 持久化三件套：replay / gen / rollback。
右 = 事务与查询：Commit 版本校验 + planCandidates + Top-N 实测。
底两卡 = 三种入口 · 适用边界（对比 SQLite / LevelDB / MongoDB）。

红线：中英混排逐段绘制；坐标/宽度 int()；Consolas 不画中文与
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

# Consolas 没有中文字形，也没有全角空格 —— 落进代码字体段就会渲染成方框。
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
d.text((W / 2, 44), "NanoDB：Go 嵌入式文档数据库",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("零依赖 Go", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("snapshot.json + wal.log", code_small, ORANGE),
                  (" · ", tiny_font, DIM), ("34 文件 9,791 行", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("持久化核心", card_title, GREEN), ("　崩溃点逐个堵死", tiny_font, MUTED)])
mixed(805, 126, [("事务与查询", card_title, ORANGE), ("　朴素机制，明确边界", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：持久化三件套 ─────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def lever(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + h / 2, [(code, code_mid, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


lever(168, 40, "replay", "撕裂半行截断，已提交不丢", GREEN, GREEN_FILL)
lever(214, 40, "gen", "代数不符即跳过，窗口期免疫", ORANGE, ORANGE_FILL)
lever(260, 40, "rollback", "写失败截回上一完整记录", GOLD, GOLD_FILL)

mixed(LX0, 326, [("Windows 上不用 ", tiny_font, MUTED), ("O_APPEND", code_small, INK),
                 ("：Truncate 才能用", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 354, [("目录 ", tiny_font, MUTED), ("LOCK", code_small, INK),
                 (" 独占锁：单进程是物理事实", tiny_font, MUTED)], anchor="lm")

# ── 右面板：事务与查询 ───────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 330, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("提交时只做一件事", card_title, ORANGE),
                      ("　版本号校验", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 218, [("Commit ", code_small, ORANGE),
                      ("versions[name] == ver", code_small, INK),
                      ("　全对才提交", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 252, [("集合快照可重复读，冲突返回 ", tiny_font, MUTED),
                      ("ErrConflict", code_small, ORANGE)], anchor="lm")

mixed(RX0 + 18, 288, [("查询规划：", tiny_font, MUTED),
                      ("planCandidates", code_small, INK),
                      (" 挑候选集最小者", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 314, [("Top-50 ", code_small, GREEN), ("6.5 ms", code_small, INK),
                      (" vs 全量 ", tiny_font, MUTED), ("85.3 ms", code_small, ORANGE),
                      ("　13 倍", tiny_font, GOLD)], anchor="lm")

card(RX0, 342, RX1, 402, ORANGE_FILL, ORANGE, width=2)
mixed(RX0 + 16, 362, [("索引家族", card_title, ORANGE),
                      ("　写入时同步维护", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 16, 386, [("unique", code_tiny, INK), (" · ", tiny_font, DIM),
                      ("multikey", code_tiny, INK), (" · ", tiny_font, DIM),
                      ("$text", code_tiny, INK), (" 二元组 · ", tiny_font, MUTED),
                      ("$geo", code_tiny, INK), (" haversine", code_tiny, INK)],
      anchor="lm")

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


bottom_card(LEFT_X, GREEN, "三种入口", [
    [("CLI", code_small, GREEN), ("　一次性命令，stdout 纯 JSON", tiny_font, MUTED)],
    [("shell", code_small, ORANGE), ("　nano(tx)> 提示符 + EOF 回滚", tiny_font, MUTED)],
    [("REST", code_small, GOLD), ("　token 角色 + 集合白名单", tiny_font, MUTED)],
    [("Go", code_small, GREEN), ("　engine.Open 一库嵌入", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "适用边界", [
    [("SQLite", code_small, ORANGE), ("　要 SQL 与磁盘 TB 级时换它", tiny_font, MUTED)],
    [("LevelDB", code_small, GOLD), ("　只要 KV 引擎时换它", tiny_font, MUTED)],
    [("MongoDB", code_small, GREEN), ("　要分布式集群时换它", tiny_font, MUTED)],
    [("NanoDB", code_small, INK), ("　进程内的 JSON 存储", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoDB 0.1.0 · engine/{db,query,index,tx}.go · 快照 + WAL + 乐观事务 + 三类索引",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 168, "分隔线顶住左卡片"
assert 168 + 40 < 214 - 4 and 214 + 40 < 260 - 4 and 260 + 40 < 326 - 9, "左面板杠杆框重叠"
assert 326 + 9 < 354 - 8, "左面板两行说明重叠"
assert 354 + 10 < CARD_Y - 20, "左面板说明压住底部卡片"
assert 160 + 20 < 218 - 10 and 218 + 17 < 252 - 10, "右面板公式行重叠"
assert 252 + 17 < 288 - 10 and 288 + 9 < 314 - 6, "右面板算例行重叠"
assert 314 + 9 < 330 - 4, "右面板最后一行越出公式卡"
assert 342 - 8 > 330, "右侧两卡重叠"
assert 386 + 8 < 402 - 4, "右侧索引行越出卡片"
assert 402 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/nanodb-cover.png")
img.save("photos/nanodb-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/nanodb-cover.png",
            "photos/nanodb-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
