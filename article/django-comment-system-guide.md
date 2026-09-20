# 敢让匿名用户评论的底气：七层防线实战

> 适用栈：Django 6.0 + DRF 3.17 + Vue 3 + SQLite + PythonAnywhere
> 代码来源：真实博客 `backend/comments/` 全应用 + `frontend/src/components/CommentForm.vue` / `CommentList.vue`，全部可运行
> 阅读时间：约 35 分钟（超详细版） | 收获：一套“匿名可评、垃圾进不来、草稿漏不出去”的评论模板

## 前言：一夜 40 条广告评论逼我重做

评论功能刚上线时我的配置很天真：`AllowAny` + 默认限流（匿名 30/min），提交即展示。有天早上打开后台，一夜 40 条“代购 / 贷款 / 赌场”广告，混在真实读者留言里，删到手软。

重做后跑了三个月：广告 0 漏网（honeypot + 待审 + 3/min 拦掉 99%，剩下 1% 进待审箱点一下删除），真实评论从提交到展示平均 12 小时内（邮件即时提醒），前端一次广告都没闪过。

本文把这套评论系统拆成七层防线：**模型 → 读 → 写 → 嵌套 → 审核 → 通知 → 前端**，每层讲“防什么 + 真实代码 + 踩过的坑”。

**目录**

- 全景：一条评论的生死之旅
- 模型：自关联 + 审核开关，三行定生死
- 读接口：只给已审核，草稿一篇不漏
- 写接口：parent 归属 + honeypot + 3/min + 默认待审
- 嵌套序列化：depth 上限防爆栈、防循环、防大 payload
- 审核后台 + 邮件通知：fail_silently 保命
- 前端：校验、错误映射、骨架屏、回复、防抖
- 缺口与升级：XSS、敏感词、IP 封禁、读者通知
- 上线 Checklist（20 项）+ FAQ（12 问）

---

## 1. 全景：一条评论的生死之旅

```
读者填昵称/邮箱/内容 → POST /api/articles/<slug>/comments/
  → 限流（comment 3/min）：脚本刷 → 429
  → honeypot（website 字段）：机器人 → 400“检测到垃圾评论”
  → parent 归属校验：跨文章回复 → 404
  → 草稿 guard：未发布文章 → 404（当它不存在）
  → is_approved=False 入库 → 发邮件通知博主 → 前端“已提交待审核”
  → 博主后台 pending → 审核通过 → 读者刷新可见
```

七层每一层只干一件事，层层设卡。设计哲学：**匿名可评（别登录），但默认不可见（先审后发）**。个人博客流量小，先审后发零成本；日活上万再切“白名单免审 + 黑名单秒删”。

---

## 2. 模型：自关联 + 审核开关

```python
# backend/comments/models.py
class Comment(models.Model):
    article = models.ForeignKey(
        "articles.Article", on_delete=models.CASCADE,
        related_name="comments", verbose_name="所属文章",
    )
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True,
        related_name="replies", verbose_name="父评论",
    )
    author_name = models.CharField(max_length=64, verbose_name="昵称")
    author_email = models.EmailField(verbose_name="邮箱")
    content = models.TextField(verbose_name="评论内容")
    is_approved = models.BooleanField(default=False, verbose_name="是否通过")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        ordering = ["-created_at"]
```

三处关键决策：

1. **`is_approved` 默认 False**：数据库层面“默认不可见”，代码再怎么写 bug，裸查 `Comment.objects.all()` 也不会把待审捅到前台（前台 queryset 还会再滤一次，双保险）；
2. **`parent` 自关联 + `related_name="replies"`**：一级回复够用（见 5.x depth 上限），表结构支持无限级但接口只暴露两级，进可攻退可守；
3. **没有 `author_ip` 字段**：点赞表存了 IP+UA 做去重，评论没存 —— 隐私最小化。反 spam 靠限流 + honeypot + 审核，不存 IP 也够，且省掉 GDPR 合规烦恼。真被盯上再加（8.x）。

