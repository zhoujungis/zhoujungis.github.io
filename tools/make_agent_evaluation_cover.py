# -*- coding: utf-8 -*-
"""
make_agent_evaluation_cover.py — 【Agent 评测：只跑一次的测试不算数】封面。

左 = 四层断言：字节 / 过程 / 结果 / 成本。
右 = 统计口径：十次全过的下界、二十步的复合成功率、零失败上界。
底部两卡 = 七个缺口 / 三条黄金断言。

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
big_font = font("msyhbd.ttc", 32)
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
d.text((W / 2, 44), "Agent 评测：只跑一次的测试不算数",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 10", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("一次通过只是抽样", formula_font, ORANGE),
                  (" · ", tiny_font, DIM), ("通过率需要分母", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("四层断言", card_title, GREEN), ("　从字节到成本", tiny_font, MUTED)])
mixed(805, 126, [("统计口径", card_title, ORANGE), ("　没有分母不算通过率", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：四层断言 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def layer(y0, code, name, note, accent, fill):
    card(LX0, y0, LX1, y0 + 40, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 20, [(code, code_mid, accent), ("  ", tiny_font, MUTED),
                              (name, card_title, INK)], anchor="lm")
    right_text(LX1 - 18, y0 + 20, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


layer(168, "L1", "字节层", "prefix_hash · requests", GREEN, GREEN_FILL)
layer(214, "L2", "过程层", "tool_seq · approval", ORANGE, ORANGE_FILL)
layer(260, "L3", "结果层", "files · answer", GOLD, GOLD_FILL)
layer(306, "L4", "成本层", "turns · bytes", GREEN, GREEN_FILL)

mixed(LX0, 360, [("越往下越稳定，越往上越接近用户", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 388, [("只写 L3 的测试，只能判定，不能", tiny_font, MUTED),
                 ("定位", tiny_font, INK)], anchor="lm")

# ── 右面板：统计口径 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 330, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("跑十次全过", card_title, ORANGE),
                      ("　真实通过率的下界", tiny_font, MUTED)], anchor="lm")
d.text((int(RX0 + 18), 216), "72.2%", font=big_font, fill=GREEN, anchor="lm")
mixed(RX0 + 130, 220, [("十次只是下界，二十次 83.9%，五十次 92.9%", tiny_font, MUTED)],
      anchor="lm")

mixed(RX0 + 18, 252, [("20 步 × 0.95 = 0.358", formula_font, INK),
                      ("　单步的差距在任务层是几倍", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 18, 280, [("零失败 n 次", tiny_font, MUTED),
                      (" → ", formula_font, INK),
                      ("失败率上界 3/n", tiny_font, ORANGE)], anchor="lm")
mixed(RX0 + 18, 306, [("n = 10", code_tiny, INK), (" → ", formula_font, INK),
                      ("26%", code_tiny, INK), ("　", formula_font, INK),
                      ("n = 60", code_tiny, INK), (" → ", formula_font, INK),
                      ("4.9%", code_tiny, INK)], anchor="lm")

card(RX0, 342, RX1, 402, ORANGE_FILL, ORANGE, width=2)
mixed(RX0 + 16, 362, [("e2e 的盲区", card_title, ORANGE),
                      ("　请求读出来就丢掉", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 16, 386, [("read_full_request", code_tiny, INK),
                      (" 的返回值没有被任何断言使用", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "七个缺口", [
    [("requests", code_small, ORANGE), ("　请求读出来就丢掉", tiny_font, MUTED)],
    [("cfg_for", code_small, ORANGE), ("　记忆与文档被关掉", tiny_font, MUTED)],
    [("auto_approve", code_small, GOLD), ("　审批路径被短路", tiny_font, MUTED)],
    [("Ok", code_small, GREEN), ("　轮次耗尽也返回成功", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "三条断言", [
    [("requests", code_small, ORANGE), ("　恰好两次请求", tiny_font, MUTED)],
    [("tools", code_small, GOLD), ("　清单排序且稳定", tiny_font, MUTED)],
    [("prefix", code_small, GREEN), ("　跨轮哈希一致", tiny_font, MUTED)],
    [("outcome", code_small, GREEN), ("　完成要单独判", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/tests/e2e_mock_llm.rs · 293 个用例的体检",
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
assert 216 + 18 < 252 - 12, "大数字压住算例行"
assert 252 + 10 < 280 - 9 and 280 + 10 < 306 - 8, "右侧统计行重叠"
assert 306 + 8 < 330 - 4, "右侧最后一行越出公式卡"
assert 342 - 8 > 330, "右侧两卡重叠"
assert 386 + 8 < 402 - 4, "右侧盲区行越出卡片"
assert 402 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-evaluation-cover.png")
img.save("photos/agent-evaluation-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-evaluation-cover.png",
            "photos/agent-evaluation-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
