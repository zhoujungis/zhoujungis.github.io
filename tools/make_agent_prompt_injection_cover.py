# -*- coding: utf-8 -*-
"""
make_agent_prompt_injection_cover.py — 【Agent 提示注入：谁说的话算指令】封面。

左 = 三类输入面：项目文件 / 工具输出 / 记忆块 / MCP 描述，逐条标出位置与信任错配。
右 = 闸门强度：能力与审批是真的，语义层缺信封；下面是「读得到就发得出」的链路。
底部两卡 = 四个缺口 / 三条修法。

红线：中英混排逐段绘制；代码字体段只放 ASCII；坐标取 int；几何自检；双份落盘。
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
big_font = font("msyhbd.ttc", 30)
formula_font = font("msyh.ttc", 18)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
BOUND = W - 20

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
d.text((W / 2, 44), "Agent 提示注入：谁说的话算指令",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 11", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("数据被放进了指令的位置", formula_font, ORANGE),
                  (" · ", tiny_font, DIM), ("位置就是权限", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("三类输入面", card_title, GREEN), ("　位置与信任错配", tiny_font, MUTED)])
mixed(805, 126, [("闸门强度", card_title, ORANGE), ("　只有两道是代码", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：三类输入面 ───────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def layer(y0, code, name, note, accent, fill):
    card(LX0, y0, LX1, y0 + 40, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 20, [(code, code_mid, accent), ("  ", tiny_font, MUTED),
                              (name, card_title, INK)], anchor="lm")
    right_text(LX1 - 18, y0 + 20, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


layer(168, "system", "项目文件", "AGENTS.md · 20k 上限", ORANGE, ORANGE_FILL)
layer(214, "system", "项目上下文", "NANOHERMES.md · 无上限", ORANGE, ORANGE_FILL)
layer(260, "tool", "工具输出", "原样入列 · 无信封", GOLD, GOLD_FILL)
layer(306, "memory", "记忆块", "auto · 下次进 system", GREEN, GREEN_FILL)

mixed(LX0, 360, [("信任等级由位置决定，不由措辞决定", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 388, [("三处都缺一个字段：", tiny_font, MUTED),
                 ("trust", code_tiny, INK)], anchor="lm")

# ── 右面板：闸门强度 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 322, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("三道边界", card_title, ORANGE),
                      ("　按攻击链顺序", tiny_font, MUTED)], anchor="lm")
d.text((int(RX0 + 18), 216), "2 / 3", font=big_font, fill=GREEN, anchor="lm")
mixed(RX0 + 100, 220, [("能挡住的边界数", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 252, [("能力", card_title, GREEN), ("　模式与工具清单", tiny_font, INK)],
      anchor="lm")
right_text(RX1 - 18, 252, "挡得住", tiny_font, GREEN)
mixed(RX0 + 18, 278, [("审批", card_title, GOLD), ("　对话框只在有 TTY 时存在", tiny_font, INK)],
      anchor="lm")
right_text(RX1 - 18, 278, "默认关", tiny_font, ORANGE)
mixed(RX0 + 18, 304, [("语义", card_title, ORANGE), ("　没有来源标记可用", tiny_font, INK)],
      anchor="lm")
right_text(RX1 - 18, 304, "缺", tiny_font, ORANGE)

card(RX0, 334, RX1, 402, ORANGE_FILL, ORANGE, width=2)
mixed(RX0 + 16, 354, [("完整链路", card_title, ORANGE),
                      ("　读得到，就发得出", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 16, 382, [("read_file", code_tiny, INK), (" → ", formula_font, INK),
                      ("web_fetch", code_tiny, INK),
                      ("　两个默认都不问", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, ORANGE, "四个缺口", [
    [("auto_approve", code_small, ORANGE), ("　最严策略被短路", tiny_font, MUTED)],
    [("resolve", code_small, ORANGE), ("　绝对路径直通", tiny_font, MUTED)],
    [("validate", code_small, GOLD), ("　只挡内网不挡外传", tiny_font, MUTED)],
    [("source", code_small, GOLD), ("　网页洗进 system", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, GREEN, "三条修法", [
    [("approval", code_small, GREEN), ("　问在能力上", tiny_font, MUTED)],
    [("envelope", code_small, GREEN), ("　source 与 trust", tiny_font, MUTED)],
    [("egress", code_small, GOLD), ("　出站白名单", tiny_font, MUTED)],
    [("audit", code_small, ORANGE), ("　拒绝也要留痕", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · prompt.rs · sandbox.rs · tools/web.rs · 三道边界只有两道是真的",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 168, "分隔线顶住左卡片"
assert 168 + 40 < 214 - 4 and 214 + 40 < 260 - 4 and 260 + 40 < 306 - 4, "左侧层框重叠"
assert 306 + 40 < 360 - 10, "最后一层压住说明行"
assert 360 + 9 < 388 - 8, "左侧两行说明重叠"
assert 388 + 10 < CARD_Y - 20, "左面板说明压住底部卡片"
assert 160 + 12 < 184 - 9 and 184 + 10 < 216 - 12, "右侧标题与数字重叠"
assert 216 + 18 < 252 - 12, "大数字压住第一行"
assert 252 + 10 < 278 - 8 and 278 + 10 < 304 - 8, "右侧三行重叠"
assert 304 + 9 < 322 - 4, "右侧最后一行越出卡片"
assert 334 - 8 > 322, "右侧两卡重叠"
assert 354 + 9 < 382 - 10, "链路卡标题压住算例"
assert 382 + 8 < 402 - 4, "链路行越出卡片"
assert 402 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-prompt-injection-cover.png")
img.save("photos/agent-prompt-injection-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-prompt-injection-cover.png",
            "photos/agent-prompt-injection-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
