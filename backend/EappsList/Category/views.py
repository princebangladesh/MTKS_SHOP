from django.shortcuts import render
from .models import Category

from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet

from .serializers import CategorySerializer, SubCategorySerializer,SubPreCategorySerializer,SubPostCategorySerializer       

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'  

class CategorySliderViewSet(ModelViewSet):  
    queryset = Category.objects.all().filter(is_popular=True)
    serializer_class = CategorySerializer
    

    