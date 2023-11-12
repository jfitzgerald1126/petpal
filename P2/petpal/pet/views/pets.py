from rest_framework import generics, filters, pagination
from ..models.pets import Pet
from ..serializers.pets import PetSerializer

class CreatePetView(generics.CreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class UpdatePetView(generics.UpdateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class DeletePetView(generics.DestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class ListAllPetsView(generics.ListAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class SearchPetsPagination(pagination.PageNumberPagination):
    page_size = 10

class SearchPetsView(generics.ListAPIView):
    serializer_class = PetSerializer
    search_fields = ['name', 'animal']
    ordering_fields = ['name', 'age', 'size']
    ordering = ['name']
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = SearchPetsPagination

    def get_queryset(self):
        queryset = Pet.objects.all()
        if 'status' not in self.request.query_params:
            queryset = queryset.filter(status='available')
        return queryset 