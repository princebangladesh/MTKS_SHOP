from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Cart, CartItem, Wishlist, Coupon
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    WishlistSerializer
)
from .utils import get_or_create_default_variant
from ..Product.models import Product, ProductVariant
from rest_framework.views import APIView
from django.db.models import F


from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from ..Product.models import Product, ProductVariant
from .serializers import CartItemSerializer


class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def _get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self._get_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        
        cart = self._get_cart(request.user)
        variant_id = request.data.get("variant_id")
        product_id = request.data.get("product_id")

        try:
            quantity = int(request.data.get("quantity", 1))
            if quantity < 1:
                raise ValueError
        except (TypeError, ValueError):
            return Response({"error": "Quantity must be a positive integer."}, status=400)

        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        elif product_id:
            product = get_object_or_404(Product, id=product_id)
            if product.variants.exists():
                return Response({"error": "This product has variants. Please select one."}, status=400)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        else:
            return Response({"error": "variant_id or product_id is required."}, status=400)

        if not created:
            cart_item.quantity = F("quantity") + quantity
            cart_item.save(update_fields=["quantity"])
            cart_item.refresh_from_db()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item, context={"request": request})
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['post'])
    def remove(self, request):
        cart = self._get_cart(request.user)
        variant_id = request.data.get("variant_id")
        product_id = request.data.get("product_id")

        if variant_id:
            deleted, _ = CartItem.objects.filter(cart=cart, variant_id=variant_id).delete()
        elif product_id:
            deleted, _ = CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        else:
            return Response({"error": "variant_id or product_id is required."}, status=400)

        if deleted:
            return Response({"message": "Item removed successfully."}, status=200)
        return Response({"error": "Item not found."}, status=404)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        """Update item quantity."""
        cart = self._get_cart(request.user)
        variant_id = request.data.get("variant_id")
        product_id = request.data.get("product_id")

        try:
            quantity = int(request.data.get("quantity", 1))
            if quantity < 1:
                raise ValueError
        except (TypeError, ValueError):
            return Response({"error": "Quantity must be a positive integer."}, status=400)

        try:
            if variant_id:
                item = CartItem.objects.get(cart=cart, variant_id=variant_id)
            elif product_id:
                item = CartItem.objects.get(cart=cart, product_id=product_id)
            else:
                return Response({"error": "variant_id or product_id is required."}, status=400)

            item.quantity = quantity
            item.save()
            serializer = CartItemSerializer(item, context={"request": request})
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=404)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from user's cart."""
        CartItem.objects.filter(cart__user=request.user).delete()
        return Response({"message": "Cart cleared successfully."}, status=204)

class WishlistView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return Wishlist.objects.filter(id=wishlist.id)

    def create(self, request, *args, **kwargs):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({'error': 'product_id is required'}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        if wishlist.products.filter(id=product.id).exists():
            return Response({'detail': 'Product already in wishlist'}, status=200)

        wishlist.products.add(product)
        return Response({'detail': 'Product added to wishlist'}, status=201)

    @action(detail=False, methods=['delete'])
    def remove(self, request):
        wishlist = Wishlist.objects.filter(user=request.user).first()
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=404)

        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=400)

        wishlist.products.remove(product_id)
        return Response({'detail': 'Product removed from wishlist'}, status=200)


from rest_framework.views import APIView

class GuestCartSyncView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        items = request.data.get("items", [])
        if not isinstance(items, list):
            return Response({"error": "Invalid payload"}, status=400)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        for entry in items:
            variant_id = entry.get("variant_id")
            quantity = int(entry.get("quantity", 1))

            if not variant_id:
                continue

            try:
                variant = ProductVariant.objects.get(id=variant_id)
            except ProductVariant.DoesNotExist:
                continue

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                variant=variant,
                defaults={"quantity": quantity}
            )
            if not created:
                cart_item.quantity = F("quantity") + quantity
                cart_item.save()

        return Response({"message": "Cart synced successfully"})
