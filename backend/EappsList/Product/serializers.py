from rest_framework import serializers
from .models import (
    Product, Brand, ProductVariant, ProductVariantImage,
    Colour, RegularSize
)


# -----------------------------------
# Colour Serializer
# -----------------------------------
class ColourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colour
        fields = ['id', 'colour_name', 'colour_code']


# -----------------------------------
# Size Serializer
# -----------------------------------
class RegularSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularSize
        fields = ['id', 'size']


# -----------------------------------
# Product Variant Image Serializer
# -----------------------------------
class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ['id', 'image']


# -----------------------------------
# Product Variant Serializer
# -----------------------------------
class ProductVariantSerializer(serializers.ModelSerializer):
    color = ColourSerializer()
    size = RegularSizeSerializer()
    images = ProductVariantImageSerializer(many=True, read_only=True)
    price = serializers.DecimalField(source='current_price', max_digits=10, decimal_places=2)
    product_name = serializers.CharField(source='product.name', read_only=True)
    sku = serializers.CharField(source='sku.code', read_only=True)
    class Meta:
        model = ProductVariant
        fields = [
            'id','product_name' ,'sku', 'color', 'size', 'quantity',
            'price', 'previous_price', 'image', 'images'
        ]


# -----------------------------------
# Brand Serializer
# -----------------------------------
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'icon_in_landing_page', 'icon_tag', 'image']


# -----------------------------------
# Product Serializer
# -----------------------------------
class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    variants = ProductVariantSerializer(many=True, read_only=True)
    total_stock = serializers.IntegerField(read_only=True)
    sku = serializers.CharField(source='sku.code', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'model', 'sku', 'brand', 'category', 'short_description',
            'description', 'current_price', 'previous_price',
            'image1', 'image2', 'image3', 'image4',
            'tags', 'total_stock', 'is_featured', 'is_trending',
            'is_new', 'is_best_selling', 'badge', 'highlights',
            'variants'
        ]
