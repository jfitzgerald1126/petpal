from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from .models import Seeker, Shelter
from .serializers import SeekerSerializer, ShelterSerializer
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny


# Create your views here.


class SeekerListCreateView(generics.ListCreateAPIView):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer
    permission_classes = [AllowAny]


class SeekerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer


class ShelterListCreateView(generics.ListCreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [AllowAny]


class ShelterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
