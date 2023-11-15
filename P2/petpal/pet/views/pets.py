from rest_framework import generics, filters, pagination
from ..models.pets import Pet
from ..serializers.pets import PetSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Case, Value, When
from rest_framework.exceptions import PermissionDenied

class CreatePetView(generics.CreateAPIView):
    serializer_class = PetSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'shelter'):
            raise PermissionDenied('Must be a shelter to list a pet.')
        serializer.save(status="available", shelter=user.shelter)
    
class UpdateDeleteRetrievePetView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PetSerializer

    def get_object(self):
        pet = get_object_or_404(Pet, id=self.kwargs['pk'])
        if self.request.method != "GET" and (not hasattr(self.request.user, 'shelter') or pet.shelter != self.request.user.shelter): 
            raise PermissionDenied('Unauthorized access to pet.')
        else:
            return pet

class SearchPetsPagination(pagination.PageNumberPagination):
    page_size = 10

class SizeOrderingFilter(filters.OrderingFilter):
    size_order = Case(
        When(size="small", then=Value(1)),
        When(size="medium", then=Value(2)),
        When(size="large", then=Value(3)),
    )

    ordering_mapping = {
        'size': size_order,
        '-size': size_order.desc(),
        'name': 'name',
        '-name': '-name',
        'birthday': 'birthday',
        '-birthday': '-birthday',
        'listed': 'listed',
        '-listed': '-listed',
    }
    
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        for field in ordering:
            if field in self.ordering_mapping:
                queryset = queryset.order_by(self.ordering_mapping[field])

        return queryset
    

class PetFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'shelter' in request.query_params:
            queryset = queryset.filter(shelter=request.query_params['shelter'])
        if 'status' in request.query_params:
            queryset = queryset.filter(status=request.query_params['status'])
        if 'breed' in request.query_params:
            queryset = queryset.filter(breed=request.query_params['breed'])
        if 'size' in request.query_params:
            queryset = queryset.filter(size=request.query_params['size'])
        if 'color' in request.query_params:
            queryset = queryset.filter(color=request.query_params['color'])
        if 'gender' in request.query_params:
            queryset = queryset.filter(gender=request.query_params['gender'])
        return queryset

class SearchPetsView(generics.ListAPIView):
    serializer_class = PetSerializer
    search_fields = ['name', 'animal']
    ordering_fields = ['name', 'birthday', 'size', 'listed']
    filterset_fields = ['shelter', 'status', 'breed', 'size', 'color', 'gender']
    ordering = ['-listed']
    filter_backends = [PetFilter, filters.SearchFilter, SizeOrderingFilter]
    pagination_class = SearchPetsPagination

    def get_queryset(self):
        queryset = Pet.objects.all()
        if 'status' not in self.request.query_params:
            queryset = queryset.filter(status='available')
        return queryset 