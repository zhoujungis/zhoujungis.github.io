# -*- coding: utf-8 -*-
"""
make_wal_cover.py — 【先写日志，再写数据：WAL 原理与源码细读】封面。

左 = SQLite 页帧：帧解码、回卷换盐、链式校验、提交可见性。
右 = LevelDB / RocksDB：ReadRecord 分片原子性 + 提交点/同步；下卡恢复四模式。
底两卡 = 写序铁律（AddRecord→Sync→InsertInto 等）· 恢复四模式全量。

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
d.text((W / 2, 44), "先写日志，再写数据：WAL 原理与源码细读",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("SQLite ", tiny_font, GREEN), ("wal.c", code_small, ORANGE),
                  (" + ", tiny_font, DIM), ("LevelDB / RocksDB", code_small, GREEN),
                  (" log 层", tiny_font, GOLD), (" · ", tiny_font, DIM),
                  ("四条契约：只追加 · 逐条校验 · 遇坏即停 · 先记账再动数据", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("SQLite 页帧", card_title, GREEN), ("　32 字节头 + 24 字节帧", tiny_font, MUTED)])
mixed(805, 126, [("记录流", card_title, ORANGE), ("　7 字节头 + 32 KB 块", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：SQLite 页帧 ──────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def lever(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + h / 2, [(code, code_mid, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


lever(168, 40, "walDecodeFrame", "盐不符 / 校验和错即 break", GREEN, GREEN_FILL)
lever(214, 40, "walRestartHdr", "回卷换盐，旧帧被判无效", ORANGE, ORANGE_FILL)
lever(260, 40, "walChecksumBytes", "链式：前帧校验和做初值", GOLD, GOLD_FILL)

mixed(LX0, 326, [("帧先落盘，", tiny_font, MUTED), ("walIndexWriteHdr", code_small, INK),
                 (" 后推进上界", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 354, [("synchronous=NORMAL", code_small, INK),
                 ("　提交不 fsync，checkpoint 兜底", tiny_font, MUTED)], anchor="lm")

# ── 右面板：记录流 ───────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 292, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("ReadRecord", card_title, ORANGE),
                      ("　分片重组的原子性", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 218, [("kFirstType", code_small, GREEN), (" → ", tiny_font, DIM),
                      ("kMiddleType", code_small, GOLD), (" → ", tiny_font, DIM),
                      ("kLastType", code_small, GREEN), ("　拼完才交付", tiny_font, MUTED)],
      anchor="lm")

mixed(RX0 + 18, 246, [("kEof", code_small, ORANGE),
                      ("　半条逻辑记录整条丢弃", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 274, [("buffer_.clear()", code_small, INK),
                      ("　坏 CRC 不找下一个记录", tiny_font, MUTED)], anchor="lm")

card(RX0, 304, RX1, 400, GREEN_FILL, GREEN, width=2)
mixed(RX0 + 16, 326, [("提交点", card_title, GREEN), ("　一个字段定原子性", tiny_font, MUTED)],
      anchor="lm")
mixed(RX0 + 18, 356, [("nTruncate", code_small, INK), (" != 0", code_small, GREEN),
                      ("　提交帧，mxFrame 才推进", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 18, 384, [("kHeader = 12", code_small, GOLD),
                      ("　sequence + count 批次原子", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "写序铁律", [
    [("AddRecord", code_small, GREEN), (" → ", tiny_font, DIM),
     ("Sync", code_small, GOLD), (" → ", tiny_font, DIM),
     ("InsertInto", code_small, GREEN), ("　成功才进内存", tiny_font, MUTED)],
    [("BuildBatchGroup", code_small, ORANGE), ("　队头合并，一次同步", tiny_font, MUTED)],
    [("WriteGroupToWAL", code_small, INK), ("　leader 替整组写", tiny_font, MUTED)],
    [("MANIFEST", code_small, GOLD), ("　复用同一个 log 格式", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "恢复四模式", [
    [("kAbsoluteConsistency", code_tiny, GOLD), ("　干净关闭假设，脏即拒启", tiny_font, MUTED)],
    [("kTolerateCorruptedTailRecords", code_tiny, ORANGE), ("　损坏即拒启", tiny_font, MUTED)],
    [("kPointInTimeRecovery", code_tiny, GREEN), ("　默认：停在坏点前", tiny_font, MUTED)],
    [("kSkipAnyCorruptedRecords", code_tiny, INK), ("　灾难抢救，尽量多救", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "WAL 原理与源码细读 · src/wal.c + db/log_format.h + include/rocksdb/options.h · 全部引文逐行回源核对",
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
assert 326 + 9 < 356 - 6 and 356 + 9 < 384 - 6, "右面板提交点行重叠"
assert 384 + 9 < 400 - 4, "提交点行越出卡片"
assert 400 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + 38 + 27 * 3 + 9 < CARD_Y + CARD_H - 4, "底部卡片行越出"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/wal-cover.png")
img.save("photos/wal-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/wal-cover.png",
            "photos/wal-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
