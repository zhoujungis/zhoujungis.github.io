# -*- coding: utf-8 -*-
"""Generate the three MySQL index deep-dive covers.

Run from repo root:
    backend/venv/Scripts/python.exe tools/make_mysql_index_covers.py

Writes each PNG twice: frontend/public/photos/ and photos/.
Consolas-only segments are asserted to be pure ASCII at generation time.
"""

import os
from pathlib import Path

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


title_font = font("msyhbd.ttc", 27)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 18)
code_tiny = font("consola.ttf", 14)

CODE_FONTS = (code_small, code_mid, code_tiny)


class Canvas:
    def __init__(self):
        self.img = Image.new("RGB", (W, H), BG)
        self.d = ImageDraw.Draw(self.img)
        self.checks = []
        self.bound = W - 20

    def assert_ascii(self, parts):
        for text, f, _ in parts:
            if f in CODE_FONTS:
                bad = [c for c in text if ord(c) > 127]
                assert not bad, f"代码字体段含非 ASCII 字符 {bad}：{text!r}"

    def mixed(self, cx, cy, parts, anchor="mm"):
        self.assert_ascii(parts)
        widths = [self.d.textlength(t, font=f) for t, f, _ in parts]
        total = sum(widths)
        x = cx - total / 2 if anchor == "mm" else cx
        assert x >= 0 and x + total <= self.bound, (
            f"文字越界: y={int(cy)} right={int(x + total)} bound={self.bound}"
        )
        self.checks.append((int(cy), int(x), int(total)))
        for (text, f, color), w in zip(parts, widths):
            self.d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
            x += w
        return x

    def right_text(self, x_right, y, text, f, color):
        self.assert_ascii([(text, f, color)])
        w = self.d.textlength(text, font=f)
        self.d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
        self.checks.append((int(y), int(x_right - w), int(w)))

    def card(self, x0, y0, x1, y1, fill, outline, width=2, radius=10):
        self.d.rounded_rectangle(
            (int(x0), int(y0), int(x1), int(y1)),
            radius=radius, fill=fill, outline=outline, width=width,
        )


