from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from..Category.models import Category,SubCategory,SubPreCategory,SubPostCategory
from django.utils.text import slugify
# Create your models here.

class SKU(models.Model):
    code = models.CharField(max_length=6, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_unique_code()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_code():
        letters = ''.join(random.choices(string.ascii_uppercase, k=2))
        digits = ''.join(random.choices(string.digits, k=4))
        return letters + digits

    def generate_unique_code(self):
        code = self.generate_code()
        while SKU.objects.filter(code=code).exists():
            code = self.generate_code()
        return code
    

class Colour(models.Model):
      colour_name=models.CharField(max_length=10)
      colour_code=models.CharField(max_length=7,blank=True,null=True)

      def __str__(self):
            return self.colour_name

      class Meta:
            verbose_name="Color"
            verbose_name_plural="Colors"





class Brand(models.Model):
      name=models.CharField(unique=True)
      slug=models.SlugField(unique=True,null=True,blank=True)
      icon_in_landing_page=models.BooleanField(default=False)
      icon_tag=models.CharField(max_length=20,blank=True,null=True)
      image=models.ImageField(upload_to='Product/Brand',blank=True,null=True)

      def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

      def __str__(self):
            return self.name

class Regular_size(models.Model):
      ID=models.IntegerField(primary_key=True)
      size=models.CharField(max_length=20)
      def __str__(self):
            return self.size

      class Meta:
            verbose_name="Regular Size"
            verbose_name_plural="Regular Sizes"


class Product(models.Model):
      category=models.ForeignKey(Category,related_name='Catgory',on_delete=models.CASCADE,default=None,blank=True,null=True)
      sub_category=models.ForeignKey(SubCategory,related_name='SubCatgory',on_delete=models.CASCADE,default=None,blank=True,null=True)
      sub_pre_category=models.ForeignKey(SubPreCategory,related_name='SubPreCatgory',on_delete=models.CASCADE,default=None,blank=True,null=True)
      sub_post_category=models.ForeignKey(SubPostCategory,related_name='SubPostCatgory',on_delete=models.CASCADE,default=None,blank=True,null=True)      
      name=models.CharField(max_length=30,default=None)
      current_price=models.IntegerField(default=0)
      previous_price=models.IntegerField(default=0,blank=True,null=True)
      size=models.ManyToManyField(to=Regular_size,blank=True,default=None)
      brand=models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True,related_name='products')
      short_description=models.CharField(max_length=50,null=True,blank=True,default=None)
      description=models.TextField(max_length=3000,default=None,blank=True,null=True)
      image1=models.ImageField(upload_to='Product/Image',blank=True,null=True)
      image2=models.ImageField(upload_to='Product/Image',blank=True,null=True)
      image3=models.ImageField(upload_to='Product/Image',blank=True,null=True)
      image4=models.ImageField(upload_to='Product/Image',blank=True,null=True)
      tags=models.CharField(max_length=20,blank=True,null=True,default=None)
      #sku=models.CharField(default=SKU.generate_code,unique=True)        
      #added_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name='added_by')          
      is_active=models.BooleanField(default=False)
      is_deleted=models.BooleanField(default=False)
      is_featured=models.BooleanField(default=False)
      is_trending=models.BooleanField(default=False)
      is_new=models.BooleanField(default=False)
      is_best_selling=models.BooleanField(default=False)  
      is_returnable=models.BooleanField(default=False)
      is_cod=models.BooleanField(default=False)
      display=models.BooleanField(default=True)
      is_featured=models.BooleanField(default=False)
      is_trending=models.BooleanField(default=False)
      trend_image=models.ImageField(upload_to='Product/Trend/Image',blank=True,null=True)
      is_new=models.BooleanField(default=False)
      is_best_selling=models.BooleanField(default=False)
      
      is_returnable=models.BooleanField(default=False)
      stock_quantity=models.IntegerField(default=0)    
      date_added=models.DateField(auto_now_add=True)
      badge=models.CharField(max_length=15,blank=True,default=None)
      highlights=models.CharField(max_length=20,blank=True,default=None)
      rating=models.IntegerField(default=0)

      def __str__(self):
          return self.name
      
      class Meta:
            verbose_name="Product"
            verbose_name_plural="Products"
      

class ProductColorQuantity(models.Model):
      product=models.ForeignKey(Product,on_delete=models.CASCADE)
      color=models.ForeignKey(Colour,on_delete=models.CASCADE)
      quantity=models.IntegerField(default=0)

      class Meta:
            unique_together = ('product', 'color')
    
            def __str__(self):
                return f"{self.product.name} - {self.color.colour_name}: {self.quantity}"



class ProductQuestion(models.Model):
      question=models.CharField(max_length=100,null=True,blank=True)
      approved=models.BooleanField(default=False)
      approved_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name='approved_by',null=True,blank=True)      
      answer=models.CharField(max_length=100,null=True,blank=True)
      answered_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name='answered_by',null=True,blank=True)

      def __str__(self):
            return self.question
      









