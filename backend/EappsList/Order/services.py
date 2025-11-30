from decimal import Decimal
from typing import Iterable, Dict, Any, Tuple, List

from django.db import transaction
from django.db.models import F
from django.core.exceptions import ValidationError

from .models import Order, OrderItem
from ..Product.models import ProductVariant  


class InsufficientStock(ValidationError):
    pass


@transaction.atomic
def create_order(
    *,
    user,
    shipping_address: str,
    billing_address: str,
    items: Iterable[Dict[str, Any]],
) -> Order:
    """
    items = [{"variant_id": int, "quantity": int}, ...]
    - Locks rows to avoid race conditions.
    - Copies price from variant at time of purchase.
    - Decrements stock.
    """
    if not items:
        raise ValidationError("Order must contain at least one item.")

    # Lock variants we’ll touch
    variant_ids = [i["variant_id"] for i in items]
    variants = (
        ProductVariant.objects.select_for_update()
        .filter(id__in=variant_ids)
        .in_bulk(field_name="id")
    )

    # Validate & build line items
    order = Order.objects.create(
        user=user,
        shipping_address=shipping_address,
        billing_address=billing_address,
        total_price=Decimal("0.00"),
    )

    line_items: List[OrderItem] = []
    for entry in items:
        vid = entry["variant_id"]
        qty = int(entry.get("quantity", 1))
        if qty <= 0:
            raise ValidationError(f"Quantity for variant {vid} must be positive.")
        variant = variants.get(vid)
        if not variant:
            raise ValidationError(f"Variant {vid} not found.")

        # Stock check
        if variant.stock < qty:
            raise InsufficientStock(f"Not enough stock for {variant} (have {variant.stock}, need {qty}).")

        # Snapshot the price
        price = variant.price

        line_items.append(
            OrderItem(order=order, product_variant=variant, quantity=qty, price=price)
        )

    # Bulk create items
    OrderItem.objects.bulk_create(line_items)

    # Decrement stock atomically
    for li in line_items:
        ProductVariant.objects.filter(pk=li.product_variant_id, stock__gte=li.quantity) \
            .update(stock=F("stock") - li.quantity)

    # Compute total (sum of line totals)
    total = sum((li.price * li.quantity for li in line_items), Decimal("0.00"))
    order.total_price = total
    order.save(update_fields=["total_price"])

    return order


@transaction.atomic
def cancel_order(order: Order) -> Order:
    """
    Business rule: allow cancel if not shipped/delivered.
    Restock items on cancel.
    """
    if order.status in ("shipped", "delivered", "cancelled"):
        raise ValidationError(f"Order cannot be cancelled from status '{order.status}'.")

    # Restock
    for li in order.items.select_related("product_variant").select_for_update():
        ProductVariant.objects.filter(pk=li.product_variant_id).update(
            stock=F("stock") + li.quantity
        )

    order.status = "cancelled"
    order.save(update_fields=["status"])
    return order
