from decimal import Decimal
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import OrderItem, Order


def _recompute_order_total(order: Order):
    agg = order.items.all().values_list("price", "quantity")
    total = sum((price * qty for price, qty in agg), Decimal("0.00"))
    Order.objects.filter(pk=order.pk).update(total_price=total)


@receiver(post_save, sender=OrderItem)
def orderitem_saved(sender, instance: OrderItem, created, **kwargs):
    _recompute_order_total(instance.order)


@receiver(post_delete, sender=OrderItem)
def orderitem_deleted(sender, instance: OrderItem, **kwargs):
    _recompute_order_total(instance.order)
