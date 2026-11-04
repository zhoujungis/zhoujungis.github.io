---
title: "文件上传：分片、断点续传与直传对象存储"
slug: file-upload-production-deep-dive
cover_image: /photos/file-upload-production-deep-dive-cover.png
date: 2026-11-04
tags: ["后端", "对象存储", "架构"]
---

> 适用读者：正在让应用服务器中转上传字节的开发者；被大文件超时、内存上涨、文件损坏折腾过的人；准备把上传切到 S3 兼容对象存储，但不确定签名、分片和校验怎么配合的人
> 结论先行：上传的正确姿势不是「把应用服务器调大、超时调长」，而是让字节从客户端直接进入对象存储。服务端只做三件事：签发一张有范围、有时效的票，记录会话状态，在完成后校验对象。分片解决的是可恢复性，校验解决的是可信度，两者不能互相替代。
> 阅读时间：约 32 分钟 | 难度：进阶 | 收获：一条从浏览器到对象存储的完整上传链路、S3 multipart 的三个 API、multipart ETag 的真实含义、安全与访问控制的边界，以及一套能落地的观测指标

**目录**

- 事故：一个 100 MB 的上传把 worker 占满
- 朴素上传的成本：字节为什么要过两道网
- 直传对象存储：预签名、CORS 与 key 设计
- S3 分片上传：三个 API 撑起断点续传
- 分片大小与并发：一个能算清的取舍
- 完整性：Content-MD5、SHA-256 与 multipart ETag 的坑
- 安全：文件名、magic bytes、压缩炸弹与 SSRF
- 访问控制：私有桶、签名 GET、CDN 与 IDOR
- 去重与生命周期：哈希、引用计数、孤儿清理
- Django 侧：配置项、FileField 与流式落盘
- 断点续传协议与幂等：tus、S3 multipart、客户端重试
- 观测：成功率、P95、孤儿分片与存储账单
- 小结
- 相关阅读

## 事故：一个 100 MB 的上传把 worker 占满

那是周日晚上十一点，一位读者在文章编辑器里上传旅行照片的压缩包，大约 100 MB。前端进度条走到一半，浏览器先报网络错误；他刷新重试，又传了一次。十分钟后，站点所有接口都开始转圈，监控显示四台应用实例的健康检查全部超时，负载均衡把它们依次摘掉，剩下的一台也在队列里越排越长。

事后复盘，链路里同时发生了四件事。

第一件，网关先拦了。nginx 的 `client_max_body_size` 默认是 1 MB，我早期改到 50 MB，100 MB 的文件在入口就被 413 拒绝。读者看到的却是前端自己包装过的「网络异常」，于是他不断重试。

第二件，我把限制调到 200 MB，请求进了应用。gunicorn 用的是同步 worker，四个进程，`timeout` 是 30 秒。一个 100 MB 的文件在读者十几 Mbps 的家宽上行里，光传输就要一分钟以上。worker 从收到请求到写完临时文件，全程被这一个连接占着，30 秒一到就被主进程杀掉，连接断开，读者侧再次失败。

第三件，最致命的一处写在兜底分支里：为了避免「取不到文件」，代码先执行了 `content = request.body`。这个属性会把整个请求体读进内存，100 MB 的字节对象加上解析过程的副本，单个进程的内存曲线直接竖起来。四路并发重试之后，OOM killer 把进程杀掉，监控上看到的是「实例随机重启」。

第四件，是数据损坏。有一次请求在传输到 60% 时客户端断网，服务端的写循环没有校验最终长度，接口依然返回 200，数据库也落了记录。第二天读者下载回来，拿到的是一个只有前 60 MB 的 zip，解压时报「文件意外结束」。这比直接失败更糟糕，因为失败至少是诚实的。

这四件事指向同一个根因：**应用服务器在代理字节**。只要字节必须穿过 Django 进程，网络慢就会变成进程慢，客户端超时就会变成 worker 被杀，磁盘写一半就会变成数据损坏。调大内存、调长超时、加更多 worker，只是在给这个错误的架构续命。

## 朴素上传的成本：字节为什么要过两道网

先看 Django 默认是怎么处理 multipart 的。按 Django docs 的 File Uploads 章节，`FILE_UPLOAD_MAX_MEMORY_SIZE` 的默认值是 2621440 字节，也就是 2.5 MB。小于它的文件会放在 `InMemoryUploadedFile` 里，大于它的会由 `TemporaryFileUploadHandler` 流式写进临时文件，得到一个 `TemporaryUploadedFile`。这一步本身是流式的，解析器按块读取请求体，并不会把 100 MB 一次性塞进内存。

问题出在三个地方。

其一是代码。很多「取文件」的写法会破坏流式：`request.body` 读整个请求体；`uploaded.read()` 不带参数时读全部；先 `list(file.chunks())` 再处理；把文件内容塞进 JSON 字段。只要出现一次全量读取，2.5 MB 的阈值就失去意义，内存占用变成「并发数 × 文件大小」。

