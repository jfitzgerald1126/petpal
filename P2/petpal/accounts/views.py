from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from .models import Seeker, Shelter
from .serializers import (
    SeekerCreateSerializer,
    ShelterCreateSerializer,
    SeekerUpdateSerializer,
    ShelterUpdateSerializer,
)
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from pet.models import Application
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.


class SeekerListCreateView(generics.ListCreateAPIView):
    queryset = []
    serializer_class = SeekerCreateSerializer
    permission_classes = [AllowAny]


class SeekerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SeekerUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cur_seeker = get_object_or_404(Seeker, id=self.kwargs["pk"])
        cur_user = get_object_or_404(User, id=self.request.user.id)
        if hasattr(cur_user, "shelter"):
            applications = Application.objects.filter(
                seeker_id=cur_seeker.id, pet__shelter_id=cur_user.id, status="active"
            )
            if applications:
                return Seeker.objects.filter(id=cur_seeker.id)
        raise PermissionDenied(
            "You do not have permission to access this Seeker Profile"
        )


class ShelterListCreateView(generics.ListCreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterCreateSerializer
    permission_classes = [AllowAny]


class ShelterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShelterUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cur_shelter = get_object_or_404(Shelter, id=self.kwargs["pk"])
        return cur_shelter
