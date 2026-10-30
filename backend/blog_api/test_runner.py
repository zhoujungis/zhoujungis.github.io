from django.conf import settings
from django.test.runner import DiscoverRunner


class TestRunner(DiscoverRunner):
    """测试期间关闭 HTTPS 重定向。

    Django 的 test runner 会把 DEBUG 置为 False，而 settings 里的
    SECURE_SSL_REDIRECT = True 恒定生效，于是所有 http 请求都会被 301 到
    https，接口测试全部拿不到真实响应。
    """

    def setup_test_environment(self, **kwargs):
        super().setup_test_environment(**kwargs)
        settings.SECURE_SSL_REDIRECT = False
