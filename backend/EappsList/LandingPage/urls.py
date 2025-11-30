from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarouselViewSet,DblocksViewSet,OfferBannerViewSet

router = DefaultRouter()
router.register(r'carousel', CarouselViewSet, basename='Carousel')
router.register(r'dblocks', DblocksViewSet, basename='Dblocks')
router.register(r'offer-banners', OfferBannerViewSet, basename='offer-banners')

urlpatterns = router.urls