from django.contrib import admin

# Register your models here.
# myapp/admin.py

from django.contrib import admin
from .models import Order,OrderItem


admin.site.register(Order)
admin.site.register(OrderItem)
