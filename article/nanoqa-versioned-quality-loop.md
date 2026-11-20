---
title: "NanoQA：一套测试管理系统的四道硬边界"
slug: nanoqa-versioned-quality-loop
cover_image: /photos/nanoqa-versioned-quality-loop-cover.png
date: 2026-11-20
tags: [Django, Vue, DRF, 测试, 架构]
---

> 适用读者：正在造内部工具的全栈工程师；被「测试用例改了但历史报告对不上」坑过的人；想知道乐观锁、状态机、审计 diff 这些词怎么落到真实代码里的开发者
> 结论先行：NanoQA 有 26 个模型、67 条路由、73 个视图类、232 条后端测试。它真正难的不是「把 Excel 搬进网页」，而是四条约束：用例必须版本化、执行结果必须绑定版本快照、并发编辑必须能检测冲突、每一次变更必须和业务写入落进同一个事务。这四条约束决定了这份数据五年后还能不能当证据用。代价也很清楚：权限不做缓存所以每次请求都要算一遍，重复检测是 O(n²) 的 800 条要跑 55 秒，AI 目前只有离线 Mock
> 阅读时间：约 36 分钟 | 难度：进阶 | 收获：一套质量闭环的数据模型 + 版本快照/乐观锁/状态机/审计的具体实现 + 两条真实基准数据（性能基线、重复检测的二次增长曲线）

**目录**

- 这不是又一个 CRUD
- 数据模型：一条闭环，不是六张孤岛
- 用例必须版本化
- 执行绑定快照：让历史报告不会说谎
- 乐观锁：两个人同时改一条用例
- 状态机：把「谁能变成谁」写成一张表
- 编号生成：select_for_update 的单调递增
- 软删除：质量资产不做物理删除
- RBAC：27 个权限与两处角色并集
- 审计：和业务写入同一个事务
- 失败即缺陷：一个事务里的四张表
- 导入导出：先 dry_run 再落库
- 搜索：把 q 语法当查询语言
- 路由表：项目上下文如何贯穿每一页
- 232 条测试是怎么组织的
- 为什么导出会带上模块路径
- 命令面板：一个跨模块的搜索入口
- 响应信封：一个 code 字段承担的四种语义
- 界面与后端的契约：版本快照组件
- AI：离线 Mock 也是一种可验收
- 实测：232 条测试与性能基线
- 重复检测的 O(n²) 真相
- 仍然存在的边界
- 小结

---

## 这不是又一个 CRUD

测试管理系统这个品类，看起来是最容易做成 CRUD 的那一类：用例增删改查、计划增删改查、缺陷增删改查。任何一个后端练手项目都能在一周内堆出界面。

但真实 QA 团队用起来，最先崩的从来不是界面，而是**可信度**。三个具体的崩溃现场：

- 用例昨天改了第三步，今天翻三个月前的测试报告，失败标题变了。到底是当时就错了，还是后来改的？
- 两个测试工程师同时打开同一条用例，A 改了优先级，B 改了步骤，谁覆盖了谁？
- 缺陷从「Open」直接被改成「Closed」，跳过了「Resolved」，统计里的修复时长就永远是 0。

这三件事的共同点：它们都不是 UI 问题，是**数据模型把可追溯性丢掉**了。NanoQA 的全部后端复杂度，本质上都在回答这三个问题。

先给规模。这不是一个演示仓库：

```text
backend  211 个 py 文件   12,132 行
frontend 36 个视图        17,395 行 (vue + ts)
模型 26 个   路由 67 条   视图类 73 个   序列化器 55 个   service 文件 39 个
迁移 19 个   后端测试 232 条
```

232 这个数字后面还会用到——它不是估算，是 `def test_` 的真实计数。

## 数据模型：一条闭环，不是六张孤岛

README 里写的是「需求 → 用例 → 计划 → 执行 → 缺陷 → 报告」。落到表结构上，它是一条有方向的链，而不是六个平行模块：

```text
Requirement ──测试覆盖──▶ TestCase ──选入──▶ TestPlan ──开轮次──▶ TestRun
     │                       │                                      │
     │                       │                                      ▼
     │                       │                                  TestResult
     │                       │                                      │
     │                       └──── TestCaseVersion ◀──绑定──────────┘
     │                                                              │
     └────────── RequirementDefect ◀── Defect ──▶ TestResultDefect ──┘
                                       │
                                       └──▶ TestCaseDefect
```

关键在中间那一行：`TestResult` 同时指向 `TestCase` 和 `TestCaseVersion`。这一个设计决定了后面所有可追溯性，也是全项目注释里出现次数最多的一句话——「坑 4」。

## 用例必须版本化

先看主表。`TestCase` 本身只存「当前状态」，内容进版本表：

```python
class TestCase(SoftDeleteModel):
    case_key = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=255)
    precondition = models.TextField(blank=True, default="")
    priority = models.CharField(max_length=2, choices=PRIORITY_CHOICES, default="P1")
    case_type = models.CharField(max_length=16, choices=TYPE_CHOICES, default="functional")
    automation_status = models.CharField(max_length=16, choices=AUTOMATION_CHOICES, default="manual")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="draft")
    current_version = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
```

`current_version` 是个游标，指向 `TestCaseVersion` 里哪一行是当前生效版本。版本表才是内容真相：

```python
class TestCaseVersion(models.Model):
    """用例版本快照：历史执行结果必须绑定版本（坑 4）。
    steps 为 JSONB：[{order,action,expected}]。"""

    test_case = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name="versions")
    version = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    steps = models.JSONField(default=list)
    expected_result = models.TextField(blank=True, default="")
    change_summary = models.CharField(max_length=255, blank=True, default="")
```

版本不是「每次保存都 +1」。只有内容字段真的变了才建新版本，改优先级、改负责人、改标签都不算：

```python
content_changed = (
    new_title != case.title
    or new_precondition != case.precondition
    or new_description != case.description
    or new_steps != version.steps
    or new_expected != version.expected_result
)
```

这个区分很重要。否则一个人把优先级从 P1 调到 P0，也会在版本历史里留下一条「内容变更」，版本号很快失去意义。触发新版本的内容字段被单独列成常量：

```python
CONTENT_FIELDS = ["title", "precondition", "steps", "expected_result", "description"]
```

于是「这条用例改过几次」这个问题有了唯一正确答案：`current_version` 减去 1。而不是去数审计日志。

## 执行绑定快照：让历史报告不会说谎