`article` 用字符串 `"articles.Article"` 避免循环 import，`on_delete=CASCADE` 删文章带走评论（个人博客合理；社区站改 `SET_NULL` 留档）。

---

## 3. 读接口：只给已审核，草稿一篇不漏

```python
# backend/comments/views.py
from rest_framework.throttling import ScopedRateThrottle

class ArticleCommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]  # 匿名可读可评
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "comment"  # 对应 settings 'comment': '3/minute'
    pagination_class = CommentPageNumberPagination  # 20/页，封顶 100

    def get_queryset(self):
        article = get_object_or_404(
            Article, slug=self.kwargs["article_slug"],
            status=Article.Status.PUBLISHED,  # 草稿/定时/归档 → 404，当它不存在
        )
        return Comment.objects.filter(
            article=article, is_approved=True, parent=None  # 只顶级+已审，回复走嵌套
        ).select_related("article").prefetch_related("replies__article")
```

四层过滤，顺序不能乱：

| 过滤 | 防什么 | 真实事故 |
|------|--------|---------|
| `status=PUBLISHED` | 草稿标题/定时文章被评论接口枚举出来 | 早期没加，`/articles/draft-slug/comments/` 200，等于宣告草稿存在 |
| `is_approved=True` | 待审广告/脏话被刷出来 | 上线第一夜 40 条广告的根因之一 |
| `parent=None` | 回复被当顶级重复展示 | 前端树+平铺双渲染，同一条出现两次 |
| `select/prefetch` | N+1（见 DRF 三件套那篇） | 20 条评论 ×（article+replies）= 40+ SQL |

注意 **`perform_create` 里又查了一次 article guard**（见 4.x）：读和写各 guard 各的，别复用 —— 读是 `get_queryset`，写是 `perform_create`，DRF 两条链路，少一处就漏一处。

分页 `20/页封顶 100`：评论比文章短，20 条一屏刚好；`max_page_size=100` 防 `?page_size=10000` 拖库（文章是 50，评论给 100 因为单条小）。

### 3.5 曾经的 bug：throttle 配了 scope 却没生效

注释里留着案底：

```python
# C-S3: actually apply the 'comment' scope (3/min) defined in settings —
# was previously falling back to the default anon throttle (30/min).
```

之前只写了 `throttle_scope = "comment"`，`throttle_classes` 用的默认（anon 30/min），`comment 3/min` 配了却从没生效 —— 广告脚本 1 分钟 30 条畅通无阻。修法就是上面代码：**`ScopedRateThrottle` + `throttle_scope` 必须成对出现**。教训：限流配完必用循环脚本打一遍（见 7.x 压测），别信“配了就行”。

---

## 4. 写接口：parent 归属 + honeypot + 默认待审

```python
def perform_create(self, serializer):
    article = get_object_or_404(
        Article, slug=self.kwargs["article_slug"],
        status=Article.Status.PUBLISHED,  # 写链路再 guard 一次
    )
    parent_id = self.request.data.get("parent")
    parent = None
    if parent_id:
        # 父评论必须属于同一篇文章：跨文章 parent → 404
        parent = get_object_or_404(Comment, pk=parent_id, article=article)

    # 蜜罐：正常人看不见（CSS 藏），机器人全填
    honeypot = self.request.data.get("website", "")
    if honeypot:
        from rest_framework.exceptions import ValidationError
        raise ValidationError({"detail": "检测到垃圾评论"})

    serializer.save(article=article, parent=parent, is_approved=False)
```

逐行拆：

