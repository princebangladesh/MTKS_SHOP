from rest_framework import serializers

from ..Category.models import Category, SubCategory, SubPreCategory,SubPostCategory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
      class Meta:
            model = SubCategory
            fields = '__all__'   

class SubPreCategorySerializer(serializers.ModelSerializer):
      class Meta:
            model = SubPreCategory
            fields = '__all__'

class SubPostCategorySerializer(serializers.ModelSerializer):
      class Meta:
            model = SubPostCategory
            fields = '__all__'