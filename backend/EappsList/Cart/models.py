from django.db import models
from django.contrib.auth.models import User
from ..Product.models import Product
from django.conf import settings

class Coupon(models.Model):
    code = models.CharField(max_length=15, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    max_uses = models.PositiveIntegerField(default=1)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    price_condition=models.PositiveIntegerField(default=0)
    

    def __str__(self):
        return self.code
    


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.quantity * self.product.price


class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"    