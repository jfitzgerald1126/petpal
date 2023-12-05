from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from comment.models import Comment, ApplicationComment 
from comment.serializers import CommentSerializer, AdminCommentSerializer, ApplicationCommentSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User
from rest_framework import permissions, pagination
from pet.models import Application
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class CommentPagination(pagination.PageNumberPagination):
    page_size = 5

class IsNotShelter(permissions.BasePermission):
    message = "You do not have permission to comment on your own shelter"
    def has_object_permission(self, request, view, shelter):
        # comment = obj
        print(shelter.user, request.user)
        return shelter.user != request.user

class ShelterCommentCreate(ListCreateAPIView):
    """This endpoint creates a shelter comment (or review) on POST Request given a shelter_id

"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsNotShelter]
    pagination_class = CommentPagination
    def get_queryset(self):
        return Comment.objects.filter(shelter_id=self.kwargs['shelter_id']).order_by('-date')
    # only get the comments for the specific shelter

    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['shelter_id'])
        commenter = self.request.user
        # print(self.request.user.id, shelter.user_id)
        self.check_object_permissions(self.request, shelter)
        # im not sure why you need to explicitly check permissions here but it wont work without it
        serializer.save(shelter_id=shelter, commenter_id=commenter)
        # set the shelter_id of the comment to the shelter object

class CantDoThisLmao(PermissionDenied):
    def __init__(self, detail):
        self.detail = detail 
        

class ApplicationCommentCreate(ListCreateAPIView):
    """Creates an Application Comment on POST Request, given application_id

"""
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination
    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        comments_set = ApplicationComment.objects.filter(application = self.kwargs['application_id']).order_by('-date')
        return comments_set
    #yes
    
    def perform_create(self, serializer):
        sender = get_object_or_404(User, pk=self.request.user.id)
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        serializer.save(sender=sender, application=application)
        # set the shelter_id of the comment to the shelter object

# review id 

class ReviewRetreive(RetrieveAPIView):
    """This Endpoint shows a Comment from a shelter on a GET Request given comment_id

"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return get_object_or_404(Comment, pk=self.kwargs['comment_id'])
    

class ApplicationCommentRetreive(RetrieveAPIView):
    """This Endpoint shows a Comment from an application on a GET Request given comment_id

"""
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        application_comment = get_object_or_404(ApplicationComment, pk=self.kwargs['comment_id'])
        application = get_object_or_404(Application, pk=application_comment.application.id)
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        return application_comment
