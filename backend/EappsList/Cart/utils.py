# utils.py

from .models import ProductVariant
from .models import Product

def get_or_create_default_variant(product):
    """
    Returns an existing default variant (no color, no size) for a product,
    or creates one if it doesn't exist.
    """


    variant = ProductVariant.objects.filter(
        product=product,
        size=None,
        color=None
    ).first()

    if variant:
        return variant

    # Create a default variant
    variant = ProductVariant.objects.create(
        product=product,
        size=None,
        color=None,
        current_price=product.current_price,
        previous_price=product.previous_price,
        quantity=10  
    )

    return variant
