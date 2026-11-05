# -*- coding: utf-8 -*-
"""
make_project_covers.py — 五篇项目实战文章的封面（统一骨架）。

构图沿用站点封面：标题 + 副标题，左右两面板 + 中间分隔线，底部两卡。
每个项目只替换文案与强调色，保证一组封面视觉一致。

红线（站点 SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与符号（· → 交给中文字体）；几何自检；双份落盘。
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
value_font = font("msyhbd.ttc", 15)
code_small = font("consola.ttf", 17)
code_card = font("consola.ttf", 16)

LX0, LX1 = 76, 528
RX0, RX1 = 570, 1040
CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX_CARD = 40
LEFT_X = (W - CARD_W * 2 - GAPX_CARD) / 2


def assert_ascii(text, where):
    bad = [ch for ch in text if ord(ch) > 127]
    if bad:
        raise AssertionError(f"Consolas 段含非 ASCII 字符 {bad!r}（{where}）")


def make_cover(spec):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    checks = []
    bound = [W - 20]

    def mixed(cx, cy, parts, anchor="mm"):
        widths = []
        for text, f, _ in parts:
            if f is code_small or f is code_card:
                assert_ascii(text, f"y={int(cy)}")
            widths.append(d.textlength(text, font=f))
        total = sum(widths)
        x = cx - total / 2 if anchor == "mm" else cx
        assert x >= 0 and x + total <= bound[0], (
            f"文字越界: y={int(cy)} right={int(x + total)} bound={bound[0]}"
        )
        checks.append((int(cy), int(x), int(total)))
        for (text, f, color), w in zip(parts, widths):
            d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
            x += w
        return x

    def right_text(x_right, y, text, f, color):
        if f is code_small or f is code_card:
            assert_ascii(text, f"y={int(y)}")
        w = d.textlength(text, font=f)
        d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
        checks.append((int(y), int(x_right - w), int(w)))

    def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
        d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                            fill=fill, outline=outline, width=width)

    def auto_parts(parts):
        """允许文案写 (text, 'c', color) / (text, 't', color) 简写。"""
        mapped = []
        for text, kind, color in parts:
            f = code_small if kind == "c" else tiny_font
            mapped.append((text, f, color))
        return mapped

    # ── 标题 ─────────────────────────────────────────────────────────────────
    d.text((W / 2, 44), spec["title"], font=title_font, fill=INK, anchor="mm")
    mixed(W / 2, 84, auto_parts(spec["subtitle"]), anchor="mm")

    # ── 面板标题 ─────────────────────────────────────────────────────────────
    mixed(302, 128, auto_parts(spec["left_title"]), anchor="mm")
    mixed(805, 128, auto_parts(spec["right_title"]), anchor="mm")

    # ── 分隔线 ───────────────────────────────────────────────────────────────
    d.line((550, 146, 550, 334), fill=BORDER, width=2)

    # ── 左面板：三个统计卡 ───────────────────────────────────────────────────
    bound[0] = LX1 - 10

    def stat_card(y0, name, value, accent):
        h = 46
        card(LX0, y0, LX1, y0 + h, WHITE, accent, width=2)
        d.text((int(LX0 + 20), int(y0 + h / 2)), name, font=code_small,
               fill=INK, anchor="lm")
        right_text(LX1 - 20, y0 + h / 2, value, value_font, accent)

    for i, (name, value, accent) in enumerate(spec["left_stats"]):
        stat_card(158 + i * 54, name, value, accent)

    for i, parts in enumerate(spec["left_lines"]):
        mixed(LX0, 338 + i * 24, auto_parts(parts), anchor="lm")

    # ── 右面板：一条链路 ─────────────────────────────────────────────────────
    bound[0] = RX1 - 10

    card(RX0, 158, RX1, 200, GREEN_FILL, GREEN, width=2)
    mixed((RX0 + RX1) / 2, 179, auto_parts(spec["right_header"]), anchor="mm")

    mixed(RX0, 214, auto_parts(spec["right_line"]), anchor="lm")

    MIDX = 805
    GAPX = 12
    half_gap = MIDX - RX0 - GAPX
    for i, (name, caption) in enumerate(spec["right_cards"]):
        x0 = RX0 if i == 0 else MIDX + GAPX
        x1 = MIDX - GAPX if i == 0 else RX1
        card(x0, 236, x1, 300, WHITE, ORANGE, width=2)
        name_font = code_card if all(ord(ch) < 128 for ch in name) else card_title
        mixed((x0 + x1) / 2, 258, [(name, name_font, ORANGE)])
        mixed((x0 + x1) / 2, 280, auto_parts(caption), anchor="mm")

    mixed(RX0, 318, auto_parts(spec["right_bottom"]), anchor="lm")

    # ── 底部卡片 ─────────────────────────────────────────────────────────────
    def bottom_card(x, accent, badge, lines):
        card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
        tw = int(d.textlength(badge, font=card_title)) + 24
        d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                            radius=7, fill=accent)
        d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
               fill=WHITE, anchor="mm")
        bound[0] = x + CARD_W - 14
        y = CARD_Y + 44
        for parts in lines:
            mixed(x + 24, y, auto_parts(parts), anchor="lm")
            y += 40

    bottom_card(LEFT_X, GREEN, spec["bottom_left_badge"], spec["bottom_left"])
    bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, spec["bottom_right_badge"],
                spec["bottom_right"])

    d.text((W / 2, H - 16), spec["footer"], font=tiny_font, fill=MUTED, anchor="mm")

    # ── 几何自检 ─────────────────────────────────────────────────────────────
    assert 44 + 14 < 84 - 9, "标题压住副标题"
    assert 84 + 9 < 128 - 12, "副标题压住面板标题"
    assert 146 < 158, "分隔线顶住左卡片"
    assert 266 + 46 < 338 - 9, "左卡片压住说明行"
    assert 362 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
    assert 318 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
    assert RX1 - RX0 == CARD_W, "右面板宽度与卡片不一致"
    assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

    for cy, x, w in checks:
        assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"

    for out in (f"frontend/public/photos/{spec['slug']}-cover.png",
                f"photos/{spec['slug']}-cover.png"):
        img.save(out)
        print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
    print(f"SELF-CHECK OK: {spec['slug']}")


COVERS = [
    {
        "slug": "nanoss-windows-ssh-client",
        "title": "NanoSSH：13 MB 的 Windows SSH 客户端",
        "subtitle": [("Go + Wails", "c", GREEN), (" · ", "t", DIM),
                     ("字节直通", "t", ORANGE), (" · ", "t", DIM),
                     ("端到端反压", "t", GOLD),
                     ("　——　一个刻意做窄的 SSH 客户端", "t", MUTED)],
        "left_title": [("体积与依赖", "t", GREEN), ("　单文件 exe", "t", MUTED)],
        "left_stats": [
            ("NanoSSH", "13.23 MB", GREEN),
            ("go.mod", "直接 5 个", ORANGE),
            ("build.ps1", "14 MB 硬上限", GOLD),
        ],
        "left_lines": [
            [("只留 ", "t", MUTED), ("[]byte", "c", INK),
             (" 直通，不切行不解码", "t", MUTED)],
            [("release：", "t", MUTED), ("-s -w", "c", GREEN),
             (" · ", "t", DIM), ("CGO_ENABLED=0", "c", GREEN),
             ("，无外部运行时", "t", MUTED)],
        ],
        "right_title": [("一条终端数据链", "t", ORANGE), ("　反压闭环", "t", MUTED)],
        "right_header": [("AckTermData", "c", GREEN), ("　逐块回执", "t", MUTED)],
        "right_line": [("后端一次只发一段，收到回执才继续读", "t", MUTED)],
        "right_cards": [
            ("pumpSession", [("读 32 KiB 复制进通道", "t", MUTED)]),
            ("flush", [("16 KiB · 8 ms · 30 s", "t", MUTED)]),
        ],
        "right_bottom": [("chunks", "c", INK), (" 通道深 8，单消费者输出", "t", MUTED)],
        "bottom_left_badge": "十二个问题",
        "bottom_left": [
            [("中文跨块", "t", INK), ("　字节直通，前端解码", "t", MUTED)],
            [("PTY 宽高", "t", INK), ("　rows / cols 顺序反了", "t", MUTED)],
            [("known_hosts", "c", INK), ("　TOFU 三档 + 哈希边界", "t", MUTED)],
            [("ssh-agent", "c", INK), ("　Windows 命名管道", "t", MUTED)],
        ],
        "bottom_right_badge": "取舍",
        "bottom_right": [
            [("IPC", "c", INK), ("　base64 事件桥，不另开端口", "t", MUTED)],
            [("体积", "t", INK), ("　14 MB 红线写进构建", "t", MUTED)],
            [("凭据", "t", INK), ("　Credential Manager + 自愈", "t", MUTED)],
            [("托盘", "t", INK), ("　手写，不引 systray", "t", MUTED)],
        ],
        "footer": "仓库 zhoujungis/NanoSSH · Go + Wails v2 · WebView2 · 单文件 13.23 MB",
    },
    {
        "slug": "micromd-3mb-markdown-reader",
        "title": "micromd：3.17 MiB 的单文件 Markdown 阅读器",
        "subtitle": [("系统 WebView2", "t", GREEN), (" · ", "t", DIM),
                     ("界面落 file://", "t", ORANGE), (" · ", "t", DIM),
                     ("两遍式解析", "t", GOLD),
                     ("　——　七个没完全解决的问题", "t", MUTED)],
        "left_title": [("一个 exe 的五层", "t", GREEN), ("　3.17 MiB", "t", MUTED)],
        "left_stats": [
            ("micromd.exe", "3,323,392 B", GREEN),
            ("-s -w", "省 32.8%", ORANGE),
            ("web/index.html", "29,520 B", GOLD),
        ],
        "left_lines": [
            [("基线：一个空 ", "t", MUTED), ("windowsgui", "c", INK),
             (" 程序已有 1.21 MB", "t", MUTED)],
            [("IconId: 1", "c", GREEN), (" 由 go-winres 写入 .syso", "t", MUTED)],
        ],
        "right_title": [("启动链路", "t", ORANGE), ("　先落盘，再导航", "t", MUTED)],
        "right_header": [("go:embed index.html", "c", GREEN), ("　29,520 B", "t", MUTED)],
        "right_line": [("抽出到 ", "t", MUTED), ("LOCALAPPDATA", "c", INK),
                       ("，失败就静默", "t", MUTED)],
        "right_cards": [
            ("file://", [("导航而非字符串注入", "t", MUTED)]),
            ("三个绑定", [("原生 / 存储 / 打开", "t", MUTED)]),
        ],
        "right_bottom": [("WebView2", "c", INK), (" 缺失 → 回退默认浏览器", "t", MUTED)],
        "bottom_left_badge": "四个取舍",
        "bottom_left": [
            [("不打包 Chromium", "t", INK), ("　用系统 WebView2", "t", MUTED)],
            [("界面先落盘", "t", INK), ("　换来可用的 file:// 基址", "t", MUTED)],
            [("手写解析器", "t", INK), ("　两遍式：转义 + 占位", "t", MUTED)],
            [("零依赖前端", "t", INK), ("　HTML / JS 全内嵌", "t", MUTED)],
        ],
        "bottom_right_badge": "已知问题",
        "bottom_right": [
            [("大文件", "t", INK), ("　BIG_DOC 只降频不减单次", "t", MUTED)],
            [("草稿配额", "t", INK), ("　空 catch，MAX_DRAFT 未接", "t", MUTED)],
            [("保存语义", "t", INK), ("　native=false 时变下载", "t", MUTED)],
            [("没有监听", "t", INK), ("　也没有最近文件", "t", MUTED)],
        ],
        "footer": "仓库 zhoujungis/micromd · Go + go-webview2 · //go:embed · 单文件 3.17 MiB",
    },
    {
        "slug": "interviewatlas-daily-crawl-llm-analysis",
        "title": "InterviewAtlas：41,771 条面经的数据流水线",
        "subtitle": [("零服务器", "t", GREEN), (" · ", "t", DIM),
                     ("Actions 日更", "t", ORANGE), (" · ", "t", DIM),
                     ("map-reduce 归纳", "t", GOLD),
                     ("　——　一条链与它的故障复盘", "t", MUTED)],
        "left_title": [("数据规模", "t", GREEN), ("　全量落 git", "t", MUTED)],
        "left_stats": [
            ("41,771", "条面经记录", GREEN),
            ("157", "家公司", ORANGE),
            ("158 + 1,791", ".json.gz + Markdown", GOLD),
        ],
        "left_lines": [
            [("运行期依赖：", "t", MUTED), ("requests", "c", GREEN),
             (" · ", "t", DIM), ("bs4", "c", GREEN),
             (" · ", "t", DIM), ("lxml", "c", GREEN),
             (" · ", "t", DIM), ("PyYAML", "c", GREEN)],
            [("压缩 ", "t", MUTED), ("35.9 MB", "c", INK),
             (" · 渲染 ", "t", MUTED), ("92.3 MB", "c", INK)],
        ],
        "right_title": [("两条链", "t", ORANGE), ("　采集 → 分析", "t", MUTED)],
        "right_header": [("三源采集 → 归一化 → 分片 → 渲染", "t", GREEN)],
        "right_line": [("去重先于详情：命中 URL 就不发第二次", "t", MUTED)],
        "right_cards": [
            ("增量采集", [("known_urls 索引", "t", MUTED)]),
            ("LLM 归纳", [("两阶段 map-reduce", "t", MUTED)]),
        ],
        "right_bottom": [("缓存：", "t", MUTED), ("manifest", "c", INK),
                         (" + 预算，断了就重算", "t", MUTED)],
        "bottom_left_badge": "故障复盘",
        "bottom_left": [
            [("面试鸭", "t", INK), ("　0 个题库、0 条记录", "t", MUTED)],
            [("LLM 分析", "t", INK), ("　永远停在 0/237", "t", MUTED)],
            [("截断", "t", INK), ("　短正文不进 known 集合", "t", MUTED)],
            [("额度", "t", INK), ("　100 MB 与源下线", "t", MUTED)],
        ],
        "bottom_right_badge": "工程约束",
        "bottom_right": [
            [("不用数据库", "t", INK), ("　状态只落在 git", "t", MUTED)],
            [("分片存储", "t", INK), ("　.json.gz 按公司切", "t", MUTED)],
            [("幂等渲染", "t", INK), ("　写放大要付代价", "t", MUTED)],
            [("无人值守", "t", INK), ("　Actions 定时跑", "t", MUTED)],
        ],
        "footer": "仓库 zhoujungis/InterviewAtlas · Python 3.11 · GitHub Actions · 四个运行期依赖",
    },
    {
        "slug": "nanoapi-wails-http-client",
        "title": "NanoAPI：10.8 MiB 的「够用」Postman",
        "subtitle": [("自建 HTTP 引擎", "t", GREEN), (" · ", "t", DIM),
                     ("cURL 双向互转", "t", ORANGE), (" · ", "t", DIM),
                     ("原子 JSON 存储", "t", GOLD),
                     ("　——　十二个网络与工程坑", "t", MUTED)],
        "left_title": [("一个 exe 的边界", "t", GREEN), ("　前端零 npm", "t", MUTED)],
        "left_stats": [
            ("NanoAPI-x64.exe", "10.8 MiB", GREEN),
            ("go.mod", "直接依赖 1 个", ORANGE),
            ("nanoapi-bundle", "仅自带 v1 格式", GOLD),
        ],
        "left_lines": [
            [("前端：", "t", MUTED), ("ESM + go:embed", "c", GREEN),
             ("，没有构建步骤", "t", MUTED)],
            [("不兼容 Postman / OpenAPI / HAR", "t", MUTED)],
        ],
        "right_title": [("一次请求", "t", ORANGE), ("　单向流水线", "t", MUTED)],
        "right_header": [("Store.Snapshot()", "c", GREEN), (" → ", "t", MUTED),
                         ("Client.Send", "c", GREEN)],
        "right_line": [("变量插值三层封顶，第四层保留并上报", "t", MUTED)],
        "right_cards": [
            ("resolveRequest", [("URL 合并 · 认证", "t", MUTED)]),
            ("buildBody", [("multipart · 文件上限", "t", MUTED)]),
        ],
        "right_bottom": [("网络错误写进 ", "t", MUTED), ("Result.Error", "c", INK),
                         ("，不抛 Go error", "t", MUTED)],
        "bottom_left_badge": "网络语义",
        "bottom_left": [
            [("超时 / 重定向", "t", INK), ("　指针三态，单次覆盖全局", "t", MUTED)],
            [("响应读取", "t", INK), ("　读 20 MB + 1 字节判截断", "t", MUTED)],
            [("cURL", "c", INK), ("　@file、引号与平台差异", "t", MUTED)],
            [("下载名", "t", INK), ("　RFC 5987 + 非法字符清理", "t", MUTED)],
        ],
        "bottom_right_badge": "工程化",
        "bottom_right": [
            [("历史", "t", INK), ("　存原文占位符，200 条上限", "t", MUTED)],
            [("响应体", "t", INK), ("　不落盘，显式保存", "t", MUTED)],
            [("存储", "t", INK), ("　临时文件 → fsync → rename", "t", MUTED)],
            [("单 exe", "t", INK), ("　10.8 MiB 的代价", "t", MUTED)],
        ],
        "footer": "仓库 zhoujungis/NanoAPI · Go + Wails v2.17.0 · 前端零依赖 · 单文件 10.8 MiB",
    },
    {
        "slug": "z-bot-local-first-ai-assistant",
        "title": "Z Bot：本地优先的私人 AI 助理",
        "subtitle": [("Electron + React 19", "c", GREEN), (" · ", "t", DIM),
                     ("node:sqlite FTS5", "c", ORANGE), (" · ", "t", DIM),
                     ("权限逐次确认", "t", GOLD),
                     ("　——　72k 字符的上下文预算", "t", MUTED)],
        "left_title": [("本地优先", "t", GREEN), ("　零云同步", "t", MUTED)],
        "left_stats": [
            ("main", "主进程 + 六个包", GREEN),
            ("node:sqlite", "FTS5 + trigram", ORANGE),
            ("72,000", "字符上下文预算", GOLD),
        ],
        "left_lines": [
            [("Agent 循环：", "t", MUTED), ("20", "c", INK), (" 步", "t", MUTED),
             (" · ", "t", DIM), ("30", "c", INK), (" 工具", "t", MUTED),
             (" · ", "t", DIM), ("5", "c", INK), (" 分钟", "t", MUTED)],
            [("模型：流式 · 重试 · fallback 三层边界", "t", MUTED)],
        ],
        "right_title": [("一次对话", "t", ORANGE), ("　进程边界", "t", MUTED)],
        "right_header": [("Renderer", "c", GREEN), (" → ", "t", MUTED),
                         ("IPC", "c", GREEN), (" → ", "t", MUTED),
                         ("BotRuntime", "c", GREEN)],
        "right_line": [("IPC 过 Zod .strict()，错误先脱敏再回传", "t", MUTED)],
        "right_cards": [
            ("direct", [("单次模型调用", "t", MUTED)]),
            ("agent", [("工具循环 + 权限门", "t", MUTED)]),
        ],
        "right_bottom": [("拒绝不是异常：变成工具结果灌回模型", "t", MUTED)],
        "bottom_left_badge": "四道防线",
        "bottom_left": [
            [("进程", "t", INK), ("　Renderer 只走 preload 白名单", "t", MUTED)],
            [("路径", "t", INK), ("　realpath 上溯 64 层", "t", MUTED)],
            [("媒体", "t", INK), ("　zbot-media 只认附件 id", "t", MUTED)],
            [("权限", "t", INK), ("　once / scope / deny 三档", "t", MUTED)],
        ],
        "bottom_right_badge": "本地机制",
        "bottom_right": [
            [("记忆", "t", INK), ("　FTS5 bm25，不上向量库", "t", MUTED)],
            [("提醒", "t", INK), ("　setTimeout 上限约 24.8 天", "t", MUTED)],
            [("OCR", "t", INK), ("　文本包进不可信标签", "t", MUTED)],
            [("测试", "t", INK), ("　32 单测 + 2 个 E2E", "t", MUTED)],
        ],
        "footer": "仓库 zhoujungis/z-bot · Electron + TypeScript · node:sqlite · 本地优先",
    },
]


if __name__ == "__main__":
    for spec in COVERS:
        make_cover(spec)
