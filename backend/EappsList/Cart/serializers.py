from rest_framework import serializers
from .models import Cart, CartItem, Wishlist
from ..Product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'current_price','image1']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    image1=serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'image1']

    def get_image1(self, obj):
        request = self.context.get('request')  # ✅ This is how you access the request
        if request is not None:
            return request.build_absolute_uri(obj.product.image1.url)
        return obj.product.image1.url

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.all(),
        write_only=True,
        source='products'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'product_ids']