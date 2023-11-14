from django.urls import path
from .views.pets import CreatePetView, UpdatePetView, DeletePetView, ListAllPetsView, SearchPetsView
from .views import ApplicationListCreate, ApplicationRetrieveUpdateDestory


urlpatterns=[
    # pets
    path('pets/create/', CreatePetView.as_view(), name='create_pet'),
    path('pets/update/<int:pk>/', UpdatePetView.as_view(), name='update_pet'),
    path('pets/delete/<int:pk>/', DeletePetView.as_view(), name='delete_pet'),
    path('pets/get/', ListAllPetsView.as_view(), name='all_pets'),
    path('pets/search/', SearchPetsView.as_view(), name='search_pets'),
    # applications
    path('application/', ApplicationListCreate.as_view(), name='all-applications'),
    path('application/<int:pk>/', ApplicationRetrieveUpdateDestory.as_view(), name='application-details'),
]