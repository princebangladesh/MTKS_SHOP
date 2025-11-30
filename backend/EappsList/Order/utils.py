# orders/utils.py
from django.db import transaction
from ..Cart.models import CartItem
from .models import Order, OrderItem

@transaction.atomic
def create_order_from_cart(user, shipping_address, billing_address):
    cart = getattr(user, 'cart', None)
    if not cart or not cart.items.exists():
        raise ValueError("Cart is empty.")

    total_price = 0
    order = Order.objects.create(
        user=user,
        shipping_address=shipping_address,
        billing_address=billing_address,
        total_price=0  
    )

    for item in cart.items.select_related('variant'):
        variant = item.variant
        line_price = float(variant.current_price) * item.quantity
        total_price += line_price

        OrderItem.objects.create(
            order=order,
            product_variant=variant,
            quantity=item.quantity,
            price=variant.current_price,
        )

        variant.quantity = max(0, variant.quantity - item.quantity)
        variant.save()

    order.total_price = total_price
    order.save()

 
    cart.items.all().delete()

    return order
