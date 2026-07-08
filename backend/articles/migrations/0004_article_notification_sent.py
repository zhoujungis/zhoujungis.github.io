# Generated migration — adds notification_sent flag to Article

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("articles", "0003_add_scheduled_likes_subscriber"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="notification_sent",
            field=models.BooleanField(default=False, verbose_name="已发送通知"),
        ),
    ]