其二是临时磁盘。大文件会落到 `FILE_UPLOAD_TEMP_DIR` 或系统临时目录。一个 100 MB 的文件传进来，磁盘上先出现 100 MB；如果后面还要复制到最终位置、再上传到对象存储，峰值可能是两到三份。临时文件在请求结束前不会自动消失，worker 被强杀时还会残留。磁盘满的时候，失败的不是上传接口，而是同一台机器上的数据库连接、日志写入和会话文件。

其三是请求体上限与超时，这两项经常被混为一谈。`DATA_UPLOAD_MAX_MEMORY_SIZE` 限制的是非文件部分的请求体，默认也是 2.5 MB；它并不限制文件上传本身。真正卡住大文件的是网关的 `client_max_body_size`、反向代理的 `proxy_read_timeout`、应用服务器的 `timeout`，以及客户端自己的超时。四者只要有一个先到，请求就会在某个中间状态被切断。

把成本写成式子会更清楚。设文件大小为 S，客户端上行带宽为 B，忽略服务端处理时间，单个上传占用的时长约等于 S/B。如果每秒有 λ 个上传请求，根据 Little 定律，系统内同时进行的上传数约为 λ·S/B。四个同步 worker 意味着同时只能有四个请求在跑，超过的部分全部排队。100 MB 在 10 Mbps 上行下需要约 80 秒，λ 只要达到 0.06，也就是每分钟不到四个上传，平均并发就已经超过四个 worker。加 worker 并不会降低单请求时长，只会让更多进程一起等待网络。

还有一笔不显眼的账：流量走了两遍。客户端传到应用服务器是一遍，应用服务器再传到对象存储是第二遍。对象存储的入口流量通常不计费，但应用服务器的带宽、出口流量和 NAT 连接数都要付钱；更贵的是，这条链路上任何一个环节变慢，都会把压力反压回应用进程。

所以「朴素 multipart」不是不能用，它只适合小文件、低并发、且能接受同步处理的场景。头像、几十 KB 的配置、后台批量导入的小 CSV，走应用服务器完全没问题。一旦文件进入几十 MB、上百 MB，或者上传成为高频动作，代理模式的结构性成本就会盖过它的便利。

## 直传对象存储：预签名、CORS 与 key 设计

直传的核心是把角色拆开：应用服务器不再是数据的搬运工，而是「签证官」。客户端先向应用请求一张上传票，应用完成身份校验、配额检查和元数据校验后，用对象存储的密钥签出一张有时效、有范围的 URL；客户端拿着这张票，把字节直接发给对象存储；完成后客户端通知应用，应用再去对象存储确认对象真的存在、大小和校验值是否匹配，最后落库。

这条链路里，应用服务器从头到尾没有碰过文件内容。它经手的只有几百字节的签名和几次元数据查询，worker 占用从「分钟级」降到「毫秒级」。对象存储负责它擅长的事：接收大流量、落盘、分片、重试和持久化。

S3 兼容接口提供两种签名方式，语义不同，不能混用。

第一种是预签名 PUT，对应单次 `PutObject`。服务端用 `generate_presigned_url` 生成一个带查询参数的 URL：

```python
import boto3

s3 = boto3.client("s3", region_name="ap-east-1")

url = s3.generate_presigned_url(
    ClientMethod="put_object",
    Params={
        "Bucket": "blog-uploads",
        "Key": "raw/u_1024/2026/11/9f3c2f6e/photo.zip",
        "ContentType": "application/zip",
    },
    ExpiresIn=900,
)
```

生成的 URL 里会带 `X-Amz-Algorithm`、`X-Amz-Credential`、`X-Amz-Date`、`X-Amz-Expires`、`X-Amz-SignedHeaders` 和 `X-Amz-Signature`。`X-Amz-Expires` 的上限按 S3 API docs 是 604800 秒，也就是七天，但生产里没人会用七天：票的有效期越长，泄漏后的窗口越长。上传票给五到十五分钟就够，客户端拿到后应当立刻开始传。

预签名 PUT 有一个容易忽略的边界：签名只覆盖 `X-Amz-SignedHeaders` 里列出的头。`Content-Type` 如果不进签名，客户端可以把它改成 `text/html`，对象存储照样接受。想把类型锁死，就要把 `ContentType` 放进 `Params`，让它进入签名头；服务端在完成回调里还要再查一次对象的实际类型，不能只信客户端。

第二种是预签名 POST，对应浏览器表单直传。它签的不是 URL，而是一份 policy：

```python
post = s3.generate_presigned_post(
    Bucket="blog-uploads",
    Key="raw/u_1024/2026/11/${filename}",
    Fields={"Content-Type": "application/zip"},
    Conditions=[
        {"Content-Type": "application/zip"},
        ["content-length-range", 1, 200 * 1024 * 1024],
        ["starts-with", "$key", "raw/u_1024/2026/11/"],
    ],
    ExpiresIn=900,
)
```

