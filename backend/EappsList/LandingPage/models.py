from django.db import models
from django.utils.translation import gettext_lazy as _
from .. Product.models import Product
from ..Category.models import Category

class Carousel(models.Model):
      title=models.CharField(max_length=50,null=True,blank=True)
      subtitle=models.CharField(max_length=100,null=True,blank=True)
      categorys=models.ForeignKey(Category, related_name='carousels', on_delete=models.CASCADE, blank=True, null=True)
      image=models.ImageField(upload_to='Carousel', height_field=None, width_field=None, max_length=None)
      link=models.URLField(max_length=200)
      published=models.BooleanField(default=True)
      
      class Meta:
          verbose_name = _("Carousel")
          verbose_name_plural = _("Carousels")

      def __str__(self):
            return self.title


class Campaign(models.Model):
      title=models.CharField(max_length=50,null=True,blank=True)
      image=models.ImageField(upload_to='Campaign',height_field=None, width_field=None, max_length=None)
      published=models.BooleanField(default=True)
      categorys=models.ForeignKey(Category, related_name='campaigns', on_delete=models.CASCADE, blank=True, null=True)   
      products=models.ManyToManyField(Product,related_name='campaigns',blank=True,default=None)

      class Meta:
          verbose_name = _("Campaign")
          verbose_name_plural = _("Campaigns")

      def __str__(self):
            return self.title
      
class Promo_offer(models.Model):
      title=models.CharField(max_length=50,null=True,blank=True)
      image=models.ImageField(upload_to='Promo_offer', height_field=None, width_field=None, max_length=None)
      published=models.BooleanField(default=False)
    #   categorys=models.ForeignKey(Category, related_name='promo_offers', on_delete=models.CASCADE, blank=True, null=True)   
      products=models.ManyToManyField(Product,related_name='promo_offers',blank=True,default=None)

      class Meta:
          verbose_name = _("Promo Offer")
          verbose_name_plural = _("Promo Offers")

      def __str__(self):
            return self.title