from django.http import HttpResponse


def ping(request):
    """极轻量的保活接口：不查库、不渲染模板、不读 session。

    PythonAnywhere 免费账号在无流量一段时间后会冻结 Web App（冷启动要等几秒）。
    外部定时器每 5 分钟打一次 /ping/，就能一直踩在“活跃”窗口内。
    """
    return HttpResponse("pong", content_type="text/plain")
