from rest_framework import generics, filters, pagination
from ..models.pets import Pet
from ..serializers.pets import PetSerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Case, Value, When

class CreatePetView(generics.CreateAPIView):
    serializer_class = PetSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(status="available", shelter=user.shelter)
    
class UpdateDeleteRetrievePetView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PetSerializer

    def get_object(self):
        pet = get_object_or_404(Pet, id=self.kwargs['pk'])
        if self.request.method != "GET" and pet.shelter != self.request.user.shelter: 
            return Response(
                {"error": "Unauthorized access to pet."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        else:
            return pet

class SearchPetsPagination(pagination.PageNumberPagination):
    page_size = 1

class SizeOrderingFilter(filters.OrderingFilter):
    size_order = Case(
        When(size="small", then=Value(1)),
        When(size="medium", then=Value(2)),
        When(size="large", then=Value(3)),
    )
    
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)
        if 'size' in ordering:
            queryset = queryset.order_by(self.size_order)
        elif '-size' in ordering:
            queryset = queryset.order_by(self.size_order).reverse()

        return queryset

class PetFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'status' in request.query_params:
            queryset = queryset.filter(status=request.query_params['status'])
        if 'breed' in request.query_params:
            queryset = queryset.filter(breed=request.query_params['breed'])  # Fixed this line
        if 'size' in request.query_params:
            queryset = queryset.filter(size=request.query_params['size'])  # Fixed this line
        if 'color' in request.query_params:
            queryset = queryset.filter(color=request.query_params['color'])  # Fixed this line
        if 'gender' in request.query_params:
            queryset = queryset.filter(gender=request.query_params['gender'])  # Fixed this line
        return queryset

class SearchPetsView(generics.ListAPIView):
    serializer_class = PetSerializer
    search_fields = ['name', 'animal']
    ordering_fields = ['name', 'birthday', 'size', 'available']
    filterset_fields = ['shelter', 'status', 'breed', 'size', 'color', 'gender']
    ordering = ['available']
    filter_backends = [PetFilter, filters.SearchFilter, SizeOrderingFilter]
    pagination_class = SearchPetsPagination

    def get_queryset(self):
        queryset = Pet.objects.all()
        if 'status' not in self.request.query_params:
            queryset = queryset.filter(status='available')
        return queryset 