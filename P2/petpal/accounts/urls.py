from django.urls import path
from .views import SeekerCreate, ShelterCreate

urlpatterns = [
    path("seekers/create", SeekerCreate.as_view(), name="seeker-list-create"),
    path("shelters/create", ShelterCreate.as_view(), name="shelter-list-create"),
]
