from rest_framework import serializers
from .models import Cart, CartItem, Wishlist
from ..Product.models import Product, ProductVariant, SKU, Colour


# ---------------------------
# Product Serializer
# ---------------------------
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id','name', 'current_price', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image1:
            url = obj.image1.url
            return request.build_absolute_uri(url) if request else url
        return None



class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model =   Colour  # or your color model
        fields = ['colour_name', 'colour_code']  # inc
# ---------------------------
# ProductVariant Serializer
# ---------------------------
class ProductVariantSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    color = ColorSerializer(read_only=True)  

    class Meta:
        model = ProductVariant
        fields = ['id','product', 'size', 'color', 'price', 'image']

    def get_price(self, obj):
        # Return current_price from variant or fallback to product current_price
        if obj.current_price:
            return float(obj.current_price)
        elif obj.product and obj.product.current_price:
            return float(obj.product.current_price)
        return 0.0

    def get_image(self, obj):
        request = self.context.get('request')
        image_url = None

        if obj.image:
            image_url = obj.image.url
        elif obj.product and obj.product.image1:
            image_url = obj.product.image1.url

        if request and image_url:
            return request.build_absolute_uri(image_url)
        return image_url


# ---------------------------
# Utility: Get/Create Default Variant
# ---------------------------
def get_or_create_default_variant(product):
    existing_variant = ProductVariant.objects.filter(
        product=product, color__isnull=True, size__isnull=True
    ).first()
    if existing_variant:
        return existing_variant

    sku = SKU.objects.create()

    default_variant = ProductVariant.objects.create(
        product=product,
        sku=sku,
        color=None,
        size=None,
        current_price=product.current_price,
        quantity=9999,
    )
    return default_variant


# ---------------------------
# CartItem Read Serializer
# ---------------------------
class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'variant',
            'product',
            'quantity',
            'name',
            'price',
            'image',
        ]

    def get_name(self, obj):
        if obj.variant and obj.variant.product:
            return obj.variant.product.name
        elif obj.product:
            return obj.product.name
        return "Unnamed Product"

    def get_price(self, obj):
        if obj.variant and obj.variant.current_price:
            return float(obj.variant.current_price)
        elif obj.product and obj.product.current_price:
            return float(obj.product.current_price)
        return 0.0

    def get_image(self, obj):
        request = self.context.get('request')
        image_url = None

        if obj.variant and obj.variant.image:
            image_url = obj.variant.image.url
        elif obj.variant and obj.variant.product and obj.variant.product.image1:
            image_url = obj.variant.product.image1.url
        elif obj.product and obj.product.image1:
            image_url = obj.product.image1.url

        if request and image_url:
            return request.build_absolute_uri(image_url)
        return image_url


# ---------------------------
# CartItem Create Serializer (Write)
# ---------------------------
class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=False)
    variant_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, data):
        variant_id = data.get("variant_id")
        product_id = data.get("product_id")

        if variant_id:
            try:
                variant = ProductVariant.objects.get(id=variant_id)
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError("Variant not found.")
        elif product_id:
            try:
                product = Product.objects.get(id=product_id)
                variant = get_or_create_default_variant(product)
            except Product.DoesNotExist:
                raise serializers.ValidationError("Product not found.")
        else:
            raise serializers.ValidationError("Either variant_id or product_id is required.")

        data["variant"] = variant
        return data

    def create(self, validated_data):
        cart = self.context['cart']
        variant = validated_data['variant']
        quantity = validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        return cart_item


# ---------------------------
# Cart Serializer
# ---------------------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']


# ---------------------------
# Wishlist Serializer
# ---------------------------

class FullProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    image1 = serializers.SerializerMethodField()
    image2 = serializers.SerializerMethodField()
    image3 = serializers.SerializerMethodField()
    image4 = serializers.SerializerMethodField()

    current_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    previous_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Product
        fields = "__all__"

    def _abs(self, img):
        request = self.context.get("request")
        if img and hasattr(img, "url"):
            return request.build_absolute_uri(img.url)
        return None

    def get_image1(self, obj): return self._abs(obj.image1)
    def get_image2(self, obj): return self._abs(obj.image2)
    def get_image3(self, obj): return self._abs(obj.image3)
    def get_image4(self, obj): return self._abs(obj.image4)


class WishlistSerializer(serializers.ModelSerializer):
    products = FullProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.all(),
        write_only=True,
        source='products'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'product_ids']