POST 的优势在于条件由对象存储强制执行。`content-length-range` 能在服务端拦掉超大文件，`starts-with` 能把 key 锁在用户自己的前缀里，客户端改表单字段会直接得到 403。PUT 没有 policy 这一层，大小限制只能在签名前根据声明的 `Content-Length` 判断，或者在完成后用 `HeadObject` 复核；前者可被伪造，后者是事后补救。

浏览器直传绕不过 CORS。对象存储默认不允许跨域 PUT，预检请求会失败，控制台里看到的往往只是一句含糊的「CORS error」。桶的 CORS 配置至少要放行来源、方法和必要请求头：

```json
[
  {
    "AllowedOrigins": ["https://blog.zhoujun.dev"],
    "AllowedMethods": ["PUT", "POST"],
    "AllowedHeaders": ["content-type", "x-amz-*"],
    "ExposeHeaders": ["ETag", "x-amz-version-id"],
    "MaxAgeSeconds": 3600
  }
]
```

`AllowedHeaders` 里的 `x-amz-*` 是给分片上传用的，缺了它，带校验头的 `UploadPart` 会在预检阶段被拒。`ExposeHeaders` 里的 `ETag` 也必须显式暴露，否则浏览器读不到响应头，分片上传拿不到每个分片的 ETag，后续 `Complete` 无从拼装。

key 的设计比签名更值得花时间。原则是：**永远不要用用户提供的文件名直接做 key**。原始文件名里可能带 `../`、反斜杠、控制字符、超长 Unicode、双向文本控制符；即使对象存储的 key 是扁平字符串，这些字符也会在 CDN 回源、本地缓存、日志和下载头里制造麻烦。可用的结构是：

```text
raw/{user_id}/{yyyy}/{mm}/{uuid4}/{sanitized_name}
```

`user_id` 用来做租户隔离和配额统计，年月用来做生命周期扫描的前缀，`uuid4` 保证不可猜测，`sanitized_name` 只保留白名单字符，并且长度截断。原始文件名放进对象 metadata 或数据库，展示时再做转义，不要参与路径。

key 里也不建议放邮箱、手机号、身份证号这类信息。对象存储的 key 会出现在访问日志、CDN 日志、浏览器历史和外链里，一旦写进去就很难收回。需要人可读的展示名，放在数据库字段里，下载时通过 `Content-Disposition` 设置。

## S3 分片上传：三个 API 撑起断点续传

单次 PUT 的问题是「全有或全无」：100 MB 传到 99 MB 断网，下一次只能从零开始。S3 的 multipart upload 把一次大写入拆成可独立重试的若干段，这也是断点续传的服务端基础。

它只有三个核心动作。

第一，`CreateMultipartUpload`。客户端（或服务端）指定 bucket、key、Content-Type，S3 返回一个 `UploadId`。这个 ID 是后续所有分片操作的句柄，必须持久化，丢了就只能重来。

第二，`UploadPart`。每次带上 `UploadId`、`PartNumber` 和这一段的内容，S3 返回该分片的 `ETag`。分片号从 1 到 10000；除最后一片外，每片至少 5 MiB；单片最大 5 GiB；整个对象最大 5 TiB，这些约束来自 S3 API docs。最后一片可以小于 5 MiB，这是给「文件大小不是分片大小整数倍」留的口子。

第三，`CompleteMultipartUpload`。客户端提交一个按分片号升序排列的列表，每项包含 `PartNumber` 和对应的 `ETag`。S3 按这个列表拼装对象。列表里任何一项的 ETag 对不上，都会得到 `InvalidPart`；分片号不连续或顺序错误，会得到 `InvalidPartOrder`。

```python
mpu = s3.create_multipart_upload(
    Bucket="blog-uploads",
    Key=key,
    ContentType="application/zip",
)
upload_id = mpu["UploadId"]

parts = []
with open(local_path, "rb") as f:
    for number in range(1, total_parts + 1):
        chunk = f.read(part_size)
        resp = s3.upload_part(
            Bucket="blog-uploads",
            Key=key,
            UploadId=upload_id,
            PartNumber=number,
            Body=chunk,
        )
        parts.append({"PartNumber": number, "ETag": resp["ETag"]})

s3.complete_multipart_upload(
    Bucket="blog-uploads",
    Key=key,
    UploadId=upload_id,
    MultipartUpload={"Parts": parts},
)
```

断点续传靠的是 `ListParts`。客户端断线后重新进来，先按 `UploadId` 拉取已经传完的分片列表，拿到每个分片的号、大小和 ETag，再和本地的分片计划对比，只补缺失的号。同一个分片号重复上传是覆盖语义，不会产生两份数据，所以「不确定上次是否成功」时，重传那一片是安全的。

