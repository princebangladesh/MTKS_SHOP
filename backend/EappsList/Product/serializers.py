from rest_framework import serializers
from .models import Product,Brand


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', allow_null=True, default='')
    category_slug = serializers.CharField(source='category.slug', allow_null=True, default='')
    brand_name = serializers.CharField(source='brand.name', allow_null=True, default='')
    image1 = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['category_name', 'brand_name','category_slug']

    def get_image1(self, obj):
        request = self.context.get('request')
        if obj.image1 and request:
            return request.build_absolute_uri(obj.image1.url)
        return None

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class ProductBrandSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', allow_null=True, default='')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'brand_name']
        extra_fields = ['brand_name']

class ProductCatSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', allow_null=True, default='')

    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['category_name']