# -*- coding: utf-8 -*-
"""
make_rea_cover.py — REA（Reverse Engineer Anything）技术深挖文的封面。

构图：左右两个面板 + 底部两张卡片（沿用 make_kmp_cover.py 骨架）。
左 = Star 陡增折线：10/4 的 1,373 → 10/11 的 31,255 五个采样点，
     末端金色重点 + 「连续多天霸榜 Trending 第 1」callout。
右 = 一条证据的解剖：JSON 记录卡（normalized_result / evidence_id /
     raw_result / analysis_profile 必填），下接两条台账注解。
下面两张卡片：不是反编译器（三层架构）/ 同族与分工。

红线（SKILL）：中英混排逐段绘制；坐标/宽度 int()；Consolas 不画中文与
符号（≠ · 一律交给中文字体）；几何自检。
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


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
code_mini = font("consola.ttf", 15)
sym_small = font("msyh.ttc", 16)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
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


def dashed(p0, p1, color=ORANGE, dash=7, gap=5, width=2):
    """PIL 没有虚线，按步长手工画。"""
    x0, y0 = p0
    x1, y1 = p1
    total = max(1.0, ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5)
    step = dash + gap
    n = int(total // step) + 1
    for i in range(n):
        t0 = min(1.0, i * step / total)
        t1 = min(1.0, (i * step + dash) / total)
        d.line((x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0,
                x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1), fill=color, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
TITLE = "REA 逆向一切：给 Agent 的逆向证据编排层"
d.text((W / 2, 46), TITLE, font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 86, [("一个 MCP Server + CLI，驱动 ", tiny_font, MUTED),
                  ("Hopper / Ghidra / IDA", code_small, GREEN),
                  ("；结论必附证据，未知项留台账", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(275, 128, [("Star 陡增", card_title, GREEN), ("　Trendshift 日增", tiny_font, MUTED)])
mixed(825, 128, [("一条证据的解剖", card_title, ORANGE), ("　字段与台账", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 336), fill=BORDER, width=2)

LCX, RCX = 275, 825

# ── 左面板：Star 陡增折线 ────────────────────────────────────────────────────
PLOT_X0, PLOT_X1 = 118, 470
PLOT_Y_TOP, PLOT_Y_BOT = 170, 288
DAY0, DAYS = 4, 7            # 10/4 → 10/11，共 7 个间隔
TOP_VALUE = 32000

step_x = (PLOT_X1 - PLOT_X0) / DAYS
axis_x = lambda idx: PLOT_X0 + idx * step_x
axis_y = lambda v: PLOT_Y_BOT - (v / TOP_VALUE) * (PLOT_Y_BOT - PLOT_Y_TOP)

# 刻度与网格
for tick in (0, 16000, 32000):
    ty = axis_y(tick)
    d.line((PLOT_X0, int(ty), PLOT_X1, int(ty)), fill=DASH, width=1)
    label = "0" if tick == 0 else f"{tick // 1000}k"
    right_text(PLOT_X0 - 8, int(ty), label, mini_font, DIM)

d.line((PLOT_X0, PLOT_Y_TOP - 6, PLOT_X0, PLOT_Y_BOT), fill=BORDER, width=2)
d.line((PLOT_X0, PLOT_Y_BOT, PLOT_X1, PLOT_Y_BOT), fill=BORDER, width=2)

# 采样点：10/4 起 1,373 → 10/11 31,255
SAMPLES = [(0, 1373), (3, 5602), (5, 19375), (6, 26572), (7, 31255)]
pts = [(axis_x(idx), axis_y(v)) for idx, v in SAMPLES]
d.line([(int(x), int(y)) for x, y in pts], fill=GREEN, width=3)
for i, (x, y) in enumerate(pts):
    last = i == len(pts) - 1
    r = 6 if last else 4
    d.ellipse((int(x - r), int(y - r), int(x + r), int(y + r)),
              fill=GOLD_FILL if last else WHITE,
              outline=GOLD if last else GREEN, width=3 if last else 2)

# 末端数值与 callout
last_x, last_y = pts[-1]
right_text(PLOT_X1, last_y - 20, "10/11 日增 31,255", mini_font, GOLD)
mixed(PLOT_X0 + 96, 262, [("连续多天霸榜 ", tiny_font, ORANGE),
                          ("Trending", code_small, ORANGE),
                          (" 第 1", tiny_font, ORANGE)], anchor="lm")

# x 轴日期标签（10/10 与 10/11 太近，只标 10/11）
for idx, label in ((0, "10/4"), (3, "10/7"), (5, "10/9"), (7, "10/11")):
    d.text((int(axis_x(idx)), PLOT_Y_BOT + 14), label, font=mini_font,
           fill=MUTED, anchor="mm")

mixed(PLOT_X0 - 26, 326, [("1,373 → 5,602 → 19,375 → 26,572 → 31,255", tiny_font, GREEN),
                          ("（当日新增 Star）", tiny_font, MUTED)], anchor="lm")
mixed(PLOT_X0 - 26, 350, [("10/12 报道 ", tiny_font, MUTED),
                          ("115,000+ Star", code_small, GOLD),
                          ("；10/13 报道 ", tiny_font, MUTED),
                          ("157,682 / 36,485", code_small, GOLD)], anchor="lm")

# ── 右面板：一条证据的解剖 ──────────────────────────────────────────────────
CARD_X0, CARD_X1 = 596, 1050
REC_Y0, REC_Y1 = 160, 300
d.rounded_rectangle((CARD_X0, REC_Y0, CARD_X1, REC_Y1), radius=12,
                    fill=WHITE, outline=ORANGE, width=2)

TXT_X = CARD_X0 + 18
for i, line in enumerate([
    "{",
    '  "normalized_result": { ... },',
    '  "evidence_id": "ev_9f3c1a",',
    '  "raw_result": null,',
    '  "analysis_profile": { ... }',
    "}",
]):
    d.text((TXT_X, 178 + i * 20), line, font=code_mini, fill=INK, anchor="lm")

# 两条字段注解，贴着卡片右内缘
right_text(CARD_X1 - 16, 178 + 3 * 20, "provider 原始报告，与结果分开", mini_font, MUTED)
right_text(CARD_X1 - 16, 178 + 4 * 20, "必填 · 缺失即拒", row_label, GOLD)

mixed(CARD_X0, 326, [("每次调用都落 ", tiny_font, MUTED),
                     ("摘要 + 字节区间 + JSON 指针", tiny_font, GREEN)],
      anchor="lm")
mixed(CARD_X0, 350, [("空调用列表 + 部分覆盖 ", tiny_font, MUTED),
                     ("≠", sym_small, ORANGE),
                     (" 没有调用", tiny_font, MUTED)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), CARD_Y, int(x + CARD_W), CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
           fill=WHITE, anchor="mm")
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "不是反编译器", [
    [("三层：", tiny_font, INK), ("契约层 / 桥接层 / 引擎层", tiny_font, GREEN),
     ("（一个内核两种入口）", tiny_font, MUTED)],
    [("Ghidra：", tiny_font, INK), ("认证本地 socket", tiny_font, GREEN),
     (" → ", tiny_font, GREEN), ("headless", code_small, GREEN)],
    [("Hopper：", tiny_font, INK), ("按需代启动", tiny_font, GREEN),
     ("；JEB 走 ", tiny_font, MUTED), ("REA_JEB_MCP_URL", code_small, ORANGE)],
    [("结论必挂：", tiny_font, INK), ("摘要 · 字节区间 · JSON 指针", tiny_font, GREEN)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "同族与分工", [
    [("GhidraMCP：", tiny_font, INK), ("2025-03", code_small, ORANGE),
     ("（先到一步）", tiny_font, MUTED)],
    [("ida-pro-mcp：", tiny_font, INK), ("2025-03", code_small, ORANGE),
     ("（同赛道）", tiny_font, MUTED)],
    [("Ghidra：", tiny_font, INK), ("Apache", code_small, GREEN),
     (" 免费", tiny_font, GREEN), ("（绕开授权成本）", tiny_font, MUTED)],
    [("IDA / Hopper / JEB：", tiny_font, INK), ("商业授权另算", tiny_font, ORANGE)],
])

FAMILY = ("同族：GhidraMCP · ida-pro-mcp · JADX · Binwalk / Unblob · TShark · "
          "sigrok-cli · Frida · mitmproxy · WABT")
d.text((W / 2, H - 16), FAMILY, font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength(TITLE, font=title_font)
assert tw_title < W - 60, f"标题过宽 {int(tw_title)}"
assert 128 + 12 < PLOT_Y_TOP, "面板标题压住折线图顶端"
assert PLOT_X1 < 520, f"折线图侵入右面板 x={int(PLOT_X1)}"
assert CARD_X0 > 570, f"证据卡侵入左面板 x={CARD_X0}"
assert CARD_X1 < W - 20, f"证据卡越界 {CARD_X1}"
assert PLOT_Y_BOT + 22 < 326 - 10, "x 轴标签压住结论行"
assert REC_Y1 + 10 < 326 - 10, "证据卡压住结论行"
assert 350 + 10 < CARD_Y - 14, "结论行压住卡片徽标"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
family_w = d.textlength(FAMILY, font=tiny_font)
assert family_w < W - 40, f"family 行过宽 {int(family_w)}"
for cy, x0, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {int(wsum)}"
    else:
        assert x0 >= 0 and x0 + wsum < W - 12, f"横排越界 y={cy}: x={x0} w={int(wsum)}"
print("SELF-CHECK OK:", f"title={int(tw_title)} plot={PLOT_X0}-{PLOT_X1} "
                        f"card={CARD_X0}-{CARD_X1} family={int(family_w)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/rea-cover.png", "photos/rea-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