这里有一个必须提前想清楚的状态问题：`UploadId` 存在哪里。浏览器刷新会丢内存，所以会话要落库，客户端只保存一个业务侧的 `session_id`。服务端的表至少要有这些列：

```sql
CREATE TABLE upload_sessions (
    id            UUID PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    object_key    TEXT NOT NULL,
    upload_id     TEXT NOT NULL,
    total_size    BIGINT NOT NULL,
    part_size     BIGINT NOT NULL,
    status        TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL
);

CREATE TABLE upload_parts (
    session_id    UUID NOT NULL REFERENCES upload_sessions(id),
    part_number   INT NOT NULL,
    etag          TEXT NOT NULL,
    size          BIGINT NOT NULL,
    uploaded_at   TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (session_id, part_number)
);
```

`status` 用一个明确的状态机：`uploading`、`completing`、`completed`、`aborted`。没有这个状态机，重试的 `Complete` 和用户的取消会互相打架。

分片上传还有一个隐形成本：未完成的上传会一直占着已上传的分片空间，按对象存储的计费规则照常收存储费。用户传了一半就走人，这些分片不会自动消失。两道清理必须都做：用户主动取消时调用 `AbortMultipartUpload`；桶上配置生命周期规则 `AbortIncompleteMultipartUpload`，按 `DaysAfterInitiation` 在若干天后自动清掉。只做前者，一定会留下孤儿；只做后者，取消后的空间要等好几天才释放。

## 分片大小与并发：一个能算清的取舍

分片大小不是随手写的 5 MB。它同时受三个约束。

第一个约束是分片数上限。`part_count = ceil(S / P)`，且 `part_count ≤ 10000`。反过来，`P ≥ S / 10000`。1 GB 的文件，理论最小分片约 105 KB，但实际不会这么切；5 TiB 的对象，最小分片约 524 MB，必须用 512 MB 或 1 GiB 这一档。先按对象大小上限算出下界，再在这个下界之上做选择。

第二个约束是重试粒度。分片越小，断点后续传要重传的数据越少；但分片数变多，请求数、签名开销、`Complete` 的列表长度都会上升。一个 1 GB 文件按 8 MiB 切是 128 片，按 64 MiB 切是 16 片。前者在网络不稳时更省流量，后者在稳定网络里请求开销更小。常见的折中是 8 到 64 MiB，按用户群的上行质量调整。

第三个约束是内存。并发上传时，每个在途分片都要在客户端占一份缓冲，服务端如果代传也要占。并发数乘以分片大小就是峰值内存。四路并发、64 MiB 分片，峰值就是 256 MiB；在浏览器里这已经需要认真考虑，在移动端更是如此。

吞吐的估算可以写成：

```text
总吞吐 ≈ min(客户端上行, 单连接可达吞吐 × 并发数, 对象存储侧限额)
```

并发不是越大越好。连接数上去以后，单连接能分到的带宽反而下降，重试和限流也会增加。三到六路并发是常见起点，再高要用真实网络验证，不能只看机房内的压测。

还有一个容易忽略的账：`Complete` 的请求体大小与分片数成正比。10000 片的列表是几百 KB 的 JSON，虽然不算大，但已经接近一些网关的默认请求体限制。分片数过多时，`Complete` 本身也会变成需要重试的请求。

## 完整性：Content-MD5、SHA-256 与 multipart ETag 的坑

上传成功不等于文件正确。传输层有 TCP 校验，但它只保证「这一段网络传输没坏」，不保证「客户端读到的字节就是它以为的那些字节」，也不保证「服务端拼装时没有漏片」。完整性校验要解决的是端到端的可信。

最轻量的做法是 `Content-MD5`。它是一个 Base64 编码的 16 字节 MD5，放在 `PutObject` 或 `UploadPart` 的请求头里。S3 会计算收到的内容并比对，不匹配返回 `BadDigest`。优点是几乎所有 S3 兼容实现都支持，成本低；缺点是 MD5 已经不适合作为抗碰撞的安全摘要，只能用来发现传输错误，不能用来证明「这份文件没有被恶意替换」。

更强的做法是 SHA-256。S3 支持附加校验和，`x-amz-checksum-sha256` 的值是 Base64 编码的 SHA-256；分片上传可以对每个分片带校验和，完成时由服务端做组合校验。具体支持的头和组合方式按 S3 API docs 的 checksum 章节执行，不同兼容实现的覆盖度不一样，接入前要实测自己的存储端，而不是假设「S3 兼容」就等于「全部支持」。

这里必须拆穿一个流传很广的误解：**multipart 的 ETag 不是整个对象的 MD5**。

单次 `PutObject` 的 ETag，在未使用某些加密方式时，通常是对象内容的 MD5 十六进制串。但 multipart 的 ETag 形式是 `"<一串十六进制>-<分片数>"`，它是对「每个分片 MD5 拼接后的结果」再取 MD5，不是对完整文件取 MD5。S3 API docs 明确写了这一点。所以拿客户端的 `sha256(file)` 或 `md5(file)` 去和 multipart ETag 比较，永远对不上；这不是文件坏了，而是你比较了两个不同的东西。

