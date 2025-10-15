from django.urls import path, include
from rest_framework.routers import DefaultRouter,SimpleRouter
from .views import CategoryViewSet,CategorySliderViewSet

router = DefaultRouter()
router.register(r'category', CategoryViewSet, basename='Category')
router.register(r'catslider', CategorySliderViewSet, basename='Category Slider')

urlpatterns = router.urls
