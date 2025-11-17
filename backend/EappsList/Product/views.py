from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet, ViewSet
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


# -------------------------
# SEARCH VIEWSET (NEW)
# -------------------------

class SearchViewSet(ViewSet):
    def list(self, request):
        query = request.GET.get("q", "").strip()

        if query == "":
            return Response([], status=status.HTTP_200_OK)

        # Search in product names and tags
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(tags__icontains=query),
            is_active=True, display=True
        ).distinct()[:8]

        # Search in categories
        categories = Category.objects.filter(
            Q(name__icontains=query)
        ).distinct()[:5]

        suggestions = []

        # Product suggestions
        for p in products:

            # Get Product Image
            if p.image1:
                img = request.build_absolute_uri(p.image1.url)
            elif p.variants.exists() and p.variants.first().image:
                img = request.build_absolute_uri(p.variants.first().image.url)
            else:
                img = None

            suggestions.append({
                "type": "product",
                "name": p.name,
                "slug": p.slug if hasattr(p, "slug") else p.id,
                "image": img,
            })

        # Category suggestions
        for c in categories:
            suggestions.append({
                "type": "category",
                "name": c.name,
                "slug": c.slug,
                "image": None     # Category does not have image
            })

        return Response(suggestions, status=status.HTTP_200_OK)
