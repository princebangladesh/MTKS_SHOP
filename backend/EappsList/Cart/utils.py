# utils.py

from .models import ProductVariant
from .models import Product# Adjust the import if utils is not in the same app

def get_or_create_default_variant(product):
    """
    Returns an existing default variant (no color, no size) for a product,
    or creates one if it doesn't exist.
    """

    # Try to find an existing variant with no size and no color
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
        quantity=10  # Default stock, adjust as needed
    )

    return variant
