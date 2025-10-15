from django.contrib import admin

# Register your models here.
from . models import Cart,Wishlist,CartItem

admin.site.register(Cart)
admin.site.register(Wishlist)
admin.site.register(CartItem)
