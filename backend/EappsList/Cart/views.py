from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import CartSerializer, ProductSerializer, WishlistSerializer,CartItemSerializer
from .models import Cart, CartItem, Wishlist
from rest_framework.exceptions import PermissionDenied 
from ..Product.models import Product
from .models import Coupon
from rest_framework.permissions import IsAuthenticatedOrReadOnly


def cart_view(request):
    coupons = Coupon.objects.all()
    return render(request, 'cart.html', {'coupons': coupons})


class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = Product.objects.get(id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartItemSerializer(cart_item).data)

    @action(detail=False, methods=['post'])
    def remove(self, request):
        product_id = request.data.get('product_id')
        cart = Cart.objects.get(user=request.user)
        CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        return Response({"message": "Item removed"})

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        cart = Cart.objects.get(user=request.user)
        item = CartItem.objects.get(cart=cart, product_id=product_id)
        item.quantity = quantity
        item.save()
        
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clears all cart items for the current user."""
        CartItem.objects.filter(cart__user=request.user).delete()
        return Response({"message": "Cart cleared successfully"}, status=status.HTTP_204_NO_CONTENT)


        return Response(CartItemSerializer(item).data)
# class WishlistViewSet(viewsets.ModelViewSet):
#     serializer_class = WishlistSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Wishlist.objects.filter(user=self.request.user)

#     @action(detail=True, methods=['post'])
#     def add_product(self, request, pk=None):
#         wishlist = self.get_object()
#         product_id = request.data.get('product_id')
#         wishlist.products.add(product_id)
#         wishlist.save()
#         return Response({'status': 'product added'})

#     @action(detail=True, methods=['post'])
#     def remove_product(self, request, pk=None):
#         wishlist = self.get_object()
#         product_id = request.data.get('product_id')
#         wishlist.products.remove(product_id)
#         wishlist.save()
#         return Response({'status': 'product removed'})
    
# views.py
from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return Wishlist.objects.filter(id=wishlist.id)

    def create(self, request, *args, **kwargs):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if already exists
        if wishlist.products.filter(id=product.id).exists():
            return Response({'detail': 'Product already in wishlist'}, status=status.HTTP_200_OK)

        wishlist.products.add(product)
        return Response({'detail': 'Product added to wishlist'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def remove(self, request):
        # Custom DELETE action to remove product from wishlist
        wishlist = Wishlist.objects.filter(user=request.user).first()
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)

        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wishlist.products.remove(product_id)
            return Response({'detail': 'Product removed from wishlist'}, status=status.HTTP_200_OK)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Product not in wishlist'}, status=status.HTTP_404_NOT_FOUND)