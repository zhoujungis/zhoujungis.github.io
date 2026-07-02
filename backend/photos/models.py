from django.db import models


class Photo(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    description = models.TextField(blank=True, verbose_name="描述")
    image = models.ImageField(upload_to="photos/%Y/%m/", verbose_name="图片")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="上传时间")

    class Meta:
        verbose_name = "图片"
        verbose_name_plural = "图片"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title
