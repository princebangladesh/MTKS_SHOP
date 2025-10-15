from django.urls import path, include
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import GoogleLoginView,FacebookLoginView,LinkedInLogin,UserDetailView

urlpatterns = [
      
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('api/auth/facebook/', FacebookLoginView.as_view(), name='facebook_login'),
    path('auth/linkedin/', LinkedInLogin.as_view(), name='linkedin_login'),
    path('profile/', UserDetailView.as_view(), name='user-profile'),
    
]
