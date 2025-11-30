from django.shortcuts import render

from .models import Carousel,Dblocks,OfferBanner
from .serializers import CarouselSerializer,DblocksSerializer,OfferBannerSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet

# Create your views here.
class CarouselViewSet(ModelViewSet):  
    queryset = Carousel.objects.all().filter(published=True)
    serializer_class = CarouselSerializer
class DblocksViewSet(ModelViewSet):
    serializer_class = DblocksSerializer

    def get_queryset(self):
        return Dblocks.objects.filter(published=True).order_by('-id')[:2]


class OfferBannerViewSet(ModelViewSet):
    serializer_class = OfferBannerSerializer

    def get_queryset(self):
        # Always return the latest published banner
        return OfferBanner.objects.filter(published=True).order_by('-id')[:1]