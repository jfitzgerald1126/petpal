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
from .permissions import IsShelterOrReadOnly 
from accounts.models import Shelter, Seeker
from accounts.serializers import SeekerSerializer, ShelterSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views import View
from django.http import JsonResponse


class CustomError(PermissionDenied):
    def __init__(self, detail):
        self.detail = detail 


class SeekerListCreateView(generics.ListCreateAPIView):
    """Creates a seeker on POST Request, does not show a list of seekers (for any user type right now)"""
    serializer_class = SeekerCreateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        raise CustomError('You do not have permission to access a list of Seekers')


class SeekerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Endpoint to Update a seeker object on PATCH Request, delete a seeker object on DELETE Request, and retrieve a seeker object on GET Request.

"""
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
    """Creates a shelter on POST Request, lists all shelters on GET Request

"""
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
    permission_classes = [IsShelterOrReadOnly]  # Use the custom permission

    def get_object(self):
        return get_object_or_404(Shelter, id=self.kwargs["pk"])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user.delete()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if 'access' in response.data:
            user = User.objects.get(username=request.data['username'])
            try: 
                seeker = Seeker.objects.get(user=user)
                user_data = {
                    'type': 'seeker',
                    'seeker': SeekerSerializer(seeker).data,
                }
            except Seeker.DoesNotExist:
                pass
            try:
                shelter = Shelter.objects.get(user=user)
                user_data = {
                    'type': 'shelter',
                    'shelter': ShelterSerializer(shelter).data,
                }
            except Shelter.DoesNotExist:
                pass

            response.data['user'] = user_data

        return response

class GetUserView(View):
    def get(self, request, *args, **kwargs):
        user_info = {}
        user = get_object_or_404(User, id=self.kwargs["id"])
        try: 
            seeker = Seeker.objects.get(user=user)
            seeker_data = SeekerSerializer(seeker).data
            user_info = {
                'name': seeker_data['first_name'] + ' ' + seeker_data['last_name'],
                'description': seeker_data['description'],
                'profile_image': seeker_data['profile_image'],
                'user': seeker_data['user'],
                'email': seeker_data['email'],
                'phone_number': seeker_data['phone_number'],
                'address': seeker_data['address'],
            }
        except Seeker.DoesNotExist:
            pass
        try:
            shelter = Shelter.objects.get(user=user)
            shelter_data = ShelterSerializer(shelter).data
            user_info = {
                'name': shelter_data['shelter_name'],
                'description': shelter_data['description'],
                'profile_image': shelter_data['shelter_image'],
                'user': shelter_data['user'],
                'email': shelter_data['email'],
                'phone_number': shelter_data['phone_number'],
                'address': shelter_data['address'],
            }
        except Shelter.DoesNotExist:
            pass

        return JsonResponse(user_info)