from django.urls import path

from .views import (
    EmailCodeRequestView,
    EmailCodeVerifyView,
    MeView,
    OAuthCallbackView,
    OAuthExchangeView,
    OAuthStartView,
)

urlpatterns = [
    path("email/request/", EmailCodeRequestView.as_view(), name="email-code-request"),
    path("email/verify/", EmailCodeVerifyView.as_view(), name="email-code-verify"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("oauth/exchange/", OAuthExchangeView.as_view(), name="oauth-exchange"),
    path("oauth/<str:provider>/start/", OAuthStartView.as_view(), name="oauth-start"),
    path("oauth/<str:provider>/callback/", OAuthCallbackView.as_view(), name="oauth-callback"),
]
