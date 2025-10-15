from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductBrandViewSet, ProductViewSet,FeaturedViewSet,TrendingViewSet,FeaturedFullViewSet,TrendingFullViewSet,BrandLandViewSet,CategoryViewSet
router = DefaultRouter()
router.register(r'productlist', ProductViewSet, basename='productlist')
router.register(r'fr_product', FeaturedViewSet, basename='Featured')
router.register(r'tr_product', TrendingViewSet, basename='Trending')
router.register(r'fr_product_full', FeaturedFullViewSet, basename='FeaturedFull')
router.register(r'tr_product_full', TrendingFullViewSet, basename='TrendingFull')
router.register(r'brand_land', BrandLandViewSet, basename='BrandLand')
router.register(r'brand', ProductBrandViewSet, basename='Brand')
router.register(r'category', CategoryViewSet, basename='Category')

urlpatterns = router.urls