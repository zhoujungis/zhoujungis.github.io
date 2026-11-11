# -*- coding: utf-8 -*-
"""生成三张新文章封面（frontend/public/photos/*-cover.png）。

统一风格：米色底、左上小标、居中标题、左右两张对照卡、底部一行结论。
每张图只讲一件事，数字全部来自 tools/ 下的实测脚本。

跑法::

    set PYTHONIOENCODING=utf-8 && python tools/make_build_perf_covers.py
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
ORANGE_FILL = (252, 243, 238)

FONT_TAG = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
FONT_TITLE = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 38)
FONT_CARD_TITLE = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 19)
FONT_BODY = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
FONT_CODE = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 17)
FONT_TINY = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
FONT_BIG = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 34)


def draw_mixed(d, x, y, text, latin, cjk, color):
    """中英混排逐段绘制：Consolas 没有中文字形，混着画会出豆腐块。"""
    cx = x
    for ch in text:
        font = latin if ord(ch) < 128 else cjk
        d.text((int(cx), int(y)), ch, font=font, fill=color)
        cx += d.textlength(ch, font=font)
    return cx


def header(d, tag, title):
    tw = d.textlength(tag, font=FONT_TAG)
    d.text((88, 50), tag, font=FONT_TAG, fill=MUTED)
    d.line((88 + tw + 16, 64, 88 + tw + 76, 64), fill=BORDER, width=2)
    tw = d.textlength(title, font=FONT_TITLE)
    d.text(((W - tw) / 2, 82), title, font=FONT_TITLE, fill=INK)


def card(d, x, y, w, h, accent, fill, badge, lines, value=None):
    d.rounded_rectangle((x, y, x + w, y + h), radius=12, fill=fill, outline=accent, width=2)
    bw = d.textlength(badge, font=FONT_CARD_TITLE) + 30
    d.rounded_rectangle((x + 16, y + 14, x + 16 + bw, y + 42), radius=7, fill=accent)
    d.text((x + 16 + bw / 2, y + 28), badge, font=FONT_CARD_TITLE, fill=WHITE, anchor="mm")
    cy = y + 58
    for line in lines:
        draw_mixed(d, x + 20, cy, line, FONT_CODE, FONT_BODY, INK)
        cy += 27
    if value:
        d.text((x + 20, y + h - 52), value, font=FONT_BIG, fill=accent)
    # 几何自检：卡片内文字不得越界
    assert cy <= y + h - 8, f"card text overflow: {badge} cy={cy} bottom={y + h}"


def footer(d, text, y=H - 46):
    tw = d.textlength(text, font=FONT_TINY)
    draw_mixed(d, (W - tw) / 2, y, text, FONT_TINY, FONT_TINY, MUTED)


def cover_static_shell(out):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    header(d, "PERFORMANCE", "英文站去 JS 化")
    card(d, 76, 150, 464, 296, ORANGE, ORANGE_FILL, "SPA（改造前）", [
        "HTML    22.9 KB",
        "CSS     30.5 KB",
        "JS     220.1 KB  (5 文件)",
        "请求      6 个（串行）",
        "Vue 挂载 + 路由匹配",
    ], "78.3 KB gzip")
    card(d, 560, 150, 464, 296, GREEN, GREEN_FILL, "静态壳（改造后）", [
        "HTML    22.9 KB",
        "CSS     30.5 KB",
        "JS       0.8 KB（内联）",
        "请求      2 个",
        "无挂载 · 无路由 · 无广告",
    ], "12.9 KB gzip")
    footer(d, "JS 解析 3.4 ms → 0.01 ms　·　请求 6 → 2　·　首屏只依赖 HTML + CSS")
    img.save(out, optimize=True)
    print(f"wrote {out}")


def cover_sqlite(out):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    header(d, "DATABASE", "一次 fsync 摊薄 1000 行")
    card(d, 76, 150, 464, 296, ORANGE, ORANGE_FILL, "逐行提交", [
        "fsync       1 次/行",
        "rollback    148 rows/s",
        "WAL         499 rows/s",
        "2 万行 ≈    136 s（外推）",
        "瓶颈：落盘次数",
    ], "6.82 ms/commit")
    card(d, 560, 150, 464, 296, GREEN, GREEN_FILL, "整批一个事务", [
        "fsync       1 次/批",
        "rollback 552,811 rows/s",
        "WAL      625,274 rows/s",
        "2 万行 ≈  0.036 s",
        "瓶颈：插入本身",
    ], "3,734x")
    footer(d, "本机 fsync 中位数 1.996 ms　·　每次提交固定一次落盘，与行数无关")
    img.save(out, optimize=True)
    print(f"wrote {out}")


def cover_build(out):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    header(d, "BUILD", "构建 191 秒 → 21 秒")
    card(d, 76, 150, 464, 296, ORANGE, ORANGE_FILL, "全量重压（之前）", [
        "vite       1.75 s",
        "prerender  ~16 s",
        "images     181.9 s",
        "94 张 × 2 格式",
        "95% 时间在压图",
    ], "191.3 s")
    card(d, 560, 150, 464, 296, GREEN, GREEN_FILL, "增量缓存（之后）", [
        "vite       3.76 s",
        "prerender  ~17 s",
        "images     0.1 s",
        "94 cached / 0 encoded",
        "缓存放在 dist 之外",
    ], "21.0 s")
    footer(d, "单张 1.94 s → 命中拷贝 ~1 ms　·　完整构建 −89%")
    img.save(out, optimize=True)
    print(f"wrote {out}")


if __name__ == "__main__":
    base = r"D:\zhoujungis.github.io\frontend\public\photos"
    cover_static_shell(base + r"\english-site-without-js-cover.png")
    cover_sqlite(base + r"\sqlite-group-commit-cover.png")
    cover_build(base + r"\build-time-image-cache-cover.png")
