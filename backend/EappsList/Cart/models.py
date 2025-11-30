from django.db import models
from django.contrib.auth.models import User
from ..Product.models import Product, ProductVariant
from django.conf import settings


# -------------------------------------
# Coupon Model
# -------------------------------------
class Coupon(models.Model):
    code = models.CharField(max_length=15, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    max_uses = models.PositiveIntegerField(default=1)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    price_condition = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.code


# -------------------------------------
# Cart Model
# -------------------------------------
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey("Cart", on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "variant"],
                name="unique_cart_variant"
            ),
            models.UniqueConstraint(
                fields=["cart", "product"],
                condition=models.Q(variant__isnull=True),
                name="unique_cart_product_no_variant"
            ),
        ]

    def __str__(self):
        if self.variant:
            return f"{self.variant.product.name} ({self.variant}) x{self.quantity}"
        return f"{self.product.name if self.product else 'Unknown Product'} x{self.quantity}"





class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"
