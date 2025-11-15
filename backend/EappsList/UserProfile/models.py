
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ADDRESS_CHOICES = [
        ('billing', 'Billing Address'),
        ('shipping', 'Shipping Address'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    billing_address = models.TextField(blank=True)
    shipping_address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # NEW: Default address type field
    default_address_type = models.CharField(
        max_length=20,
        choices=ADDRESS_CHOICES,
        default='billing',  # or null=True, blank=True if optional
    )

    def get_default_address(self):
        return self.billing_address if self.default_address_type == 'billing' else self.shipping_address

    def __str__(self):
        return f"{self.user.username}'s profile"