def draw(spec, out_name):
    c = Canvas()
    d = c.d

    # ── 标题 ────────────────────────────────────────────────────────────────
    d.text((W / 2, 44), spec["title"], font=title_font, fill=INK, anchor="mm")
    c.mixed(W / 2, 84, spec["subtitle"])

    # ── 面板标题 ────────────────────────────────────────────────────────────
    c.mixed(302, 126, spec["left_title"])
    c.mixed(805, 126, spec["right_title"])
    d.line((550, 144, 550, 400), fill=BORDER, width=2)

    # ── 左面板 ──────────────────────────────────────────────────────────────
    LX0, LX1 = 76, 528
    c.bound = LX1 - 10
    y = 168
    for code, note, accent, fill in spec["left_rows"]:
        c.card(LX0, y, LX1, y + 38, fill, accent, width=2)
        c.mixed(LX0 + 16, y + 19, [(code, code_mid, accent)], anchor="lm")
        c.right_text(LX1 - 16, y + 19, note, tiny_font, MUTED)
        c.checks.append((int(y), int(LX0), int(LX1 - LX0)))
        y += 44
    note_y = y + 8
    for parts in spec["left_notes"]:
        c.mixed(LX0, note_y, parts, anchor="lm")
        note_y += 28

    # ── 右面板 ──────────────────────────────────────────────────────────────
    RX0, RX1 = 570, 1040
    c.bound = RX1 - 10
    c.card(RX0, 160, RX1, 288, WHITE, ORANGE, width=2)
    c.mixed(RX0 + 16, 184, spec["right_card1_title"], anchor="lm")
    row_y = 212
    for parts in spec["right_card1_rows"]:
        c.mixed(RX0 + 18, row_y, parts, anchor="lm")
        row_y += 26

    c.card(RX0, 296, RX1, 400, GREEN_FILL, GREEN, width=2)
    c.mixed(RX0 + 16, 318, spec["right_card2_title"], anchor="lm")
    row_y = 342
    for parts in spec["right_card2_rows"]:
        c.mixed(RX0 + 18, row_y, parts, anchor="lm")
        row_y += 23

    # ── 底部卡片 ────────────────────────────────────────────────────────────
    CARD_Y, CARD_H, CARD_W, GAPX = 420, 160, 470, 40
    LEFT_X = (W - CARD_W * 2 - GAPX) / 2

    def bottom_card(x, accent, badge, lines):
        c.card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
        tw = int(d.textlength(badge, font=card_title)) + 24
        d.rounded_rectangle(
            (int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
            radius=7, fill=accent,
        )
        d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
               fill=WHITE, anchor="mm")
        c.bound = x + CARD_W - 14
        yy = CARD_Y + 38
        for parts in lines:
            c.mixed(x + 24, yy, parts, anchor="lm")
            yy += 27

    bottom_card(LEFT_X, GREEN, spec["bottom1_badge"], spec["bottom1_lines"])
    bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, spec["bottom2_badge"], spec["bottom2_lines"])

    d.text((W / 2, H - 16), spec["footer"], font=tiny_font, fill=MUTED, anchor="mm")

    # ── 几何自检 ────────────────────────────────────────────────────────────
    assert 44 + 14 < 84 - 9, "标题压住副标题"
    assert 84 + 9 < 126 - 12, "副标题压住面板标题"
    assert 144 < 168, "分隔线顶住左卡片"
    assert 168 + 38 * 4 + 44 * 0 < CARD_Y - 30, "左面板行数过多"
    assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"
    assert CARD_Y + 38 + 27 * 3 + 9 < CARD_Y + CARD_H - 4, "底部卡片行越出"
    assert 160 + 12 < 184 - 9 and 184 + 9 < 212 - 10, "右面板卡标题重叠"
    assert 212 + 9 < 238 - 10 and 238 + 9 < 264 - 10, "右面板卡行重叠"
    assert 264 + 9 < 288 - 4, "右面板最后一行越出卡片"
    assert 296 - 288 >= 8, "右侧两卡重叠"
    assert 318 + 9 < 342 - 6 and 342 + 9 < 365 - 6, "右面板队列行重叠"
    assert 365 + 9 < 388 - 6 and 388 + 9 < 400 - 2, "队列行越出卡片"
    assert 400 + 10 < CARD_Y - 6, "右面板压住底部卡片"

    for cy, x, w in c.checks:
        assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"

    root = Path(__file__).resolve().parent.parent
    for out in (root / "frontend" / "public" / "photos" / out_name,
                root / "photos" / out_name):
        out.parent.mkdir(parents=True, exist_ok=True)
        c.img.save(out)
        print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
    print(f"SELF-CHECK OK: {out_name}")


