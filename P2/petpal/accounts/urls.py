from django.urls import path
from .views import SeekerCreate, ShelterCreate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("seekers/create", SeekerCreate.as_view(), name="seeker-list-create"),
    path("shelters/create", ShelterCreate.as_view(), name="shelter-list-create"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