现在回到那三个崩溃现场的第一个。如果 `TestResult` 只存 `test_case_id`，那么报告渲染失败用例标题时，读的是**现在**的用例标题。三个月后有人改了标题，历史报告就跟着变了——而且是静默地变。

所以开轮次时，为每个计划内用例预建一条 `not_run` 结果，并当场锁定当时的当前版本对象：

```python
version_map = {
    version.test_case_id: version
    for version in TestCaseVersion.objects.filter(
        test_case_id__in=case_ids, version=F("test_case__current_version")
    )
}
missing = [pk for pk in case_ids if pk not in version_map]
if missing:
    raise BusinessConflictError(f"用例缺少版本快照，无法执行: {missing}")
```

然后批量预建：

```python
TestResult.objects.bulk_create([
    TestResult(
        test_run=run,
        test_case_id=pk,
        test_case_version=version_map[pk],
        status="not_run",
    )
    for pk in case_ids
])
```

注意 `version_map` 的过滤条件用的是 `version=F("test_case__current_version")`——一个跨表比较，只在查询里成立，不需要 Python 侧再筛一遍。

这里有一个容易被忽略的选择：预建 `not_run` 结果，而不是等执行时才 insert。好处是三重的——轮次一创建，分母就确定了；「未执行」和「执行了但没提交」不再混淆；批量提交时可以直接 `filter(test_run=run, test_case_id=...)` 命中已存在的行，不需要 upsert。

报告侧严格遵守这个契约：

```python
def _failed_cases(results) -> list[dict]:
    failed = (
        results.filter(status="failed")
        .select_related("test_case", "test_case_version", ...)
    )
    return [
        {
            "result_id": result.id,
            "case_key": result.test_case.case_key,
            "title": result.test_case_version.title,   # 快照，不是现值
            ...
        }
        for result in failed
    ]
```

`result.test_case_version.title` 和 `result.test_case.title` 只差一个下划线，但它们读的是两张表。前者永远不会变。

## 乐观锁：两个人同时改一条用例

第二个崩溃现场。这个问题最朴素的解法是「后写覆盖先写」，代价是有人在不知情的情况下丢掉工作。NanoQA 选了显式冲突。

客户端拿到数据时同时拿到 `updated_at`，提交时原样回传。服务端把它塞进 WHERE：

```python
def save_with_lock(obj, expected_updated_at, update_fields: list[str]):
    """带乐观锁的更新：WHERE id=%s AND updated_at=%s，0 行 → 冲突。"""
    expected = parse_updated_at(expected_updated_at)
    new_updated_at = timezone.now()
    values = {field: getattr(obj, field) for field in update_fields}
    values["updated_at"] = new_updated_at

    rows = type(obj).objects.filter(pk=obj.pk, updated_at=expected).update(**values)
    if rows == 0:
        exists = type(obj).all_objects.filter(pk=obj.pk).exists() ...
        if not exists:
            raise NotFoundError("资源不存在")
        raise OptimisticLockError("该记录已被其他用户修改，请刷新后重新编辑")
    obj.updated_at = new_updated_at
    return obj
```

三个细节值得说。

第一，`0 行` 有两种可能：并发冲突，或者这条记录根本没了。前者该提示刷新重试，后者该提示不存在。所以 `rows == 0` 之后要再探一次 `exists()`，把 404 和 409 分开。用 `all_objects` 是因为软删除后 `objects` 看不到，但「存在但被删了」和「从来没存在过」都需要正确归类。

第二，时间戳必须原样回传，不允许前端格式化。`parse_updated_at` 的注释写得很直白：

```python
"""解析客户端回传的 updated_at（ISO 微秒字符串原样回传，禁止前端格式化）。"""
```

原因很实际：前端只要做过一次 `toLocaleString`，微秒就没了，锁粒度直接退化到毫秒，同一毫秒内的两次写入又会互相覆盖。

第三，用 `.update()` 而不是 `save()`。Django 的 `save()` 会自己写 `updated_at`，那就没有 WHERE 条件可言了。必须绕过 ORM 的时间戳行为，让 `updated_at` 成为条件而不是结果。

这条锁不只用在用例上，缺陷更新也复用同一套：先比对，再落库，最后把 diff 写进审计。

## 状态机：把「谁能变成谁」写成一张表

第三个崩溃现场：缺陷从 Open 直接跳到 Closed。修法不是在前端藏掉那个按钮——前端守卫只能防误操作，防不了直接调 API。修法是在 service 层把合法转移写成显式表：

```python
DEFECT_TRANSITIONS = {
    "Open": {"In Progress", "Rejected", "Duplicate", "Closed"},
    "In Progress": {"Resolved", "Open", "Rejected", "Duplicate"},
    "Resolved": {"Closed", "Reopened", "In Progress"},
    "Reopened": {"In Progress", "Resolved", "Open"},
    "Closed": {"Reopened"},
    "Rejected": {"Open"},
    "Duplicate": {"Open"},
}
```

四张表：testcase、testplan、defect、requirement。校验函数只有一处：

```python
def validate_transition(entity: str, from_status: str, to_status: str):
    if from_status == to_status:
        return
    table = TABLES.get(entity)
    if table is None:
        raise InvalidTransitionError(f"未知状态机: {entity}")
    allowed = table.get(from_status)
    if allowed is None:
        raise InvalidTransitionError(f"未知状态: {from_status}")
    if to_status not in allowed:
        raise InvalidTransitionError(f"状态不能从 {from_status} 变更为 {to_status}")
```

源码注释里留着一条设计决策，我觉得比代码本身更值得抄：

```text
D5 决策：在文档链式转移基础上允许必要的回退转移（Deprecated→Active、
Closed→Reopened、Rejected→Open），贴合真实 QA 流程。
```

纯链式状态机在教科书里很漂亮，在真实流程里会把人逼疯。用例被误标废弃要能恢复，缺陷关了又复发要能重开，需求被拒了改了又可以再来。这些回退边是产品需求的直接映射，写进表里比散落在十几个 `if` 里可读得多。

配套的是时间戳维护。状态变更时 `resolved_at` 和 `closed_at` 自动打点，但只在「第一次」进入时打：

```python
if status_changed:
    now = timezone.now()
    if new_status == Defect.STATUS_RESOLVED and defect.resolved_at is None:
        defect.resolved_at = now
    if new_status == Defect.STATUS_CLOSED:
        defect.closed_at = now
    if new_status in REOPEN_STATUSES:
        defect.closed_at = None
```

