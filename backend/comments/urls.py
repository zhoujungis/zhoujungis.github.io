from django.urls import path

from . import views

urlpatterns = [
    path(
        "articles/<slug:article_slug>/comments/",
        views.ArticleCommentList.as_view(),
        name="article-comments",
    ),
]
