# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from rest_framework import permissions,generics
from rest_framework.exceptions import NotFound
from .serializers import UserSerializer,UserProfileSerializer
from .models import UserProfile

class FacebookLoginView(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    permission_classes = [permissions.AllowAny]


class LinkedInLogin(SocialLoginView):
    adapter_class = LinkedInOAuth2Adapter

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get('id_token')

        if not token:
            return Response({'detail': 'No ID token provided.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request())

            # Get user info
            email = idinfo.get('email')
            name = idinfo.get('name')

            # Get or create user
            user, created = User.objects.get_or_create(email=email, defaults={'username': email, 'first_name': name})

            # Issue JWT token
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        except Exception as e:
            return Response({'detail': 'Invalid token', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)