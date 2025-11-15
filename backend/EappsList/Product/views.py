from django.shortcuts import render
from rest_framework import generics
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action

from ..Category.models import Category
from ..Category.serializers import CategorySerializer
from .models import Product, Brand
from .serializers import ProductSerializer, BrandSerializer


# -------------------------
# Regular Django Views
# -------------------------

def product_overview(request):
    products = Product.objects.filter(is_active=True)
    return render(request, 'product_overview.html', {'products': products})


def product_list(request):
    products = Product.objects.filter(is_active=True)
    return render(request, 'product_list.html', {'products': products})


# -------------------------
# API ViewSets
# -------------------------

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True, display=True)
    serializer_class = ProductSerializer


class FeaturedViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True, display=True, is_featured=True)
    serializer_class = ProductSerializer


class TrendingViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True, display=True, is_trending=True)
    serializer_class = ProductSerializer


class FeaturedFullViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_featured=True)
    serializer_class = ProductSerializer


class TrendingFullViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_trending=True)
    serializer_class = ProductSerializer


class BrandLandViewSet(ModelViewSet):
    queryset = Brand.objects.filter(icon_in_landing_page=True)
    serializer_class = BrandSerializer


class ProductBrandViewSet(ReadOnlyModelViewSet):
    queryset = Brand.objects.filter(icon_in_landing_page=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        brand = self.get_object()
        products = Product.objects.filter(brand=brand)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        category = self.get_object()
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)
