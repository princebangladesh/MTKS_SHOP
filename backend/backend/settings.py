"""
Django settings for backend project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")

# ------------------------------------------------------------
# SECURITY
# ------------------------------------------------------------

SECRET_KEY = 'os.getenv("DJANGO_SECRET_KEY")'

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "prince1971.pythonanywhere.com",
    "localhost",
    "127.0.0.1",
]

CSRF_TRUSTED_ORIGINS = [
    "https://prince1971.pythonanywhere.com",
    "http://localhost:3000",
    "http://localhost:8000",
]

# ------------------------------------------------------------
# Applications
# ------------------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.sites",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.linkedin_oauth2",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.facebook",

    "EappsList.Category",
    "EappsList.LandingPage",
    "EappsList.Product",
    "EappsList.Cart",
    "EappsList.UserProfile",
    "EappsList.Order",
]

SITE_ID = 1

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# ------------------------------------------------------------
# Database
# ------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ------------------------------------------------------------
# REST Framework & JWT
# ------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=24),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# ------------------------------------------------------------
# Authentication
# ------------------------------------------------------------

AUTHENTICATION_BACKENDS = (
    "allauth.account.auth_backends.AuthenticationBackend",
    "django.contrib.auth.backends.ModelBackend",
)

ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATED_REDIRECT_URL = "/"
REST_USE_JWT = True
SOCIALACCOUNT_LOGIN_ON_GET = True
LOGIN_REDIRECT_URL = "/user"
APPEND_SLASH = True

# ------------------------------------------------------------
# Social Login Credentials (from .env)
# ------------------------------------------------------------

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "secret": os.getenv("GOOGLE_SECRET"),
            "key": "",
        }
    },
    "facebook": {
        "METHOD": "oauth2",
        "SCOPE": ["email"],
        "AUTH_PARAMS": {"auth_type": "rerequest"},
        "INIT_PARAMS": {
            "scope": "email",
            "fields": "id,name,email,first_name,last_name",
        },
        "VERIFIED_EMAIL": False,
    },
    "linkedin_oauth2": {
        "SCOPE": [
            "r_emailaddress",
            "r_liteprofile",
        ],
        "PROFILE_FIELDS": [
            "id",
            "first-name",
            "last-name",
            "email-address",
        ],
        "APP": {
            "client_id": os.getenv("LINKEDIN_CLIENT_ID"),
            "secret": os.getenv("LINKEDIN_SECRET"),
            "key": "",
        },
    },
}

SOCIAL_AUTH_FACEBOOK_KEY = os.getenv("FACEBOOK_CLIENT_ID")
SOCIAL_AUTH_FACEBOOK_SECRET = os.getenv("FACEBOOK_SECRET")

SOCIAL_AUTH_GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# ------------------------------------------------------------
# Static & Media Files
# ------------------------------------------------------------

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media/"
IMAGES_DIR = MEDIA_ROOT / "images"

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

# ------------------------------------------------------------
# Email
# ------------------------------------------------------------

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

# ------------------------------------------------------------
# Other
# ------------------------------------------------------------

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
