from rest_framework import serializers

from .models import Carousel,OfferBanner
from ..Category.models import Category
from .models import Dblocks

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
        if obj.categorys:  
            return {
                "id": obj.categorys.id,
                "name": obj.categorys.name,
                "slug": obj.categorys.slug,
            }
        return None
    




class DblocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dblocks
        fields = '__all__'




class OfferBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferBanner
        fields = '__all__'
