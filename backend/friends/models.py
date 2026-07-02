from django.db import models


class FriendLink(models.Model):
    name = models.CharField(max_length=64, verbose_name="站点名称")
    url = models.URLField(verbose_name="站点地址")
    logo = models.URLField(blank=True, verbose_name="Logo 地址")
    description = models.TextField(blank=True, verbose_name="描述")
    is_active = models.BooleanField(default=True, verbose_name="是否启用")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "友情链接"
        verbose_name_plural = "友情链接"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
