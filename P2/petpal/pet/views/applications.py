from django.shortcuts import render
from rest_framework import generics, filters, pagination
from ..models import Pet, Application
from .. serializers import ApplicationSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

# Create your views here.

# List / Create
class ApplicationListCreate(ListCreateAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        # TODO:
        # Filter applications by status (2 marks)
        # Sort application by creation time and last update time (4 marks)
        # When an application receives a new comment, its "last update time" should be changed.
        # Pagination support (1 mark)

        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            # pet__shelter to traverse from pet -> shelter
            return Application.objects.filter(pet__shelter=shelter)
        else:
            raise PermissionDenied("Only shelters can view list of applications.")
        
    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'seeker'):
            # TODO: raise different error??
            raise PermissionDenied('Only seekers can submit applications.')

        # Can only create applications for a pet listing that is "available"
        # TODO: stop user for submitting application twice for same pet
        print(serializer.validated_data, 'hello')
        pet = serializer.validated_data.get('pet')
        status = pet.status
        if status == 'L':
            seeker = self.request.user.seeker
            # TODO: auto set status when applying...
            application = Application.objects.create(**serializer.validated_data,
                                                        seeker=seeker,
                                                    )
        else:
            # TODO: shouldn't be permission denied, how to handle??
            raise PermissionDenied('Pet is not available.')


class ApplicationRetrieveUpdateDestory(RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer

    def get_object(self):
        # TODO: permissions for who can view an application? -- only seeker / shelter involved?
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            return get_object_or_404(Application, id=self.kwargs['pk'], pet__shelter=shelter)
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            print(seeker)
            return get_object_or_404(Application, id=self.kwargs['pk'], seeker=seeker)
        else:
            raise PermissionDenied("Unauthorized.")
        
    # TODO: update
    # Details of an application cannot be updated once submitted/created, except for its status (see below).
    # Shelter can only update the status of an application from pending to accepted or denied.
    # Pet seeker can only update the status of an application from pending or accepted to withdrawn.