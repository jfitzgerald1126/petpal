from django.urls import path
from .views import (
    SeekerListCreateView,
    SeekerRetrieveUpdateDestroyView,
    ShelterListCreateView,
    ShelterRetrieveUpdateDestroyView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth.models import User
from accounts.models import Shelter, Seeker
from accounts.serializers import SeekerSerializer, ShelterSerializer

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
    
urlpatterns = [
    path("seekers/", SeekerListCreateView.as_view(), name="seeker-list-create"),
    path(
        "seekers/<int:pk>/",
        SeekerRetrieveUpdateDestroyView.as_view(),
        name="seeker-retrieve-update-destroy",
    ),
    path("shelters/", ShelterListCreateView.as_view(), name="shelter-list-create"),
    path(
        "shelters/<int:pk>/",
        ShelterRetrieveUpdateDestroyView.as_view(),
        name="shelter-retrieve-update-destroy",
    ),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