如果对象用了 SSE-KMS 之类的服务端加密，ETag 甚至不再是内容摘要，连单次 PUT 都不能当 MD5 用。把 ETag 当校验值的代码，在切换加密方式的那天会集体误报。

正确的双重校验是这样分工的：

客户端在读取文件时流式计算 SHA-256，一边上传一边算，不额外读一遍磁盘：

```python
import hashlib

def sha256_of(path, chunk_size=1024 * 1024):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()
```

上传完成后，客户端把 `sha256` 和 `size` 交给服务端。服务端不信任这个值，而是用 `HeadObject` 读对象存储记录的 `ContentLength` 和校验和：大小必须与声明一致；如果上传时带了 SHA-256 校验和，直接比对；如果没带，对高价值文件做一次服务端回读计算，普通文件则至少校验大小和可读性。

```python
head = s3.head_object(Bucket="blog-uploads", Key=key)
assert head["ContentLength"] == declared_size
if head.get("ChecksumSHA256"):
    assert head["ChecksumSHA256"] == declared_sha256_base64
```

校验失败时的处理顺序也要定死：先把会话标成 `failed`，再删除已经写入的对象，保留失败原因和已上传分片信息供重试，最后告警。不要「先落库再校验」，否则数据库里会出现指向坏对象的记录；也不要「校验失败就静默重试三次」，坏文件往往不是偶发网络问题，重试只会放大存储成本。

## 安全：文件名、magic bytes、压缩炸弹与 SSRF

上传是少数「用户能直接往你的存储里写字节」的入口，安全边界必须比普通接口更硬。

第一层是文件名与路径。原始文件名不可信：`../../etc/passwd`、`..\\..\\windows\\win.ini`、带 NUL 字节的名字、超长名字、以及利用 Unicode 规范化产生视觉混淆的名字。防护不是「把 `..` 替换掉」这种黑名单，而是白名单加重新生成：取 `basename`，做 NFKC 规范化，只保留字母、数字、点、下划线、短横线，把连续的点压缩，长度截到 100 字符以内，最后在前面拼 UUID。用于本地落盘的场景，还要再用 `os.path.realpath` 确认最终路径在允许的根目录内。

第二层是 Content-Type 欺骗。浏览器发来的 `Content-Type` 只是声明，攻击者可以把一个 HTML 文件声明成 `image/png`。如果这个对象随后从你的域名以 `image/png` 返回，浏览器可能仍然按内容嗅探，造成存储型 XSS。防线有三道：用 magic bytes 识别真实类型，不只看扩展名和声明头；对不可信来源强制 `Content-Disposition: attachment` 并加 `X-Content-Type-Options: nosniff`；把用户上传内容放在独立域名或独立桶上，避免与主站共享 Cookie 和同源策略。

```python
import magic

mime = magic.from_buffer(head_bytes, mime=True)
if mime not in {"image/jpeg", "image/png", "application/pdf", "application/zip"}:
    raise ValueError("unsupported content type")
```

`python-magic` 依赖 libmagic，容器里要装系统库；它对 polyglot 文件也不是万能的，所以高风控场景还要结合解析器实际打开一次。

第三层是图片解压炸弹。一个几十 KB 的 PNG 可以声明 20000×20000 的像素，解码后是上 GB 的位图。Pillow 有 `Image.MAX_IMAGE_PIXELS` 保护，默认大约是 8900 万像素，超过会告警，超过两倍会抛 `DecompressionBombError`；但很多服务把它关掉了，或者在解码前没有检查尺寸。正确顺序是先读头部拿宽高，按 `width * height` 和单像素字节数估算内存，超过阈值直接拒绝，再谈解码。解码后重新编码一遍，顺便去掉 EXIF 里的 GPS 和设备信息。

第四层是病毒与恶意文档。面向公众的文件共享必须做异步扫描，而不是同步阻塞上传。对象先进入 `quarantine/` 前缀，扫描器（例如 ClamAV）拉取、扫描、打标签，干净后才允许生成下载链接；命中病毒的对象移到隔离区并记录。扫描要有超时和大小上限，压缩包要限制递归层数和解压后总大小，否则扫描器自己会被压缩炸弹打垮。

第五层是「从 URL 导入」带来的 SSRF。这个功能看起来只是帮用户下载一张图，实际上应用服务器会带着自己的网络身份去访问用户给的地址。攻击者可以填 `http://127.0.0.1:8000/admin`、`http://169.254.169.254/latest/meta-data/`、内网网段的数据库地址。防护要同时做：只允许 `http` 和 `https`；解析域名后检查所有 A/AAAA 记录，拒绝回环、私网、链路本地、保留地址；禁止重定向，或对每一跳重新解析并重新检查；设置连接超时、读取超时和最大字节数；最好把抓取放在没有内网权限的独立 worker 或独立网络命名空间里。只做字符串黑名单挡不住 DNS 重绑定。

