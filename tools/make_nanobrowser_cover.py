# -*- coding: utf-8 -*-
"""
make_nanobrowser_cover.py — 【NanoBrowser 拆解】的封面。

构图：沿用站点封面骨架（左右两面板 + 中间分隔线 + 底部两卡）。
左 = 两个二进制卡片（nanobrowser.exe 4.52 MB / nanoagent.exe 4.24 MB）+ 共用内核说明。
右 = 窗口拓扑示意：shell 一条通栏，下面 tab-<id> 与 devtools 并排 + z-order 坑提示。
下面两张卡片：三个反常识决定 / 关键机制。

红线（站点 SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与符号（→ · 「」 交给中文字体）；几何自检；双份落盘。
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
DASH = (216, 221, 214)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 29)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
sym_small = font("msyh.ttc", 16)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    """逐段绘制：中文/符号与等宽代码各自用自己的字体。"""
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    checks.append((int(cy), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def right_text(x_right, y, text, f, color):
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "NanoBrowser：4.5 MB 的 Tauri + WebView2 浏览器",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("不造引擎", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("永不开调试端口", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("硬依赖手写", tiny_font, GOLD),
                  ("　——　一个窗口里塞进 N+1 个兄弟 HWND", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 128, [("两个二进制", card_title, GREEN), ("　一个内核", tiny_font, MUTED)])
mixed(805, 128, [("窗口拓扑", card_title, ORANGE), ("　3 类兄弟 HWND", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 146, 550, 334), fill=BORDER, width=2)

# ── 左面板：两个二进制卡片 ────────────────────────────────────────────────────
LX0, LX1 = 76, 528


def binary_card(y0, name, size_text, accent):
    h = 52
    card(LX0, y0, LX1, y0 + h, WHITE, accent, width=2)
    d.text((int(LX0 + 20), int(y0 + h / 2)), name, font=code_small,
           fill=INK, anchor="lm")
    right_text(LX1 - 20, y0 + h / 2, size_text, card_title, accent)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


binary_card(160, "nanobrowser.exe", "4.52 MB", GREEN)
binary_card(224, "nanoagent.exe", "4.24 MB", ORANGE)

mixed(LX0, 298, [("两者共用 ", tiny_font, MUTED),
                 ("cdp.rs", code_small, GOLD),
                 (" 进程内桥", tiny_font, MUTED),
                 ("（lib crate）", tiny_font, DIM)], anchor="lm")
mixed(LX0, 322, [("release profile：", tiny_font, MUTED),
                 ("opt-level=s · lto · strip · panic=abort", code_small, GREEN)],
      anchor="lm")

# ── 右面板：窗口拓扑 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
MIDX = 805
GAPX = 12

card(RX0, 158, RX1, 200, GREEN_FILL, GREEN, width=2)
mixed((RX0 + RX1) / 2, 179, [("shell webview", code_small, GREEN),
                             ("　label \"shell\"", tiny_font, MUTED)])

mixed(RX0, 214, [("顶栏 = 标签条 ", tiny_font, MUTED), ("40", code_small, INK),
                 (" + 工具栏 ", tiny_font, MUTED), ("44", code_small, INK),
                 (" + 书签栏 ", tiny_font, MUTED), ("28", code_small, INK),
                 ("　→　", tiny_font, DIM),
                 ("shell_h = 84 / 112", code_small, GREEN)], anchor="lm")

card(RX0, 236, MIDX - GAPX, 300, WHITE, ORANGE, width=2)
mixed((RX0 + MIDX - GAPX) / 2, 258, [("tab-<id>", code_small, ORANGE)])
mixed((RX0 + MIDX - GAPX) / 2, 280, [("每个标签一个", tiny_font, MUTED),
                                     ("　仅当前可见", tiny_font, DIM)])

card(MIDX + GAPX, 236, RX1, 300, WHITE, ORANGE, width=2)
mixed((MIDX + GAPX + RX1) / 2, 258, [("devtools", code_small, ORANGE)])
mixed((MIDX + GAPX + RX1) / 2, 280, [("停靠面板", tiny_font, MUTED),
                                     ("　底/右", tiny_font, DIM)])

mixed(RX0, 318, [("页面 webview 后创建 ", tiny_font, MUTED),
                 ("→", tiny_font, ORANGE),
                 (" 压在 shell 之上（z-order 坑）", tiny_font, MUTED)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX_CARD = 40
LEFT_X = (W - CARD_W * 2 - GAPX_CARD) / 2


def bottom_card(x, accent, badge, lines):
    card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
           fill=WHITE, anchor="mm")
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "三个反常识决定", [
    [("不造引擎　", tiny_font, INK), ("复用系统 WebView2", tiny_font, MUTED)],
    [("不开调试端口　", tiny_font, INK), ("进程内 ", tiny_font, MUTED),
     ("CallDevToolsProtocolMethod", code_small, GREEN)],
    [("硬依赖手写　", tiny_font, INK), ("SHA-1 握手 + WS 帧编解码", tiny_font, MUTED)],
    [("代价　", tiny_font, INK), ("Windows only（WebView2 COM）", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "关键机制", [
    [("CDP 内核　", tiny_font, INK), ("无 id 信封 · 按序号关联", tiny_font, MUTED)],
    [("回调在 UI 线程　", tiny_font, INK), ("worker 在 Condvar 上等", tiny_font, MUTED)],
    [("停靠 DevTools　", tiny_font, INK), ("官方前端 + loopback WS 桥", tiny_font, MUTED)],
    [("nanoagent　", tiny_font, INK), ("可信输入 + MCP 九个工具", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "仓库 zhoujungis/NanoBrowser · Tauri 2.12.4 · wry 0.57.0 · WebView2 · Rust 2021 · 前端零框架",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 15 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 128 - 12, "副标题压住面板标题"
assert 146 < 160, "分隔线顶住左卡片"
assert 224 + 52 < 298 - 9, "左卡片压住说明行"
assert 322 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 318 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert RX1 - RX0 == CARD_W, "右面板宽度与卡片不一致（视觉不齐）"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"

img.save("frontend/public/photos/nanobrowser-cover.png")
img.save("photos/nanobrowser-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/nanobrowser-cover.png", "photos/nanobrowser-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