1. **parent 归属校验**：`get_object_or_404(Comment, pk=parent_id, article=article)` 把“父评论属于本文”一次性断掉。不加的话，攻击者拿 A 文的评论 id 当 parent 发到 B 文，B 文读者点回复跳到 A 文，串台 + 信息泄露。细节：父评论未审核也能被回复吗？我允许（回复待审评论，整串一起审），社区站可收紧到 `is_approved=True` 才可回；
2. **honeypot 蜜罐**：字段名 `website` 是经典机器人诱饵（“网址”框机器人必填）。前端 `.hp-field{position:absolute;left:-9999px}` 藏起来，真人看不见 tab 也到不了（`tabindex="-1"`）。机器人 90% 中招，零成本拦第一波。注意：**别叫 `honeypot`**，叫 `website/url/company` 这种正常名，特征太明显机器人会绕；
3. **`is_approved=False` 硬编码**：`serializer.save(... is_approved=False)`，且 Serializer 里 `is_approved` 是 read_only（见 5.x），前端传 `{"is_approved": true}` 也会被忽略。**“客户端说已审”永远无效**，这条是铁律——所有权限字段（is_staff/is_approved/is_top）都必须 read_only + 服务端硬写。

配套 `settings`（三件套那篇配过，这里是评论视角）：`'comment': '3/minute'` —— 正常人 1 分钟写不完 3 条（打字+思考），脚本直接 429。前端 429 文案别写“限流”，写“评论太频繁啦，喝口水再发～”（见 7.x）。

---

## 5. 嵌套序列化：depth 上限 + 邮箱永不外泄

```python
# backend/comments/serializers.py
class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "article", "article_slug", "article_title",
                  "parent", "author_name", "author_email",
                  "content", "is_approved", "created_at", "replies"]
        read_only_fields = ["article", "article_slug", "article_title",
                            "is_approved", "created_at"]
        extra_kwargs = {"author_email": {"write_only": True}}  # 只收不吐

    def get_replies(self, obj):
        depth = self.context.get('depth', 0) if self.context else 0
        if depth >= 2:
            return []  # 最多两级，第三级直接截
        replies = [r for r in obj.replies.all() if r.is_approved]
        return CommentSerializer(
            replies, many=True,
            context={**(self.context or {}), 'depth': depth + 1},
        ).data
```

三个保命设计：

1. **`author_email: write_only`**：收（建评论要邮箱，备用通知+认领），但 GET 永远不吐。响应里出现过一次真实邮箱就是一次泄露事故。审核后台看邮箱走 `admin/` 认证接口，前台 JSON 里没有，爬虫拖了也没用；
2. **`depth >= 2` 截断**：防三件事 —— 深嵌套爆调用栈、恶意 parent 环（A→B→A 无限递归）、超长串 payload 拖死前端。`[r for r in ... if r.is_approved]` 内存里再滤一次待审（queryset prefetch 拉的是全量，展示只给已审）；
3. **read_only 全家桶**：`article/is_approved/created_at` 全只读。`article` 由 URL 的 slug 决定（`perform_create` 传），`created_at` 自动，前端传了也忽略。

前端渲染用 `{{ comment.content }}` 插值（自动 HTML 转义），**永远别 `v-html`** —— 评论 XSS 的正确防线在渲染层转义，不在入库层。各别允许 Markdown 评论的站才入库 `bleach`（见我 XSS 那篇），纯文本评论转义就够。

---

## 6. 审核后台 + 邮件通知

```python
# backend/comments/admin_views.py（IsAdminUser 全锁）
class CommentAdminViewSet(mixins.DestroyModelMixin, viewsets.GenericViewSet):
    @action(detail=False, methods=["get"], url_path="pending")
    def pending(self, request): ...    # 待审箱

    @action(detail=True, methods=["put"])
    def approve(self, request, pk=None):
        comment.is_approved = True
        comment.save(update_fields=["is_approved"])  # 只写一列，不碰别的
```

```python
# backend/comments/signals.py
@receiver(post_save, sender=Comment)
def notify_new_comment(sender, instance, created, **kwargs):
    if not created:
        return
    body = (f"文章：{instance.article.title}\n作者：{instance.author_name}\n"
            f"邮箱：{instance.author_email}\n内容：\n{instance.content[:500]}\n\n"
            f"查看：{blog_url}/article/{instance.article.slug}/\n"
            f"审核：{blog_url}/admin/comments\n")
    try:
        send_mail(subject=f"💬 新评论待审核 — {instance.article.title}",
                  message=body, from_email=settings.DEFAULT_FROM_EMAIL,
                  recipient_list=[settings.DEFAULT_FROM_EMAIL],
                  fail_silently=True)
    except Exception as exc:
        logger.warning("Failed to send comment notification: %s", exc)
```