第六层是签名 URL 的范围。一张上传票应当只允许一个方法、一个 key、一个有效期，必要时再加内容类型和大小范围。不要签「整个前缀可写」的票，也不要用同一张票既允许上传又允许读取。票是 bearer 凭证，拿到就能用，所以不能放进会被 Referer 带走的页面，也不能写进日志。

## 访问控制：私有桶、签名 GET、CDN 与 IDOR

上传桶应当默认私有，并开启「阻止公开访问」。公开读的桶一旦被写入一个 HTML 或 SVG，就等于在你的域名下开了一个 XSS 入口；即使内容无害，桶被当成图床滥用也是成本问题。

读取有两条常见路径。小规模直接用预签名 GET：服务端先查数据库确认当前用户对这条记录有权限，再为这个 key 签一个五到十五分钟有效的 URL。规模上来以后用 CDN：CloudFront 的签名 URL 或签名 Cookie，把鉴权放在边缘，回源时用源站访问控制。两条路径的共同点是：**授权发生在签名之前**，而不是在客户端拿到 key 之后。

这里最典型的漏洞是 IDOR（不安全的直接对象引用）。接口设计成 `GET /api/files?key=raw/u_1/2026/11/xxx/photo.zip`，服务端不查归属，直接对传入的 key 签名。攻击者只要知道别人的 key，就能拿到下载链接。key 不是权限，key 只是地址；不可猜测的 UUID 降低了枚举概率，但不能替代授权检查。正确做法是客户端只传业务 ID，服务端由 ID 查到记录、查到 owner，再决定是否签名。

CDN 场景还有两个细节。第一，私有内容的缓存键必须包含签名参数，或者使用签名 Cookie 并设置 `Cache-Control: private`，否则一个用户的签名响应可能被边缘节点缓存给另一个用户。第二，签名有效期要短于或等于缓存 TTL；权限被撤销后，已经签发的 URL 在到期前仍然有效，这是签名机制的固有窗口，只能靠缩短 TTL 和必要时刷新签名密钥来控制。

下载响应还要处理 `Content-Disposition`。用户上传的文件名可能包含引号、换行、分号，直接拼进头里会造成响应头注入。用 RFC 5987 的 `filename*` 编码，或者干脆只用服务端生成的 ASCII 文件名，展示名放在响应体或前端。

最后是日志。预签名 URL 里的 `X-Amz-Signature` 就是凭证，完整打印到访问日志等于把票公开。日志只记录 bucket、key、会话 ID 和结果码，不记录完整 URL；错误上报同理。

## 去重与生命周期：哈希、引用计数、孤儿清理

当同一份文件被多个用户、多个页面重复上传时，存储账单会以肉眼可见的速度上涨。去重的基本单位是内容哈希：客户端或服务端计算 SHA-256，数据库对 `(tenant_id, sha256, size)` 建唯一约束。命中已有记录时，不再上传字节，直接创建一条新的引用，返回已有的对象 key。

引用计数可以用一张关系表，也可以在文件表上加 `ref_count`。关键是删除路径不能直接删对象：先把引用减一，减到零时标记 `deleted_at`，留七到三十天的宽限期，再由生命周期规则或清理任务物理删除。这样用户误删可以恢复，并发引用也不会出现「A 删除时把 B 还在用的对象删掉」。

去重有一个隐私边界：跨租户共享同一个对象会形成「存在性预言机」。攻击者上传一个已知文件，如果系统告诉他「秒传成功」，他就知道这个平台上有别人存过这份文件。对敏感业务，去重范围要限制在租户内，或者用 `HMAC(tenant_key, sha256)` 作为去重键，让不同租户的相同内容落到不同对象上。

生命周期规则至少覆盖四类对象：未完成的分片上传，按 `AbortIncompleteMultipartUpload` 清理；临时上传和未引用的 `raw/` 对象，按天数过期；长期不访问的归档文件，转低频或归档存储；旧版本对象，按非当前版本过期。规则要按前缀设计，key 结构里的 `raw/{user}/{yyyy}/{mm}/` 就是为了让规则能精确命中，而不是全桶扫描。

孤儿有两种。一种是「对象在、数据库没有」：上传成功但完成回调丢失，或者客户端传完就跑。另一种是「数据库有、对象没有」：对象被外部误删，或者生命周期规则提前命中。前者用对象存储的清单（S3 Inventory）定期和数据库对账，不要用 `ListObjects` 全量扫，百万对象会把请求费用和耗时都拉满；后者在生成下载链接时做一次 `HeadObject`，发现缺失就把记录标成 `missing` 并告警。

