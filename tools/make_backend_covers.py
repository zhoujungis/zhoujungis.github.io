# -*- coding: utf-8 -*-
"""Generate the eight backend deep-dive covers.

Run from repo root:
    backend/venv/Scripts/python.exe tools/make_backend_covers.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from make_mysql_index_covers import (  # noqa: E402
    DIM,
    GOLD,
    GOLD_FILL,
    GREEN,
    GREEN_FILL,
    INK,
    MUTED,
    ORANGE,
    ORANGE_FILL,
    card_title,
    code_small,
    code_tiny,
    draw,
    tiny_font,
)

TX = {
    "title": "分布式事务",
    "subtitle": [("Outbox", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("Saga · TCC · 2PC", tiny_font, MUTED)],
    "left_title": [("一条事件", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("从业务事务到消费", tiny_font, MUTED)],
    "left_rows": [
        ("BEGIN", "业务事务开始", GREEN, GREEN_FILL),
        ("outbox INSERT", "与业务同事务", ORANGE, ORANGE_FILL),
        ("relay / CDC", "至少一次投递", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("提交与发消息", tiny_font, INK), (" 不能分两步", tiny_font, MUTED)],
        [("消费端幂等", tiny_font, INK), (" · 重复投递是常态", tiny_font, MUTED)],
    ],
    "right_title": [("四种承诺", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("选能承受的中间态", tiny_font, MUTED)],
    "right_card1_title": [("一致性", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("各自放弃什么", tiny_font, MUTED)],
    "right_card1_rows": [
        [("Outbox", code_small, GREEN), (" 最终一致", tiny_font, MUTED)],
        [("Saga", code_small, ORANGE), (" 可补偿无隔离", tiny_font, MUTED)],
        [("TCC", code_small, GOLD), (" 预留资源", tiny_font, MUTED)],
    ],
    "right_card2_title": [("TCC 三异常", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("Cancel 必须能重入", tiny_font, MUTED)],
    "right_card2_rows": [
        [("空回滚", tiny_font, INK), (" Try 没执行", tiny_font, MUTED)],
        [("幂等", tiny_font, INK), (" Cancel 可重试", tiny_font, MUTED)],
        [("防悬挂", tiny_font, INK), (" Cancel 先到", tiny_font, MUTED)],
    ],
    "bottom1_badge": "投递",
    "bottom1_lines": [
        [("FOR UPDATE", code_small, GREEN), (" SKIP LOCKED", code_small, MUTED)],
        [("CDC", code_small, ORANGE), (" 读 binlog / WAL", tiny_font, MUTED)],
        [("死信", tiny_font, INK), (" 与积压要报警", tiny_font, MUTED)],
        [("至少一次", tiny_font, INK), (" 不等于只一次", tiny_font, MUTED)],
    ],
    "bottom2_badge": "选型",
    "bottom2_lines": [
        [("短事务", tiny_font, INK), (" 2PC 仍可用", tiny_font, MUTED)],
        [("长流程", tiny_font, INK), (" Saga 更合适", tiny_font, MUTED)],
        [("资金类", tiny_font, INK), (" TCC 换隔离", tiny_font, MUTED)],
        [("先定", tiny_font, MUTED), (" 可接受的中间态", tiny_font, INK)],
    ],
    "footer": "分布式事务 · Outbox / Saga / TCC · 中间态、补偿与幂等",
}

POOL = {
    "title": "数据库连接池",
    "subtitle": [("PostgreSQL", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("MySQL · Django · HikariCP", tiny_font, MUTED)],
    "left_title": [("三个数", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("决定池子大小", tiny_font, MUTED)],
    "left_rows": [
        ("RPS", "请求速率", GREEN, GREEN_FILL),
        ("latency", "单次查询耗时", ORANGE, ORANGE_FILL),
        ("concurrency", "RPS x latency", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("池大小由数据库容量决定", tiny_font, INK), (" · 不由线程数", tiny_font, MUTED)],
        [("超过容量只是换地方排队", tiny_font, INK), (" · 更慢", tiny_font, MUTED)],
    ],
    "right_title": [("账要对上", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("应用 × 数据库", tiny_font, MUTED)],
    "right_card1_title": [("池参数", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("每个都在防一件事", tiny_font, MUTED)],
    "right_card1_rows": [
        [("max_size", code_small, GREEN), (" 并发上限", tiny_font, MUTED)],
        [("acquire_timeout", code_small, ORANGE), (" 等多久", tiny_font, MUTED)],
        [("max_lifetime", code_small, GOLD), (" 定期轮换", tiny_font, MUTED)],
    ],
    "right_card2_title": [("Django", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("每 worker 一个池", tiny_font, MUTED)],
    "right_card2_rows": [
        [("CONN_MAX_AGE", code_small, INK), (" 连接复用", tiny_font, MUTED)],
        [("workers", code_small, ORANGE), (" × pool", tiny_font, MUTED)],
        [("max_connections", code_small, GREEN), (" 留余量", tiny_font, MUTED)],
    ],
    "bottom1_badge": "pgbouncer",
    "bottom1_lines": [
        [("session", code_small, GREEN), (" 一连接一会话", tiny_font, MUTED)],
        [("transaction", code_small, ORANGE), (" 事务结束即归还", tiny_font, MUTED)],
        [("statement", code_small, GOLD), (" 最激进", tiny_font, MUTED)],
        [("transaction 模式", tiny_font, INK), (" 慎用 prepared", tiny_font, MUTED)],
    ],
    "bottom2_badge": "观测",
    "bottom2_lines": [
        [("active / idle", code_small, GREEN), (" / pending", code_small, MUTED)],
        [("等待时间", tiny_font, INK), (" 比池大小更早报警", tiny_font, MUTED)],
        [("超时次数", tiny_font, INK), (" 连接泄漏信号", tiny_font, MUTED)],
        [("故障切换后", tiny_font, INK), (" 清陈旧连接", tiny_font, MUTED)],
    ],
    "footer": "数据库连接池 · Little's Law · pgbouncer / HikariCP · 泄漏与陈旧连接",
}

OBS = {
    "title": "指标与链路追踪",
    "subtitle": [("RED", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("USE · OpenTelemetry", tiny_font, MUTED)],
    "left_title": [("三类信号", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("别混在一起用", tiny_font, MUTED)],
    "left_rows": [
        ("logs", "事件与上下文", GREEN, GREEN_FILL),
        ("metrics", "趋势与告警", ORANGE, ORANGE_FILL),
        ("traces", "单次请求路径", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("平均值会骗人", tiny_font, INK), (" · 看 P95 / P99", tiny_font, MUTED)],
        [("Histogram 分桶", tiny_font, INK), (" 决定分位数精度", tiny_font, MUTED)],
    ],
    "right_title": [("RED", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("四个黄金信号", tiny_font, MUTED)],
    "right_card1_title": [("指标三件套", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("Rate / Errors / Duration", tiny_font, MUTED)],
    "right_card1_rows": [
        [("Rate", code_small, GREEN), (" 请求速率", tiny_font, MUTED)],
        [("Errors", code_small, ORANGE), (" 错误比例", tiny_font, MUTED)],
        [("Duration", code_small, GOLD), (" 延迟分布", tiny_font, MUTED)],
    ],
    "right_card2_title": [("Trace", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("一次请求一棵树", tiny_font, MUTED)],
    "right_card2_rows": [
        [("trace_id", code_small, INK), (" 全链路", tiny_font, MUTED)],
        [("span", code_small, ORANGE), (" 分段耗时", tiny_font, MUTED)],
        [("traceparent", code_small, GREEN), (" 跨服务传播", tiny_font, MUTED)],
    ],
    "bottom1_badge": "采样",
    "bottom1_lines": [
        [("head", code_small, GREEN), (" 固定比例", tiny_font, MUTED)],
        [("tail", code_small, ORANGE), (" 按错误保留", tiny_font, MUTED)],
        [("低频错误", tiny_font, INK), (" 最容易漏", tiny_font, MUTED)],
        [("always-on", code_small, GOLD), (" 成本要算", tiny_font, MUTED)],
    ],
    "bottom2_badge": "落地",
    "bottom2_lines": [
        [("OTel SDK", code_small, GREEN), (" 统一埋点", tiny_font, MUTED)],
        [("OTLP", code_small, ORANGE), (" 导出协议", tiny_font, MUTED)],
        [("trace_id", code_small, GOLD), (" 写进日志", tiny_font, MUTED)],
        [("指标 → trace", tiny_font, INK), (" → 日志", tiny_font, MUTED)],
    ],
    "footer": "指标与链路追踪 · RED / USE · OpenTelemetry · 采样与基数治理",
}

GRACE = {
    "title": "优雅停机",
    "subtitle": [("SIGTERM", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("Kubernetes · Gunicorn · Celery", tiny_font, MUTED)],
    "left_title": [("停机顺序", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("先摘流量再关进程", tiny_font, MUTED)],
    "left_rows": [
        ("readiness", "先失败，摘流量", GREEN, GREEN_FILL),
        ("stop accept", "不再收新连接", ORANGE, ORANGE_FILL),
        ("drain", "等 in-flight 完成", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("SIGKILL", code_small, INK), (" 没有优雅可言", tiny_font, MUTED)],
        [("exec form", code_small, INK), (" 才能收到信号", tiny_font, MUTED)],
    ],
    "right_title": [("两段时间", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("等 endpoint 传播", tiny_font, MUTED)],
    "right_card1_title": [("K8s", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("preStop 不是偷懒", tiny_font, MUTED)],
    "right_card1_rows": [
        [("preStop sleep", code_small, GREEN), (" 等摘流量", tiny_font, MUTED)],
        [("grace period", code_small, ORANGE), (" 硬上限", tiny_font, MUTED)],
        [("readiness", code_small, GOLD), (" 先失败", tiny_font, MUTED)],
    ],
    "right_card2_title": [("后台任务", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("别用 SIGKILL", tiny_font, MUTED)],
    "right_card2_rows": [
        [("warm shutdown", code_small, INK), (" 等任务收尾", tiny_font, MUTED)],
        [("acks_late", code_small, ORANGE), (" 未 ack 可重投", tiny_font, MUTED)],
        [("幂等", tiny_font, INK), (" 重投不重复", tiny_font, MUTED)],
    ],
    "bottom1_badge": "HTTP",
    "bottom1_lines": [
        [("graceful_timeout", code_small, GREEN), (" 等请求", tiny_font, MUTED)],
        [("uvicorn", code_small, ORANGE), (" timeout 上限", tiny_font, MUTED)],
        [("关 keep-alive", tiny_font, INK), (" 不接新连接", tiny_font, MUTED)],
        [("超时后", tiny_font, INK), (" 才强制退出", tiny_font, MUTED)],
    ],
    "bottom2_badge": "验证",
    "bottom2_lines": [
        [("慢请求中", tiny_font, INK), (" 发 SIGTERM", tiny_font, MUTED)],
        [("断言 200", tiny_font, INK), (" 且无 502", tiny_font, MUTED)],
        [("消费者", tiny_font, INK), (" 不丢消息", tiny_font, MUTED)],
        [("定时任务", tiny_font, INK), (" 不双跑", tiny_font, MUTED)],
    ],
    "footer": "优雅停机 · SIGTERM · K8s preStop · 连接 draining · 任务收尾",
}

LB = {
    "title": "负载均衡",
    "subtitle": [("L4 / L7", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("轮询 · 最少连接 · 一致性哈希", tiny_font, MUTED)],
    "left_title": [("选谁", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("算法就是假设", tiny_font, MUTED)],
    "left_rows": [
        ("round robin", "假设成本相同", GREEN, GREEN_FILL),
        ("least conn", "看当前负载", ORANGE, ORANGE_FILL),
        ("consistent hash", "少搬迁", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("健康", tiny_font, INK), (" 不等于能扛流量", tiny_font, MUTED)],
        [("一台慢机器", tiny_font, INK), (" 会拖垮整组", tiny_font, MUTED)],
    ],
    "right_title": [("一致性哈希", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("环与虚拟节点", tiny_font, MUTED)],
    "right_card1_title": [("扩容时", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("只搬一小段", tiny_font, MUTED)],
    "right_card1_rows": [
        [("ring", code_small, GREEN), (" 哈希环", tiny_font, MUTED)],
        [("vnode", code_small, ORANGE), (" 虚拟节点", tiny_font, MUTED)],
        [("hot key", code_small, GOLD), (" 热点仍在", tiny_font, MUTED)],
    ],
    "right_card2_title": [("失败模式", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("别只看平均值", tiny_font, MUTED)],
    "right_card2_rows": [
        [("sticky", code_small, INK), (" 扩容失效", tiny_font, MUTED)],
        [("retry storm", code_small, ORANGE), (" 重试放大", tiny_font, MUTED)],
        [("skew", code_small, GOLD), (" 连接不均", tiny_font, MUTED)],
    ],
    "bottom1_badge": "Nginx",
    "bottom1_lines": [
        [("upstream", code_small, GREEN), (" 后端组", tiny_font, MUTED)],
        [("least_conn", code_small, ORANGE), (" 最少连接", tiny_font, MUTED)],
        [("max_fails", code_small, GOLD), (" 摘除阈值", tiny_font, MUTED)],
        [("keepalive", code_small, INK), (" 复用长连接", tiny_font, MUTED)],
    ],
    "bottom2_badge": "观测",
    "bottom2_lines": [
        [("每后端延迟", tiny_font, INK), (" 看分布", tiny_font, MUTED)],
        [("5xx", code_small, ORANGE), (" 是否集中", tiny_font, MUTED)],
        [("连接数", tiny_font, INK), (" 是否倾斜", tiny_font, MUTED)],
        [("排队", tiny_font, INK), (" 还是后端退化", tiny_font, MUTED)],
    ],
    "footer": "负载均衡 · 轮询 / 最少连接 / 一致性哈希 · 健康检查与重试预算",
}

WS = {
    "title": "WebSocket 上生产",
    "subtitle": [("RFC 6455", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("心跳 · 重连 · 水平扩展", tiny_font, MUTED)],
    "left_title": [("握手", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("从 HTTP 升级", tiny_font, MUTED)],
    "left_rows": [
        ("Upgrade", "请求头", GREEN, GREEN_FILL),
        ("101", "协议切换", ORANGE, ORANGE_FILL),
        ("frames", "opcode / mask", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("浏览器", tiny_font, INK), (" 不能主动发协议 ping", tiny_font, MUTED)],
        [("应用层心跳", tiny_font, INK), (" 才可控", tiny_font, MUTED)],
    ],
    "right_title": [("断线与扩展", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("两件独立的事", tiny_font, MUTED)],
    "right_card1_title": [("重连", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("退避 + 续传", tiny_font, MUTED)],
    "right_card1_rows": [
        [("backoff", code_small, GREEN), (" 指数 + jitter", tiny_font, MUTED)],
        [("cursor", code_small, ORANGE), (" 断点续传", tiny_font, MUTED)],
        [("resync", code_small, GOLD), (" 状态重建", tiny_font, MUTED)],
    ],
    "right_card2_title": [("扩展", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("连接放哪", tiny_font, MUTED)],
    "right_card2_rows": [
        [("sticky", code_small, INK), (" 粘性会话", tiny_font, MUTED)],
        [("pub/sub", code_small, ORANGE), (" Redis 广播", tiny_font, MUTED)],
        [("registry", code_small, GREEN), (" 连接注册表", tiny_font, MUTED)],
    ],
    "bottom1_badge": "代理",
    "bottom1_lines": [
        [("proxy_http_version", code_small, GREEN), (" 1.1", tiny_font, MUTED)],
        [("Upgrade", code_small, ORANGE), (" + Connection", tiny_font, MUTED)],
        [("proxy_read_timeout", code_small, GOLD), (" 别太短", tiny_font, MUTED)],
        [("Nginx", code_small, INK), (" 正确透传", tiny_font, MUTED)],
    ],
    "bottom2_badge": "安全",
    "bottom2_lines": [
        [("Origin", code_small, GREEN), (" 校验", tiny_font, MUTED)],
        [("首帧鉴权", tiny_font, INK), (" 或子协议", tiny_font, MUTED)],
        [("消息大小", tiny_font, INK), (" 设上限", tiny_font, MUTED)],
        [("慢消费者", tiny_font, INK), (" 要背压", tiny_font, MUTED)],
    ],
    "footer": "WebSocket 上生产 · 握手与心跳 · 断线重连 · 粘性会话与 Redis 广播",
}

UPLOAD = {
    "title": "文件上传",
    "subtitle": [("S3 multipart", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("分片 · 续传 · 直传", tiny_font, MUTED)],
    "left_title": [("三条路径", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("别让应用代理字节", tiny_font, MUTED)],
    "left_rows": [
        ("client", "取预签名凭证", GREEN, GREEN_FILL),
        ("storage", "分片直传", ORANGE, ORANGE_FILL),
        ("app", "只记账与鉴权", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("应用只发凭证", tiny_font, INK), (" · 不中转文件", tiny_font, MUTED)],
        [("分片 ", tiny_font, INK), ("ETag", code_small, INK),
         (" 不等于 MD5", tiny_font, MUTED)],
    ],
    "right_title": [("完整性", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("别只信 Content-Type", tiny_font, MUTED)],
    "right_card1_title": [("分片", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("三个请求", tiny_font, MUTED)],
    "right_card1_rows": [
        [("Create", code_small, GREEN), (" 初始化", tiny_font, MUTED)],
        [("UploadPart", code_small, ORANGE), (" 传分片", tiny_font, MUTED)],
        [("Complete", code_small, GOLD), (" 合并 / Abort", tiny_font, MUTED)],
    ],
    "right_card2_title": [("安全", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("上传也是入口", tiny_font, MUTED)],
    "right_card2_rows": [
        [("path", code_small, INK), (" 路径穿越", tiny_font, MUTED)],
        [("magic", code_small, ORANGE), (" 真实类型", tiny_font, MUTED)],
        [("zip bomb", code_small, GOLD), (" 解压炸弹", tiny_font, MUTED)],
    ],
    "bottom1_badge": "完整性",
    "bottom1_lines": [
        [("SHA-256", code_small, GREEN), (" 内容哈希", tiny_font, MUTED)],
        [("Content-MD5", code_small, ORANGE), (" 传输校验", tiny_font, MUTED)],
        [("双重校验", tiny_font, INK), (" 客户端 + 服务端", tiny_font, MUTED)],
        [("孤儿分片", tiny_font, INK), (" 定时 Abort", tiny_font, MUTED)],
    ],
    "bottom2_badge": "Django",
    "bottom2_lines": [
        [("FILE_UPLOAD", code_small, GREEN), (" 内存阈值", tiny_font, MUTED)],
        [("DATA_UPLOAD", code_small, ORANGE), (" 请求体上限", tiny_font, MUTED)],
        [("流式落盘", tiny_font, INK), (" 不读进内存", tiny_font, MUTED)],
        [("upload_to", code_small, GOLD), (" 生成 key", tiny_font, MUTED)],
    ],
    "footer": "文件上传 · 预签名直传 · S3 multipart · 完整性、鉴权与清理",
}

SEARCH = {
    "title": "搜索",
    "subtitle": [("BM25", tiny_font, GREEN), (" · ", tiny_font, DIM),
                 ("倒排索引 · PG · Elasticsearch", tiny_font, MUTED)],
    "left_title": [("倒排索引", card_title, GREEN), (" · ", tiny_font, DIM),
                   ("从词到文档", tiny_font, MUTED)],
    "left_rows": [
        ("term dict", "词项词典", GREEN, GREEN_FILL),
        ("postings", "文档列表", ORANGE, ORANGE_FILL),
        ("positions", "短语位置", GOLD, GOLD_FILL),
    ],
    "left_notes": [
        [("分词错了", tiny_font, INK), (" 后面全错", tiny_font, MUTED)],
        [("LIKE '%kw%'", code_small, INK), (" 用不上 B+ 树", tiny_font, MUTED)],
    ],
    "right_title": [("相关性", card_title, ORANGE), (" · ", tiny_font, DIM),
                    ("BM25 不是魔法", tiny_font, MUTED)],
    "right_card1_title": [("排序", card_title, ORANGE), (" · ", tiny_font, DIM),
                          ("词频与字段", tiny_font, MUTED)],
    "right_card1_rows": [
        [("TF-IDF", code_small, GREEN), (" 经典权重", tiny_font, MUTED)],
        [("BM25", code_small, ORANGE), (" k1 / b", tiny_font, MUTED)],
        [("boost", code_small, GOLD), (" 字段加权", tiny_font, MUTED)],
    ],
    "right_card2_title": [("选型", card_title, GREEN), (" · ", tiny_font, DIM),
                          ("规模与可控性", tiny_font, MUTED)],
    "right_card2_rows": [
        [("tsvector", code_small, INK), (" PostgreSQL", tiny_font, MUTED)],
        [("Elasticsearch", code_small, ORANGE), (" 大集群", tiny_font, MUTED)],
        [("Meilisearch", code_small, GREEN), (" 轻量", tiny_font, MUTED)],
    ],
    "bottom1_badge": "同步",
    "bottom1_lines": [
        [("双写", tiny_font, INK), (" 简单但会漂移", tiny_font, MUTED)],
        [("CDC / Outbox", code_small, ORANGE), (" 最终一致", tiny_font, MUTED)],
        [("全量重建", tiny_font, INK), (" 版本号切换", tiny_font, MUTED)],
        [("删除", tiny_font, INK), (" 也要同步", tiny_font, MUTED)],
    ],
    "bottom2_badge": "观测",
    "bottom2_lines": [
        [("延迟", tiny_font, INK), (" P95 / P99", tiny_font, MUTED)],
        [("零结果率", tiny_font, INK), (" 分词或召回问题", tiny_font, MUTED)],
        [("点击率", tiny_font, INK), (" 相关性信号", tiny_font, MUTED)],
        [("索引延迟", tiny_font, INK), (" 新鲜度", tiny_font, MUTED)],
    ],
    "footer": "搜索 · 倒排索引与 BM25 · PostgreSQL / Elasticsearch / Meilisearch 选型",
}

COVERS = [
    (TX, "distributed-transaction-outbox-saga-tcc-cover.png"),
    (POOL, "database-connection-pool-deep-dive-cover.png"),
    (OBS, "metrics-and-distributed-tracing-cover.png"),
    (GRACE, "graceful-shutdown-in-practice-cover.png"),
    (LB, "load-balancing-algorithms-in-practice-cover.png"),
    (WS, "websocket-production-deep-dive-cover.png"),
    (UPLOAD, "file-upload-production-deep-dive-cover.png"),
    (SEARCH, "search-inverted-index-to-engine-cover.png"),
]

if __name__ == "__main__":
    for spec, name in COVERS:
        draw(spec, name)
