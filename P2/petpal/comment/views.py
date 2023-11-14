from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from comment.models import Comment, ApplicationComment 
from comment.serializers import CommentSerializer, AdminCommentSerializer, ApplicationCommentSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User
from rest_framework import permissions, pagination
from pet.models import Application


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


class ApplicationCommentCreate(ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination
    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise PermissionDenied('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise PermissionDenied('You are not the applicant for this pet')
        comments_set = ApplicationComment.objects.filter(application = self.kwargs['application_id']).order_by('-date')
        return comments_set
    #yes
    
    def perform_create(self, serializer):
        sender = get_object_or_404(User, pk=self.request.user.id)
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        serializer.save(sender=sender, application=application)
        # set the shelter_id of the comment to the shelter object


class AdminCommentCreate(ListCreateAPIView):
    serializer_class = AdminCommentSerializer
    permission_classes = [IsAdminUser]
    queryset = Comment.objects.all()
    # see all the comments for all the shelters


class AdminCommentRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminCommentSerializer
    permission_classes = [IsAdminUser]
    def get_object(self):
        return get_object_or_404(Comment, pk=self.kwargs['comment_id'])
    


# class IsCommenter(permissions.BasePermission):
#     message = "You do not have permission to update or delete this comment"
#     def has_object_permission(self, request, view, comment):
#         # comment = obj
#         return comment.commenter_id == request.user

# class SeekerCommentRetreiveUpdateDestroy(RetrieveUpdateDestroyAPIView):
#     serializer_class = CommentSerializer
#     permission_classes = [IsAuthenticated, IsCommenter]
#     # if not IsCommenter:
#     #     raise PermissionDenied("You are not the commenter, you cannot update or delete this comment")
#     def get_object(self):
#         comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
#         self.check_object_permissions(self.request, comment)  
#         # dunno why it wont work without this line but f it we ball
#         return comment