# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
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
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer,UserProfileSerializer,ChangePasswordSerializer
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
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])  # Ensure the user is authenticated
def change_password(request):
    user = request.user

    # Check if current password is correct
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)  # Set the new password
        user.save()  # Save the user with the new password

        # Update session auth hash to keep the user logged in
        update_session_auth_hash(request, user)

        return Response({"detail": "Password has been successfully changed."}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)