`defect.resolved_at is None` 这个判断让 Resolved → Closed → Reopened → Resolved 不会把首次修复时间刷成最后一次。统计口径经常就栽在这种地方。

## 编号生成：select_for_update 的单调递增

`SHOP-TC-000001` 这种业务编号有个隐性要求：不能重复，不能跳号，不能因为并发而回退。三个要求叠起来就排除了「查最大 ID 再 +1」——两个请求会拿到同一个值。

实现是行锁：

```python
def next_key(project: Project, entity: str, width: int = 6) -> str:
    """生成下一个业务编号，如 SHOP-TC-000001。必须在调用方事务内使用。"""
    if entity not in {c[0] for c in NumberSequence.ENTITY_CHOICES}:
        raise ValueError(f"unknown entity: {entity}")
    with transaction.atomic():
        seq, _created = (
            NumberSequence.objects.select_for_update()
            .get_or_create(project=project, entity=entity, defaults={"next_value": 1})
        )
        value = seq.next_value
        seq.next_value = value + 1
        seq.save(update_fields=["next_value"])
    return format_key(project.key, entity, value, width=width)
```

`select_for_update()` 在 PostgreSQL 上是 `SELECT ... FOR UPDATE`，把这一行锁到事务结束。`get_or_create` 里带 `select_for_update` 有点微妙——它只锁已存在的情况，新建那一路靠唯一约束兜底。所以并发取号测试必须单独跑，而且要做成事务级用例：

```text
测试隔离：每个测试库独立命名；TransactionTestCase 的 flush 会截断数据迁移种子
（Role/Permission），测试基座已内置自愈（ensure_rbac_seed），并发取号测试已开启
serialized_rollback。
```

`serialized_rollback` 这一点值得单独讲。Django 的 `TransactionTestCase` 默认会 `flush()` 整个库——如果种子数据（27 个权限、5 个系统角色）是数据迁移灌进去的，flush 之后它们就没了，后续所有权限测试会报 `Role.DoesNotExist`。README 的 FAQ 里专门留了这条排查记录，说明它真的坑过人。

## 软删除：质量资产不做物理删除

`TestCase` 继承的是 `SoftDeleteModel`，不是 `TimestampedModel`：

```python
class SoftDeleteModel(TimestampedModel):
    """软删除基类：测试数据是质量资产，不做物理删除（§48）。"""

    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()
```

两个 manager 的分工是关键：`objects` 默认只看活的，`all_objects` 能看到已删的。删除和恢复都是一次 `update_fields` 写入：

```python
def soft_delete(self):
    self.deleted_at = timezone.now()
    self.save(update_fields=["deleted_at", "updated_at"])
```

为什么测试数据不该物理删？因为它同时是三个东西的证据：某个用例曾经存在过（覆盖率分母）、某次失败对应的是哪条用例（报告上下文）、以及某个需求当时被哪些用例覆盖过（评审依据）。删掉任何一条，历史报告就会出现空洞。

配套代价是查询必须小心。`TestResult` 指向的用例如果被软删，`select_related("test_case")` 会拿不到（默认 manager 过滤掉了）。这类问题只能在测试里暴露，所以 `executions` 目录下有专门的 `test_results.py`。

## RBAC：27 个权限与两处角色并集

权限全集写成一个列表，作为种子数据来源和校验白名单：

```python
PERMISSION_CODENAMES = [
    "project.read", "project.create", "project.update", "project.delete",
    "requirement.read", "requirement.create", "requirement.update", "requirement.delete",
    "testcase.read", "testcase.create", "testcase.update", "testcase.delete",
    "testcase.execute", "testcase.review",
    "testplan.read", "testplan.create", "testplan.update", "testplan.delete", "testplan.execute",
    "defect.read", "defect.create", "defect.update", "defect.delete",
    "report.read",
    "user.manage", "role.manage", "audit.read",
]
```

数一下是 27 个。五个系统角色（admin / pm / qa / dev / viewer）是这些权限的不同子集。

真正值得讲的是解析逻辑。用户在项目下的权限 = 项目角色权限 ∪ 组织角色权限：

```python
def permissions_for_user(user, project) -> set[str]:
    """用户在项目下的权限 = 项目角色权限 ∪ 组织角色权限。

    v0.1 不做缓存：成员/角色变更需要即时生效（无失效机制的缓存会造成 60s 权限滞后）。
    """
    ...
    role_ids: set[int] = set()
    if project is not None:
        role_ids.update(project.members.filter(user=user).values_list("role_id", flat=True))
        role_ids.update(project.organization.members.filter(user=user).values_list("role_id", flat=True))
    return _role_permissions(role_ids)
```

这段注释里的取舍很有代表性：**没有失效机制的缓存会造成 60 秒权限滞后**。一个被撤销的测试工程师，在被撤销后的一分钟内还能删用例——这在审计上是不接受的。所以宁可每次请求多两条查询。

权限判定挂在视图基类上，按 HTTP 方法映射权限码，而不是每个视图写一遍 `if`：

```python
class ProjectApiView(APIView):
    """按 HTTP 方法映射权限码的项目级视图基类。"""

    permission_classes = [IsAuthenticated, HasProjectPermission]
    method_permissions: dict = {}

    @property
    def permission_codename(self):
        return self.method_permissions.get(self.request.method, "")
```

于是视图声明退化成一行字典：

```python
class TestRunResultListCreateView(RunObjectMixin, ProjectApiView):
    method_permissions = {"GET": "testplan.read", "POST": "testcase.execute"}
```

GET 要计划读权限、POST 要用例执行权限——同一个 URL 两种方法两种权限，不用写两个类。

还有一个容易漏的点：`resolve_project` 的解析顺序。有的视图从 URL 拿 `project_id`，有的从对象反查（`result.test_run.project`），有的在 `get_project()` 里自定义。基类用缓存 + 三种兜底统一掉：

```python
cached = getattr(request, "_nano_project", None)
if cached is not None:
    return cached
...
request._nano_project = project
```

不缓存的话，权限校验一次、业务逻辑一次、审计又一次，同一个项目要查三遍。

## 审计：和业务写入同一个事务

审计最容易做错的地方是「异步记录」。业务写成功了，审计写失败了，于是数据库里有一条没有证据的变更。

所以约定是：审计调用必须落在与业务相同的 `transaction.atomic()` 里。创建用例是这么写的：

