from django.shortcuts import render

from ..Category.serializers import CategorySerializer
from ..Category.models import Category
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from . models import Product, Brand

from rest_framework import generics
from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet
from . serializers import ProductSerializer, BrandSerializer, ProductBrandSerializer
# Create your views here.

def product_overview(request):
      products = Product.objects.all().filter(is_active=True)
      return render(request, 'product_overview.html', {'products': products})

def product_list(request): 
      products = Product.objects.all().filter(is_active=True)     
      return render(request, 'product_list.html', {'products': products})

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all().filter(display=True)
    serializer_class = ProductSerializer

class FeaturedViewSet(ModelViewSet):
    queryset = Product.objects.all().filter(display=True).filter(is_featured=True).filter(is_active=True)
    serializer_class = ProductSerializer

class TrendingViewSet(ModelViewSet):
    queryset = Product.objects.all().filter(display=True).filter(is_trending=True).filter(is_active=True)
    serializer_class = ProductSerializer

class FeaturedFullViewSet(ModelViewSet):
    queryset = Product.objects.all().filter(display=True).filter(is_featured=True)
    serializer_class = ProductSerializer



class TrendingFullViewSet(ModelViewSet):
     queryset = Product.objects.all().filter(display=True).filter(is_trending=True)
     serializer_class = ProductSerializer

class BrandLandViewSet(ModelViewSet):
    queryset = Brand.objects.all().filter(icon_in_landing_page=True)
    serializer_class = BrandSerializer



class ProductBrandViewSet(ReadOnlyModelViewSet):
    queryset = Brand.objects.all().filter(icon_in_landing_page=True)
    serializer_class = ProductSerializer()
    lookup_field = 'slug'

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):  # ✅ USE slug here
        brand = self.get_object()          # DRF handles lookup_field = 'slug'
        products = Product.objects.filter(brand=brand)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer()
    lookup_field = 'slug'

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):  # ✅ USE slug here
        category = self.get_object()          # DRF handles lookup_field = 'slug'
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)
    
    