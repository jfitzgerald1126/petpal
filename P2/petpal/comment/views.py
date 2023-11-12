from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from comment.models import Comment
from comment.serializers import CommentSerializer, AdminCommentSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User
from rest_framework import permissions
# Create your views here.


class SeekerCommentCreate(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(shelter_id=self.kwargs['shelter_id'])
    # only get the comments for the specific shelter

    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['shelter_id'])
        commenter = get_object_or_404(User, pk=self.request.user.id)
        serializer.save(shelter_id=shelter, commenter_id=commenter)
        # set the shelter_id of the comment to the shelter object

class IsCommenter(permissions.BasePermission):
    message = "You do not have permission to update or delete this comment"
    def has_object_permission(self, request, view, comment):
        # comment = obj
        return comment.commenter_id == request.user

class SeekerCommentRetreiveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsCommenter]
    # if not IsCommenter:
    #     raise PermissionDenied("You are not the commenter, you cannot update or delete this comment")
    def get_object(self):
        comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        self.check_object_permissions(self.request, comment)  
        # dunno why it wont work without this line but f it we ball
        return comment

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