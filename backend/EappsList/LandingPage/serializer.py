from rest_framework import serializers

from .models import Carousel
from ..Category.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CarouselSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='categorys.name')

    class Meta:
        model = Carousel
        fields = ['id', 'title', 'subtitle', 'image', 'link', 'published', 'category']