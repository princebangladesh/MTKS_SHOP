from django.contrib import admin

# Register your models here.
from .models import Carousel,Dblocks,OfferBanner

admin.site.register(Carousel)
admin.site.register(Dblocks)
admin.site.register(OfferBanner)