from django.contrib import admin

# Register your models here.
from django.contrib import admin
from . models import Brand,Product,ProductQuestion,Colour,ProductVariant
# Register your models here.
class BrandAdmin(admin.ModelAdmin):
      list_display=('name','icon_in_landing_page')
      list_filter=('name',)

class RegularSizeAdmin(admin.ModelAdmin):
      list_display=('id','size')
      list_filter=('size',)


class ProductAdmin(admin.ModelAdmin):
      list_display=('name','is_trending')
      list_filter=('name')
      

admin.site.register(Brand,BrandAdmin)

admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(ProductQuestion)

admin.site.register(Colour)