```python
def create_case(project, data: dict, user, request=None) -> TestCase:
    """创建用例：编号 + 用例 + v1 版本 + 审计 同事务。"""
    with transaction.atomic():
        case = TestCase.objects.create(...)
        create_version(case, version=1, ...)
        set_tags(case, data.get("tag_ids"))
        AuditService.record(
            "create", case, request=request, user=user,
            new_data=_audit_snapshot(case, [...], data["steps"], data.get("expected_result") or ""),
        )
    return case
```

审计存的是**字段级 diff**，不是整条记录快照。更新时先拍旧快照，改完拍新快照，然后只保留差异：

```python
old_diff, new_diff = model_diff(old_snapshot, new_snapshot)
AuditService.record(
    "update", case, request=request, user=user,
    old_data=old_diff or None, new_data=new_diff or None,
)
```

`old_data or None` 也有用意：没有差异就存 `null`，而不是存空字典。否则「改了但没变内容」和「只是点了一下保存」在查询时无法区分。

审计行本身记录十来个字段：`organization / project / user / action / object_type / object_id / object_ref / old_data / new_data / ip_address / user_agent / request_id`。另外留了一个适配器兜种脏数据：

```python
def record_audit(action, obj, request=None, **kwargs):
    """审计适配：请求缺 User-Agent 头时补空串（common/utils.user_agent 会返回 None，
    而 AuditLog.user_agent 非空）。建议后续在 common/utils.py 修复。"""
```

这种「在调用点打补丁并写明后续该在哪修」的注释，比悄悄 `or ""` 好得多。

缺陷的状态时间线直接由审计日志反推，不需要单独建事件表：

```python
def defect_timeline(defect: Defect) -> list[dict]:
    """状态时间线：来自 AuditLog(object_type="defect")，按时间升序。"""
    logs = (
        AuditLog.objects.filter(object_type="defect", object_id=defect.pk)
        .select_related("user")
        .order_by("created_at", "id")
    )
```

`order_by("created_at", "id")` 里的第二个字段不是装饰。同一毫秒可能产生两条审计，只按时间排序结果不稳定，加上自增主键才能保证时间线严格单调。

## 失败即缺陷：一个事务里的四张表

从执行结果直接建缺陷，是质量闭环上最紧的一段。它一次要写四张表：缺陷本体、结果↔缺陷、用例↔缺陷、审计。四张表必须同生共死：

```python
def create_defect_from_result(request, result: TestResult, data: dict) -> Defect:
    run = result.test_run
    case = result.test_case
    description = data.get("description") or _default_description(result)
    ...
    with transaction.atomic():
        defect = Defect.objects.create(
            organization=run.organization,
            project=run.project,
            key=next_key(run.project, "BUG"),
            title=(data.get("title") or f"[失败] {case.case_key} {case.title}")[:255],
            ...
        )
        TestResultDefect.objects.create(test_result=result, defect=defect)
        TestCaseDefect.objects.create(test_case=case, defect=defect)
        AuditService.record("create", defect, request=request, old_data=None, new_data={...})
    return defect
```

注意 `next_key(run.project, "BUG")` 在事务里取号——和上面行锁那一节对上。如果取号在事务外，回滚时会留下一个空洞编号。

默认描述是从版本快照拼出来的，而不是从当前用例：

```python
def _default_description(result: TestResult) -> str:
    run = result.test_run
    version = result.test_case_version
    lines = [
        f"用例：{result.test_case.case_key} {version.title}",
        f"执行轮次：{run.name}（环境 {run.environment or '-'} / 版本 {run.build_version or '-'}）",
        "",
    ]
    if version.precondition:
        lines += ["前置条件：", version.precondition, ""]
    lines.append("步骤：")
    for step in sorted(version.steps or [], key=lambda item: item.get("order", 0)):
        lines.append(f"{step.get('order', '')}. {step.get('action', '')}")
        if step.get("expected"):
            lines.append(f"   预期结果：{step['expected']}")
```

于是缺陷报告自带「当时的步骤」，开发拿着单子就能复现，不用去系统里翻历史版本。`sorted(..., key=order)` 是因为 `steps` 是 JSONB 数组，顺序没有数据库层保证。

接口层还留了一个温和的提醒：非失败结果也能建缺陷，但返回 warning：

```python
warning = None
if result.status != "failed":
    warning = f"当前执行结果状态为 {result.status}，非失败结果，缺陷仍已创建并关联"
```

这里没有硬拦。真实场景里确实存在「执行标了通过，但人工发现了问题」——拦掉反而逼人去绕过流程。

## 导入导出：先 dry_run 再落库

从 Excel 迁移是这类系统的必经关口，也是最容易做坏的地方：用户传了 500 行，导入到第 300 行报错，前 299 行已经落库了。

NanoQA 的做法是同一套校验代码跑两遍，`dry_run` 决定落不落库：

```text
导入流程严格按 §61：上传 → 字段映射 → 数据预览 → 错误检查 → 确认导入，
预览（dry_run=True）只解析校验不落库；确认（dry_run=False）复用同一套校验，
合法行批量入库（用例 + 版本 1 快照 + 编号递增），非法行跳过并逐行回报。
```

「复用同一套校验」是重点。如果预览用一套宽松校验、导入用一套严格校验，用户会看到「预览全绿、导入全红」。同一份代码意味着预览结果就是承诺。

导出的列定义是数据而非代码，顺序即表头顺序：

```python
EXPORT_COLUMNS = [
    ("case_key", "用例编号"),
    ("title", "标题"),
    ("module_path", "模块路径"),
    ("priority", "优先级"),
    ("case_type", "类型"),
    ("status", "状态"),
    ("precondition", "前置条件"),
    ("steps", "步骤"),
    ("expected_result", "预期结果"),
    ("tags", "标签"),
    ("owner", "负责人"),
]
```

步骤导出成可读文本，回导时能被 `parse_steps` 解析——于是导出的文件本身就是一个合法的导入模板。这一条让「导出→改→导入」成为可用的批量编辑路径。

限制也写死在服务层，而不是只在前端提示：`MAX_FILE_SIZE = 10 * 1024 * 1024`，`ALLOWED_EXTENSIONS = {"csv", "xlsx"}`。前端限制是体验，后端限制是边界。

## 搜索：把 q 语法当查询语言

列表页给了一个 `q` 参数，支持键值对：

```text
q 语法：`priority:P0 status:active module:login tag:smoke automation:automated`，
token 之间 AND；非法 token（未知 key / 非法值 / 空值）退化为普通文本。
```

