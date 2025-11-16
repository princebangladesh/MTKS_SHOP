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
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariantImage
        fields = ['id', 'image']

    def get_image(self, obj):
        try:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if obj.image else None
        except:
            return None


# -----------------------------------
# Product Variant Serializer
# -----------------------------------
class ProductVariantSerializer(serializers.ModelSerializer):
    color = ColourSerializer()
    size = RegularSizeSerializer()
    images = ProductVariantImageSerializer(many=True, read_only=True)

    image = serializers.SerializerMethodField()
    price = serializers.DecimalField(source='current_price',
                                     max_digits=10, decimal_places=2,
                                     read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'color', 'size', 'quantity',
            'price', 'previous_price',
            'image', 'images'
        ]

    def get_image(self, obj):
        try:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if obj.image else None
        except:
            return None


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
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    brand = BrandSerializer()
    # Fallback image used by wishlist
    image = serializers.SerializerMethodField()

    # Convert ALL image fields to absolute URLs
    image1 = serializers.SerializerMethodField()
    image2 = serializers.SerializerMethodField()
    image3 = serializers.SerializerMethodField()
    image4 = serializers.SerializerMethodField()

    # Computed prices for wishlist & product cards
    display_price = serializers.SerializerMethodField()
    display_old_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"  # Ensures all model fields + custom fields are included
        extra_fields = [
            "image",
            "image1", "image2", "image3", "image4",
            "display_price", "display_old_price",
        ]

    # --- Helper: Convert relative → absolute URL ---
    def _abs_url(self, image_field):
        request = self.context.get("request")
        try:
            if image_field and hasattr(image_field, "url"):
                return request.build_absolute_uri(image_field.url) if request else image_field.url
        except:
            return None
        return None

    # -------------- IMAGE FIELDS -------------------

    def get_image1(self, obj):
        return self._abs_url(obj.image1)

    def get_image2(self, obj):
        return self._abs_url(obj.image2)

    def get_image3(self, obj):
        return self._abs_url(obj.image3)

    def get_image4(self, obj):
        return self._abs_url(obj.image4)

    # ✔ SINGLE fallback image for wishlist & product boxes
    def get_image(self, obj):
        # 1️⃣ First variant image
        first_variant = obj.variants.first()
        if first_variant and first_variant.image:
            return self._abs_url(first_variant.image)

        # 2️⃣ Main product images
        if obj.image1:
            return self._abs_url(obj.image1)

        return None

    # -------------- PRICE FIELDS -------------------

    def get_display_price(self, obj):
        variant = obj.variants.first()
        if variant and variant.current_price:
            return float(variant.current_price)
        return float(obj.current_price or 0)

    def get_display_old_price(self, obj):
        variant = obj.variants.first()
        if variant and variant.previous_price:
            return float(variant.previous_price)
        return float(obj.previous_price or 0)



