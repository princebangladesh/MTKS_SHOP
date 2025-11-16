from django.db import models
from django.utils.text import slugify
# Create your models here.

class Category(models.Model):
      name=models.CharField(max_length=20)
      icon_in_order_landing_page=models.IntegerField(default=False,blank=True,null=True)
      icon_landing_page=models.CharField(default=False,blank=True,null=True)
      slug=models.SlugField(default='',blank=True,null=True)
      icon_in_landing_page=models.BooleanField(default=False)
      show_in_dropdown=models.BooleanField(default=False)
      product_overview=models.ImageField(upload_to='Categor Product_overview',blank=True,null=True)
      category_in_landing_page=models.ImageField(upload_to='Category/Category-In-Landing-Page',blank=True,null=True)
      is_popular=models.BooleanField(default=False)
      popular_image=models.ImageField(upload_to='Category/Popular-Image',blank=True,null=True) 
      

      def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

      def __str__(self):
        return self.name
      
      class Meta:
            verbose_name="Category"
            verbose_name_plural="Categories"


class SubCategory(models.Model):
      Category=models.ForeignKey(Category,related_name='Category',on_delete=models.CASCADE)
      name=models.CharField(max_length=30)
      icon=models.ImageField(upload_to='Category/Sub-Category',blank=True,null=True)
      show_in_dropdown=models.BooleanField(default=True)


      def __str__(self):
        return self.name
      
      class Meta:
            verbose_name="Sub Category"
            verbose_name_plural="Sub Categories"

class SubPreCategory(models.Model):
      SubCategory=models.ForeignKey(SubCategory,related_name='SubCategory',on_delete=models.CASCADE)
      name=models.CharField(max_length=30)
      icon=models.ImageField(upload_to='Category/Sub-Category/Sub-Pre-Category',blank=True,null=True)
      show_in_dropdown=models.BooleanField(default=True)

      def __str__(self):
        return self.name

      class Meta:
            verbose_name="Sub Pre Category"
            verbose_name_plural="Sub Pre Categories"

class SubPostCategory(models.Model):
      SubPreCategory=models.ForeignKey(SubPreCategory,related_name='SubPreCategory',on_delete=models.CASCADE)
      name=models.CharField(max_length=30)
      icon=models.ImageField(upload_to="Category/Sub-Category/Sub-Post-Category/Sub-Post-Category",blank=True,null=True)
      show_in_dropdown=models.BooleanField(default=True)

      def __str__(self):
        return self.name
      
      class Meta:
            verbose_name="Sub Post Category"
            verbose_name_plural="Sub Post Categories"