「非法 token 退化为普通文本」这个决定很实用。用户输入 `login:超时`，本意可能是搜索包含这两个词的内容，而不是被一个错误弹窗打断。宽松解析比严格报错更适合搜索框。

实现上，值域用白名单，命中才转成过滤条件：

```python
PRIORITY_VALUES = {"p0": "P0", "p1": "P1", "p2": "P2", "p3": "P3"}
STATUS_VALUES = {"draft", "active", "deprecated", "archived"}
...
if key == "priority" and value.lower() in PRIORITY_VALUES:
    result.priority.append(PRIORITY_VALUES[value.lower()])
elif key == "status" and value.lower() in STATUS_VALUES:
    result.status.append(value.lower())
...
else:
    result.text.append(raw)
```

文本搜索要能搜到「当前版本的预期结果」，但预期结果不在主表里。用子查询而不是 JOIN，避免一对多把结果行数放大：

```python
def _text_q(term: str) -> Q:
    matched = TestCaseVersion.objects.filter(
        test_case=OuterRef("pk"),
        version=OuterRef("current_version"),
        expected_result__icontains=term,
    ).values("test_case_id")
    q = Q(pk__in=Subquery(matched))
    for name in TEXT_FIELDS:
        q |= Q(**{f"{name}__icontains": term})
    return q
```

最后 `queryset.distinct()` 兜掉 `tags__name__icontains` 这类多对多筛选产生的重复行。

模块树还有一层：勾选「包含子模块」时要递归取所有后代。用的是广度遍历而不是递归函数，避免深层树爆栈：

```python
ids = [module_id]
if include_descendants:
    frontier = [module_id]
    while frontier:
        children = list(Module.objects.filter(project=project, parent_id__in=frontier).values_list("id", flat=True))
        new_ids = [child_id for child_id in children if child_id not in ids]
        ids.extend(new_ids)
        frontier = new_ids
```

`child_id not in ids` 用列表做成员判断，复杂度是 O(n)，理论上该用 set。但这个循环每层只有几个元素，实测里从没成为瓶颈——留一个知道但不改的取舍，比假装没看见好。

## 路由表：项目上下文如何贯穿每一页

一个多项目系统最容易做坏的地方是 URL。如果路由写成 `/testcases`，那么「我现在在哪个项目下」这件事就只能靠 store 里的全局状态维持，刷新页面就丢，分享链接就错。

NanoQA 的路由表把项目放进路径第二段：

```typescript
{
  path: '/p/:projectId',
  component: () => import('@/layouts/AppLayout.vue'),
  children: [
    { path: '', redirect: { name: 'project-overview' } },
    { path: 'overview', name: 'project-overview', ... },
    { path: 'testcases', name: 'testcases', ... },
    { path: 'testcases/:caseId', name: 'testcase-detail', ... },
    ...
  ],
}
```

于是 `/p/7/testcases/42` 本身就是一份完整的上下文：项目 7 的用例 42。刷新不丢，分享可用，浏览器前进后退正确。这一条看起来是路由技巧，实际上决定了后端权限校验怎么写——`resolve_project` 可以直接从 `view.kwargs["project_id"]` 拿到项目，不需要信任任何客户端传来的项目 ID 头。

路由文件的开头有一句注释，说明它是提前定型的：

```typescript
/**
 * 路由表（预先定型）：后续阶段只实现视图，不再改动本文件结构。
 */
```

这个决定在多人协作里很有价值。路由结构是所有人共享的骨架，一旦中途改动，所有正在开发中的分支都要跟着变。先把它钉死，各个页面按名字并行开发，冲突面从「路由文件」缩小到「各自的视图」。

守卫只做两件事：没 token 就跳登录，有 token 但没加载用户就先拉一次：

```typescript
router.beforeEach(async (to) => {
  if (to.meta.public) return true
  const auth = useAuthStore()
  if (!tokenStore.access) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (!auth.loaded) {
    try {
      await auth.fetchMe()
    } catch {
      tokenStore.clear()
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
  return true
})
```

注意 `!auth.loaded` 这个前缀判断。用户在一个项目里连续点十个页面，`fetchMe` 只会发生一次；但换标签页回来、store 被重建时，它会重新拉一次——这是唯一能确认 token 仍然有效的地方。

`redirect` 参数也处理得对：登录后回到原来那页，而不是永远跳首页。细节小，但少了它，所有深链接都变成了「点一下、被踢去登录、登录完到首页、再自己找回去」。

守卫**不做**权限判断。这一点是刻意的，前面 RBAC 那节说过：前端守卫只能防误操作，防不了直接调 API。所以前端只判断「有没有登录」，具体某个按钮能不能点，来自 `/auth/me` 返回的权限集合——而那只是展示层，真正的判定在后端 `HasProjectPermission`。

页面标题在 `afterEach` 里统一设置：

```typescript
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · NanoQA` : 'NanoQA'
})
```

用 `meta.title` 而不是在组件里 `document.title = ...`，好处是路由切换的同一帧内标题就变了，浏览器历史里的条目也正确。

## 232 条测试是怎么组织的

前面反复提到 232 这个数字。它不是一个跑起来很热闹的集成测试，而是按域拆开的、每个域测自己那件事。

目录结构就是测试策略：

```text
backend/apps/testcases/tests/
  test_create.py        创建：编号 + v1 版本 + 审计 同事务
  test_update.py        更新：乐观锁 / 内容变更才升版本
  test_search.py        q 语法解析、非法 token 降级、模块递归
  test_import_export.py 预览与导入复用同一套校验
backend/apps/executions/tests/
  test_results.py       预建 not_run、覆盖式提交、版本绑定
backend/apps/defects/tests/
  test_api.py           状态机、时间戳、归档权限
  test_links.py         关联/解除关联与审计
