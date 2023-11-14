from django.urls import path
from .views.pets import CreatePetView, UpdateDeleteRetrievePetView, SearchPetsView
from .views import ApplicationListCreate, ApplicationRetrieveUpdateDestory


urlpatterns=[
    # pets
    path('pet/', CreatePetView.as_view(), name='create_pet'),
    path('pet/<int:pk>/', UpdateDeleteRetrievePetView.as_view(), name='update_delete_retrieve_pet'),
    path('pets/', SearchPetsView.as_view(), name='search_pets'),
    # applications
    path('application/', ApplicationListCreate.as_view(), name='all-applications'),
    path('application/<int:pk>/', ApplicationRetrieveUpdateDestory.as_view(), name='application-details'),
]