# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from urllib.parse import quote

from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from .utils.uid_encoder import encode_uid, decode_uid
from urllib.parse import unquote
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from urllib.parse import quote,unquote
from google.oauth2 import id_token
from google.auth.transport import requests
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserProfile
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    EmailOrUsernameTokenSerializer
)


class EmailOrUsernameLoginView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenSerializer

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
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    
    
    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data)

    if serializer.is_valid():
        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect"}, status=400)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)

        # Send success email template
        html_content = render_to_string("emails/password_reset_success.html", {
            "name": user.first_name or user.username,
            "site_name": "Your Website",
            "year": timezone.now().year,
        })

        msg = EmailMultiAlternatives(
            subject="Your password was changed",
            body="Your password has been updated.",
            from_email="no-reply@example.com",
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({"detail": "Password changed successfully"}, status=200)

    return Response(serializer.errors, status=400)

class RegisterUser(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Create inactive user
        user = User.objects.create(
            username=data["username"],
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            is_active=False,
        )
        user.set_password(data["password"])
        user.save()

        # Create profile
        UserProfile.objects.create(user=user)

        # → Encode UID (no padding)
        uid = encode_uid(user.pk)

        # → Create token
        token = default_token_generator.make_token(user)

        # → Build verification URL
        verify_url = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"

        # Render email template
        html_message = render_to_string(
            "emails/verify_email.html",
            {"first_name": user.first_name, "verify_url": verify_url},
        )

        msg = EmailMultiAlternatives(
            subject="Verify your email",
            body="Please verify your email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send()

        return Response({"detail": "Verification email sent"}, status=201)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        uidb64 = request.GET.get("uid")
        token = request.GET.get("token")

        if not uidb64 or not token:
            return Response({"detail": "Invalid verification link"}, status=400)

        try:
            # → Restore padding + decode UID safely
            user_id = decode_uid(uidb64)
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"detail": "Invalid link"}, status=400)

        # → Validate token
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"}, status=400)

        # → Activate user
        user.is_active = True
        user.save()

        return Response({"detail": "Email verified successfully"})


class CheckUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.GET.get("email")
        username = request.GET.get("username")

        email_exists = False
        username_exists = False

        if email:
            email_exists = User.objects.filter(email=email).exists()

        if username:
            username_exists = User.objects.filter(username=username).exists()

        return Response({
            "email_exists": email_exists,
            "username_exists": username_exists
        })



class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Only fetch, DO NOT create
        user = User.objects.filter(email=email, is_active=True).first()


        if not user:
            return Response(
                {"detail": "If an account with this email exists, a reset link has been sent."},
                status=status.HTTP_200_OK,
            )

        # ✅ For existing user: generate token + send email
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = settings.FRONTEND_URL
        reset_url = request.build_absolute_uri(
            f"{frontend_url}/reset-password?uid={uid}&token={token}"
        )

        html_content = render_to_string("emails/password_reset.html", {
            "name": user.first_name or user.username,
            "reset_url": reset_url,
            "site_name": "MTKS SHOP",
            "year": timezone.now().year,
        })

        msg = EmailMultiAlternatives(
            subject="Reset Your Password",
            body="Use this link to reset your password.",
            from_email="no-reply@example.com",
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response(
            {"detail": "If an account with this email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetValidateTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except:
            return Response({"valid": False})

        return Response({"valid": default_token_generator.check_token(user, token)})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        if not all([uid, token, password]):
            return Response({"detail": "Missing data"}, status=400)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except:
            return Response({"detail": "Invalid link"}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"}, status=400)

        user.set_password(password)
        user.save()

        html_content = render_to_string("emails/password_reset_success.html", {
            "name": user.first_name or user.username,
            "site_name": "MTKS SHOP",
            "year": timezone.now().year,
        })

        msg = EmailMultiAlternatives(
            subject="Password Reset Successful",
            body="Your password has been reset.",
            from_email="no-reply@example.com",
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({"detail": "Password reset successful"}, status=200)