## Django 侧：配置项、FileField 与流式落盘

即使主链路改成直传，Django 侧仍然要理解这些配置，因为后台、导入、头像这类小文件还会走应用。

`FILE_UPLOAD_MAX_MEMORY_SIZE` 决定文件在内存还是临时文件里，默认 2.5 MB。调大它不会让大文件变快，只会让每个并发请求多占内存；调小它会让更多文件落到磁盘，增加临时盘 I/O。`FILE_UPLOAD_TEMP_DIR` 应该指向一个有容量上限、和应用日志分开的磁盘。`FILE_UPLOAD_PERMISSIONS` 控制落盘文件的权限，默认 0o644，多用户部署时要确认 umask 不会把它变宽。

`DATA_UPLOAD_MAX_MEMORY_SIZE` 限制的是非文件请求体，默认同样 2.5 MB；它不是文件大小限制。很多人把它调到 200 MB 以为能传大文件，实际只是放大了 JSON 表单被吃进内存的风险。文件大小要在中间件层看 `Content-Length` 先拒一次，再在解析后用 `uploaded.size` 复核一次。

`DATA_UPLOAD_MAX_NUMBER_FIELDS` 默认 1000，防止一个请求带几万个表单字段把解析器拖死。批量导入场景如果确实要很多字段，应该改成分片提交，而不是把这个值调到无限。

模型层有两种存法。用 `FileField` 配对象存储后端（例如 django-storages 的 S3 后端）时，Django 会把文件交给 storage 的 `save`，具体是否流式、是否自动分片取决于后端实现；用 `CharField` 只存 key，把对象存储当成外部系统，模型里保留 `key`、`size`、`sha256`、`content_type`、`owner`、`status`，职责更清晰，也不依赖 storage 的隐式行为。后一种在直传架构里更常见。

`upload_to` 如果要用，必须传一个函数而不是把用户文件名拼进字符串：

```python
def upload_to(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext not in {".jpg", ".png", ".pdf", ".zip"}:
        raise ValueError("unsupported extension")
    return f"raw/u_{instance.owner_id}/{timezone.now():%Y/%m}/{uuid4().hex}{ext}"
```

真正落盘时，唯一不能做的事是先 `read()` 再写。正确姿势是按块消费：

```python
def save_stream(uploaded, dest_path, chunk_size=64 * 1024):
    with open(dest_path, "xb") as out:
        for chunk in uploaded.chunks(chunk_size):
            out.write(chunk)
```

`chunks()` 对 `TemporaryUploadedFile` 是从磁盘读，对 `InMemoryUploadedFile` 是从内存切；无论哪种，都不会一次性构造完整副本。写完以后用 `os.fsync` 或依赖文件系统的持久化语义，再做大小校验。如果进程在中途被杀，临时文件可能残留，启动时的清理任务要按修改时间清掉超过一定时长的临时文件。

## 断点续传协议与幂等：tus、S3 multipart、客户端重试

S3 multipart 是「对象存储侧的断点」，但它要求客户端理解 S3 的 API。浏览器里更通用的是 tus 协议，按 tus 1.0 协议的约定，它把可恢复上传抽象成一组 HTTP 语义。

tus 的核心流程很短。创建时 `POST` 到上传端点，带 `Upload-Length` 和可选的 `Upload-Metadata`，服务端返回 `Location`，指向这个上传资源。查询进度用 `HEAD`，响应里的 `Upload-Offset` 表示服务端已经收到多少字节。续传用 `PATCH`，请求头带 `Upload-Offset` 和 `Content-Type: application/offset+octet-stream`，响应返回新的偏移量。偏移不匹配时返回 409，客户端必须重新 `HEAD` 对齐，而不能按本地记录硬传。

tus 的价值在于语义统一：创建、查询、追加、终止（`DELETE`）都有明确的状态码和头，客户端库可以直接处理暂停、恢复、跨刷新恢复。它的代价是需要一个能存分片状态的服务端；如果最终存储是 S3，这个服务端要么把分片暂存本地再合并上传，要么把 tus 的偏移映射到 S3 multipart 的分片号，两套状态要能对上。

无论用哪种协议，客户端重试都要遵守几条纪律。只对网络错误、超时、5xx 和 429 重试，4xx 里的签名过期、权限不足、校验失败不要盲目重试。退避用指数加抖动，设置上限，避免所有客户端在同一时刻重试打垮入口。续传偏移以服务端返回为准，本地记录只是提示；每次恢复前先查一次进度。

幂等要落在服务端。创建会话用 `Idempotency-Key` 或客户端生成的 UUID，数据库唯一约束保证重复创建不会产生两个 `UploadId`。完成操作要有状态机保护：只有 `uploading` 能进入 `completing`，进入后加行锁或条件更新，重复的完成请求直接返回当前状态。`CompleteMultipartUpload` 如果返回 `NoSuchUpload`，不要立刻判失败，先 `HeadObject` 看对象是否已经存在且大小正确：存在就视为成功，不存在才重开会话。

