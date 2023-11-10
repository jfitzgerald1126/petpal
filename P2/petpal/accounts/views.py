from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from .models import Seeker, Shelter
from .serializers import SeekerSerializer, ShelterSerializer
from rest_framework.response import Response
from rest_framework import status


# Create your views here.


class SeekerCreate(ListCreateAPIView):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer

    def create(self, request, serializer):
        username = request.data.get("username")
        if Seeker.objects.filter(username=username).exists():
            # username already exists
            return Response(
                {"error": "Seeker with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # password checks here?

        serializer.save(data=request.data)


class ShelterCreate(ListCreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer

    def create(self, request, serializer):
        username = request.data.get("username")
        if Shelter.objects.filter(username=username).exists():
            # username already exists
            return Response(
                {"error": "Shelter with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # password checks here?

        serializer.save(data=request.data)
