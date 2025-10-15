from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category,SubCategory,SubPreCategory,SubPostCategory
# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
      list_display=('name','icon_in_order_landing_page','icon_in_landing_page','show_in_dropdown')
      list_filter=('icon_in_order_landing_page',)
class SubCategoryAdmin(admin.ModelAdmin):
      list_display=('name','Category')
      list_filter=('Category',)

class SubPreCategoryAdmin(admin.ModelAdmin):
      list_display=('name','SubCategory',)
      list_filter=('SubCategory','name')


admin.site.register(Category,CategoryAdmin)
admin.site.register(SubCategory,SubCategoryAdmin)
admin.site.register(SubPreCategory,SubPreCategoryAdmin)
admin.site.register(SubPostCategory)