分片上传本身是幂等的：同一个 `PartNumber` 重复上传会覆盖，不会追加。利用这一点，客户端可以在不确定上一次是否成功时安全重传，而不需要先查询。

## 观测：成功率、P95、孤儿分片与存储账单

上传链路的观测要按阶段拆，不能只看一个「上传成功率」。一次上传至少经过：申请签名、创建会话、逐片上传、完成拼装、服务端校验、落库。每个阶段都要有成功率和耗时，否则故障时只能看到「整体失败」，不知道是签名过期、CORS 配错、分片 ETag 对不上，还是完成回调丢了。

核心指标如下。

- 端到端成功率：从申请签名到落库成功的会话占比；分阶段再看创建、分片、完成、校验的成功率。
- P95 与 P99 时长：按文件大小分桶统计，100 MB 和 1 MB 混在一起的平均值没有意义。
- 有效吞吐：总字节数除以总上传时长，区分客户端侧和服务端侧。
- 4xx 分解：403 里再分「签名过期」「签名不匹配」「CORS 预检失败」，413 单独看，400 里分「校验和不匹配」「分片顺序错误」。
- 孤儿分片：未完成会话数、未完成分片的总字节数、最老会话的年龄。这个指标直接对应账单。
- Abort 次数与原因：用户取消、超时、客户端崩溃、服务端主动清理。
- 去重命中率：命中越高，实际写入字节越少，但也要看是否存在跨租户泄露风险。
- 扫描延迟与隔离率：异步扫描的排队时间、命中恶意文件的比例。

账单可以按公式拆：

```text
月存储费 ≈ Σ 对象字节数 × 单价 + 未完成分片字节数 × 单价
月请求费 ≈ 上传请求数 + 分片请求数 + 完成请求数 + 下载请求数
月流量费 ≈ 下载字节数 × 出口单价
```

分片请求数近似为 `ceil(S/P) + 2`（创建和完成各一次）。把分片大小从 8 MiB 调到 64 MiB，1 GB 文件的请求数从 130 降到 18，但单次失败的重传成本从 8 MiB 升到 64 MiB。这个取舍要按网络质量做，不是单纯追求请求数最少。

告警建议设在「成功率连续五分钟低于阈值」「P95 超过目标的两倍」「孤儿分片字节数一天内增长超过阈值」「403 中签名过期占比突然升高」。最后一条往往是服务端时钟漂移或签名 TTL 配错，属于配置问题，不该让用户来承担。

日志里记录会话 ID、key、分片号、ETag、错误码和耗时，不记录完整签名 URL。跨服务追踪用同一个 trace ID，从申请签名一路带到完成校验，排查时才能把「客户端说传完了」和「服务端说没收到」对上。

## 小结

| 问题 | 结论 |
| --- | --- |
| 大文件为什么要直传 | 应用服务器代理字节会把网络时长变成进程占用，超时、内存、损坏都由此而来 |
| 预签名 PUT 和 POST 怎么选 | 需要 policy 强约束大小和前缀用 POST；单对象、已有大小校验用 PUT |
| 分片上传解决什么 | 可恢复性和并行吞吐，不解决内容正确性 |
| multipart ETag 能当 MD5 吗 | 不能，它是分片 MD5 拼接后的摘要再加分片数后缀 |
| 完整性怎么保证 | 客户端流式 SHA-256 加服务端大小与校验和复核，做双重校验 |
| 上传票的边界 | 一个方法、一个 key、短 TTL、必要时锁 Content-Type 和大小 |
| key 等于权限吗 | 不等于，授权必须在签名之前查归属 |
| 孤儿分片怎么清 | 主动 Abort 加生命周期 `AbortIncompleteMultipartUpload`，两道都要 |
| 断点续传以谁为准 | 服务端返回的偏移和分片列表，客户端记录只是提示 |
| 观测看什么 | 分阶段成功率、按大小分桶的 P95、孤儿分片字节数、4xx 分解 |

上传这件事的难点从来不在「把文件存下来」，而在「让不可信的网络、不可信的客户端和不可信的文件名，最终变成一个可验证、可授权、可清理的对象」。直传把字节从应用进程里拿走，分片把失败变成可恢复，校验把「传完了」变成「传对了」，访问控制把「知道地址」和「有权访问」分开。四件事各管一段，缺一段都会在某个深夜以另一种形式回来。

## 相关阅读

- [敢让匿名用户评论的底气：七层防线实战](/article/django-comment-system-guide/)
- [Django XSS 防御：bleach 白名单与渲染层转义](/article/django-bleach-xss-defense/)
- [接口幂等：重复请求为什么必须被设计掉](/article/api-idempotency-deep-dive/)
- [如何将 Django 后端部署到 PythonAnywhere](/article/django-pythonanywhere-deploy/)