- **`update_fields=["is_approved"]`**：审核只碰一列，避免并发改别的字段被覆盖；
- **邮件 `fail_silently=True` + logger**：SMTP 挂了（PA 免费版偶发）不能让评论提交 500 —— 通知是旁路，入库是主路，主路永远优先。`content[:500]` 防 10 万字刷屏塞爆邮箱；
- **审核 SLA**：邮件即时到，我设 24h 内必审。前端提交后显示“评论已提交，审核后展示”，预期管理一步到位。

---

## 7. 前端：校验、错误映射、骨架屏、回复、防抖

后端七层，前端四件套接住体验：

**（1）先本地校验，再撞后端**（`CommentForm.vue`）：昵称非空、邮箱正则、内容 ≥3 字。省 429 配额，也省等待。

**（2）后端字段错映射回字段**：`{"author_email": ["Enter a valid email"]}` → 邮箱框下红字；`{"detail": "检测到垃圾评论"}` → 顶部通栏。真人永远看不到蜜罐那条（除非手填了隐藏框，那 400 该吃）。

**（3）列表骨架屏 + 相对时间 + 头像色**（`CommentList.vue`）：加载中 3 条 shimmer 占位；`刚刚/3分钟前/2天前`；昵称首字哈希 12 色头像。无头像系统的匿名评论最体面解法。

**（4）提交防抖 + 429 人话**：`submitting` 锁按钮 + spinner，成功“评论已提交！”3 秒；429  bust 显示“评论太频繁啦，稍后再试～”而不是 raw error。回复是内联 `CommentForm(parent-id)`，提交后 `fetchComments()` 整树刷新（评论量小，不用局部 patch）。

压测（上线前必跑）：

```bash
# 1 分钟 5 条，第 4 条起 429
for i in 1 2 3 4 5; do curl -s -X POST http://127.0.0.1:8000/api/articles/<slug>/comments/ \
  -H "Content-Type: application/json" \
  -d '{"author_name":"t","author_email":"t@t.com","content":"test '$i'"}'; echo; done
# 蜜罐：带 website 必 400
curl -s -X POST ... -d '{"author_name":"b","author_email":"b@b.com","content":"x","website":"http://spam"}'
# 草稿：未发布 slug 必 404
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/articles/draft-slug/comments/
```

---

## 8. 缺口与升级（诚实章节）

当前方案的四块已知短板，按优先级排：

1. **无敏感词预审**：广告进待审箱要人点删。升级：`sensitive-words` 词库命中直接 `is_approved=False` + 标记 `flagged=True` 优先审；别自动拒（误伤正常词），只做排序。
2. **无 IP 封禁**：同一脚本换邮箱可 3/min 持续灌待审箱（前台无感，后台烦）。升级：`django-ratelimit` 按 IP `5/hour` 封灌箱，或复用点赞的 IP+UA 指纹记频次。现在没存 IP，加字段 + 迁移（见模型那篇迁移流程）。
3. **读者无“被回复通知”**：读者回来看才知道。升级：`author_email` 派用场 —— 被回复/被审核通过时发一封（带退订 footer，别成 spam）。 approve 里加 10 行即可，记得 `fail_silently`。
4. **无评论编辑/删除（读者侧）**：发错字只能找博主。升级：发评论时 Set-Cookie 一个 `comment_token`（UUID），凭 token 15 分钟内可删；或登录后绑定 user。个人博客优先级最低。

XSS 特别说明：现在安全是因为前端 `{{ }}` 转义 + 后台 Django admin 转义。**哪天要上 Markdown 评论/楼中楼富文本，必须入库前 `bleach` 白名单**（`b/i/code/a[href]` 极小集），抄我 XSS 那篇的 `ALLOWED_TAGS` 即可。

---

## 9. 上线 Checklist（20 项）+ FAQ（12 问）

