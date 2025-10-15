from django.shortcuts import render

from .models import Carousel
from .serializer import CarouselSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet

# Create your views here.
class CarouselViewSet(ModelViewSet):  # or ModelViewSet if you want full CRUD
    queryset = Carousel.objects.all().filter(published=True)
    serializer_class = CarouselSerializer