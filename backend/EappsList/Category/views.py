from django.shortcuts import render
from .models import Category

from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet

from .serializers import CategorySerializer, SubCategorySerializer,SubPreCategorySerializer,SubPostCategorySerializer       

class CategoryViewSet(ModelViewSet):  # or ModelViewSet if you want full CRUD
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategorySliderViewSet(ModelViewSet):  # or ModelViewSet if you want full CRUD
    queryset = Category.objects.all().filter(is_popular=True)
    serializer_class = CategorySerializer
    

    