**后端（11）**

- [ ] `is_approved` 默认 False，前台 queryset 三滤（published+approved+parent=None）
- [ ] 读/写两条链路各 guard 草稿（get_queryset + perform_create）
- [ ] parent 归属同一文章，跨文章 404
- [ ] honeypot 字段正常名（website），填了 400
- [ ] `comment 3/min` 用 ScopedRateThrottle + scope 成对，循环脚本验 429
- [ ] Serializer：email write_only，is_approved/article/created read_only
- [ ] replies depth ≤2 + 只吐已审，防环防爆栈
- [ ] 审核 `update_fields` 单列，后台 IsAdminUser 全锁
- [ ] 邮件 `fail_silently` + 日志，`content[:500]`
- [ ] 分页 20/100 封顶，N+1（select+prefetch）≤3 SQL
- [ ] 前端永远插值渲染，`v-html` 禁区

**前端（9）**

- [ ] 本地三校验（昵称/邮箱/≥3 字）先行
- [ ] 后端字段错映射回字段，蜜罐错走通栏
- [ ] 骨架屏 + 空态 + 相对时间 + 哈希头像
- [ ] 提交锁 + spinner + 成功 3 秒提示
- [ ] 429 人话，按钮防抖
- [ ] 回复内联，提交后整树刷新
- [ ] 草稿文章页不渲染评论区（别给 404 机会）
- [ ] 邮箱框 `type=email` + `autocomplete=email`
- [ ] 移动端回复缩进收窄（12px），别溢出

**FAQ**

- **Q：先审后发会不会劝退评论？** A：个人博客量小，24h 内审 + 邮件即时提醒，读者体感“博主很活”。量大再切白名单免审。
- **Q：honeypot 会不会误伤真人？** A：CSS 隐藏 + tabindex -1，真人填不到。读屏器用户？`aria-hidden=true` 跳过，无障碍也 OK。
- **Q：3/min 会不会太严？** A：正常人 1 分钟写不完 3 条。博主自己回评论多？登录走 user 档或后台直接回。
- **Q：parent 能嵌套几级？** A：表无限，接口两级。三级自动截，想盖楼去开新顶级。
- **Q：邮箱会被爬走吗？** A：write_only，GET 无此字段。后台看走认证接口。
- **Q：草稿评论 404 还是 403？** A：404。当它不存在，别告诉枚举者“有但不给你看”。
- **Q：广告灌待审箱怎么办？** A：前台无感，后台批量删。现在 3/min + 蜜罐后极少，量大上 IP 封禁（8.x）。
- **Q：评论支持 Markdown/图片吗？** A：不支持，纯文本。开了就得 bleach + 对象存储两套，个人博客 ROI 低。
- **Q：能编辑/删除自己的评论吗？** A：暂不能，发错联系博主。方案在 8.4。
- **Q：被回复有通知吗？** A：暂无，回来看。`author_email` 就是为它留的，approve 加 10 行。
- **Q：删文章评论还在吗？** A：CASCADE 带走。社区站改 SET_NULL 留档。
- **Q：要存 IP 吗？** A：现在不存，够用。被盯上再加字段+迁移+隐私声明。

---

## 结语

评论系统就一句话：**匿名可评是体验，默认待审是底线**。七层防线里 honeypot 和 3/min 拦机器，审核和 read_only 拦人心，depth 和 write_only 拦事故。先把这套跑顺，敏感词、IP 封禁、读者通知都是水到渠成的加法。

下一篇预告：**《从 SQLite 到 PostgreSQL：Django 生产数据库迁移避坑》** —— 评论点赞并发上来后，SQLite 写锁是下一个瓶颈。到时讲 `pgloader` 一键迁移、PA 上配 Postgres、全文检索替代 `icontains`，敬请期待。

> 完整代码：`backend/comments/models.py|views.py|serializers.py|signals.py|admin_views.py`、`frontend/src/components/CommentForm.vue|CommentList.vue`
> 评论区聊聊：你的 honeypot 叫什么名？限流几档？误伤过真人吗？
