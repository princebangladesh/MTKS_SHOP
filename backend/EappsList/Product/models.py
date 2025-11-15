import random
import string
from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

from ..Category.models import Category, SubCategory, SubPreCategory, SubPostCategory

# -------------------------------------
# SKU Model
# -------------------------------------
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

    def __str__(self):
        return self.code


# -------------------------------------
# Colour Model
# -------------------------------------
class Colour(models.Model):
    colour_name = models.CharField(max_length=10)
    colour_code = models.CharField(max_length=7, blank=True, null=True)

    def __str__(self):
        return self.colour_name

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"


# -------------------------------------
# Brand Model
# -------------------------------------
class Brand(models.Model):
    name = models.CharField(unique=True, max_length=100)
    slug = models.SlugField(unique=True, null=True, blank=True)
    icon_in_landing_page = models.BooleanField(default=False)
    icon_tag = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='Product/Brand', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Brand.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# -------------------------------------
# Regular Size Model
# -------------------------------------
class RegularSize(models.Model):  # renamed from Regular_size
    id = models.AutoField(primary_key=True)
    size = models.CharField(max_length=20)

    def __str__(self):
        return self.size

    class Meta:
        verbose_name = "Regular Size"
        verbose_name_plural = "Regular Sizes"


# -------------------------------------
# Product Model
# -------------------------------------
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, blank=True, null=True)
    sub_category = models.ForeignKey(SubCategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)
    sub_pre_category = models.ForeignKey(SubPreCategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)
    sub_post_category = models.ForeignKey(SubPostCategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)

    model = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')

    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    previous_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    short_description = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(max_length=3000, blank=True, null=True)

    image1 = models.ImageField(upload_to='Product/Image', blank=True, null=True)
    image2 = models.ImageField(upload_to='Product/Image', blank=True, null=True)
    image3 = models.ImageField(upload_to='Product/Image', blank=True, null=True)
    image4 = models.ImageField(upload_to='Product/Image', blank=True, null=True)

    tags = models.CharField(max_length=50, blank=True, null=True)
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    is_best_selling = models.BooleanField(default=False)
    is_returnable = models.BooleanField(default=False)
    is_cod = models.BooleanField(default=False)

    display = models.BooleanField(default=True)
    date_added = models.DateField(auto_now_add=True)
    badge = models.CharField(max_length=15, blank=True, null=True)
    highlights = models.CharField(max_length=100, blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    quantity= models.PositiveIntegerField(default=0,blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = SKU.objects.create()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def total_stock(self):
        if not self.variants.exists():
            return self.quantity
    # Otherwise, return the sum of all variant quantities and the product's own quantity.
        return sum((variant.quantity or 0) for variant in self.variants.all()) + (self.quantity or 0)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"


# -------------------------------------
# Product Variant Model
# -------------------------------------
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color = models.ForeignKey(Colour, on_delete=models.CASCADE,blank=True, null=True)
    size = models.ForeignKey(RegularSize, on_delete=models.CASCADE, blank=True, null=True)

    image = models.ImageField(upload_to='Product/VariantImage', blank=True, null=True)
    sku = models.OneToOneField(SKU, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    previous_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        unique_together = ('product', 'color', 'size')

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = SKU.objects.create()
        super().save(*args, **kwargs)

    def __str__(self):
        product_name = self.product.name if self.product else "Unknown Product"
        size_value = self.size.size if self.size else "No Size"
        color_name = self.color.colour_name if self.color else "No Color"
        return f"{product_name} | {color_name} | {size_value} | {self.sku.code}"

    @property
    def price(self):
        return self.current_price


# -------------------------------------
# Extra Images for Variants
# -------------------------------------
class ProductVariantImage(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='Product/VariantImages')

    def __str__(self):
        return f"{self.variant} - Extra Image"


# -------------------------------------
# Product Question Model
# -------------------------------------
class ProductQuestion(models.Model):
    question = models.TextField(max_length=500, null=True, blank=True)
    approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='approved_questions', null=True, blank=True)
    answer = models.TextField(max_length=500, null=True, blank=True)
    answered_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answered_questions', null=True, blank=True)

    def __str__(self):
        return self.question if self.question else "No Question"
