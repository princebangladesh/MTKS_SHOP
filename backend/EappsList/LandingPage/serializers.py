from rest_framework import serializers

from .models import Carousel
from ..Category.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CarouselSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()

    class Meta:
        model = Carousel
        fields = "__all__"

    def get_category(self, obj):
        if obj.categorys:  # <-- correct field
            return {
                "id": obj.categorys.id,
                "name": obj.categorys.name,
                "slug": obj.categorys.slug,
            }
        return None