COVER1 = {
    "title": "MySQL 聚簇索引与二级索引",
    "subtitle": [("MySQL", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("回表到底贵在哪", tiny_font, MUTED)],
    "left_title": [("两棵 B+ 树", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("叶子存什么", tiny_font, MUTED)],
    "right_title": [("回表与覆盖", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("多一次随机查找", tiny_font, MUTED)],
    "left_rows": [
        ("PRIMARY", "整行 + 事务信息", GREEN, GREEN_FILL),
        ("idx_user", "user_id + 主键", ORANGE, ORANGE_FILL),
        ("idx_status", "status + 主键", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("二级索引天然带主键", tiny_font, INK), (" · 覆盖查询免回表", tiny_font, MUTED)],
        [("回表 = 拿主键再走一次聚簇索引", tiny_font, MUTED)],
    ],
    "right_card1_title": [("回表路径", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("一次变 N 次", tiny_font, MUTED)],
    "right_card1_rows": [
        [("idx_user", code_small, GREEN), (" 找到主键", tiny_font, MUTED)],
        [("PRIMARY", code_small, ORANGE), (" 再查整行", tiny_font, MUTED)],
        [("随机页访问", tiny_font, INK), (" 是主要成本", tiny_font, MUTED)],
    ],
    "right_card2_title": [("三笔账", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("不只是多一次函数调用", tiny_font, MUTED)],
    "right_card2_rows": [
        [("随机 IO", tiny_font, INK), (" 主键与索引序不一致", tiny_font, MUTED)],
        [("buffer pool", code_small, ORANGE), (" 热点被挤掉", tiny_font, MUTED)],
        [("CPU 与锁", tiny_font, INK), (" 每行重走 B+ 树", tiny_font, MUTED)],
    ],
    "bottom1_badge": "覆盖索引",
    "bottom1_lines": [
        [("Using index", code_small, GREEN), (" 所需列都在索引", tiny_font, MUTED)],
        [("SELECT id", code_small, INK), (" 天然覆盖", tiny_font, MUTED)],
        [("窄索引", tiny_font, INK), (" 比宽覆盖更便宜", tiny_font, MUTED)],
        [("先 ", tiny_font, MUTED), ("EXPLAIN", code_small, GOLD),
         (" 再决定加列", tiny_font, MUTED)],
    ],
    "bottom2_badge": "观测",
    "bottom2_lines": [
        [("EXPLAIN", code_small, GREEN), (" 看 Extra", tiny_font, MUTED)],
        [("Handler_read%", code_small, ORANGE), (" 看定位次数", tiny_font, MUTED)],
        [("buffer pool", code_small, GOLD), (" 看命中率", tiny_font, MUTED)],
        [("先证实在回表", tiny_font, INK), (" 再谈优化", tiny_font, MUTED)],
    ],
    "footer": "MySQL 聚簇索引与二级索引 · 回表的三笔成本账 · 覆盖索引与观测方法",
}

COVER2 = {
    "title": "MySQL 联合索引最左前缀",
    "subtitle": [("MySQL", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("为什么 (a,b) 查不了 b", tiny_font, MUTED)],
    "left_title": [("一棵树", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("按列字典序排序", tiny_font, MUTED)],
    "right_title": [("定位与验证", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("key_len 是证据", tiny_font, MUTED)],
    "left_rows": [
        ("(uid, kind, ts)", "先比 uid", GREEN, GREEN_FILL),
        ("kind", "uid 相同再比", ORANGE, ORANGE_FILL),
        ("ts", "最后才比", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("范围列之后", tiny_font, INK), (" · 后续列不再有序", tiny_font, MUTED)],
        [("跳过中间列", tiny_font, INK), (" · 后面只能过滤", tiny_font, MUTED)],
    ],
    "right_card1_title": [("能定位到哪", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("从第一列起连续匹配", tiny_font, MUTED)],
    "right_card1_rows": [
        [("a=1", code_small, GREEN), (" 定位 a 段", tiny_font, MUTED)],
        [("a=1 AND b=2", code_small, ORANGE), (" 定位 (1,2)", tiny_font, MUTED)],
        [("a=1 AND c=3", code_small, GOLD), (" 只用 a", tiny_font, MUTED)],
    ],
    "right_card2_title": [("key_len", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("用了几列的直接证据", tiny_font, MUTED)],
    "right_card2_rows": [
        [("BIGINT", code_small, INK), (" 8 字节", tiny_font, MUTED)],
        [("TINYINT", code_small, ORANGE), (" 1 字节", tiny_font, MUTED)],
        [("DATETIME", code_small, GOLD), (" 5 字节", tiny_font, MUTED)],
    ],
    "bottom1_badge": "列顺序",
    "bottom1_lines": [
        [("等值列", tiny_font, GREEN), (" 放最前", tiny_font, MUTED)],
        [("排序列", tiny_font, INK), (" 放等值之后", tiny_font, MUTED)],
        [("范围列", tiny_font, ORANGE), (" 放最后", tiny_font, MUTED)],
        [("覆盖列", tiny_font, GOLD), (" 追加到末尾", tiny_font, MUTED)],
    ],
    "bottom2_badge": "验证",
    "bottom2_lines": [
        [("EXPLAIN FORMAT=JSON", code_tiny, GREEN), (" 看 used_key_parts", tiny_font, MUTED)],
        [("Using index", code_small, ORANGE), (" 覆盖", tiny_font, MUTED)],
        [("Using index condition", code_tiny, GOLD), (" 下推", tiny_font, MUTED)],
        [("别靠感觉", tiny_font, INK), (" 用计划对比", tiny_font, MUTED)],
    ],
    "footer": "MySQL 联合索引最左前缀 · 字典序决定可用列 · 范围列之后断档",
}

COVER3 = {
    "title": "MySQL EXPLAIN 执行计划",
    "subtitle": [("MySQL", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("从 ALL 到 ref 怎么看", tiny_font, MUTED)],
    "left_title": [("type 阶梯", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("访问方式不是评分", tiny_font, MUTED)],
    "right_title": [("先看三处", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("key / rows / Extra", tiny_font, MUTED)],
    "left_rows": [
        ("const", "唯一等值 · 一行", GREEN, GREEN_FILL),
        ("ref", "普通索引等值", ORANGE, ORANGE_FILL),
        ("range", "索引范围扫描", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("index", code_small, INK), (" 扫整棵索引 · ", tiny_font, MUTED),
         ("ALL", code_small, ORANGE), (" 扫全表", tiny_font, MUTED)],
        [("小表 ALL 正常 · 大表 ALL 才要处理", tiny_font, MUTED)],
    ],
    "right_card1_title": [("三个先看", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("别只盯 type", tiny_font, MUTED)],
    "right_card1_rows": [
        [("key", code_small, GREEN), (" 是否为 NULL", tiny_font, MUTED)],
        [("rows", code_tiny, ORANGE), (" × ", tiny_font, MUTED),
         ("filtered", code_tiny, ORANGE), (" 量级有多大", tiny_font, MUTED)],
        [("Extra", code_small, GOLD), (" 有没有额外操作", tiny_font, MUTED)],
    ],
    "right_card2_title": [("Extra 信号", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("哪些要处理", tiny_font, MUTED)],
    "right_card2_rows": [
        [("Using index", code_small, GREEN), (" 覆盖 · 好事", tiny_font, MUTED)],
        [("Using filesort", code_tiny, ORANGE), (" 排序没蹭上", tiny_font, MUTED)],
        [("Using temporary", code_tiny, GOLD), (" 临时表", tiny_font, MUTED)],
    ],
    "bottom1_badge": "对账",
    "bottom1_lines": [
        [("EXPLAIN ANALYZE", code_tiny, GREEN), (" 8.0.18+", tiny_font, MUTED)],
        [("actual rows", code_small, ORANGE), (" 对比估算", tiny_font, MUTED)],
        [("ANALYZE TABLE", code_small, GOLD), (" 先修统计", tiny_font, MUTED)],
        [("一次采样", tiny_font, INK), (" 不等于定论", tiny_font, MUTED)],
    ],
    "bottom2_badge": "排查顺序",
    "bottom2_lines": [
        [("表大小", tiny_font, GREEN), (" 先看量级", tiny_font, MUTED)],
        [("key", code_small, INK), (" 有没有用上", tiny_font, MUTED)],
        [("rows", code_tiny, ORANGE), (" × ", tiny_font, MUTED),
         ("filtered", code_tiny, ORANGE), (" 估算是否离谱", tiny_font, MUTED)],
        [("最后才加索引", tiny_font, INK), (" 加完再 EXPLAIN", tiny_font, MUTED)],
    ],
    "footer": "MySQL EXPLAIN · type 是访问方式 · key_len 是列数证据 · Extra 是额外操作",
}


if __name__ == "__main__":
    draw(COVER1, "mysql-clustered-index-cover.png")
    draw(COVER2, "mysql-composite-index-cover.png")
    draw(COVER3, "mysql-explain-cover.png")
