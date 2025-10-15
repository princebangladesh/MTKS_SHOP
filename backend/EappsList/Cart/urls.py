from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, WishlistView

router = DefaultRouter()
router.register(r'cart-items', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistView, basename='wishlist')

urlpatterns = router.urls