backend/apps/testplans/tests/test_plans.py
backend/apps/requirements/tests/test_api.py
backend/apps/attachments/tests/test_attachments.py
backend/apps/reports/tests/test_run_report.py
```

有两处值得单独说，因为它们测的是「容易被做对但很难看出做错了」的东西。

第一处是更新用例。它要同时验证四件事：乐观锁在旧 `updated_at` 下失败；内容不变时不升版本；内容变了才升版本；全文和 diff 都进了审计。如果只测「改完能读出来」，这四条里能过三条，而错的那条（比如无条件升版本）会在上线三个月后表现为「版本号莫名其妙涨到 40」。

第二处是并发取号。这一条必须用 `TransactionTestCase`，因为要真正提交事务看行锁行为。而它正是那个会踩到 `flush()` 截断种子数据坑的地方——所以 README 里专门留了排查记录，测试基座里也内置了自愈。这类「测试框架本身的行为污染了测试」的问题，比业务 bug 更难查，因为报错信息指向的是 `Role.DoesNotExist`，和取号毫无关系。

测试里还有一个细节：`serialized_rollback`。它让 `TransactionTestCase` 在 flush 后恢复初始数据，代价是慢一些，但换来了「并发测试不依赖执行顺序」。在测试套件里，顺序依赖是最贵的债务——它让一条无关的改动引发一串随机失败。

## 为什么导出会带上模块路径

导入导出最容易做成「列名对得上就能用」。但真实迁移里，用户的 Excel 通常长这样：

```text
用例编号 | 标题 | 模块路径 | 优先级 | 步骤 | 预期结果 | 标签 | 负责人
```

注意是**模块路径**，不是模块 ID。因为人在 Excel 里写的是「登录 / 验证码 / 短信」，而不是 `module_id=17`。所以导入服务必须把路径还原成树节点，路径不存在时还要决定是自动创建还是报错。

这件事决定了导入不能只做字段映射，还要做一次树的解析。而导出必须输出同样的路径格式，否则「导出改一改再导入」这条路走不通。于是导出的 `module_path` 列不是便利字段，而是往返契约的一部分。

`EXPORT_COLUMNS` 的顺序即表头顺序，列宽单独给一份：

```python
COLUMN_WIDTHS = {
    "用例编号": 18, "标题": 40, "模块路径": 28, "优先级": 8, "类型": 10, "状态": 8,
    "前置条件": 30, "步骤": 60, "预期结果": 30, "标签": 22, "负责人": 12,
}
```

列宽这种「纯装饰」的东西为什么要写在后端而不是前端？因为 XLSX 是后端生成的。如果让前端算列宽，导出逻辑就得复制一份到浏览器里，而浏览器的 XLSX 库和 Python 的 `openpyxl` 行为不完全一致。**谁生成文件，谁负责让文件好读。**

步骤的编码也值得一说。它导出成可读文本，回导时能被 `parse_steps` 解析。这一步看起来是双向适配，实际上是在定义一种微型格式：既要人能看懂、能在 Excel 里手改，又要机器能无歧义还原。这类格式一旦定下来就很难改，因为用户手里已经有一堆导出的文件了。

最后是那两条限制：

```python
MAX_FILE_SIZE = 10 * 1024 * 1024  # 与前端一致：10MB
ALLOWED_EXTENSIONS = {"csv", "xlsx"}
```

注释里那句「与前端一致」是唯一的同步机制。如果哪天后端改成 20MB 而前端还是 10MB，用户会看到一个前端拦截、后端能收的怪现象。这类不一致不会报错，只会慢慢侵蚀信任。

## 命令面板：一个跨模块的搜索入口

`Ctrl+K` 打开的命令面板要同时搜四类对象：页面、项目、用例、缺陷。它看起来是前端功能，难点其实在后端：**四类东西的搜索代价差两个数量级**。

- 页面：纯前端静态列表，零请求。
- 项目：一次轻查询，几十行。
- 缺陷：按项目过滤，通常几百行。
- 用例：可能上千行，且要搜标题和编号。

如果四类都用同一个「输入即请求」策略，每敲一个字就发四个请求，其中一个是重查询。所以前端做防抖，后端给每类单独的轻量端点——而不是做一个「万能搜索」接口。

这个决定和前面搜索那节的 `q` 语法是两种不同取舍。列表页的 `q` 是完整的筛选语言，适合「我要找所有 P0 且自动化状态为 partial 的用例」；命令面板是模糊跳转，适合「我记得那条用例标题里有个退款」。前者允许复杂但不该每敲一个字跑一次，后者简单但必须快。

界面上这两个入口共用同一个查询服务，只是参数不同。这种「同一个后端能力，两个前端入口」的结构，比给命令面板单独写一套查询逻辑要好维护得多——因为修 bug 时只需要修一处。

## 响应信封：一个 code 字段承担的四种语义

后端所有接口返回同一个信封，而不是裸数据：

```typescript
/**
 * NanoQA API 客户端
 * - 统一信封解包：{ code, message, data }，code === 0 才视为成功
 * - 401/40002 单飞刷新 token 后重放原请求（并发只发一次刷新）
 * - 40003 乐观锁冲突弹统一确认框
 */
export interface ApiEnvelope<T = unknown> {
  code: number
  message: string
  data: T
}
```

`code === 0` 才算成功。这看起来和 HTTP 状态码重复了，但两者职责不同：HTTP 状态码给中间层看（缓存、重试、监控），`code` 给业务看（哪一类错误、要不要弹框、要不要刷新 token）。

后端异常类里定义了一张完整的业务码表：

```python
# 业务错误码
CODE_SUCCESS = 0
CODE_PERMISSION_DENIED = 40001
CODE_UNAUTHENTICATED = 40002
CODE_CONFLICT = 40003          # 乐观锁冲突
CODE_INVALID_TRANSITION = 40004  # 状态机非法转移
CODE_NOT_FOUND = 40005
CODE_VALIDATION_ERROR = 40006
CODE_BUSINESS_CONFLICT = 40007  # 业务规则冲突（如模块仍有用例）
CODE_SERVER_ERROR = 50000
```

前端对这几类的反应完全不同。`40002` 要先刷新 token 再重放原请求，而且必须保证并发只刷新一次：

```typescript
/** 不参与自动刷新的端点（否则会死循环） */
const NO_REFRESH_PATHS = ['/auth/login/', '/auth/refresh/', '/auth/logout/']
```

这一行防的是最经典的死循环：刷新 token 的请求自己返回 40002，于是又触发一次刷新，无限递归。黑名单是必要的，不是洁癖。

`40003` 则是弹一个统一确认框，让用户选「刷新看最新」还是「放弃我的修改」。这个交互细节很重要——乐观锁的价值有一半在这里。如果服务端检测到冲突、前端只弹一句「保存失败」，那和直接覆盖体验上没区别。

`40004`、`40007` 直接展示后端文案，因为它们已经写清楚了具体原因——「状态不能从 draft 变更为 archived」或者「模块下仍有用例，无法删除」。这类信息在前端重新拼一遍只会更差。

异常层还顺带做了 DRF 标准异常到业务码的翻译，让前端只需要认一套码：

```python
if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
    code, message = CODE_UNAUTHENTICATED, "未认证或登录已过期"
