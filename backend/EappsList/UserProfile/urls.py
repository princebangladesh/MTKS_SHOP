from django.urls import path, include
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import GoogleLoginView,FacebookLoginView,LinkedInLogin,UserDetailView,change_password,CheckUserView,RegisterUser,VerifyEmailView,PasswordResetRequestView,PasswordResetValidateTokenView,PasswordResetConfirmView,EmailOrUsernameLoginView

urlpatterns = [
    path("check-user/", CheckUserView.as_view()),
    path("auth/registration/", RegisterUser.as_view()),
    path("api/verify-email/", VerifyEmailView.as_view(), name="verify-email"),  
    path('api/token/', EmailOrUsernameLoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('api/auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('api/auth/facebook/', FacebookLoginView.as_view(), name='facebook_login'),
    path('auth/linkedin/', LinkedInLogin.as_view(), name='linkedin_login'),


    path('profile/', UserDetailView.as_view(), name='user-profile'),
    path('api/auth/change_password/',change_password, name='google_login'),
    path("api/auth/password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("api/auth/password-reset/validate/", PasswordResetValidateTokenView.as_view(), name="password-reset-validate"),
    path("api/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    
]
