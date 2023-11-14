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
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
