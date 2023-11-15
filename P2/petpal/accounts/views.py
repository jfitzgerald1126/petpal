from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from .models import Seeker, Shelter
from .serializers import (
    SeekerCreateSerializer,
    ShelterCreateSerializer,
    SeekerUpdateSerializer,
    ShelterUpdateSerializer,
    ShelterSerializer,
)
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from pet.models import Application
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomError(PermissionDenied):
    def __init__(self, detail):
        self.detail = detail 


class SeekerListCreateView(generics.ListCreateAPIView):
    serializer_class = SeekerCreateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        raise CustomError('You do not have permission to access a list of Seekers')


class SeekerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SeekerUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cur_seeker = get_object_or_404(Seeker, id=self.kwargs["pk"])
        cur_user = get_object_or_404(User, id=self.request.user.id)
        if hasattr(cur_user, "shelter"):
            applications = Application.objects.filter(
                seeker_id=cur_seeker.id,
                pet__shelter_id=cur_user.shelter.id,
                status="accepted",
            )
            applications2 = Application.objects.filter(
                seeker_id=cur_seeker.id,
                pet__shelter_id=cur_user.shelter.id,
                status="pending",
            )
            if applications or applications2:
                return cur_seeker
        elif hasattr(cur_user, "seeker"):
            if cur_seeker.id == cur_user.seeker.id:
                return cur_seeker
        raise CustomError(
            "You do not have permission to access this Seeker Profile"
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.user.delete()

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ShelterListCreateView(generics.ListCreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterCreateSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ShelterSerializer
        else:
            return ShelterCreateSerializer


class ShelterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShelterUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cur_shelter = get_object_or_404(Shelter, id=self.kwargs["pk"])
        if hasattr(self.request.user, "shelter"):
            if cur_shelter.id == self.request.user.shelter.id:
                return cur_shelter
        raise CustomError(
            "You do not have permission to access this Seeker Profile"
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.user.delete()

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)