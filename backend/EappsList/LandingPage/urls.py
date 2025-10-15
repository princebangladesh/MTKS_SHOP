from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarouselViewSet

router = DefaultRouter()
router.register(r'carousel', CarouselViewSet, basename='Carousel')

urlpatterns = router.urls