elif isinstance(exc, PermissionDenied):
    code, message = CODE_PERMISSION_DENIED, "权限不足"
elif isinstance(exc, NotFound):
    code, message = CODE_NOT_FOUND, "资源不存在"
elif isinstance(exc, ValidationError):
    code, message = CODE_VALIDATION_ERROR, _format_validation_error(response.data)
```

`_format_validation_error` 也值得看一眼，它把 DRF 那种嵌套字典的校验错误压成一句人话：

```python
def _format_validation_error(data) -> str:
    if isinstance(data, dict):
        if "detail" in data and isinstance(data["detail"], str):
            return data["detail"]
        parts = []
        for key, value in data.items():
            parts.append(f"{key}: {value[0] if isinstance(value, list) and value else value}")
        return "；".join(parts) if parts else "参数校验失败"
```

于是前端不需要写「从 `{'title': [ErrorDetail(...)]}` 里取第一条」这种代码。所有信封里的 `message` 都是可以直接展示的句子。未捕获的异常也带上了 `request_id`：

```python
logger.exception("unhandled error, request_id=%s", request_id)
return Response(
    envelope(CODE_SERVER_ERROR, "服务器内部错误", {"request_id": request_id}),
    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
)
```

用户看到「服务器内部错误」时，屏幕上那句话里的 `request_id` 就是唯一的排查线索。把它放进响应体，比只写进日志有用得多——否则用户截图过来，你还是找不到那次请求。

请求拦截器统一带 token：

```typescript
client.interceptors.request.use((config) => {
  const token = tokenStore.access
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

前端超时设成 30 秒。这个值和后端性能基线（P95 都在 200 ms 以内）差了两个数量级，是刻意留的余量——避免网络抖动时一个 5 秒的慢请求被判超时而重复操作。

## 界面与后端的契约：版本快照组件

后端把「历史结果绑版本」这件事钉死了，前端也必须显式呈现，否则用户不知道为什么报告里的标题和自己刚看到的不一样。

`CaseSnapshot.vue` 就是这份契约的界面化。它的第一行注释就是结论：

```vue
<!-- 版本快照标识：结果固定绑定执行时的用例版本 -->
<div class="snapshot-head">
  <span class="version-badge">版本快照 v{{ snapshot?.version ?? '—' }}</span>
  <span v-if="snapshot?.change_summary" class="change-summary">{{ snapshot.change_summary }}</span>
</div>
```

组件只接受三个 props，其中两个都可能为 `null`：

```typescript
defineProps<{
  snapshot: VersionSnapshot | null
  loading: boolean
  /** 当前结果（展示上次执行结果与备注） */
  result: RunResult | null
}>()
```

`result: RunResult | null` 这个类型不是随手写的。它对应「这一轮的执行结果」——可能还没执行，所以必须是可空的。而 `snapshot` 可空对应的是另一个现实：版本被归档、或接口暂时失败时，界面要能退化成一个明确的空态，而不是白屏：

```vue
<div v-else-if="!snapshot" class="state-line">版本快照不可用，请刷新重试</div>
```

三个区域的分层也对应数据来源：版本快照区（来自 `TestCaseVersion`）、步骤表格（`snapshot.steps`）、上次结果区（来自 `TestResult`）。前两块永远不变，第三块每次执行后更新。同一个页面同时展示「当时的用例」和「这次的执行」，是这套系统最重要的一个界面约定。

步骤表格直接展示 `order / action / expected`：

```vue
<el-table :data="snapshot.steps" size="small" class="steps-table">
  <el-table-column label="序号" width="64" align="center">
    <template #default="{ row }"><span class="mono">{{ row.order }}</span></template>
  </el-table-column>
  <el-table-column label="操作" min-width="240">...
```

`row.order` 直接用后端存的值，不信任数组下标。因为 `steps` 是 JSONB，理论上不保证顺序——这一点在缺陷默认描述的 `sorted(..., key=order)` 那里也出现过。同一个约束在两个地方被同一份数据源提醒了两次。

## AI：离线 Mock 也是一种可验收

项目描述里有「AI 原生」，但 AI 层目前只有离线 Mock：

```python
class MockLLMProvider(BaseLLMProvider):
    """离线 Mock：规则化生成结构化 JSON，保证全流程可离线验收。"""
```

这个选择在工程上是对的，理由写在类注释里：**保证全流程可离线验收**。AI 能力最容易做成「演示时很惊艳、测试时全跳过」的模块。把 Provider 抽象成接口，Mock 用规则实现，于是：

- CI 里不需要 API Key，AI 相关的 5 个测试文件照常跑；
- 前端可以在没有网关的情况下开发完整的「生成 → 审核 → 入库」流程；
- 真实网关接进来时，只需要换 `get_provider()` 的返回值。

生成逻辑是场景表驱动，而不是随机文本：

```python
scenarios = [
    ("正常流程验证", "P1", "functional"),
    ("必填参数校验", "P1", "functional"),
    ("异常输入处理", "P2", "functional"),
    ("重复提交防护", "P2", "functional"),
]
if context.get("include_edge_cases"):
    scenarios.append(("边界值验证", "P1", "functional"))
if context.get("include_security"):
    scenarios.append(("越权访问拦截", "P1", "security"))
```

评审也是规则化的打分，扣分项都对应真实的用例质量问题：

```python
if len(steps) < 2:
    score -= 25
    issues.append({"severity": "high", "message": "测试步骤少于 2 条，覆盖不足"})
...
if not str(context.get("expected_result") or "").strip():
    score -= 15
    issues.append({"severity": "high", "message": "缺少预期结果，无法判定通过标准"})
```

它不假装聪明，只做确定性检查。这类能力上线后用户信任度反而高——因为每次扣分都能解释。

不过 `OpenAICompatibleProvider` 目前只是桩：

```python
def complete(self, prompt: str, schema: dict | None = None) -> dict:
    if not self.api_key:
        raise NanoAPIError("未配置 LLM Provider")
    raise NanoAPIError("LLM 网关调用将在 v0.2 接入")
```

有 Key 也直接抛错，而不是悄悄退回 Mock。这个选择避免了「配置了 Key 却拿到 Mock 结果」这种最坏情况。

## 实测：232 条测试与性能基线

后端测试规模不是靠感觉说的：

```text
232 条，覆盖用例 / 版本 / 计划 / 执行 / 缺陷 / 需求 / 导入导出 / 并发取号 / 状态机 / 权限，当前全部通过。
```

五个接口的 P95 基线也写在 README 里，并且有脚本可以复现（自动建 1000 用例夹具、采样、输出达标判定）：

```text
用例列表（分页 20）   188 ms   < 500 ms   达标
用例搜索              98 ms   < 500 ms   达标
工作台 Dashboard     186 ms   < 1 s      达标
测试报告聚合         171 ms   < 500 ms   达标
缺陷列表（分页 20）    65 ms   < 500 ms   达标
```

报告聚合 171 ms 这个数字背后是一组单查询聚合，而不是 Python 循环：

```python
rows = (
    results.values("test_case__module_id", "test_case__module__name")
    .annotate(
        total=Count("id"),
        passed=Count("id", filter=Q(status="passed")),
        not_run=Count("id", filter=Q(status="not_run")),
    )
    .order_by("-total", "test_case__module_id")
)
```

`Count(filter=Q(...))` 是 Django 的条件聚合，生成 `COUNT(*) FILTER (WHERE ...)`。三类计数一次扫描完成，而不是三次。

通过率口径也在注释里钉死了，避免前后端各算一套：

```text
口径：pass_rate = passed / executed（not_run 不进分母，与 Dashboard 一致）
```

`executed = total - not_run`。如果分母用 `total`，那么一轮刚开、什么都没跑时通过率是 0%；用 `executed`，分母为 0 时函数返回 0.0，语义清楚得多：

```python
def _ratio(numerator: int, denominator: int) -> float:
    return round(numerator / denominator, 4) if denominator else 0.0
```

## 重复检测的 O(n²) 真相

`find_duplicates` 是这套系统里唯一一处复杂度会失控的地方。它拿每两条用例的「标题 + 步骤文本」跑 `difflib.SequenceMatcher`：

```python
def find_duplicates(project) -> list[dict]:
    """返回 [{case_a, case_b, similarity}]，≥阈值才输出，按相似度降序，最多 50 对。"""
    texts = _case_texts(project)
    pairs = []
    for i in range(len(texts)):
        for j in range(i + 1, len(texts)):
            similarity = SequenceMatcher(None, texts[i][1], texts[j][1]).ratio()
            if similarity >= SIMILARITY_THRESHOLD:
                pairs.append({...})
```

阈值 0.6，输出上限 50 对。配对上限掩盖了扫描成本——上限是 50，但**比较次数**是 `n(n-1)/2`。

我把这段循环（连同文本拼装方式）单独抠出来，用真实规模跑了一遍：

```text
  cases  comparisons    seconds   ms/1k cmp  pairs>=0.6
    100        4,950      0.682     137.822          50
    200       19,900      3.887     195.305          50
    400       79,800     18.314     229.495          50
    800      319,600     55.534     173.760          50

quadratic growth check:
    100 ->   200 cases: 4.02x comparisons, 5.70x time
    200 ->   400 cases: 4.01x comparisons, 4.71x time
    400 ->   800 cases: 4.01x comparisons, 3.03x time
```

比较次数严格按 4 倍增长——这是二次复杂度的定义。时间增长更乱（3.03 到 5.70 倍），因为 `SequenceMatcher` 的成本取决于字符串长度和公共子串长度，而随机夹具的相似度分布并不均匀。

用 400/800 两点线性外推：

```text
   1600 cases:    1,279,200 comparisons ~=   198.5 s
   2000 cases:    1,999,000 comparisons ~=   310.3 s
   5000 cases:   12,497,500 comparisons ~=  1939.8 s
```

我先试过跑 1600 条，结果整个命令超了五分钟没结束，只好把扫描截止到 800 条再外推。这个超时本身就是结论：**在一个 2000 条用例的项目里点一次「重复检测」，请求会挂五分钟。**

这不是实现 bug，是算法选型。要把这条路走通，至少三种改法：按模块或标签先分桶（只比较同桶内）、给标题做倒排先召回候选（只比较有词面重叠的）、或者把整件事挪到后台任务里并给结果落库。项目里 `ai` 模块已经有 `AITask` 模型和任务队列的雏形，缺的是把重复检测接进去。

## 仍然存在的边界

把上面所有东西摊开后，边界也很清楚：

- **重复检测没有分桶**。上面那条二次曲线，加上 50 对上限掩盖了成本，实际规模上一用就卡。
- **AI 只有 Mock**。真实网关留了接口但直接抛错，所以「AI 生成用例」目前是规则化生成，不是模型生成。
- **权限不做缓存**。这是刻意的，代价是每个请求多两次查询。如果项目成员有几百人，这会成为下一个热点。
- **软删除没有级联策略**。删一条被历史执行引用的用例，报告侧的 `select_related` 会拿不到它，需要查询时显式用 `all_objects` 兜底。
- **`child_id not in ids` 是 O(n) 列表查找**。当前规模无感，但属于「知道该改、暂时不改」。
- **导入导出是同步的**。10 MB 上限内可以接受，再大就需要异步任务。
- **前端 36 个视图、后端 39 个 service 文件**，没有统一的错误码字典在仓库里可见，靠 `common/exceptions.py` 与前端约定对齐。

这些不是「后续 TODO」。它们是这份实现当前的形状。

## 小结

如果只记三件事：

1. **内容与状态分离**。`TestCase` 存当前状态，`TestCaseVersion` 存内容，`current_version` 做游标。所有历史引用指向版本，不指向主表。
2. **锁定的是版本对象，不是用例 ID**。执行、报告、缺陷描述全部绑定 `test_case_version`。这一个下划线决定了历史报告三年后还能不能当证据。
3. **审计必须是业务事务的一部分**。异步审计等于没有审计；字段级 diff 加可选空值，让「改了」和「点了一下」可区分。

至于乐观锁、状态机、行锁取号、软删除，它们都是同一件事的不同侧面：**让系统在多人、多次、多年之后仍然自洽**。这类系统真正的验收标准不是功能列表有多长，而是半年后有人问「这条报告当时为什么是失败的」时，你能给出一个不会变的答案。

项目地址：[github.com/zhoujungis/NanoQA](https://github.com/zhoujungis/NanoQA)。同周发布的另一篇拆解是 [Routewise AI：让模型吐出一份能落在地图上的行程](/article/routewise-ai-geo-constrained-itinerary/)。
