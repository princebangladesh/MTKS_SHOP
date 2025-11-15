from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, WishlistView,GuestCartSyncView

router = DefaultRouter()
router.register(r'cart-items', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistView, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),  # include all router urls
    path('cart-items/sync/', GuestCartSyncView.as_view(), name='cart-sync'),  # add sync endpoint manually
]